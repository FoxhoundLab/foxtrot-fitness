# Fable 5 Post-Build Review — Foxtrot Fitness

Date: 2026-07-01. Scope: backend code review (report-only) + UX walkthrough of the completed frontend.

Verified during the build: `tsc --noEmit` clean, `next build` clean (9 routes), all pages exercised in a live browser against the running backend (SQLite dev DB, seeded) at desktop and 375px mobile viewports.

---

## 1. Backend Code Review

(Findings below are suggestions only — no backend files were modified.)

### High

1. **Auth is fully spoofable — magic-link verification is decorative.** `deps.py:11-36` trusts the `X-User-Email` header outright; `auth.py:16-20` verifies the token but never issues anything (no JWT/session, despite `jwt_secret` sitting unused in `config.py:17`). Anyone can read/modify/delete any account's data by setting a header. Fix: have `/verify` mint a signed JWT and validate it in `deps.py`.
2. **Empty `LLM_API_KEY` crashes generation with `Illegal header value b'Bearer '`.** `program_generator.py:89` builds the Bearer header unconditionally; with the default empty key the user gets an opaque 500 (reproduced live during the walkthrough). Fix: fail fast with `HTTPException(503, "LLM not configured")` and wrap httpx errors in a friendly 502.
3. **Dev mode never shows the magic link.** `auth_service.py:63` prints only recipient and subject; the body containing the link is discarded, so local login is impossible without a Resend key. Fix: include `body` in the dev print.
4. **`POST /api/generate` is unauthenticated and unmetered** (`generation.py:16-17`) — anyone can burn paid LLM tokens. Fix: require the user dependency and add basic rate limiting.
5. **IDOR on programs.** `GET /api/programs/{id}` (`programs.py:46-53`) and the `/save` copy source have no ownership check, so any user's private program is readable/copyable by ID. Fix: filter `user_id == user.id OR is_example == True`.

### Medium

6. **`get_or_create_user` race + unvalidated creation** (`deps.py:22-36`): concurrent first requests can hit a unique-constraint `IntegrityError` → 500; any arbitrary string becomes a user row (no email validation, case-sensitive). Fix: normalize/validate email, catch `IntegrityError` with re-select.
7. **In-memory token store breaks with >1 uvicorn worker** (`auth_service.py:16`) — token lands in one process, `/verify` hits another → random 401s; also grows unboundedly under request floods. Fix: move to DB/Redis.
8. **Invalid UUID path param returns 500, not 404** (`programs.py:47`, `types.py:54`). Fix: parse `uuid.UUID(program_id)` in the handler, 404 on `ValueError`.
9. **LLM output isn't structurally validated before `build_execution_view` indexes into it** (`program_generator.py:177-204`; `ProgramSchema.design_view` is `Any`). Malformed LLM output → `KeyError` → 500. Fix: validate `design_view` with the Pydantic model inside the retry loop and treat failure as a retryable miss.
10. **Generation failures surface as bare 500s** (`program_generator.py:62,65` raise `ValueError`, nothing catches it). Fix: translate to `HTTPException(502)` with a retry-friendly message.
11. **Partial profile updates silently reset fields** (`users.py:30-33`) — `PUT /me` with a partial `goals` object resets the unspecified fields to defaults. Fix: merge with `exclude_unset=True`.
12. **Email and token travel as query params** (`auth.py:10,17`) — magic-link tokens end up in server/proxy logs and browser history; email skips `EmailStr` validation (email-bombing vector via Resend given no rate limit). Fix: accept a Pydantic body model with `EmailStr`. (The frontend client currently matches the query-param contract; update both together.)
13. **CORS origin hardcoded to `http://localhost:3000`** (`main.py:15`) instead of `settings.app_url` — any deployed frontend is blocked until a code change.

### Low

