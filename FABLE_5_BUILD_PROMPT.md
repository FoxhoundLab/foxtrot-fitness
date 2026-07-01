# FOXTROT FITNESS — FABLE 5 BUILD PROMPT (REVISED)
# Target: Claude Fable 5
# Project: ~/Projects/foxtrot-fitness/
# Date: 2026-07-01
# Status: SCAFFOLD COMPLETE. Build the remaining components, pages, and services.

---

## CONTEXT

You are continuing a partially-built project. The full monorepo scaffold is already in place at `~/Projects/foxtrot-fitness/`:

- **Frontend:** Next.js 14 + TypeScript + Tailwind (P90X design system configured)
- **Backend:** FastAPI + SQLAlchemy + Pydantic + Alembic
- **Database:** PostgreSQL schema ready (Alembic migration ready)
- **Seed data:** Equipment catalog (26 items), finisher library (6 finishers), 3 example programs — all JSON files ready and a working seed script at `backend/app/seed/seed.py`
- **AI prompt template:** Ready at `ai/prompts/program_design.md`
- **TypeScript types:** All types defined at `frontend/lib/types.ts`
- **API client:** All endpoints stubbed at `frontend/lib/api.ts`
- **SQLAlchemy models:** All 5 models ready at `backend/app/models/`
- **Pydantic schemas:** All schemas ready at `backend/app/schemas/`

**Your job:** Build the remaining components, pages, routers, and services listed below. Everything you need is already scaffolded — just fill in the implementation.

**Detailed status:** Read `~/Projects/foxtrot-fitness/SESSION_STATUS.md` for a complete "what's done / what's not" map.

---

## YOUR ROLE

You are a senior full-stack engineer with complete authority to build out the remaining pieces of Foxtrot Fitness. Build exactly what's specified below. Make reasonable decisions where minor details are unspecified. Do not rebuild what already exists — the scaffold is locked.

---

## 🎨 DESIGN DIRECTIVE — READ THIS FIRST

**Design language:** Aggressive, high-energy fitness aesthetic inspired by P90X. Bold colors, strong typography, athletic intensity. Feels like a training camp, not a wellness app.

**Component foundation:** shadcn/ui themed with custom P90X design tokens (already in Tailwind config at `~/Projects/foxtrot-fitness/`). Use shadcn/ui patterns as the starting point — install it, then theme it with the existing tokens.

### Design principles:

1. **Energy over calm.** This is a workout platform, not a meditation app. Bold contrasts, aggressive CTAs, visual momentum.
2. **Data-forward.** Workout programs, sets, reps, equipment — present clearly with strong visual hierarchy. Athletes scan, they don't read.
3. **Progressive overload visual language.** Show progression, improvement, leveling up. Charts, streaks, completion bars should feel rewarding.

### Color & typography:

P90X design tokens already defined in Tailwind — **use them, don't invent new colors**. Bold display fonts (Bebas Neue) for headers, clean sans-serif (Inter) for data, monospace (JetBrains Mono) for tempo/execution view. High contrast for gym/outdoor visibility.

### Guardrails:

- **Do NOT default to soft pastel "wellness" aesthetics.** This is training, not therapy.
- **Mobile-first** — most users check workouts on phone between sets.
- **Every program/equipment card must be visually scannable in under 2 seconds.**

### When building UI:

1. Reference shadcn/ui patterns first (`npx shadcn-ui@latest init`, then add components as needed).
2. Define all design tokens (already done in `tailwind.config.ts`) before building components.
3. Every screen should feel intense and athletic — not generic.
4. Treat the design directive as **non-negotiable**. If a component feels soft, pastel, or wellness-app-ish, rebuild it harder.

---

## PROJECT GOAL (Recap)

**Foxtrot Fitness** is a web app that generates personalized, named workout programs using AI. Users input equipment → AI generates a full program with movements, tempos, sets/reps, finishers → program gets a code-name (Adjective + Noun) → saved to user's library.

Every program is validated against the 5-pillar blueprint (Strength, Zone 2, VO2 Max, Mobility, Recovery).

**The differentiators:**
- AI-generated, tailored to exact equipment (not static templates)
- Every program is a named "mission" (Cobalt Fury, Sanguine Thunder, Genesis Protocol)
- Tempo notation (3-1-1, 2-1-2, 3-1-X) baked into every movement
- Finisher library matched to user's capacity & gear
- 5-pillar validation ensures every program is complete

---

## TECH STACK (Already Configured)

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend:** FastAPI (Python 3.11+), SQLAlchemy 2.0 (async), Pydantic 2.7, Alembic
- **Database:** PostgreSQL (Supabase for production / local Docker for dev)
- **AI:** OpenRouter API (default model: `anthropic/claude-sonnet-4`)
- **Auth:** Email magic links via Resend or Supabase Auth

---

## ⚠️ WHAT'S ALREADY DONE — DO NOT REBUILD

