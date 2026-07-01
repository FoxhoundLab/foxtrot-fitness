"""Foxtrot Fitness API — FastAPI entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, users, programs, equipment, movements, generation

app = FastAPI(
    title="Foxtrot Fitness API",
    description="AI-generated workout programs. Tailored to your equipment. Named like operations.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"name": "Foxtrot Fitness API", "status": "operational"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


# Register routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(programs.router, prefix="/api/programs", tags=["programs"])
app.include_router(equipment.router, prefix="/api/equipment", tags=["equipment"])
app.include_router(movements.router, prefix="/api/movements", tags=["movements"])
app.include_router(generation.router, prefix="/api/generate", tags=["generation"])