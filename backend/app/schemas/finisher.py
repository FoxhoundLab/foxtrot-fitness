"""Finisher Pydantic schema."""
from pydantic import BaseModel
from typing import Literal


Difficulty = Literal["beginner", "intermediate", "advanced"]


class FinisherMovement(BaseModel):
    name: str | None = None
    minute: int | None = None
    reps: int | str | None = None
    distance_meters: int | None = None
    duration_seconds: int | None = None
    detail: str | None = None


class FinisherSchema(BaseModel):
    id: str
    name: str
    format: str
    duration_minutes: int | None = None
    rounds: int | None = None
    rest_between_rounds: int | None = None
    reps_scheme: str | None = None
    movements: list[FinisherMovement] = []
    equipment_required: list[str] = []
    type: str | None = None
    difficulty: Difficulty = "intermediate"
    notes: str | None = None