### Frontend
- ✅ `package.json` (Next.js 14, React 18, Tailwind, Supabase, Lucide, clsx, zod, react-hook-form)
- ✅ `tsconfig.json`, `next.config.js`, `postcss.config.js`
- ✅ `tailwind.config.ts` — **FULL P90X DESIGN SYSTEM** (dark palette, red/orange accents, Bebas Neue + Inter + JetBrains Mono, glow shadows, pulse animations)
- ✅ `app/layout.tsx` — root layout with all 3 fonts loaded
- ✅ `app/globals.css` — dark theme, sharp corners, scrollbar styling, print styles
- ✅ `lib/types.ts` — **COMPLETE** (User, Equipment, Movement, Finisher, Program, etc.)
- ✅ `lib/utils.ts` — cn(), formatTempo(), formatDifficultyColor(), formatBadgeColor()
- ✅ `lib/api.ts` — **COMPLETE API CLIENT** with all endpoints stubbed
- ✅ `lib/supabase.ts` — Supabase browser client

### Backend
- ✅ `requirements.txt` (FastAPI, SQLAlchemy, asyncpg, Pydantic, httpx, Resend, Supabase)
- ✅ `alembic.ini`, `alembic/env.py`, `alembic/versions/0001_initial_schema.py` — **FULL DDL**
- ✅ `app/main.py` — FastAPI entry with CORS + health check + router stubs (commented, ready to enable)
- ✅ `app/config.py` — Pydantic settings
- ✅ `app/database.py` — async engine + session maker
- ✅ `app/models/` — **ALL 5 SQLAlchemy models** (User, Equipment, Movement, Finisher, Program)
- ✅ `app/schemas/` — **ALL Pydantic schemas** (User, Equipment, Movement, Finisher, Program, Generation)
- ✅ `app/seed/seed.py` — **WORKING seed script**

### Seed Data (Valid JSON)
- ✅ `backend/app/seed/equipment_catalog.json` — 26 equipment items
- ✅ `backend/app/seed/finisher_library.json` — 6 finishers
- ✅ `backend/app/seed/example_programs.json` — 3 example programs (Genesis Protocol, Cobalt Fury, Sanguine Thunder) — **valid JSON matching Pydantic schemas**

### AI
- ✅ `ai/prompts/program_design.md` — **FULL prompt template** with system prompt + refinement prompt

---

## ❌ WHAT YOU NEED TO BUILD

### A. Frontend Components

**⚠️ DESIGN REMINDER:** All UI components must follow the Design Directive above (P90X aesthetic, aggressive, high-contrast, mobile-first, scannable in under 2 seconds). Use shadcn/ui as the foundation, then theme aggressively with the existing Tailwind tokens. No pastel, no soft, no wellness-app vibes.

**Install shadcn/ui first:**
```bash
cd frontend
npx shadcn-ui@latest init
# Choose: TypeScript, Default style, Tailwind config path, CSS variables
# Then add components: button, card, badge, input, textarea, select, tabs, dialog, sheet, toast
npx shadcn-ui@latest add button card badge input textarea select tabs dialog sheet toast
```

After installing shadcn, override the default CSS variables in `app/globals.css` with the P90X tokens (near-black bg, red accent, sharp corners, no rounded defaults).

#### 1. Base UI Components (`frontend/components/ui/`)

Build these reusable components (use Tailwind classes, follow P90X design system):

```typescript
// Button.tsx — Primary CTA button
// Variants: primary (red bg), secondary (outline), ghost
// Sharp corners (no rounded), uppercase Bebas Neue for primary

// Card.tsx — Dark card with border + hover glow
// border-border-default bg-bg-secondary hover:shadow-glow-red

// Badge.tsx — Code-name badge (sharp corners, color-coded by program name)
// Use formatBadgeColor() from lib/utils.ts for color
// Bebas Neue uppercase, large

// Input.tsx, Textarea.tsx, Select.tsx — Form inputs
// bg-bg-tertiary, border-border-default, focus:border-accent-red

// Tabs.tsx — Tab switcher (Design View | Execution View)
// Underline indicator, red active state
```

#### 2. Layout Components (`frontend/components/layout/`)

```typescript
// Navbar.tsx — Top navigation
// Foxtrot Fitness logo (left), nav links (center), user menu (right)
// Background: bg-bg-primary with bottom border

// Footer.tsx — Minimal footer
// Copyright + links

// MobileBottomNav.tsx — Bottom nav (mobile only, hidden md:flex)
// 4 items: Home, Library, Generate (+), Profile
// Fixed bottom, dark bg, red active indicator
```

#### 3. Equipment Wizard (`frontend/components/equipment-wizard/`)

```typescript
// WizardStepper.tsx — Progress indicator (3 steps: Equipment → Goals → Review)
// Numbers with connecting lines, red active step

// CategorySelector.tsx — Equipment category cards
// 6 categories: Barbells & Plates, Squat Rack & Bench, Dumbbells & Kettlebells,
//                Machines, Bodyweight Gear, Specialty
// Icon + name, click to expand

// ItemPicker.tsx — Individual equipment selection within a category
// Toggleable item cards, checkmark when selected
// Use equipment list from /api/equipment

// SummaryReview.tsx — Final review before generation
// List of selected equipment, count, "Generate Mission" button
```

