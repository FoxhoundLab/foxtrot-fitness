# Foxtrot Fitness — Scaffold Status

**Last updated:** 2026-07-01
**Phase:** Scaffold complete. Ready for Fable 5.

---

## ✅ What's Already Built (DO NOT REBUILD)

### Root
- `Makefile` — install, dev, backend, frontend, seed, test, docker-up, docker-down, clean
- `docker-compose.yml` — Postgres + backend services
- `.gitignore` — Python, Node, IDE, OS, DB
- `README.md` — project overview

### Frontend (`frontend/`)
- `package.json` — Next.js 14, React 18, Tailwind, TypeScript, Supabase, Lucide, clsx, twMerge, zod, react-hook-form
- `tsconfig.json` — strict mode, path alias `@/*`
- `next.config.js` — minimal config
- `tailwind.config.ts` — **FULL P90X DESIGN SYSTEM CONFIGURED** (colors, fonts, animations, shadows)
- `postcss.config.js`
- `app/globals.css` — dark background, sharp corners, scrollbar styling, print styles
- `app/layout.tsx` — Bebas Neue + Inter + JetBrains Mono font loading, root layout
- `app/page.tsx` — minimal landing stub (Fable 5 builds the real one)
- `lib/types.ts` — **COMPLETE TypeScript types** for User, Equipment, Movement, Finisher, Program, etc.
- `lib/utils.ts` — cn(), formatTempo(), formatDifficultyColor(), formatBadgeColor()
- `lib/api.ts` — **COMPLETE API client** with all endpoints stubbed
- `lib/supabase.ts` — Supabase browser client

### Backend (`backend/`)
- `requirements.txt` — FastAPI, SQLAlchemy, asyncpg, Pydantic, httpx, Resend, Supabase, etc.
- `alembic.ini`, `alembic/env.py` — async Alembic config
- `alembic/versions/0001_initial_schema.py` — **FULL DDL** for all 5 tables
- `app/main.py` — FastAPI entry, CORS, health check, router stubs (commented)
- `app/config.py` — Pydantic settings (DB URL, Supabase, Resend, LLM)
- `app/database.py` — async engine + session maker
- `app/models/` — **ALL 5 SQLAlchemy models** (User, Equipment, Movement, Finisher, Program)
- `app/schemas/` — **ALL Pydantic schemas** (User, Equipment, Movement, Finisher, Program, Generation)
- `app/seed/seed.py` — **WORKING seed script** that populates equipment + finishers + example programs

### Seed Data (`backend/app/seed/`)
- `equipment_catalog.json` — **26 equipment items** across 6 categories (barbells, rack, weights, machines, cardio, bodyweight, specialty)
- `finisher_library.json` — **ALL 6 finishers** with full movement breakdowns (Engine Burn, Oxygen Debt, Iron Lung, Genesis Chipper, Compression, Vertical Limit)
- `example_programs.json` — **ALL 3 EXAMPLE PROGRAMS** as valid JSON matching Pydantic schema:
  - Genesis Protocol (beginner, 4-day)
  - Cobalt Fury (intermediate, 4-day)
  - Sanguine Thunder (intermediate, 4-day)

### AI (`ai/`)
- `prompts/program_design.md` — **FULL prompt template** with system prompt + refinement prompt

### Docs (`docs/`)
- `architecture.md` — system overview, data flow, 5-pillar explanation, deployment
- `deployment.md` — local dev + production deployment guide

---

## ❌ What Fable 5 Needs to Build (FRONTEND ONLY)

**Backend is COMPLETE.** All services, routers, deps, and main.py are done.

### Frontend Components & Pages

#### Pages (`frontend/app/`)
- `app/page.tsx` — REPLACE stub with **Landing Page**: hero + 3 example program cards + how-it-works
- `app/onboard/page.tsx` — Multi-step wizard (equipment → goals → review)
- `app/generate/page.tsx` — Generation loading state + result display
- `app/program/[id]/page.tsx` — Program detail (Design View + Execution View tabs)
- `app/library/page.tsx` — User's saved programs
- `app/auth/login/page.tsx` — Magic link login
- `app/auth/callback/page.tsx` — Auth callback

