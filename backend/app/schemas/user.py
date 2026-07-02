"""User Pydantic schemas."""
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, field_serializer
from typing import Literal, Any


Goal = Literal["strength", "hypertrophy", "conditioning", "balanced", "longevity", "hybrid"]
Experience = Literal["beginner", "intermediate", "advanced"]
DaysPerWeek = Literal[3, 4, 5]
SessionLength = Literal[30, 45, 60, 75, 90]
FinisherPreference = Literal["metabolic", "volume", "mixed", "none"]
FocusArea = Literal[
    "legs", "chest", "back", "shoulders", "arms", "full_body", "core"
]


class UserGoals(BaseModel):
    primary: Goal = "balanced"
    experience: Experience = "intermediate"
    days_per_week: DaysPerWeek = 4
    session_length_minutes: SessionLength = 60
    limitations: str = ""
    finisher_preference: FinisherPreference = "mixed"


class UserPreferences(BaseModel):
    dislikes: list[str] = []
    preferred_alternatives: dict[str, str] = {}
    finisher_style: FinisherPreference = "mixed"
    goals: dict = Field(
        default_factory=lambda: {"primary": [], "secondary": []}
    )


class UserSchema(BaseModel):
    model_config = {"from_attributes": True}

    id: Any  # str or UUID accepted; serialized as str
    email: str
    name: str | None = None
    equipment_ids: list[str] = []
    goals: Any = {}  # accepts dict or UserGoals
    preferences: Any = {}  # accepts dict or UserPreferences
    user_level: Experience = "intermediate"
    created_at: Any  # datetime or str
    updated_at: Any  # datetime or str

    @field_serializer("id")
    def serialize_id(self, v):
        return str(v) if v is not None else None

    @field_serializer("created_at", "updated_at")
    def serialize_datetime(self, v):
        if v is None:
            return None
        if isinstance(v, datetime):
            return v.isoformat()
        return v


class UserCreate(BaseModel):
    email: EmailStr
    name: str | None = None


class UserUpdate(BaseModel):
    name: str | None = None
    equipment_ids: list[str] | None = None
    goals: UserGoals | None = None
    preferences: UserPreferences | None = None
    user_level: Experience | None = None