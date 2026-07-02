# Fable 5 Hardening Report — 2026-07-01

## Fixed

### Workstream A — Backend Hardening (commit `435c009`)
- **A1** `/auth/verify` mints an HS256 JWT (`jwt_expiry_hours=168`); `deps.py` validates `Authorization: Bearer`, rejects bad tokens with 401, and allows `X-User-Email` only when `env=development` (with warning log). Frontend stores the JWT and sends it on every request. Verified: spoofed bearer → 401, verify → JWT → 200 round-trip.
- **A2** `/api/generate` requires auth, attaches `user_id` to the generated program, and is rate-limited to 5/user/hour in-memory. Verified: anonymous → 401; 6th call in an hour → 429.
- **A3** Program read and save-copy 404 unless the program is an example or owned by the caller (`_authorize_program_access`). Verified: owner 200, other user 404, anonymous 404, example 200 anonymously, cross-user copy 404.
- **A4** Empty `LLM_API_KEY` → 503 "LLM not configured"; httpx failures and malformed LLM responses → 502; retry exhaustion → 502. Verified: authed generate with empty key returns clean 503.
- **A5** Dev mode prints the full magic-link email body (`[DEV MAGIC LINK]`). Verified in server log; full login flow (request link → verify → JWT) exercised end-to-end locally.

### Workstream B — UX Polish (commit `f0aa2a4`)
- **B1** Wizard draft persists to `sessionStorage` on every change, restores on mount, clears on generation. Verified: hard reload restored step 1 with intermediate level + 2 selected items.
- **B2** Trash icon with inline two-step confirm on user-owned library cards only (examples get none). Verified: delete removed the card (4 → 3) and the row server-side.
- **B3** Equipment accordion supports multiple open categories (`Set<string>`) plus a select-all/deselect-all row per category. Verified: three categories open simultaneously, select-all toggled 2/2.
- **B4** Generate errors differentiated via new `ApiError(status)`: 401 → Sign In CTA, 429 → rate-limit copy, 503 → "Generator Offline", other API errors → retry, network failure → "Can't Reach the Server". Verified live on the 503 path.
- **B5** Landing stats stack vertically at mobile (`flex-col sm:flex-row`, smaller text). Verified at 375px.

### Workstream C — Brand Identity (commit `9668b17`)
- **C1** Logo background made transparent (edge flood-fill, preserves the white wordmark inside the art); fox-head crop placed in navbar (40px), footer, login page, and as the mobile bottom-nav Home icon; full logo as a 6%-opacity hero watermark.
- **C2** Fox orange `#F26B1F` replaces P90X red across `accent-red`, dark variant `#B8430E`, glow/pulse shadows, and the hardcoded scrollbar/selection colors in `globals.css`. `accent-orange` lightened to `#FF8C42`. Green/blue pillar colors untouched.
- **C3** Fox-head crop saved as `frontend/app/icon.png`; verified served at `/icon.png` (200, image/png).

All three commits passed `npm run build` (and backend import + live endpoint tests) before push.

## Pushed back on / deviations
- **B1 "clear on navigation away":** the draft is cleared on generation only. Clearing on unmount would also wipe the draft when the user is bounced to `/auth/login` mid-wizard (the exact case persistence exists for). Deviation noted rather than implemented.
- **Behavior change (from A2):** anonymous program generation no longer works; the wizard's Generate button routes signed-out users to login with their draft preserved.

## Skipped
- Nothing from the brief.

## New issues discovered
- The generation rate limiter and magic-link token store are both in-memory — same multi-worker caveat as the QA report's medium finding #7; fine for single-worker deploys.
- If generation itself 401s (expired JWT between wizard and generate page), the pending generation request survives in `sessionStorage` but the login callback redirects to `/library`, not back to `/generate` — a return-URL flow would smooth this.
- `fox-head.png` retains small white flecks inside speed-line strokes by design (comic style); acceptable at rendered sizes.