#### 4. Goals Form (`frontend/components/goals-form/`)

```typescript
// GoalSelector.tsx — Primary goal picker
// 5 large cards: Strength, Hypertrophy, Conditioning, Balanced, Longevity
// Icon + description, single select

// ExperiencePicker.tsx — Beginner / Intermediate / Advanced
// 3 cards with visual difficulty indicators

// SchedulePicker.tsx — Days/week + Session length
// Two grids: days (3/4/5) and minutes (30/45/60/75/90)

// FocusAreas.tsx — Multi-select body parts
// 7 cards: Legs, Chest, Back, Shoulders, Arms, Full Body, Core

// LimitationsInput.tsx — Free text textarea
// Placeholder: "e.g., no box jumps, bad knees, rotator cuff injury"

// PreferencesInput.tsx — Dislikes + preferred alternatives
// Tag input for dislikes, key-value pairs for alternatives
// Plus finisher preference selector
```

#### 5. Program Viewer (`frontend/components/program-viewer/`)

```typescript
// DesignView.tsx — Full structured program display
// Weekly overview + day cards

// ExecutionView.tsx — Copy-paste monospace format
// Render execution_view string from Program
// "COPY TO CLIPBOARD" button (prominent, sticky on mobile)
// Print-optimized (already in globals.css)

// DayCard.tsx — Single day card
// Day number + name, movements list, finisher, cardio, mobility notes

// MovementRow.tsx — Single movement row
// Name, sets x reps (mono), tempo badge (orange, mono), rest, notes
// Use formatTempo() from utils

// FinisherCard.tsx — Distinct visual treatment
// Darker bg, red top border, finisher name (Bebas Neue large)
// Format badge, movements list (mono)

// CodeNameBadge.tsx — Program name display
// Use formatBadgeColor() for color
// Bebas Neue uppercase, large, shield-like shape (clip-path or sharp corners)

// PillarChecklist.tsx — 5-pillar display
// 5 icons in a row: strength, zone2, vo2max, mobility, recovery
// Green checkmark if passed, red X if failed, with glow
// Always display on program cards and detail view
```

#### 6. Library (`frontend/components/library/`)

```typescript
// ProgramCard.tsx — Program card for library grid
// Code-name, goal tag, difficulty badge, split, date, pillar mini
// Click to open detail

// FilterBar.tsx — Filter by goal, days, date
// Dropdowns or chips
```

### B. Frontend Pages

Replace existing stubs and create new pages:

#### `app/page.tsx` (Landing Page)
- Hero: "BUILD YOUR MISSION" (Bebas Neue 6xl uppercase)
- Subhead: "AI-generated workout programs. Tailored to your equipment. Named like operations."
- CTA: "START YOUR MISSION" (red, large)
- Example Missions section: 3 cards (Genesis Protocol first as "START HERE")
- How It Works: 3-step visual (Equipment → Goals → Mission)
- Footer

#### `app/onboard/page.tsx` (Multi-step wizard)
- Fetch equipment from `/api/equipment` on mount
- Step 1: Equipment selection (use equipment-wizard components)
- Step 2: Goals & preferences (use goals-form components)
- Step 3: Review & generate
- On submit: POST to `/api/generate`, redirect to `/program/[id]`

#### `app/generate/page.tsx` (Generation page)
- Loading state: sequential animation ("ANALYZING EQUIPMENT..." → "DESIGNING SPLIT..." → etc.)
- Pulsing red animation
- On complete: code-name reveal + 5-pillar display + "SAVE TO LIBRARY" / "REFINE" buttons

#### `app/program/[id]/page.tsx` (Program detail)
- Fetch program from `/api/programs/[id]`
- Header: code-name, goal tag, difficulty, split, 5-pillar checklist
- Tab toggle: DESIGN VIEW | EXECUTION VIEW
- Design tab: DesignView component
- Execution tab: ExecutionView component with copy button

#### `app/library/page.tsx` (User's library)
- Fetch programs from `/api/programs`
- Grid of ProgramCards
- FilterBar at top
- Empty state if no programs

#### `app/auth/login/page.tsx` (Magic link login)
- Email input
- "SEND MAGIC LINK" button → POST to `/api/auth/request-link`
- Confirmation state after send

#### `app/auth/callback/page.tsx` (Auth callback)
- Verify token from URL, set session
- Redirect to /library or /onboard

### C. Backend Services (`backend/app/services/`)

#### `pillar_validator.py` — **THE MOST IMPORTANT SERVICE**

The 5-pillar post-generation validator. This is what makes every generated program complete and balanced.

