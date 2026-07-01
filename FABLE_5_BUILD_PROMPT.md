# FOXTROT FITNESS — FABLE 5 BUILD PROMPT (FRONTEND ONLY)
# Target: Claude Fable 5
# Project: ~/Projects/foxtrot-fitness/
# Date: 2026-07-01
# Status: SCAFFOLD + COMPLETE BACKEND DONE. Build frontend components and pages only.

---

## CONTEXT

You are continuing a project at `~/Projects/foxtrot-fitness/`. **The entire backend is complete and verified.** All services, routers, models, schemas, and seed data are written, tested, and committed to git.

**What's done:**
- ✅ Full monorepo scaffold (configs, types, DB schema, migrations)
- ✅ **Complete backend** — 5 services + 6 routers + deps.py, all registered in main.py
- ✅ Seed data — 26 equipment, 42 movements, 6 finishers, 3 example programs
- ✅ Frontend foundation — Tailwind P90X design system, TypeScript types, API client
- ✅ Dependencies installed (npm + pip)
- ✅ All code verified (Python compiles, JSON valid, services tested)

**Your job:** Build the frontend React components and Next.js pages only. Wire them to the existing backend API.

---

## YOUR ROLE

You are a senior frontend engineer with complete authority to build out the remaining UI for Foxtrot Fitness. Build exactly what's specified below. The backend is locked — do not touch it.

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
- **Backend:** FastAPI (Python 3.11+), SQLAlchemy 2.0 (async), Pydantic 2.7 — **COMPLETE**
- **Database:** PostgreSQL (Supabase for production / local Docker for dev)
- **AI:** OpenRouter API (default model: `anthropic/claude-sonnet-4`)
- **Auth:** Email magic links via Resend or Supabase Auth

---

## 🎯 TOKEN EFFICIENCY DIRECTIVE — READ THIS

**You have a HARD usage cap. No additional plans can be purchased. Once the cap is hit, you stop.** This is a 7-day window with no safety net. Treat every token as finite.

### Build Priority Order (Critical — Follow This Exactly)

1. **Base UI components first** (shadcn/ui install + theme override + Button/Card/Badge/Input/Tabs)
2. **ExperienceGate + Program viewer components** (ExperienceGate is the wizard entry point; Program viewer is the payoff screen)
   - ExperienceGate, DesignView, ExecutionView, DayCard, MovementRow, FinisherCard, CodeNameBadge, PillarChecklist
3. **Core pages** (Landing page → Program detail page → Onboarding wizard → Generation page)
4. **Equipment wizard + goals form components** (WizardStepper, CategorySelector, ItemPicker, GoalSelector, SchedulePicker, etc.)
5. **Auth + library** (Login/callback pages, library page, mobile bottom nav)
6. **Polish last** (animations, transitions, progress indicators, advanced mobile)

**If you hit your cap, the app must still work with whatever was built in tiers 1-3.** A functional app with basic styling is infinitely better than a beautiful app that crashes.

### Token-Saving Rules

- **Do NOT over-comment code.** Comments only where logic is non-obvious. One-liner comments max.
- **Do NOT write verbose docstrings.** One-line docstrings only.
- **Use existing types and schemas as-is.** They're already defined in `frontend/lib/types.ts` — import and use, don't redefine.
- **Do NOT generate README content or documentation** beyond what already exists. Code only.
- **Do NOT modify backend files.** The backend is complete and locked.
- **Batch file writes.** Don't read a file, make one edit, then write it back. Make all changes in one pass.

---

## 🔍 PRE-BUILD AUDIT (3 Minutes Max)

1. **Read `frontend/lib/types.ts`** — your TypeScript source of truth for data shapes.
2. **Read `frontend/lib/api.ts`** — your API client with all endpoints.
3. **Read `tailwind.config.ts`** — your design tokens.
4. **Read `backend/app/seed/example_programs.json`** — the real programs your components must display correctly.

