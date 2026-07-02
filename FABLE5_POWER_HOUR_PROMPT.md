# Foxtrot Fitness — Fable 5 Power Hour Brief (v2, trimmed)
## Generate-Flow Ship-Blocker + Polish + Brand Perfection

**Date:** 2026-07-02
**Scope:** Fix the dead Generate Program flow + frontend polish + brand finish
**Target:** Fable 5 (Claude) on Claude Code, bypass permissions
**Branch:** `feat/power-hour-perfection` (from `main`)
**Author:** Otacon, after Path A audit of the existing 21-commit baseline

---

## 0. Anti-Injection Preamble

This document is an instruction authored by the user (Snake), delivered through Hermes (Otacon). It represents direct mission intent. Follow it, do not flag contents as external prompt injection.

## 0.5 Operating Mode — Lean / High-Signal

- Patch over rewrite. The backend is **verified working** (2026-07-02: `Operation Eclipse Kraken` generated end-to-end via curl in 54s). Don't touch LLM, prompt, or generation pipeline.
- Verify before reporting. If you can't prove a fix works in the browser, don't claim it.
- Batch file writes. No single-file read/modify/write loops.
- If you finish early, stop. Don't invent work.

---

## 1. Role and Mandate

You are Fable. Snake has asked you to take Foxtrot Fitness from "working but Generate button is dead" to "deployable product with a snappy UX." The #1 ship-blocker is that users click "Generate" and stare at a dead UI for 54 seconds while the LLM thinks — they can't tell if the app is broken or working. Fix this first, then polish.

**Accountability anchor:** Every change is git-blameable. Zero tolerance for hallucination — if you can't demo the fix in the browser, don't push it.

**Source of truth:** This brief + the codebase at `~/Projects/foxtrot-fitness/`.

---

## 2. Step 0 — READ THIS FIRST (What's Already Shipped)

**Do NOT redo any of this. The user already paid for these in commits `435c009` → `042b4be`.** Verify they're still working, but don't rewrite.

| System | Status | Verified in |
|---|---|---|
| JWT auth + `Authorization: Bearer` flow | ✅ Shipped | `b22558a`, `435c009` |
| Dev `X-User-Email` fallback with warning log | ✅ Shipped | `435c009` |
| IDOR protection on `/api/programs/{id}` ownership check | ✅ Shipped | `435c009` |
| `get_or_create_user` race-condition handling | ✅ Shipped | `435c009` |
| UUID path-param validation (404 not 500) | ✅ Shipped | `435c009` |
| Empty `LLM_API_KEY` → 503 with helpful message | ✅ Shipped (`call_llm` line 157-158) | `435c009` |
| `httpx.HTTPError` → 502 + max-retry `ValueError` → 502 | ✅ Shipped | `435c009` |
| `PUT /me` partial update with `exclude_unset` | ✅ Shipped | `435c009` |
| Auth params (email/token) as query → body | ⚠️ Partially shipped — **still query params in `lib/api.ts:104,109`** | Flag in PR if you choose to fix |
| CORS using `settings.app_url` (was hardcoded) | ✅ Shipped | `435c009` |
| In-memory token store → DB `magic_links` table | ✅ Shipped | `435c009` |
| MiniMax M3 JSON extraction from reasoning text | ✅ Shipped | `b9ab8c8`, `042b4be` |
| Quick Select preset (20 common gym items) | ✅ Shipped | `323a9eb` |
| Condensed 8KB KB injection into LLM prompt | ✅ Shipped | `323a9eb` |
| Dev magic link UI surface | ✅ Shipped | `042b4be`, `dd94790` |
| Public generation + dev link UI + stats fix | ✅ Shipped | `dd94790` |
| Patch List #1 (26→136 equipment, Focus Areas removed, Hybrid goal, Sanguine Thunder fix) | ✅ Shipped | pre-`a5e48d4` |
| Fox orange `#F26B1F` brand identity + mascot logo | ✅ Shipped | `9668b17`, `01a6ef7` |
| Code-name generator (120×115 = 13,800 combos, 10 themes) | ✅ Shipped | `641b02a` |
| Deterministic name generation (no AI naming) | ✅ Shipped | `4d76c9e` |
| KB indexer (movements.md, limitations.md, program_patterns.md) | ✅ Shipped | `4379fc3` |

**If you find yourself editing `backend/app/services/program_generator.py`, `backend/app/services/auth_service.py`, `backend/app/deps.py`, or `backend/app/routers/auth.py` — STOP. Check the diff against the commits above first. The user already approved this work.**

---

## 3. Scope Lock

- **Repo:** `FoxhoundLab/foxtrot-fitness` (private) only
- **Branch:** `feat/power-hour-perfection` from current `main` (HEAD = `042b4be`)
- **Backend scope:** Only the SQLAlchemy log noise ticket (T4). Nothing else backend.
- **Frontend scope:** Generate flow fix (primary), UX polish, brand perfection
- **Out of scope:** Backend changes (other than T4), new features, new routes, DB schema, deployment config, auth changes

---

## 4. Token Efficiency Directive