```python
"""5-pillar post-generation validation gate."""
from typing import Tuple

COMPOUND_PATTERNS = ["squat", "deadlift", "bench", "row", "press", "pull", "hinge"]

def validate_program(program: dict) -> Tuple[bool, list[str]]:
    """
    Returns (is_valid, missing_pillars).
    
    Checks all 5 pillars:
    1. strength — compound movements present
    2. zone2 — cardio block ≥ 20 min labeled zone-2
    3. vo2max — norwegian 4x4 OR HIIT finisher OR dedicated cardio day
    4. mobility — warm-up/cool-down/flexibility notes
    5. recovery — rest day OR active recovery session
    """
    missing = []
    days = program.get("design_view", {}).get("days", [])
    
    # 1. Strength check
    has_strength = any(
        any(p in m.get("name", "").lower() for p in COMPOUND_PATTERNS)
        for day in days
        for m in day.get("movements", [])
    )
    if not has_strength:
        missing.append("strength")
    
    # 2. Zone 2 check
    has_zone2 = any(
        day.get("cardio", {}).get("type") == "zone-2"
        and day["cardio"].get("duration_minutes", 0) >= 20
        for day in days
    )
    if not has_zone2:
        missing.append("zone2")
    
    # 3. VO2 Max check
    has_vo2 = (
        any("norwegian" in str(day).lower() for day in days)
        or any(day.get("finisher") for day in days)
    )
    if not has_vo2:
        missing.append("vo2max")
    
    # 4. Mobility check
    has_mobility = any(
        any(kw in str(day).lower() for kw in ["warm", "mobility", "foam", "stretch", "cool"])
        for day in days
    )
    if not has_mobility:
        missing.append("mobility")
    
    # 5. Recovery check
    has_recovery = (
        len(days) < 7
        or any("recovery" in day.get("name", "").lower() or "rest" in day.get("name", "").lower()
               for day in days)
    )
    if not has_recovery:
        missing.append("recovery")
    
    return (len(missing) == 0, missing)


def regenerate_flag(missing_pillar: str) -> str:
    """Return the regeneration flag for the LLM."""
    return f"Regenerate — missing pillar: {missing_pillar}"
```

#### `name_generator.py` — Code-name engine

```python
"""Generate Adjective + Noun code-names with collision detection."""

ADJECTIVES = [
    "Crimson", "Cobalt", "Sanguine", "Obsidian", "Titanium", "Iron",
    "Voltage", "Apex", "Vortex", "Phantom", "Rogue", "Ironclad",
    "Brutal", "Savage", "Feral", "Onyx", "Steel", "Thunder",
    "Solar", "Lunar", "Arctic", "Inferno", "Tempest", "Cyclone",
    "Glacial", "Magma", "Shadow", "Diamond", "Neon", "Pulse"
]

NOUNS = [
    "Typhoon", "Fury", "Thunder", "Protocol", "Sentinel", "Bastion",
    "Reckoning", "Tempest", "Vanguard", "Falcon", "Hammer", "Breaker",
    "Storm", "Raptor", "Colossus", "Inferno", "Bulwark", "Catalyst",
    "Engine", "Crucible", "Phoenix", "Titan", "Wolverine", "Mammoth",
    "Grizzly", "Jackal", "Cobra", "Panther", "Wolfhound", "Badger"
]

RESERVED = {"Genesis Protocol", "Cobalt Fury", "Sanguine Thunder"}

import random

def generate_name() -> str:
    """Generate a random code-name."""
    return f"{random.choice(ADJECTIVES)} {random.choice(NOUNS)}"


def is_collision(name: str, existing_names: set) -> bool:
    """Check if name collides with existing or reserved names."""
    return name in existing_names or name in RESERVED


def generate_unique_name(existing_names: set, max_retries: int = 3) -> str:
    """Generate a unique name with collision retries."""
    for _ in range(max_retries):
        name = generate_name()
        if not is_collision(name, existing_names):
            return name
    raise ValueError("Could not generate unique name after max retries")
```

#### `finisher_matcher.py` — Finisher selection

```python
"""Match finishers to user equipment and preferences."""
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models import Finisher

async def find_matching_finisher(
    session: AsyncSession,
    equipment_ids: list[str],
    difficulty: str = "intermediate",
    finisher_type: Optional[str] = None,
) -> Optional[Finisher]:
    """
    Find a finisher that matches the user's equipment and difficulty level.
    
    Algorithm:
    1. Filter finishers where equipment_required is subset of user's equipment
    2. Filter by difficulty if specified
    3. Filter by type (metabolic/volume/etc.) if specified
    4. Return random match
    """
    result = await session.execute(select(Finisher))
    all_finishers = result.scalars().all()
    
    candidates = []
    for f in all_finishers:
        if f.difficulty == difficulty:
            if not f.equipment_required or all(eq in equipment_ids for eq in f.equipment_required):
                if not finisher_type or f.type == finisher_type:
                    candidates.append(f)
    
    return random.choice(candidates) if candidates else None
```

#### `program_generator.py` — LLM integration

