"""Equipment Pydantic schema."""
from pydantic import BaseModel


class EquipmentSchema(BaseModel):
    id: str
    category: str
    name: str
    aliases: list[str] = []
    requires: list[str] = []
    paired_with: list[str] = []
    movements: list[str] = []
    icon: str | None = None