"""Program Pydantic schemas."""
from datetime import datetime
from pydantic import BaseModel, Field, field_serializer
from typing import Literal, Any


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
    model_config = {"from_attributes": True}

    id: Any  # str or UUID accepted; serialized as str
    user_id: Any | None = None
    name: str
    goal_tag: str | None = None
    difficulty: Difficulty = "intermediate"
    split: str = "4-day"
    user_level: Experience = "intermediate"
    design_view: Any  # dict or ProgramDesignView
    execution_view: str = ""
    version: int = 1
    is_active: bool = False
    is_example: bool = False
    created_at: Any  # datetime or str

    @field_serializer("id", "user_id")
    def serialize_uuid(self, v):
        return str(v) if v is not None else None

    @field_serializer("created_at")
    def serialize_datetime(self, v):
        if v is None:
            return None
        if isinstance(v, datetime):
            return v.isoformat()
        return v


class ProgramCreate(BaseModel):
    name: str
    goal_tag: str
    difficulty: Difficulty
    split: str
    user_level: Experience
    design_view: ProgramDesignView
    execution_view: str