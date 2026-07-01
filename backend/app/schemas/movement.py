"""Movement Pydantic schema."""
from pydantic import BaseModel


class MovementSchema(BaseModel):
    id: str
    name: str
    aliases: list[str] = []
    equipment_required: list[str] = []
    muscle_groups: list[str] = []
    movement_pattern: str | None = None
    difficulty: str = "intermediate"
    tempo_default: str | None = None
    alternatives: list[str] = []
    contraindications: list[str] = []