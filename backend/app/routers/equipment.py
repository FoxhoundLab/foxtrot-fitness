"""Equipment router — equipment catalog listing."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.equipment import Equipment
from app.schemas.equipment import EquipmentSchema

router = APIRouter()


@router.get("", response_model=list[EquipmentSchema])
async def list_equipment(db: AsyncSession = Depends(get_db)):
    """List all equipment, ordered by category."""
    result = await db.execute(select(Equipment).order_by(Equipment.category))
    return result.scalars().all()


@router.get("/{equipment_id}", response_model=EquipmentSchema)
async def get_equipment(equipment_id: str, db: AsyncSession = Depends(get_db)):
    """Get single equipment by ID."""
    result = await db.execute(select(Equipment).where(Equipment.id == equipment_id))
    equipment = result.scalar_one_or_none()
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return equipment