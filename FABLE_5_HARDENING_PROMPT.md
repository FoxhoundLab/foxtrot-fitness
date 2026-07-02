# FOXTROT FITNESS — FABLE 5 PROMPT: BACKEND HARDENING + UX POLISH
# Target: Claude Fable 5
# Project: ~/Projects/foxtrot-fitness/
# GitHub Repo: https://github.com/FoxhoundLab/foxtrot-fitness (PRIVATE)
# Date: 2026-07-01
# Prerequisite: Phase 1 frontend + backend are complete and committed.

---

## CONTEXT

The Foxtrot Fitness MVP is functional — full frontend, complete backend, 8 routes, build passes clean. But the app is "demo quality," not "deployable quality." This session focuses on two things:

1. **Backend hardening** — fix 5 HIGH-severity issues identified in the post-build review (`docs/fable5-review.md`)
2. **UX polish** — fix 5 friction points found during the UX walkthrough

The backend was written and tested by Otacon. You're modifying it now — not rewriting. Be surgical.

---

## GITHUB ACCESS

The project is on GitHub at **https://github.com/FoxhoundLab/foxtrot-fitness** (private repo under the FoxhoundLab org).

You are authenticated as FoxhoundLab via `gh` CLI. You can:
- Push your work with `git add -A && git commit -m "message" && git push`
- Reference existing files/commits via `gh` or `git log`

**Commit convention:** Conventional commits (`feat:`, `fix:`, `refactor:`). Commit backend hardening and UX polish as **separate commits** so we can track them.

---

## 🎯 TOKEN EFFICIENCY

**You have a HARD usage cap. No additional plans can be purchased.** Be efficient:
- No verbose comments or docstrings
- No README updates or documentation beyond what's asked
- Batch file writes — don't read/modify/write one file at a time
- Fix the issues listed below — don't refactor unrelated code
- If you finish early, stop. Don't invent work.

---

## 🔒 PART 1: BACKEND HARDENING (5 HIGH-Severity Issues)

Read `docs/fable5-review.md` for the full context. Fix these 5 issues:

### 1. Auth is spoofable — no JWT/session

**Problem:** `backend/app/deps.py` trusts the `X-User-Email` header outright. `auth.py` verifies the magic-link token but never issues anything (no JWT/session). Anyone can impersonate any user.

**Fix:**
- Have `POST /api/auth/verify` mint a signed JWT (use `settings.jwt_secret` from `config.py`)
- Return the JWT to the frontend
- Frontend stores the JWT in localStorage and sends it as `Authorization: Bearer <token>`
- `deps.py` validates the JWT and extracts the user — no more trusting raw email headers
- Keep backward compat: if `Authorization` header is missing, fall back to `X-User-Email` for dev mode (log a warning)

**Files to modify:**
- `backend/app/deps.py` — JWT validation
- `backend/app/routers/auth.py` — issue JWT on verify
- `backend/app/services/auth_service.py` — add JWT creation function
- `backend/app/config.py` — `jwt_secret` already exists, add `jwt_expiry_hours` (default 168 = 7 days)
- `frontend/lib/api.ts` — send JWT as `Authorization: Bearer`, update login flow

### 2. Generation endpoint is unauthenticated

**Problem:** `POST /api/generate` (`generation.py`) requires no auth — anyone can burn paid LLM tokens.