14. **Generated programs are orphaned rows** (`generation.py:45-57` persists with `user_id=None`; `/save` copies) — unsaved generations accumulate forever. Fix: attach the user at generation time or add cleanup.
15. **Prompt template loaded fragilely on every request** (`program_generator.py:29-30,136`): blocking `open()` in an async handler, path reaches outside `backend/` (`../../ai/prompts/...`), template string-scraped for `SYSTEM_PROMPT = """`. Fix: load once at import and package the prompt inside `app/`.
16. **`StringList.process_result_value` swallows corrupt data** (`types.py:32-33` returns `[]` on `JSONDecodeError`), masking DB corruption and conflating NULL with empty list.
17. **Minor hygiene:** duplicate `Base` import in `models/equipment.py:6,8`; seed script uses `create_all` (`seed/seed.py:115`) which can drift from the alembic migrations; `finisher_matcher.py:19` loads the full finisher table per call (fine at current scale).

**Positives:** the `for/else` retry logic in `program_generator.py` is correct; route ordering (`/examples` before `/{program_id}`) is right; delete checks ownership; the GUID/StringList type decorators are sound with `cache_ok = True`.

---

## 2. UX Walkthrough Report

Paths walked: landing → example program → detail (both views); onboard (experience → equipment → goals → review → generate); library signed-out and signed-in; login + callback (failure path); every page at 375px.

### Blockers / friction found and fixed during the walkthrough

1. **Bebas Neue never loaded** — `globals.css` re-declared `--font-display`/`--font-body`/`--font-mono` in `:root`, overriding the variables injected by `next/font`. Headers rendered in fallback sans. Fixed by removing the `:root` font block.
2. **API client didn't match the backend contract** — the backend authenticates via an `X-User-Email` header and takes auth `email`/`token` as query params, but `lib/api.ts` sent neither. Library and save always failed. Fixed: session stored in `localStorage`, header attached automatically, auth endpoints call with query params.
3. **Save-to-library silently "succeeded" for anonymous users** — `POST /programs/{id}/save` requires auth; the generate page swallowed the 401. Fixed: unsigned users are routed to `/auth/login`; real failures show an error message.
4. **Library showed "backend down" when the user was simply signed out.** Fixed: dedicated "Sign In Required" state.

### Remaining friction / improvement ideas (not blockers)

1. **Local login is impossible in dev** — with no `RESEND_API_KEY`, the backend prints only the email subject, not the magic link, so there is no way to obtain a token locally (see backend findings). Frontend auth was verified via failure path + simulated session.
2. **Generation cannot be tested end-to-end** — `LLM_API_KEY` in `backend/.env` is empty, so `/api/generate` 500s (`Illegal header value b'Bearer '`). The frontend's "Mission Aborted / Try Again" state handles it gracefully, but the happy-path reveal screen has only been verified with component-level rendering, not a live generated program. **Action: add a real OpenRouter key to `backend/.env`.**
3. **Error copy could distinguish causes** — "Failed to fetch" (backend down) vs. a 500 (generation failed) render the same "Mission Aborted" screen. Users can't tell whether to retry or start the backend.
4. **Equipment accordion is single-open** — selecting gear across many categories means repeated expand/collapse. Multi-open or a "select all in category" affordance would speed up power users.
5. **Review step isn't editable in place** — fixing one field means walking Back through steps (state is preserved, so it's cheap, but "edit" links per section would be nicer).
6. **Wizard state is lost on refresh** — a mid-wizard reload restarts at Experience. Persisting draft state to `sessionStorage` would protect longer sessions.
7. **No delete affordance in the library** — `api.deleteProgram` exists and the backend supports it, but no UI calls it yet.
8. **Landing stats row wraps awkwardly at 375px** ("26 Equipment Types" breaks onto three lines). Cosmetic.
9. **Generation loading phases are timer-driven** (1.8s each), not tied to real progress. Fine for a ~10s LLM call; would look stuck if generation takes much longer — consider looping the final phase's animation.
10. **Anonymous generate + signed-in save creates a v2 copy** — saving copies the program with `version + 1` even though the user never iterated. Cosmetic versioning oddity (backend behavior).

### Design verification checklist

- No pastels; only P90X tokens used. Sharp corners everywhere (max 2px radius).
- Bebas Neue on all headers/code-names after the font fix; JetBrains Mono on tempo/sets/execution view.
- Tempo badges orange + mono; finishers get the darker card with red top border.
- All tap targets ≥44px (buttons enforce `min-h-[44px]`, bottom nav 56px).
- CTAs glow/pulse (`animate-pulse-red` on primary mission CTAs).
- 2-second scan test passes on program cards: code-name badge → goal tag → difficulty/split/pillars.