Do NOT spend more than 3 minutes on this audit.

---

## ❌ WHAT YOU NEED TO BUILD (FRONTEND ONLY)

### A. shadcn/ui Foundation

**Install shadcn/ui first:**
```bash
cd frontend
npx shadcn-ui@latest init
# Choose: TypeScript, Default style, Tailwind config path, CSS variables
npx shadcn-ui@latest add button card badge input textarea select tabs dialog sheet toast
```

After installing shadcn, override the default CSS variables in `app/globals.css` with the P90X tokens (near-black bg, red accent, sharp corners, no rounded defaults). Default shadcn is too soft — make it feel like P90X, not Stripe.

### B. Base UI Components (`frontend/components/ui/`)

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

### C. Layout Components (`frontend/components/layout/`)

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

### D. Equipment Wizard (`frontend/components/equipment-wizard/`)

```typescript
// WizardStepper.tsx — Progress indicator (4 steps: Experience → Equipment → Goals → Review)
// Numbers with connecting lines, red active step

// ExperienceGate.tsx — THE FIRST THING USERS SEE
// Full-screen experience level selector: Beginner / Intermediate / Advanced
// 3 large cards, each with:
//   - Visual difficulty indicator (1/2/3 dumbbells or bars)
//   - Short description ("New to structured training" / "Consistent training 6+ months" / "Years of structured programming")
//   - What to expect (volume, complexity)
// This sets the tone for the entire wizard — equipment and goals adapt based on this choice
// Beginner: simplify equipment labels, default to 3-day, conservative everything
// Intermediate: standard labels, default to 4-day, full options
// Advanced: all options, 5-day available, highest intensity

// CategorySelector.tsx — Equipment category cards
// 6 categories: Barbells & Plates, Squat Rack & Bench, Dumbbells & Kettlebells,
//                Machines, Bodyweight Gear, Specialty
// Icon + name, click to expand

// ItemPicker.tsx — Individual equipment selection within a category
// Toggleable item cards, checkmark when selected
// Use equipment list from api.listEquipment()
// For beginners: show plain-English descriptions ("Dumbbells — handheld weights")

// SummaryReview.tsx — Final review before generation
// Shows experience level + selected equipment + goals, "Generate Mission" button
```

### E. Goals Form (`frontend/components/goals-form/`)

```typescript
// GoalSelector.tsx — Primary goal picker
// 5 large cards: Strength, Hypertrophy, Conditioning, Balanced, Longevity
// Icon + description, single select

// SchedulePicker.tsx — Days/week + Session length
// Two grids: days and minutes
// Days available adapt to experience level set in ExperienceGate:
//   Beginner: 3-day default, 4-day available
//   Intermediate: 4-day default, 3 or 5 available
//   Advanced: 5-day default, 3/4 available

// FocusAreas.tsx — Multi-select body parts
// 7 cards: Legs, Chest, Back, Shoulders, Arms, Full Body, Core

// LimitationsInput.tsx — Free text textarea
// Placeholder: "e.g., no box jumps, bad knees, rotator cuff injury"

// PreferencesInput.tsx — Dislikes + preferred alternatives
// Tag input for dislikes, key-value pairs for alternatives
// Plus finisher preference selector
```

### F. Program Viewer (`frontend/components/program-viewer/`)

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

### G. Library (`frontend/components/library/`)

```typescript
// ProgramCard.tsx — Program card for library grid
// Code-name, goal tag, difficulty badge, split, date, pillar mini
// Click to open detail

// FilterBar.tsx — Filter by goal, days, date
// Dropdowns or chips
```

### H. Frontend Pages

#### `app/page.tsx` (Landing Page)
- Hero: "BUILD YOUR MISSION" (Bebas Neue 6xl uppercase)
- Subhead: "AI-generated workout programs. Tailored to your equipment. Named like operations."
- CTA: "START YOUR MISSION" (red, large)
- Example Missions section: fetch from `api.listExamplePrograms()`, display 3 cards (Genesis Protocol first as "START HERE")
- How It Works: 3-step visual (Equipment → Goals → Mission)
- Footer