```python
"""Format prompt + call LLM + parse response."""
import httpx
import json
from typing import Optional

from app.config import settings
from app.schemas.program import ProgramSchema
from app.services.pillar_validator import validate_program, regenerate_flag
from app.services.name_generator import generate_unique_name
from app.services.finisher_matcher import find_matching_finisher

async def generate_program(
    equipment_ids: list[str],
    equipment_list: str,  # formatted equipment names
    goals,
    preferences,
    user_level: str,
    session,
    max_retries: int = 2,
) -> ProgramSchema:
    """
    Generate a program via LLM with 5-pillar validation gate.
    
    Flow:
    1. Format prompt
    2. Call LLM
    3. Parse JSON
    4. Run 5-pillar validation
    5. If fails, regenerate with flag (max 2 retries)
    6. Generate unique code-name
    7. Build execution view
    8. Return
    """
    # Format prompt from ai/prompts/program_design.md
    prompt = format_prompt(equipment_list, goals, preferences, user_level)
    
    missing_pillars = []
    for attempt in range(max_retries + 1):
        # Call LLM
        raw_response = await call_llm(prompt, missing_pillars)
        
        # Parse JSON
        try:
            program_dict = json.loads(raw_response)
        except json.JSONDecodeError:
            missing_pillars = ["all"]  # Regenerate
            continue
        
        # Validate 5 pillars
        is_valid, missing = validate_program(program_dict)
        if is_valid:
            break
        missing_pillars = missing
    else:
        raise ValueError("Failed to generate valid program after max retries")
    
    # Generate unique code-name
    existing_names = await get_existing_program_names(session)
    if not program_dict.get("name") or program_dict["name"] in existing_names:
        program_dict["name"] = generate_unique_name(existing_names)
    
    # Build execution view from design view
    program_dict["execution_view"] = build_execution_view(program_dict["design_view"])
    
    return ProgramSchema(**program_dict)


async def call_llm(prompt: str, missing_pillars: list[str] = None) -> str:
    """Call LLM API (OpenRouter)."""
    headers = {
        "Authorization": f"Bearer {settings.llm_api_key}",
        "Content-Type": "application/json",
    }
    
    # If regenerating, add flag to prompt
    if missing_pillars:
        prompt += f"\n\nIMPORTANT: The previous output was missing these pillars: {', '.join(missing_pillars)}. Ensure they are present in your regeneration."
    
    payload = {
        "model": settings.llm_model,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 4096,
        "temperature": 0.7,
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(settings.llm_api_url, headers=headers, json=payload, timeout=60.0)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]


def format_prompt(equipment_list: str, goals, preferences, user_level: str) -> str:
    """Format the system prompt template with user data."""
    template_path = "ai/prompts/program_design.md"
    with open(template_path) as f:
        template = f.read()
    
    # Extract system prompt (text between ``` blocks)
    # ... (parse and format)
    return template.format(
        days_per_week=goals.days_per_week,
        experience=user_level,
        equipment_list=equipment_list,
        goal=goals.primary,
        focus_areas=", ".join(goals.focus_areas),
        session_minutes=goals.session_length_minutes,
        limitations=goals.limitations or "None",
        finisher_pref=goals.finisher_preference,
        dislikes=", ".join(preferences.dislikes) or "None",
        preferred_alternatives=json.dumps(preferences.preferred_alternatives),
    )


def build_execution_view(design_view: dict) -> str:
    """Convert design_view JSON to copy-paste execution_view string."""
    lines = []
    for day in design_view["days"]:
        lines.append(f"### {day_name_for_day_number(day['day'])}: {day['name']}")
        for movement in day.get("movements", []):
            notes = f" | {movement['notes']}" if movement.get("notes") else ""
            lines.append(f"- {movement['name']}: {movement['sets']}x{movement['reps']} | Tempo: {movement['tempo']}{notes}")
        
        if day.get("finisher"):
            fin = day["finisher"]
            lines.append(f"- FINISHER: \"{fin['name']}\"")
            lines.append(f"    - Format: {fin['format']}")
            for m in fin.get("movements", []):
                detail = f" ({m.get('detail')})" if m.get('detail') else ""
                lines.append(f"    - {m.get('name')}{detail}")
        
        if day.get("cardio"):
            cardio = day["cardio"]
            lines.append(f"- {cardio['type'].upper()} Cardio: {cardio['duration_minutes']}m ({cardio.get('equipment', '')})")
        
        if day.get("mobility"):
            lines.append(f"- Mobility: {day['mobility']}")
        
        lines.append("")  # blank line between days
    
    return "\n".join(lines)


def day_name_for_day_number(day_num: int) -> str:
    """Map day number to day name based on days_per_week."""
    # This is a simple mapping; you can make it smarter based on the split
    days_4 = {1: "MONDAY", 2: "TUESDAY", 3: "THURSDAY", 4: "FRIDAY"}
    days_3 = {1: "MONDAY", 2: "WEDNESDAY", 3: "FRIDAY"}
    days_5 = {1: "MONDAY", 2: "TUESDAY", 3: "WEDNESDAY", 4: "THURSDAY", 5: "FRIDAY"}
    
    return days_4.get(day_num) or days_3.get(day_num) or days_5.get(day_num) or f"DAY {day_num}"
