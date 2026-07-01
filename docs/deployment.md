# Foxtrot Fitness — Deployment Guide

## Local Development

```bash
# 1. Install dependencies
make install

# 2. Start Postgres via Docker
docker-compose up -d postgres

# 3. Run migrations + seed
cd backend && alembic upgrade head
cd backend && python -m app.seed.seed

# 4. Start backend
make backend   # Runs on http://localhost:8000

# 5. Start frontend (separate terminal)
make frontend  # Runs on http://localhost:3000
```

## Environment Variables

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend (`backend/.env`)

```env
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/foxtrot
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
RESEND_API_KEY=your_resend_api_key
LLM_API_KEY=your_openrouter_api_key
LLM_MODEL=anthropic/claude-sonnet-4
```

## Production Deployment

### Frontend → Vercel

1. Connect GitHub repo to Vercel
2. Set root directory: `frontend`
3. Add environment variables in Vercel dashboard
4. Deploy

### Backend → Railway

1. Connect GitHub repo to Railway
2. Add environment variables
3. Railway auto-detects Python and runs `uvicorn app.main:app`
4. Note the deployed URL

### Database → Supabase

1. Create new Supabase project
2. Run migrations via `alembic upgrade head` (with production DATABASE_URL)
3. Run seed script: `python -m app.seed.seed`
4. Note the SUPABASE_URL and SUPABASE_ANON_KEY for frontend

### Post-Deployment Checklist

- [ ] Frontend can reach backend API
- [ ] Magic link auth works (Resend configured)
- [ ] Equipment catalog loads
- [ ] Example programs display on landing page
- [ ] Program generation works end-to-end
- [ ] Library saves programs