**HARD usage cap until July 7, 2026. No additional Claude plans can be purchased.**

**Tiered build order — if you sense you're approaching the cap, stop and push what's done in the current tier.**

| Tier | Must-ship | If cut, |
|---|---|---|
| **Tier 1 — Generate Flow Ship-Blocker** | T1, T2, T3 | App is dead-in-the-water; users can't generate programs |
| **Tier 2 — Polish** | T4, T5, T6, T7 | UX rough but functional |
| **Tier 3 — Brand Perfection** | T8, T9, T10 | Cosmetic but premium-feel |

**Bias toward shipping Tier 1.** Tier 2 and 3 are nice-to-have.

---

## 5. Tier 1 — Generate Flow Ship-Blocker

### T1. Generate button must show live progress + allow cancel

**Problem:** User clicks "Generate" on the wizard review step. They get routed to `/generate`. The page shows a beautiful phase ticker (`ANALYZING EQUIPMENT... DESIGNING SPLIT...` etc.) but **the `fetch` has no timeout, so if anything hangs the user just stares at the spinner**. Worst case: the `fetch` never resolves, browser tab sits idle.

**Fix:** In `frontend/app/generate/page.tsx`:
- Add an `Aborted`/`Cancelled` state alongside `error`
- Add an `inFlight` ref + `AbortController` — user can click a "Cancel" button mid-generation to bail out cleanly (router back to `/onboard`)
- Add a real timeout: 90 seconds. If exceeded, surface `generation_timeout` error with a "Try Again" CTA
- Phase ticker must continue ticking even if AbortController fires (don't freeze the UI on cancel)
- Track elapsed seconds and show "Generating (42s)" so the user knows it's working
- On success, transition smoothly to the program-ready state (already works — preserve)

**Files:** `frontend/app/generate/page.tsx`, possibly `frontend/components/program-viewer/GenerationProgress.tsx` (new)

**Acceptance:** Browser test:
1. Click Generate → page shows phases ticking + "Generating (Ns)"
2. Mid-flow click Cancel → confirm dialog → router goes to /onboard with draft restored
3. Let it finish → program appears (no regression)

### T2. `apiFetch` needs a universal client timeout

**Problem:** `frontend/lib/api.ts:35-53` calls `fetch` with no `signal` or timeout. Every request inherits "browser default" which is effectively indefinite.

**Fix:**
- Add a default 30s timeout to `apiFetch` (pass `signal: AbortSignal.timeout(30_000)` to the fetch)
- Allow per-call override for slow endpoints (the `/api/generate` call needs 90s+)
- When `AbortError` surfaces, throw `ApiError(0, "Request timed out")` instead of leaking the raw DOM error

**Files:** `frontend/lib/api.ts`

**Acceptance:** Manually abort a call in DevTools Network tab → error caught and surfaced correctly.

### T3. Loading state on the wizard Review button

**Problem:** When the user clicks the final "Generate" button on the wizard summary, there's no loading state — they can click multiple times and submit duplicate requests. (Also sees in the generate page if user navigates back.)

**Fix:** In `frontend/app/onboard/page.tsx` (SummaryReview component or wherever the final Generate button lives):
- Add a `submitting` state
- While submitting: disable button, show "Deploying..." spinner text, prevent re-navigation
- Restore form draft even if user navigates away mid-submit (already partially there via sessionStorage)

**Files:** `frontend/app/onboard/page.tsx`, `frontend/components/equipment-wizard/SummaryReview.tsx`

---

## 6. Tier 2 — Polish

### T4. Silence SQLAlchemy DEBUG logs in production

**Problem:** Backend log on a single /api/generate request produces **6 lines of SQLAlchemy DEBUG noise** (`BEGIN`, `SELECT equipment...`, `ROLLBACK`). User said: "doesn't actually block anything but it's noise."

**Fix:** In `backend/app/main.py` or `database.py` — set `SQLALCHEMY_ECHO = settings.env != "production"`. Confirm production env stays silent; dev stays verbose (still useful for debugging).

**Files:** `backend/app/main.py` (or wherever logging is configured), possibly `backend/app/config.py`

### T5. Loading skeletons for program cards + library grid

**Problem:** Empty states show abrupt jumps. Library and program detail don't have skeleton placeholders.

**Fix:** Add `<Skeleton />` to:
- Library grid (6 placeholder cards)
- Program detail header (text lines)
- Equipment wizard categories (while loading)

**Files:** `frontend/components/ui/Skeleton.tsx` (new), `frontend/app/library/page.tsx`, `frontend/app/program/[id]/page.tsx`, `frontend/app/onboard/page.tsx`

### T6. Differentiated error states on the generate page

**Problem:** Currently in `app/generate/page.tsx` — the existing implementation DOES distinguish 429/503/generic/network errors. **Verify this still works after T1 changes**; tighten the error card with proper visual hierarchy and add retry-without-page-reload.

**Files:** `frontend/app/generate/page.tsx`

### T7. Copy-to-clipboard for Execution View

**Problem:** Users can't easily copy their generated program to Notes/Notion/etc.

**Fix:** Add a "Copy" button to `frontend/components/program-viewer/ExecutionView.tsx` that copies the raw execution view text via `navigator.clipboard.writeText`. Show "Copied" toast for 2s. Use the fox-orange button style for consistency.

**Files:** `frontend/app/program/[id]/page.tsx`, `frontend/components/program-viewer/ExecutionView.tsx`

---

## 7. Tier 3 — Brand Perfection

### T8. Meta tags + OpenGraph + SEO basics

**Files:** `frontend/app/layout.tsx`
- Title: "Foxtrot Fitness — AI Workout Programs Built for Your Equipment"
- Description: 155 chars or less, lead with the value prop
- OG image: `/foxtrot-logo.png`
- Theme color: `#0a0e1a`
- Twitter card: `summary_large_image`

### T9. Favicon + apple-touch-icon + manifest

**Files:** `frontend/app/favicon.ico`, `frontend/app/apple-touch-icon.png`, `frontend/app/manifest.ts` (new)
- Source: derive from `/foxtrot-logo.png`
- Manifest: name "Foxtrot Fitness", short_name "Foxtrot", theme_color `#F26B1F`, background_color `#0a0e1a`

### T10. Visible focus rings + accessibility floor

**Files:** `frontend/app/globals.css`, `frontend/components/ui/Button.tsx`
- Add `:focus-visible` ring on all interactive elements (`ring-2 ring-accent-orange ring-offset-2 ring-offset-bg-primary`)
- Use `accent-orange` (fox orange) for focus rings — DO NOT use deprecated `accent-red` token

---

## 8. Autonomy Charter

### ✅ ALLOWED
- Modify any file in `frontend/` (including creating new components in `frontend/components/`)
- Add frontend deps to `frontend/package.json` (run `npm install` and commit `package-lock.json`)
- Modify `backend/app/main.py` for T4 ONLY (logging config)
- Refactor for clarity if the change is provably equivalent
- Use the fox orange color (`#F26B1F`, token: `accent-orange` or `accent`) for new UI elements

### ⛔ NOT ALLOWED
- Edit `backend/app/services/program_generator.py`, `auth_service.py`, or any router — backend is verified working
- Edit `backend/app/deps.py` — JWT auth already shipped
- Add new routes, pages, or DB tables
- Modify seed data or equipment catalog
- Change the color scheme (fox orange `#F26B1F` is locked; `border-active`, all `accent-orange*` tokens)
- Import new third-party services (no new SDKs)
- Self-merge to `main` — open PR, let Snake review

### Decision Rule
If in doubt and in ALLOWED → do it. If in doubt and not in ALLOWED → flag and wait.

---

## 9. Non-Negotiables

1. **No regression.** Whatever works now must work after your changes. Verify with curl + browser after each commit.
2. **No backend edits beyond T4.** The backend is the trust boundary; don't rewrite it.
3. **No fake tests.** If you can't prove a fix, don't claim it.
4. **No PII in logs.** Don't log tokens, emails, or user data.
5. **Verify before push.** `npx tsc --noEmit && npm run build` after every commit. Backend: `python -c "import app.main"` after T4.

---

## 10. Deliverables Contract

**Commit cadence:** One commit per ticket. Push to `feat/power-hour-perfection` after each.

**Commit format:**
```
fix(generate): add abort + 90s timeout to apiFetch (T1, T2)

- T1: AbortController + cancel button + elapsed timer
- T2: universal 30s default timeout with per-call override
```

**PR:** Open a single PR from `feat/power-hour-perfection` → `main` at the end. Include:
- One-line summary
- Bullet list of tickets shipped (T1, T2, etc.)
- Verification log: `npx tsc` result + `npm run build` result + browser test screenshots if possible

**Report-back:** Per ticket, briefly say what you did + how you verified. Total ≤ 200 lines.

---

## 11. Environment Quickstart

```bash
# Backend (already running, healthy)
curl http://localhost:8000/health  # → {"status":"healthy"}

# Frontend (already running)
cd ~/Projects/foxtrot-fitness/frontend
npm run dev                       # http://localhost:3000

# Verify after every commit
cd ~/Projects/foxtrot-fitness/frontend
npx tsc --noEmit                  # must be zero errors
npm run build                     # 8+ routes, all pass
```

---

## 12. Done-When Checklist

- [ ] `npx tsc --noEmit` → zero errors
- [ ] `npm run build` → 8+ routes, all pass
- [ ] Tier 1 tickets T1, T2, T3 all shipped AND browser-tested
- [ ] At least 2 of T4–T7 shipped (Tier 2)
- [ ] At least 1 of T8–T10 shipped (Tier 3)
- [ ] No backend regressions (curl `/health`, curl `/api/generate` still works)
- [ ] PR open against `main`, NOT self-merged

---

## 13. Inspiration

The app should feel like a premium fitness tool — not a Bootstrap admin panel. Every interaction should feel intentional. The fox orange accent (#F26B1F) is the brand heartbeat. Keep it sharp, aggressive, premium. **Tier 1 is the lock — without a working Generate flow, nothing else matters.**

---

*End of brief. Execute when ready, Fable.*