```

#### `auth_service.py` — Magic link auth

```python
"""Email magic link authentication."""
import secrets
from datetime import datetime, timedelta
from fastapi import HTTPException
import httpx

from app.config import settings

async def send_magic_link(email: str) -> str:
    """Generate magic link token and send via Resend."""
    token = secrets.token_urlsafe(32)
    
    # Store token in DB with expiry (implement with a tokens table or Redis)
    # For MVP, use in-memory dict or simple DB table
    # await store_token(token, email, expires_at=datetime.utcnow() + timedelta(hours=1))
    
    # Send email via Resend
    magic_link = f"{settings.app_url}/auth/callback?token={token}"
    await send_email(email, "Your Foxtrot Fitness Magic Link", f"Click to log in: {magic_link}")
    
    return token


async def verify_token(token: str) -> str:
    """Verify magic link token and return email."""
    # Look up token in storage
    # email = await lookup_token(token)
    # if not email or expired:
    #     raise HTTPException(401, "Invalid or expired token")
    # return email
    pass


async def send_email(to: str, subject: str, body: str):
    """Send email via Resend API."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.resend.com/emails",
            headers={"Authorization": f"Bearer {settings.resend_api_key}"},
            json={"from": "Foxtrot Fitness <noreply@foxtrotfitness.com>", "to": to, "subject": subject, "text": body}
        )
        response.raise_for_status()
```

### D. Backend Routers (`backend/app/routers/`)

Each router implements the API endpoints. Uncomment the router registrations in `app/main.py` when ready.

#### `auth.py`

```python
from fastapi import APIRouter, HTTPException
from app.services.auth_service import send_magic_link, verify_token

router = APIRouter()

@router.post("/request-link")
async def request_link(email: str):
    """Send magic link to email."""
    await send_magic_link(email)
    return {"message": "Magic link sent"}

@router.post("/verify")
async def verify(token: str):
    """Verify magic link token and create session."""
    email = await verify_token(token)
    if not email:
        raise HTTPException(401, "Invalid token")
    # Create session/JWT here
    return {"email": email, "token": "session_token"}

@router.get("/me")
async def me():
    """Get current user (from session)."""
    # Implement session check
    pass
```

#### `users.py`

```python
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.user import UserSchema, UserUpdate

router = APIRouter()

@router.get("/me", response_model=UserSchema)
async def get_me(db: AsyncSession = Depends(get_db)):
    """Get current user profile."""
    # Implement session check, fetch user
    pass

@router.put("/me", response_model=UserSchema)
async def update_me(update: UserUpdate, db: AsyncSession = Depends(get_db)):
    """Update user profile."""
    # Implement
    pass
```

#### `equipment.py`

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Equipment
from app.schemas.equipment import EquipmentSchema

router = APIRouter()

@router.get("", response_model=list[EquipmentSchema])
async def list_equipment(db: AsyncSession = Depends(get_db)):
    """List all equipment (grouped by category)."""
    result = await db.execute(select(Equipment).order_by(Equipment.category))
    return result.scalars().all()

@router.get("/{equipment_id}", response_model=EquipmentSchema)
async def get_equipment(equipment_id: str, db: AsyncSession = Depends(get_db)):
    """Get single equipment by ID."""
    result = await db.execute(select(Equipment).where(Equipment.id == equipment_id))
    equipment = result.scalar_one_or_none()
    if not equipment:
        raise HTTPException(404, "Equipment not found")
    return equipment
```

#### `movements.py`

```python
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Movement
from app.schemas.movement import MovementSchema

router = APIRouter()

@router.get("", response_model=list[MovementSchema])
async def list_movements(db: AsyncSession = Depends(get_db)):
    """List all movements."""
    result = await db.execute(select(Movement))
    return result.scalars().all()
```

#### `programs.py`

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Program
from app.schemas.program import ProgramSchema

router = APIRouter()

@router.get("", response_model=list[ProgramSchema])
async def list_programs(db: AsyncSession = Depends(get_db)):
    """List user's programs + example programs."""
    # For MVP, return all example programs
    # In production, filter by user_id from session
    result = await db.execute(
        select(Program).where(Program.is_example == True).order_by(Program.created_at.desc())
    )
    return result.scalars().all()

@router.get("/examples", response_model=list[ProgramSchema])
async def list_examples(db: AsyncSession = Depends(get_db)):
    """List example programs (for landing page)."""
    result = await db.execute(
        select(Program).where(Program.is_example == True).order_by(Program.created_at)
    )
    return result.scalars().all()

@router.get("/{program_id}", response_model=ProgramSchema)
async def get_program(program_id: str, db: AsyncSession = Depends(get_db)):
    """Get single program by ID."""
    result = await db.execute(select(Program).where(Program.id == program_id))
    program = result.scalar_one_or_none()
    if not program:
        raise HTTPException(404, "Program not found")
    return program

