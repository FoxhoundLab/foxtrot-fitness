"""User Pydantic schemas."""
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from typing import Literal


Goal = Literal["strength", "hypertrophy", "conditioning", "balanced", "longevity"]
Experience = Literal["beginner", "intermediate", "advanced"]
DaysPerWeek = Literal[3, 4, 5]
SessionLength = Literal[30, 45, 60, 75, 90]
FinisherPreference = Literal["metabolic", "volume", "mixed", "none"]
FocusArea = Literal[
    "legs", "chest", "back", "shoulders", "arms", "full_body", "core"
]


class UserGoals(BaseModel):
    primary: Goal
    experience: Experience
    days_per_week: DaysPerWeek
    session_length_minutes: SessionLength
    focus_areas: list[FocusArea] = []
    limitations: str = ""
    finisher_preference: FinisherPreference


class UserPreferences(BaseModel):
    dislikes: list[str] = []
    preferred_alternatives: dict[str, str] = {}
    finisher_style: FinisherPreference = "mixed"
    goals: dict = Field(
        default_factory=lambda: {"primary": [], "secondary": []}
    )


class UserSchema(BaseModel):
    id: str
    email: str
    name: str | None = None
    equipment_ids: list[str] = []
    goals: UserGoals = Field(default_factory=UserGoals)
    preferences: UserPreferences = Field(default_factory=UserPreferences)
    user_level: Experience = "intermediate"
    created_at: datetime
    updated_at: datetime


class UserCreate(BaseModel):
    email: EmailStr
    name: str | None = None


class UserUpdate(BaseModel):
    name: str | None = None
    equipment_ids: list[str] | None = None
    goals: UserGoals | None = None
    preferences: UserPreferences | None = None
    user_level: Experience | None = None