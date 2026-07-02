"""Format prompt + call LLM + parse response.

The generation pipeline:
1. Format prompt with user data
2. Call LLM API
3. Parse JSON response
4. Run 5-pillar validation gate
5. Generate unique code-name
6. Build execution view from design view
7. Return validated program
"""

import httpx
import json
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.program import Program
from app.schemas.program import ProgramSchema
from app.services.pillar_validator import validate_program
from app.services.name_generator import generate_unique_name

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent
PROMPT_PATH = PROJECT_ROOT / "ai" / "prompts" / "program_design.md"
KB_DIR = PROJECT_ROOT / "backend" / "app" / "knowledge_base"


def _load_knowledge_base() -> str:
    """Load all knowledge base files for injection into the AI prompt."""
    kb_files = ["movements.md", "limitations.md", "program_patterns.md"]
    sections = []
    for filename in kb_files:
        path = KB_DIR / filename
        if path.exists():
            sections.append(f"\n--- {filename.upper().replace('.MD', '')} ---\n{path.read_text()}")
        else:
            # KB file missing — fail loudly so the operator notices
            raise FileNotFoundError(
                f"Knowledge base file missing: {path}. "
                f"Required for AI generation. See backend/app/knowledge_base/."
            )
    return "\n".join(sections)


async def generate_program(
    equipment_ids: list[str],
    equipment_list: str,
    goals,
    preferences,
    user_level: str,
    session: AsyncSession,
    max_retries: int = 2,
) -> ProgramSchema:
    """Generate a program via LLM with 5-pillar validation gate."""
    prompt = format_prompt(equipment_list, goals, preferences, user_level)

    program_dict = None
    missing_pillars = []

    for attempt in range(max_retries + 1):
        raw_response = await call_llm(prompt, missing_pillars)

        try:
            program_dict = parse_json_response(raw_response)
        except (json.JSONDecodeError, ValueError):
            missing_pillars = ["all"]
            continue

        is_valid, missing = validate_program(program_dict)
        if is_valid:
            break
        missing_pillars = missing
    else:
        raise HTTPException(
            status_code=502,
            detail="Could not generate a valid program after several attempts — please retry",
        )

    if not program_dict:
        raise HTTPException(status_code=502, detail="No program generated — please retry")

    # Generate unique code-name
    existing_names = await get_existing_program_names(session)
    if not program_dict.get("name") or program_dict["name"] in existing_names:
        program_dict["name"] = generate_unique_name(existing_names)

    # Build execution view from design view
    program_dict["execution_view"] = build_execution_view(program_dict["design_view"])

    # Fill in fields not provided by LLM
    program_dict["id"] = str(uuid.uuid4())
    program_dict["user_id"] = None
    program_dict["version"] = 1
    program_dict["is_active"] = False
    program_dict["is_example"] = False
    program_dict["created_at"] = datetime.now(timezone.utc)

    return ProgramSchema(**program_dict)


async def call_llm(prompt: str, missing_pillars: list[str] = None) -> str:
    """Call LLM API (OpenRouter-compatible)."""
    if not settings.llm_api_key:
        raise HTTPException(status_code=503, detail="LLM not configured — set LLM_API_KEY")

    headers = {
        "Authorization": f"Bearer {settings.llm_api_key}",
        "Content-Type": "application/json",
    }

    full_prompt = prompt
    if missing_pillars:
        full_prompt += (
            f"\n\nIMPORTANT: The previous output was missing these pillars: "
            f"{', '.join(missing_pillars)}. Ensure they are present."
        )

    payload = {
        "model": settings.llm_model,
        "messages": [{"role": "user", "content": full_prompt}],
        "max_tokens": 4096,
        "temperature": 0.7,
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                settings.llm_api_url,
                headers=headers,
                json=payload,
                timeout=60.0,
            )
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"LLM request failed: {e}") from e
    except (KeyError, IndexError) as e:
        raise HTTPException(status_code=502, detail="LLM returned an unexpected response") from e


def parse_json_response(raw: str) -> dict:
    """Parse LLM response, stripping markdown code blocks if present."""
    cleaned = raw.strip()

    # Strip ```json ... ``` wrapper
    if cleaned.startswith("```"):
        lines = cleaned.split("\n")
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        cleaned = "\n".join(lines).strip()

    return json.loads(cleaned)