@router.post("/{program_id}/save", response_model=ProgramSchema)
async def save_program(program_id: str, db: AsyncSession = Depends(get_db)):
    """Save generated program to user's library."""
    # Copy program and set user_id
    pass

@router.delete("/{program_id}")
async def delete_program(program_id: str, db: AsyncSession = Depends(get_db)):
    """Delete program."""
    pass
```

#### `generation.py`

```python
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.generation import GenerationRequest, GenerationResponse
from app.services.program_generator import generate_program

router = APIRouter()

@router.post("", response_model=GenerationResponse)
async def generate(request: GenerationRequest, db: AsyncSession = Depends(get_db)):
    """Generate a new program based on equipment + goals + preferences."""
    # Fetch equipment names
    equipment_list = ... # format from equipment_ids
    
    program = await generate_program(
        equipment_ids=request.equipment_ids,
        equipment_list=equipment_list,
        goals=request.goals,
        preferences=request.preferences,
        user_level=request.user_level,
        session=db,
    )
    
    return GenerationResponse(program=program)
```

### E. Tests (`backend/app/tests/`)

Replace `test_placeholder.py` with:

```python
# test_generation.py — Test generation endpoint
# test_pillar_validator.py — Test 5-pillar validation
# test_name_generator.py — Test code-name generation + collision
# test_finisher_matcher.py — Test finisher matching
```

Use pytest + pytest-asyncio. Mock the LLM API call in generation tests.

---

## 🎨 DESIGN SYSTEM (Already Configured — Use These)

```typescript
// Tailwind color classes
bg-bg-primary (near-black main bg)
bg-bg-secondary (dark charcoal cards)
bg-bg-tertiary (lighter charcoal inputs/hover)

text-text-primary (near-white)
text-text-secondary (gray)
text-text-muted (dark gray)

bg-accent-red (P90X red — primary CTA)
bg-accent-orange (energy/highlight — tempo badges)
bg-accent-green (success — pillar passed)
bg-accent-blue (info — Zone 2 indicators)

border-border-default (subtle)
border-border-active (red, active state)

bg-badge-crimson, bg-badge-cobalt, bg-badge-sanguine, bg-badge-genesis

// Font classes
font-display (Bebas Neue — headings, code-names, CTAs, uppercase)
font-body (Inter — body text)
font-mono (JetBrains Mono — tempo, execution view)

// Shadow classes
shadow-glow-red (hover glow effect)
shadow-glow-red-strong (intense glow)

