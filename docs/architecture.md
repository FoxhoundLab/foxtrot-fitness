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

Every program gets a name: **Adjective + Noun** (e.g., "Cobalt Fury", "Sanguine Thunder", "Crimson Typhoon").

Reserved names (already used by example programs):
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