#### Components (`frontend/components/`)
- `ui/` — Button, Card, Badge, Input, Select, Tabs (base components)
- `layout/` — Navbar, Footer, MobileBottomNav
- `equipment-wizard/` — WizardStepper, CategorySelector, ItemPicker, SummaryReview
- `goals-form/` — GoalSelector, ExperiencePicker, SchedulePicker, FocusAreas, LimitationsInput, PreferencesInput
- `program-viewer/` — DesignView, ExecutionView, DayCard, MovementRow, FinisherCard, CodeNameBadge, PillarChecklist
- `library/` — ProgramCard, FilterBar

### Backend Routers (`backend/app/routers/`) — ✅ ALL COMPLETE

All 6 routers are fully implemented and registered in `main.py`:
- ✅ `auth.py` — Magic link auth endpoints
- ✅ `users.py` — User profile CRUD with get_or_create_user dependency
- ✅ `equipment.py` — Equipment catalog listing
- ✅ `movements.py` — Movement database listing
- ✅ `programs.py` — Program CRUD, examples, save/delete
- ✅ `generation.py` — AI generation endpoint with full pipeline

### Backend Services (`backend/app/services/`) — ✅ ALL COMPLETE

All 5 services are fully implemented and tested:
- ✅ `pillar_validator.py` — 5-pillar post-generation validation gate
- ✅ `name_generator.py` — Code-name engine (Adjective + Noun, collision detection)
- ✅ `finisher_matcher.py` — Finisher selection by equipment/difficulty/type
- ✅ `program_generator.py` — LLM integration + prompt formatting + execution view builder
- ✅ `auth_service.py` — In-memory token store + Resend email integration

### Backend Shared (`backend/app/`)
- ✅ `deps.py` — `get_current_user` + `get_or_create_user` dependencies
- ✅ `main.py` — All 6 routers registered

---

## 🎨 Design System Already Configured

**Don't reconfigure these — use them:**

```typescript
// Colors (Tailwind)
bg-primary, bg-secondary, bg-tertiary
accent-red, accent-red-dark, accent-red-glow
accent-orange, accent-orange-dark
accent-blue, accent-blue-dark
accent-green, accent-green-dark
text-primary, text-secondary, text-muted
border-default, border-active
badge-crimson, badge-cobalt, badge-sanguine, badge-genesis

// Fonts (CSS variables)
--font-display: Bebas Neue (headings, code-names, CTAs)
--font-body: Inter (body text)
--font-mono: JetBrains Mono (tempo, execution view, code)

// Shadows
shadow-glow-red, shadow-glow-red-strong, shadow-glow-green

// Animations
animate-pulse-red, animate-fade-in
```

**Design philosophy:** P90X-inspired — dark, industrial, sharp corners, militaristic, high contrast.

**⚠️ Design Directive (Non-Negotiable):**
- Aggressive, high-energy fitness aesthetic. NOT wellness app vibes.
- Use shadcn/ui as foundation, theme aggressively with P90X tokens.
- Mobile-first. Every screen scannable in under 2 seconds.
- No pastel colors. No soft rounded shapes. No therapy-app aesthetic.
- Data-forward: athletes scan, don't read. Strong visual hierarchy.
- Progressive overload visual language: streaks, completion bars, level-up feel.

**Install shadcn/ui first:**
```bash
cd frontend
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card badge input textarea select tabs dialog sheet toast
```

Then override shadcn's default CSS variables in `app/globals.css` with the P90X tokens. Default shadcn is too soft — make it feel like P90X, not Stripe.

---

## 🚀 How to Run Locally

```bash
cd ~/Projects/foxtrot-fitness

# Install deps
cd frontend && npm install
cd ../backend && pip install -r requirements.txt

# Start Postgres
docker-compose up -d postgres

# Seed DB
cd backend && python -m app.seed.seed

# Start backend (terminal 1)
make backend

# Start frontend (terminal 2)
make frontend

# Open http://localhost:3000
```

---

## ⚠️ Known Issues / Open Questions

1. **No env vars configured yet** — copy `.env.example` to `.env` and fill in Supabase + Resend keys when ready
2. **No CI/CD** — Fable 5 can add `.github/workflows` if desired
3. **No deployment configs** — Vercel/Railway configs can be added when ready to deploy
4. **Movement database is empty** — Fable 5 can seed movements (currently only equipment + finishers + programs are seeded)

---

**Next step:** Fable 5 picks up from here. Build the components, pages, routers, and services listed above.