// Animation classes
animate-pulse-red (generation loading)
animate-fade-in (page transitions)
```

**Design philosophy:** P90X-inspired — dark, industrial, sharp corners (no rounded), militaristic, high contrast, mission/operations aesthetic.

---

## 🚀 VERIFICATION STEPS

After building, verify:

1. `cd backend && python -m app.seed.seed` populates DB successfully
2. `cd backend && uvicorn app.main:app --reload` starts on port 8000
3. `cd frontend && npm run dev` starts on port 3000
4. Landing page loads at http://localhost:3000 and shows 3 example programs
5. Onboarding wizard lets user select equipment + set goals
6. Generation produces a valid program with all 5 pillars
7. Program detail page shows Design View and Execution View
8. Library page lists saved programs
9. Mobile responsive: test on phone-sized viewport
10. No console errors, no TypeScript errors, no Python linting errors

### 🎨 Design Verification (Non-Negotiable)

11. **No pastel colors anywhere.** All UI uses the P90X tokens defined in `tailwind.config.ts`. If you see soft blue, mint green, or pale yellow, rebuild it.
12. **Sharp corners only.** All cards, buttons, badges have `rounded-none` or `rounded-sm` (max 2px). No pill shapes, no soft rounded edges.
13. **Bebas Neue on all headers and code-names.** Uppercase, tight letter-spacing. Body text uses Inter. Tempo/execution view uses JetBrains Mono.
14. **2-second scan test.** Open any program card or equipment selector. Can you understand what it is and what to do in under 2 seconds? If not, rebuild with stronger visual hierarchy.
15. **Mobile-first verified.** Test on phone-sized viewport (375px wide). Every screen works, every tap target is ≥44px, bottom nav is reachable.
16. **shadcn/ui themed aggressively.** Default shadcn components are too soft. Override every CSS variable in `globals.css` with P90X tokens. Make it feel like P90X, not Stripe.
17. **Visual momentum.** Every CTA has a glow or pulse animation. Every completed action feels rewarding (checkmarks, progress bars, level-up animations).

---

## 📁 FINAL FILE STRUCTURE

After completion, the project should look like:

```
foxtrot-fitness/
├── frontend/
│   ├── app/
│   │   ├── page.tsx ✅ (build)
│   │   ├── onboard/page.tsx ✅ (build)
│   │   ├── generate/page.tsx ✅ (build)
│   │   ├── program/[id]/page.tsx ✅ (build)
│   │   ├── library/page.tsx ✅ (build)
│   │   ├── auth/{login,callback}/page.tsx ✅ (build)
│   │   ├── layout.tsx ✅
│   │   └── globals.css ✅
│   ├── components/
│   │   ├── ui/ ✅ (build)
│   │   ├── layout/ ✅ (build)
│   │   ├── equipment-wizard/ ✅ (build)
│   │   ├── goals-form/ ✅ (build)
│   │   ├── program-viewer/ ✅ (build)
│   │   └── library/ ✅ (build)
│   ├── lib/ ✅
│   ├── package.json ✅
│   └── tailwind.config.ts ✅
├── backend/
│   ├── app/
│   │   ├── main.py ✅ (uncomment router registrations)
│   │   ├── config.py ✅
│   │   ├── database.py ✅
│   │   ├── models/ ✅
│   │   ├── schemas/ ✅
│   │   ├── seed/ ✅
│   │   ├── routers/ ✅ (build all 6)
│   │   ├── services/ ✅ (build all 4)
│   │   └── tests/ ✅ (build real tests)
│   ├── alembic/ ✅
│   ├── requirements.txt ✅
│   └── .env.example ✅
├── ai/prompts/ ✅
├── docs/ ✅
└── Makefile, docker-compose.yml, README.md ✅
```

---

## ⚠️ IMPORTANT REMINDERS

1. **Do NOT rebuild** what's already scaffolded. The config files, types, models, schemas, and seed data are locked.
2. **Uncomment router registrations** in `app/main.py` when you build the routers.
3. **Use the design system** — colors, fonts, animations are pre-configured in Tailwind.
4. **P90X aesthetic** — sharp corners, dark backgrounds, red accents, Bebas Neue for impact.
5. **Mobile responsive** — every page must work on phone-sized viewports.
6. **The 5-pillar validator** is the heart of the system. Build it correctly — it ensures every generated program is complete.
7. **Read `~/Projects/foxtrot-fitness/SESSION_STATUS.md`** for the full "what's done / what's not" map.

---

## 🎯 TOKEN EFFICIENCY DIRECTIVE — READ THIS

**You have a HARD usage cap. No additional plans can be purchased. Once the cap is hit, you stop.** This is a 7-day window with no safety net. Treat every token as finite.

### Build Priority Order (Critical — Follow This Exactly)

Build in this order so the most critical functionality ships first. If you hit the cap mid-build, whatever was built in priority 1-2 is what we get:

1. **Backend services first** (highest logic complexity, hardest to replicate without Fable 5):
   - `pillar_validator.py` → `name_generator.py` → `finisher_matcher.py` → `program_generator.py`
   - Then all 6 routers + uncomment in `main.py`
   - Then tests for the 4 core services only

2. **Frontend pages second** (highest visual complexity):
   - Landing page → Program detail page → Onboarding wizard → Generation page
   - These are the user-facing screens — they need the P90X design treatment

3. **Auth + library third** (important but not blocking core flow):
   - Login/callback pages, library page, mobile bottom nav

4. **Polish last** (only if tokens remain after core flow works):
   - Animations, transitions, progress indicators, advanced mobile optimization
   - Deployment configs (.github/workflows, Vercel/Railway files)

**If you hit your cap, the app must still work with whatever was built in tiers 1-2.** A functional app with basic styling is infinitely better than a beautiful app that crashes because generation was half-built. Prioritize a working end-to-end flow (equipment → goals → generate → view) above all else.

### Token-Saving Rules

- **Do NOT over-comment code.** Comments only where logic is non-obvious. One-liner comments max.
- **Do NOT repeat patterns.** If you build one router, the others follow the same shape — don't re-explain each one in comments.
- **Do NOT write verbose docstrings.** One-line docstrings only.
- **Use existing types and schemas as-is.** They're already defined — import and use, don't redefine.
- **Do NOT generate README content or documentation** beyond what already exists. Code only.
- **Do NOT add tests for every function.** Test only the 4 core services (pillar_validator, name_generator, finisher_matcher, program_generator). Skip router tests — they're thin CRUD wrappers.
- **Batch file writes.** Don't read a file, make one edit, then write it back. Make all changes in one pass.

---

## 🔍 PRE-BUILD AUDIT (5 Minutes Max)

Before you start building, do a quick review of the scaffold:

1. **Read `SESSION_STATUS.md`** — understand what's done and what's not.
2. **Read `frontend/lib/types.ts` and `backend/app/schemas/`** — these are your source of truth for data shapes.
3. **Read `backend/app/seed/example_programs.json`** — these are the real programs your components must display correctly.
4. **Read `tailwind.config.ts`** — your design tokens.
5. **Read `ai/prompts/program_design.md`** — the prompt template `program_generator.py` will use.

If you spot any issues in the scaffold (type mismatches, schema inconsistencies, missing fields), fix them first, then proceed to build.

Do NOT spend more than 5 minutes on this audit. Its purpose is orientation, not redesign.

---

**Build the remaining pieces. Ship it.**