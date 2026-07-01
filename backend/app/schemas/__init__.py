"""Pydantic schemas for API request/response validation."""
from app.schemas.user import UserSchema, UserCreate, UserUpdate, UserGoals, UserPreferences
from app.schemas.equipment import EquipmentSchema
from app.schemas.movement import MovementSchema
from app.schemas.finisher import FinisherSchema, FinisherMovement
from app.schemas.program import (
    ProgramSchema,
    ProgramCreate,
    ProgramMovement,
    ProgramCardio,
    ProgramDay,
    ProgramDesignView,
    PillarCoverage,
)
from app.schemas.generation import GenerationRequest, GenerationResponse

__all__ = [
    "UserSchema",
    "UserCreate",
    "UserUpdate",
    "UserGoals",
    "UserPreferences",
    "EquipmentSchema",
    "MovementSchema",
    "FinisherSchema",
    "FinisherMovement",
    "ProgramSchema",
    "ProgramCreate",
    "ProgramMovement",
    "ProgramCardio",
    "ProgramDay",
    "ProgramDesignView",
    "PillarCoverage",
    "GenerationRequest",
    "GenerationResponse",
]