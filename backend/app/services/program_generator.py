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
    """Load a condensed knowledge base summary for injection into the AI prompt.

    Instead of injecting the full 40KB KB files, we inject a condensed ~4KB summary
    of the critical rules. The full KB files remain at backend/app/knowledge_base/
    for reference and future RAG retrieval.
    """
    return """
=== KNOWLEDGE BASE SUMMARY ===

MOVEMENT SELECTION:
- Select movements ONLY from the user's available equipment list
- Map each equipment type to appropriate exercises (squats → barbell/dumbbell/kettlebell, presses → bench/dumbbell/cable, rows → barbell/cable/TRX)
- 3-5 movements per training day
- Contraindication awareness: knee issues → avoid deep squats/lunges/jumps; shoulder issues → avoid overhead press/behind-neck; back issues → avoid heavy deadlifts/bent rows; wrist issues → avoid front rack/clean

LIMITATION HANDLING:
- Parse free-text limitations and auto-resolve: "bad knees" → knee-injury, "shoulder pain" → shoulder-injury, "lower back" → back-injury
- EXCLUDE contraindicated movements for each limitation
- SUBSTITUTE with safe alternatives (e.g., knee-injury: goblet squat instead of back squat, belt squat instead of barbell deadlift)

PROGRAM PATTERNS (select based on experience + days/week + goal):
- Beginner, 3 days → Full Body (compound per session)
- Beginner, 4 days → Upper/Lower split
- Intermediate, 3 days → Full Body or PPL
- Intermediate, 4 days → Upper/Lower or Hybrid (legs/push/pull/legs)
- Intermediate, 5 days → Hybrid with Wednesday VO2 Max
- Advanced, 4 days → Powerbuilding (heavy compound + volume accessories)
- Advanced, 5 days → Hybrid with Wednesday VO2 Max
- Advanced, 6 days → PPL or Arnold Split
- Longevity goal → Blueprint pattern (3x strength + 150min Zone 2 + 75min VO2 Max)
- Hybrid goal → Equal hypertrophy + conditioning emphasis

VOLUME LANDMARKS (sets per muscle group per week):
- Beginner: 8-10 sets (minimum effective)
- Intermediate: 10-16 sets (optimal)
- Advanced: 16-22 sets (maximum adaptive for lagging muscles)
- Deload weeks: 50% of working volume

RECOVERY SPACING:
- NEVER train the same primary muscle group on consecutive days
- Minimum 1 full rest day per week
- Each muscle hit 1.5-2x per week for optimal growth

TEMPO BY GOAL:
- Strength: 3-1-1 or 4-1-1, 4-6 reps, 120-180s rest
- Hypertrophy: 2-1-2 or 3-1-1, 8-12 reps, 60-90s rest
- Conditioning: 2-0-2 or X-0-X, 12-15 reps, 30-60s rest
- Power: X-0-X explosive, 1-5 reps, 120-180s rest

CARDIO INTEGRATION:
- Zone 2 (low intensity, conversation pace, 60-70% max HR): 150 min/week minimum. After strength work or rest days.
- VO2 Max (Norwegian 4x4 or intervals, 80-90% max HR): 75 min/week. STANDALONE SESSION ONLY in 5-day splits (Wednesday). NEVER tack onto strength day.
- HIIT Finishers (metabolic circuits): 10-20 min at end of strength sessions. Used in 3-day and 4-day splits to satisfy VO2 Max pillar.

CRITICAL — NORWEGIAN 4x4 RULE:
- Norwegian 4x4 is a 30-minute standalone VO2 Max protocol (4 min high / 3 min recovery × 4 sets)
- It is NEVER a finisher. It is NEVER tacked onto strength work.
- 5-day split: Wednesday = standalone Norwegian 4x4 session
- 4-day split: NO Norwegian 4x4. HIIT finishers handle VO2 Max pillar instead.
=== END KNOWLEDGE BASE ===
"""


async def generate_program(
    equipment_ids: list[str],
    equipment_list: str,
    goals,
    preferences,
    user_level: str,
    session: AsyncSession,
    max_retries: int = 1,
) -> ProgramSchema:
    """Generate a program via LLM with 5-pillar validation gate."""
    # Cap equipment list to ~10 items to prevent M3 timeout on large selections
    equipment_lines = equipment_list.strip().split("\n")
    if len(equipment_lines) > 10:
        equipment_list = "\n".join(equipment_lines[:10])
        equipment_list += f"\n... and {len(equipment_lines) - 10} more pieces of equipment available"

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

    # Generate unique code-name — ALWAYS generate from our word lists
    # (don't rely on the AI to suggest one — it may collide or be empty)
    existing_names = await get_existing_program_names(session)
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
        "max_tokens": 8192,
        "temperature": 0.7,
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                settings.llm_api_url,
                headers=headers,
                json=payload,
                timeout=80.0,
            )
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"LLM request failed: {e}") from e
    except (KeyError, IndexError) as e:
        raise HTTPException(status_code=502, detail="LLM returned an unexpected response") from e


def parse_json_response(raw: str) -> dict:
    """Parse LLM response, extracting JSON from markdown code blocks, think tags, or raw text."""
    import re
    cleaned = raw.strip()

    # Strip <think>...</think> blocks (MiniMax M3, DeepSeek, etc.)
    cleaned = re.sub(r'<think>.*?</think>', '', cleaned, flags=re.DOTALL).strip()

    # Strip ```json ... ``` or ``` ... ``` wrapper
    if cleaned.startswith("```"):
        lines = cleaned.split("\n")
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        cleaned = "\n".join(lines).strip()

    # If there's still text before the JSON object (M3 outputs reasoning text then JSON),
    # extract the first `{` to last `}` as the JSON payload
    json_start = cleaned.find("{")
    json_end = cleaned.rfind("}")
    if json_start >= 0 and json_end > json_start:
        json_str = cleaned[json_start:json_end + 1]
        return json.loads(json_str)

    # Fallback: try parsing the whole thing as JSON
    return json.loads(cleaned)


def format_prompt(equipment_list: str, goals, preferences, user_level: str) -> str:
    """Format the system prompt template with user data."""
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

    # Load condensed knowledge base (movements, limitations, program patterns)
    knowledge_base = _load_knowledge_base()

    return template.format(
        knowledge_base=knowledge_base,
        days_per_week=goals.days_per_week,
        experience=user_level,
        equipment_list=equipment_list,
        goal=goals.primary,
        focus_areas="Full Body",
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