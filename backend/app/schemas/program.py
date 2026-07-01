"""Program Pydantic schemas."""
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Literal


Difficulty = Literal["beginner", "intermediate", "advanced"]
Experience = Literal["beginner", "intermediate", "advanced"]


class ProgramMovement(BaseModel):
    name: str
    sets: int
    reps: str
    tempo: str
    rest_seconds: int
    notes: str | None = None


class ProgramCardio(BaseModel):
    type: Literal["zone-2", "vo2-max", "hiit"]
    duration_minutes: int
    equipment: str | None = None
    notes: str | None = None


class ProgramDay(BaseModel):
    day: int
    name: str
    movements: list[ProgramMovement] = []
    finisher: dict | None = None
    cardio: ProgramCardio | None = None
    mobility: str | None = None


class PillarCoverage(BaseModel):
    strength: bool = False
    zone2: bool = False
    vo2max: bool = False
    mobility: bool = False
    recovery: bool = False


class ProgramDesignView(BaseModel):
    days: list[ProgramDay]
    finishers_used: list[str] = []
    pillars_covered: PillarCoverage = Field(default_factory=PillarCoverage)


class ProgramSchema(BaseModel):
    id: str
    user_id: str | None = None
    name: str
    goal_tag: str | None = None
    difficulty: Difficulty
    split: str
    user_level: Experience
    design_view: ProgramDesignView
    execution_view: str
    version: int = 1
    is_active: bool = False
    is_example: bool = False
    created_at: datetime


class ProgramCreate(BaseModel):
    name: str
    goal_tag: str
    difficulty: Difficulty
    split: str
    user_level: Experience
    design_view: ProgramDesignView
    execution_view: str