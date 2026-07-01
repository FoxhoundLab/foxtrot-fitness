"""Generation request/response schemas."""
from pydantic import BaseModel

from app.schemas.program import ProgramSchema
from app.schemas.user import UserGoals, UserPreferences, Experience


class GenerationRequest(BaseModel):
    equipment_ids: list[str]
    goals: UserGoals
    preferences: UserPreferences
    user_level: Experience


class GenerationResponse(BaseModel):
    program: ProgramSchema