**Fix:**
- Require the `get_or_create_user` dependency on the generation endpoint
- Attach `user_id` to the generated program (don't leave it orphaned)
- Add basic rate limiting: max 5 generations per user per hour (in-memory counter in `auth_service.py` or a simple middleware)

**Files to modify:**
- `backend/app/routers/generation.py` — add auth dependency + user_id attachment
- `backend/app/services/auth_service.py` — add rate limit check function

### 3. IDOR on programs — no ownership check

**Problem:** `GET /api/programs/{id}` and `POST /api/programs/{id}/save` have no ownership check. Any user can read or copy any other user's private programs by ID.

**Fix:**
- `GET /{id}`: only return if `program.user_id == user.id OR program.is_example == True`, otherwise 404
- `POST /{id}/save`: same check — can only copy your own programs or examples
- `DELETE /{id}`: already checks ownership (confirmed in review), keep as-is

**Files to modify:**
- `backend/app/routers/programs.py` — add ownership filtering to get/save endpoints

### 4. Empty LLM key crashes with opaque 500

**Problem:** `program_generator.py:89` builds `Bearer {settings.llm_api_key}` unconditionally. With an empty key, httpx throws `Illegal header value b'Bearer '` → opaque 500.

**Fix:**
- At the top of `generate_program()`, check if `settings.llm_api_key` is empty → raise `HTTPException(503, "LLM not configured")`
- Wrap the httpx call in try/except → catch `httpx.HTTPStatusError` and `httpx.RequestError` → raise `HTTPException(502, "LLM request failed: {detail}")`
- Also catch the `ValueError` from max-retries exhaustion → `HTTPException(502, "Failed to generate valid program after retries")`

**Files to modify:**
- `backend/app/services/program_generator.py` — add key check + error wrapping

### 5. Dev mode never shows the magic link

**Problem:** `auth_service.py:63` (`send_email`) prints only recipient and subject in dev mode — the body with the magic link is discarded. Local login is impossible without a Resend key.

**Fix:**
- In `send_email()`, when `settings.resend_api_key` is empty (dev mode), print the **full body** including the magic link URL
- Make it visually obvious: print `[DEV MAGIC LINK]` prefix so it's easy to find in terminal output

**Files to modify:**
- `backend/app/services/auth_service.py` — update dev-mode print in `send_email()`

---

## 🎨 PART 2: UX POLISH (5 Friction Points)

### 1. Wizard state lost on refresh

**Problem:** If a user refreshes mid-onboarding (step 1-3), all wizard state is lost and they restart at Experience level.

**Fix:**
- In `app/onboard/page.tsx`, persist wizard state to `sessionStorage` on every change
- Key: `foxtrot-wizard-draft`
- On mount, check for saved state and restore it
- Clear the draft when generation is triggered or user navigates away from the wizard

**File:** `frontend/app/onboard/page.tsx`

### 2. No library delete button

**Problem:** `api.deleteProgram` exists in the API client and the backend supports it, but there's no UI to trigger it.

**Fix:**
- Add a delete button (trash icon) to `components/library/ProgramCard.tsx`
- On click, show a confirmation (inline confirm, not a modal — keep it simple)
- Call `api.deleteProgram(id)`, remove card from list on success
- Only show delete button for user-owned programs (not examples)

**Files:** `frontend/components/library/ProgramCard.tsx`, `frontend/app/library/page.tsx`

### 3. Equipment accordion is single-open

**Problem:** Selecting equipment across multiple categories requires repeated expand/collapse. Only one category open at a time.

**Fix:**
- Allow multiple categories to be open simultaneously
- Change `expandedCategory` from `string | null` to `Set<string>`
- Clicking a category toggles it independently
- Add a "Select All in Category" checkbox at the top of each expanded ItemPicker

**Files:** `frontend/app/onboard/page.tsx`, `frontend/components/equipment-wizard/CategorySelector.tsx`, `frontend/components/equipment-wizard/ItemPicker.tsx`

### 4. Error states all look the same

**Problem:** "Failed to fetch" (backend down) and a 500 (generation failed) render the same "Generation Failed" screen. Users can't tell whether to retry or start the backend.

**Fix:**
- In `app/generate/page.tsx`, detect error type:
  - Network error (`TypeError: Failed to fetch`) → "Can't reach the server. Is the backend running?"
  - 503 → "AI service not configured. Contact support."
  - 502 → "Generation failed. Try again with different parameters."
  - 500 → "Something went wrong. Try again."
- Show different copy and different CTA (retry vs. go back) based on error type

**File:** `frontend/app/generate/page.tsx`

### 5. Landing stats row wraps at 375px

**Problem:** The hero stats bar ("26 Equipment Types | 6 Named Finishers | 5-Pillar Validation") wraps awkwardly on mobile (375px viewport).

**Fix:**
- Stack the stats vertically on mobile (flex-col), horizontal on sm+ (flex-row)
- Reduce icon size and text size at mobile breakpoints
- Keep the same information density, just reflow cleanly

**File:** `frontend/app/page.tsx`

---

## ✅ VERIFICATION

After all fixes, verify:

### Backend
1. `cd backend && python -c "import app.main"` — no import errors
2. JWT auth flow: verify → get token → use token → access protected endpoint
3. Generation requires auth — 401 without token
4. IDOR blocked — user A can't read user B's programs
5. Empty LLM key → clean 503, not a crash
6. Dev mode prints full magic link

### Frontend
7. `cd frontend && npm run build` — clean compile
8. Refresh mid-wizard → state preserved
9. Library delete works → program removed from list
10. Multiple equipment categories can be open at once
11. Error states show differentiated copy
12. Landing page stats stack cleanly at 375px (test in browser dev tools)

### Commit Structure
- Commit 1: `fix: backend hardening — JWT auth, ownership checks, error handling, dev magic link`
- Commit 2: `fix: UX polish — wizard persistence, library delete, multi-open accordion, error states, responsive stats`
- Push both to origin

---

**Fix these 10 issues. Commit separately. Push. Stop.**