#### `app/onboard/page.tsx` (Multi-step wizard — 4 steps)
- **Step 0: Experience Level** (ExperienceGate component) — THE FIRST THING
  - Full-screen, 3 large cards: Beginner / Intermediate / Advanced
  - Each card has visual difficulty indicator + description
  - Selection gates everything downstream (equipment labels, default days/week, finisher availability)
- Step 1: Equipment selection (use equipment-wizard components)
  - Fetch from `api.listEquipment()` on mount
  - Labels adapt to experience level (beginner = plain English, advanced = technical)
- Step 2: Goals & preferences (use goals-form components)
  - Default days/week based on experience level from step 0
- Step 3: Review & generate
  - Shows experience + equipment + goals summary
- On submit: `api.generateProgram(request)`, redirect to `/program/[id]`

#### `app/generate/page.tsx` (Generation page)
- Loading state: sequential animation ("ANALYZING EQUIPMENT..." → "DESIGNING SPLIT..." → etc.)
- Pulsing red animation
- On complete: code-name reveal + 5-pillar display + "SAVE TO LIBRARY" / "REFINE" buttons

#### `app/program/[id]/page.tsx` (Program detail)
- Fetch program from `api.getProgram(id)`
- Header: code-name, goal tag, difficulty, split, 5-pillar checklist
- Tab toggle: DESIGN VIEW | EXECUTION VIEW
- Design tab: DesignView component
- Execution tab: ExecutionView component with copy button

#### `app/library/page.tsx` (User's library)
- Fetch programs from `api.listPrograms()`
- Grid of ProgramCards
- FilterBar at top
- Empty state if no programs

#### `app/auth/login/page.tsx` (Magic link login)
- Email input
- "SEND MAGIC LINK" button → `api.requestMagicLink(email)`
- Confirmation state after send

#### `app/auth/callback/page.tsx` (Auth callback)
- Verify token from URL, set session
- Redirect to /library or /onboard

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

1. `cd frontend && npm run dev` starts on port 3000
2. Landing page loads and shows 3 example programs
3. Onboarding wizard lets user select equipment + set goals
4. Program detail page shows Design View and Execution View
5. Library page lists saved programs
6. Mobile responsive: test on phone-sized viewport
7. No console errors, no TypeScript errors

### 🎨 Design Verification (Non-Negotiable)

8. **No pastel colors anywhere.** All UI uses the P90X tokens defined in `tailwind.config.ts`.
9. **Sharp corners only.** All cards, buttons, badges have `rounded-none` or `rounded-sm` (max 2px).
10. **Bebas Neue on all headers and code-names.** Uppercase, tight letter-spacing.
11. **2-second scan test.** Open any program card or equipment selector. Can you understand what it is in under 2 seconds?
12. **Mobile-first verified.** Test on phone-sized viewport (375px wide). Every tap target is >=44px.
13. **shadcn/ui themed aggressively.** Override every CSS variable in `globals.css` with P90X tokens.
14. **Visual momentum.** Every CTA has a glow or pulse animation. Every completed action feels rewarding.

---

## ⚠️ IMPORTANT REMINDERS

1. **Do NOT modify backend files.** The backend is complete, tested, and committed.
2. **Use the design system** — colors, fonts, animations are pre-configured in Tailwind.
3. **P90X aesthetic** — sharp corners, dark backgrounds, red accents, Bebas Neue for impact.
4. **Mobile responsive** — every page must work on phone-sized viewports.
5. **The API client is ready** — import from `lib/api.ts`, all endpoints are stubbed.
6. **The TypeScript types are ready** — import from `lib/types.ts`.

---

**Build the frontend. Ship it.**