def format_prompt(equipment_list: str, goals, preferences, user_level: str) -> str:
    """Format the system prompt template with user data + knowledge base."""
    with open(PROMPT_PATH) as f:
        content = f.read()

    # Extract SYSTEM_PROMPT string (between triple quotes)
    start_marker = 'SYSTEM_PROMPT = """'
    end_marker = '"""'

    start_idx = content.find(start_marker)
    if start_idx == -1:
        raise ValueError("Could not find SYSTEM_PROMPT in template file")

    start_idx += len(start_marker)
    end_idx = content.find(end_marker, start_idx)
    if end_idx == -1:
        raise ValueError("Could not find end of SYSTEM_PROMPT")

    template = content[start_idx:end_idx]

    # Load knowledge base (movements, limitations, program patterns)
    knowledge_base = _load_knowledge_base()

    return template.format(
        knowledge_base=knowledge_base,
        days_per_week=goals.days_per_week,
        experience=user_level,
        equipment_list=equipment_list,
        goal=goals.primary,
        focus_areas=", ".join(goals.focus_areas) if goals.focus_areas else "Full Body",
        session_minutes=goals.session_length_minutes,
        limitations=goals.limitations or "None",
        finisher_pref=goals.finisher_preference,
        dislikes=", ".join(preferences.dislikes) if preferences.dislikes else "None",
        preferred_alternatives=json.dumps(preferences.preferred_alternatives),
    )


def build_execution_view(design_view: dict) -> str:
    """Convert design_view JSON to copy-paste execution_view string."""
    lines = []
    days = design_view.get("days", [])
    num_days = len(days)

    for day_data in days:
        day_num = day_data.get("day", 1)
        day_name = day_name_for_day_number(day_num, num_days)
        lines.append(f"### {day_name}: {day_data['name']}")

        for movement in day_data.get("movements", []):
            notes = f" | {movement['notes']}" if movement.get("notes") else ""
            lines.append(
                f"- {movement['name']}: {movement['sets']}x{movement['reps']} "
                f"| Tempo: {movement['tempo']}{notes}"
            )

        if day_data.get("finisher"):
            fin = day_data["finisher"]
            lines.append(f"- FINISHER: \"{fin['name']}\"")
            lines.append(f"    - Format: {fin['format']}")
            for m in fin.get("movements", []):
                parts = []
                if m.get("name"):
                    parts.append(m["name"])
                if m.get("reps"):
                    parts.append(f"({m['reps']})")
                if m.get("detail"):
                    parts.append(f"[{m['detail']}]")
                lines.append(f"    - {' '.join(parts)}")

        if day_data.get("cardio"):
            cardio = day_data["cardio"]
            equipment = cardio.get("equipment", "")
            notes = cardio.get("notes", "")
            cardio_line = f"- {cardio['type'].upper().replace('-', ' ')} Cardio: {cardio['duration_minutes']}m"
            if equipment:
                cardio_line += f" ({equipment})"
            if notes:
                cardio_line += f" | NOTE: {notes}"
            lines.append(cardio_line)

        if day_data.get("mobility"):
            lines.append(f"- Mobility: {day_data['mobility']}")

        lines.append("")  # blank line between days

    return "\n".join(lines)


def day_name_for_day_number(day_num: int, total_days: int = 4) -> str:
    """Map day number to day name based on split."""
    schedules = {
        3: {1: "MONDAY", 2: "WEDNESDAY", 3: "FRIDAY"},
        4: {1: "MONDAY", 2: "TUESDAY", 3: "THURSDAY", 4: "FRIDAY"},
        5: {1: "MONDAY", 2: "TUESDAY", 3: "WEDNESDAY", 4: "THURSDAY", 5: "FRIDAY"},
    }
    mapping = schedules.get(total_days, schedules[4])
    return mapping.get(day_num, f"DAY {day_num}")


async def get_existing_program_names(session: AsyncSession) -> set[str]:
    """Get all existing program names from DB for collision check."""
    result = await session.execute(select(Program.name))
    return {row[0] for row in result.all()}