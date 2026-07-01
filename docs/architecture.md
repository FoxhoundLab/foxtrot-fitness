# Foxtrot Fitness — Architecture

## System Overview

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                │
│  Equipment Wizard │ Profile Builder │ Program Viewer │
│  Program Library  │ Finisher Display│ History        │
└──────────────────────┬──────────────────────────────┘
                       │ REST API
┌──────────────────────▼──────────────────────────────┐
│                   BACKEND (FastAPI)                  │
│  Auth Service │ User Service │ Program CRUD Service │
│  Equipment Catalog │ Movement DB │ AI Orchestrator  │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              AI GENERATION PIPELINE                  │
│  ┌──────────────────────────────────────────────┐   │
│  │  LLM Call + Post-Gen 5-Pillar Validator     │   │
│  │  + Code-Name Engine + Finisher Matcher       │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## Data Flow

### Program Generation Flow

1. User submits equipment + goals + preferences → frontend
2. Frontend POSTs to `/api/generate` → backend
3. Backend formats prompt (using `ai/prompts/program_design.md` template)
4. Backend calls LLM API
5. Backend parses JSON response
6. **5-pillar validation gate** runs:
   - If any pillar missing → re-route to LLM with specific flag (max 2 retries)
7. Code-name collision check → if collision, regenerate name
8. Generate Execution View from Design View
9. Save to database
10. Return Program to frontend

## The 5-Pillar Blueprint

Every program must satisfy all 5 pillars (Bryan Johnson Blueprint):

1. **Strength** — Compound movements (squat/hinge/push/pull)
2. **Zone 2 Cardio** — ≥20 min, conversation pace
3. **VO2 Max** — Norwegian 4x4, HIIT finisher, or dedicated cardio day
4. **Mobility** — Warm-up/cool-down/flexibility work
5. **Recovery** — Rest day or active recovery session

## The Code-Name System

Every program gets a name: **Operation [Adjective] [Noun]** (e.g., "Operation Cobalt Fury", "Operation Classy Cat", "Operation Zesty Phantom").

Word lists mix fun/silly with military/intense — the generator picks randomly for surprising combos.

Reserved names (example programs keep their original format):
- Genesis Protocol
- Cobalt Fury
- Sanguine Thunder

## The Finisher Library

6 named finishers, each with distinct format and equipment requirements:

| Finisher | Format | Type | Difficulty |
|---|---|---|---|
| The Engine Burn | EMOM | Metabolic | Intermediate |
| The Oxygen Debt | EMOM | Metabolic | Beginner |
| The Iron Lung | Rounds | Posterior Chain | Intermediate |
| The Genesis Chipper | For Time | High-Volume | Advanced |
| The Compression | Rounds | Full-Body | Intermediate |
| The Vertical Limit | AMRAP | Shoulder Endurance | Intermediate |

## Database Schema

5 core tables:
- `users` — user profiles + preferences
- `equipment` — canonical equipment catalog (seeded)
- `movements` — movement database (seeded)
- `finishers` — finisher library (seeded)
- `programs` — generated + example programs

See `backend/alembic/versions/0001_initial_schema.py` for full DDL.

## Deployment

- **Frontend:** Vercel (Next.js 14)
- **Backend:** Railway (FastAPI)
- **Database:** Supabase (PostgreSQL)
- **AI:** OpenRouter API (default: anthropic/claude-sonnet-4)

---

## Roadmap

### Phase 1 — Weekly Programs (MVP) ✅ CURRENT

Equipment wizard → AI generates a single weekly program → Design/Execution views → Library.

Core loop is functional. All 5 pillars validated. Code-name engine produces Operation names.

### Phase 2 — Monthly Blocks (Periodization)

**Concept:** Advanced users stack 4 weekly programs into a coordinated monthly mesocycle with built-in progressive overload and CNS recovery (deload week).

**Block periodization** is the science of varying training intensity across weeks to prevent overtraining and maximize adaptation. No consumer fitness app currently offers AI-generated periodized blocks — this is a competitive moat.

#### Block Styles

| Style | Week 1 | Week 2 | Week 3 | Week 4 |
|---|---|---|---|---|
| **Progressive** | 75% Foundation | 85% Build | 95% Peak | 60% Deload |
| **Wave** | 80% | 70% | 90% | 65% |
| **Peak** | 70% | 80% | 100% Max | 55% Recovery |

Week 4 is always a deload — reduced volume (~40% drop), moderate intensity. This recharges the central nervous system and prevents burnout.

#### Access Gate

| User Level | Block Access |
|---|---|
| Beginner | Weekly only — "Build consistency first" |
| Intermediate | Weekly + teaser ("unlock at Advanced") |
| Advanced | Full access — "Build a Monthly Block" toggle |

#### Data Model

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "Phase I: Crimson Ascension",
  "block_type": "progressive | wave | peak",
  "goal_tag": "Hypertrophy Block — 4-week mesocycle",
  "weeks": [
    {
      "week_number": 1,
      "program_id": "uuid",
      "intensity_percent": 75,
      "label": "Foundation"
    },
    {
      "week_number": 2,
      "program_id": "uuid",
      "intensity_percent": 85,
      "label": "Build"
    },
    {
      "week_number": 3,
      "program_id": "uuid",
      "intensity_percent": 95,
      "label": "Peak"
    },
    {
      "week_number": 4,
      "program_id": "uuid",
      "intensity_percent": 60,
      "label": "Deload"
    }
  ],
  "current_week": 1,
  "is_active": true,
  "created_at": "timestamp"
}
```

#### API Endpoints

```
POST /api/blocks/generate     # Generate a 4-week block
GET  /api/blocks              # List user's blocks
GET  /api/blocks/{id}         # Block detail with all 4 weeks linked
POST /api/blocks/{id}/activate  # Set as current training plan
```

#### AI Prompt Logic

Block generation produces 4 coordinated weekly programs in a single pass. The prompt tells the LLM:

> Design 4 coordinated weekly programs forming a {block_type} mesocycle.
> Week 1: {intensity}% (Foundation) — moderate volume, establish baseline.
> Week 2: {intensity}% (Build) — increase volume or load ~10-15%.
> Week 3: {intensity}% (Peak) — highest volume/heaviest loads of the block.
> Week 4: {intensity}% (Deload) — reduce volume by 40%, keep intensity moderate. CNS recovery.
> Never repeat the same primary movement pattern on consecutive days within any week.
> Each week gets a unique Operation name. The block gets its own phase name.

#### Frontend Changes

- **Onboarding:** Advanced users see "Weekly" vs "Monthly Block" toggle after ExperienceGate
- **Library:** New "Blocks" tab alongside "Programs"
- **New page:** `/block/[id]` — visual month calendar showing all 4 weeks with intensity bars
- **Program detail:** If part of a block, show "Week 2 of Phase I: Crimson Ascension"
- **Block detail:** Intensity graph (ascending curve to week 3, sharp drop week 4)

#### Key Principle

The `Program` model remains the atomic unit. A `Block` is simply a collection of 4 Programs with an intensity curve and metadata. No refactor to existing weekly generation needed — pure addition.

### Phase 3 — Auto-Progression

App tracks program completion and suggests when to start a new block. Detects plateaus and recommends deload weeks based on training log data.