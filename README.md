# Foxtrot Fitness

> AI-generated workout programs. Tailored to your equipment. Named like operations.

A web application that turns equipment + goals into a complete, named, structured weekly workout program — every program gets a code-name, every movement has a tempo, and every program is validated against the 5-pillar blueprint (Strength, Zone 2, VO2 Max, Mobility, Recovery).

## Architecture

- **Frontend:** Next.js 14 (App Router, React, Tailwind CSS, TypeScript)
- **Backend:** FastAPI (Python 3.11+)
- **Database:** PostgreSQL via Supabase (production) / SQLite (local dev)
- **AI:** LLM API call with structured prompt + post-generation 5-pillar validation gate
- **Auth:** Email magic links (Resend or Supabase Auth)
- **Deployment:** Vercel (frontend) + Railway (backend) + Supabase (database)

## Project Structure

```
foxtrot-fitness/
├── frontend/          # Next.js 14 app
├── backend/           # FastAPI backend
├── ai/                # AI prompts + config
└── docs/              # Architecture + deployment docs
```

## Local Development

```bash
# Install dependencies
make install

# Start local DB + backend
make dev

# Run tests
make test

# Seed database
make seed
```

## Environment Variables

See `.env.example` files in each subdirectory. To get started locally:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env    # if present
```

Then in `backend/.env`:

- **`LLM_API_KEY`** — required to test program generation. Without it the app still
  runs; the generate flow shows a clean "Generator Offline" screen (HTTP 503)
  instead of crashing.
- **`RESEND_API_KEY`** — required only for real email delivery. Dev mode works
  without it: the magic link is printed to the backend console **and** surfaced
  as a clickable "Dev Mode — Link Ready" button on the sign-in page.

## License

Proprietary.