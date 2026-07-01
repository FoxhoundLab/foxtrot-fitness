"""Movements router — movement database listing."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.movement import Movement
from app.schemas.movement import MovementSchema

router = APIRouter()


@router.get("", response_model=list[MovementSchema])
async def list_movements(db: AsyncSession = Depends(get_db)):
    """List all movements."""
    result = await db.execute(select(Movement).order_by(Movement.name))
    return result.scalars().all()


@router.get("/{movement_id}", response_model=MovementSchema)
async def get_movement(movement_id: str, db: AsyncSession = Depends(get_db)):
    """Get single movement by ID."""
    result = await db.execute(select(Movement).where(Movement.id == movement_id))
    movement = result.scalar_one_or_none()
    if not movement:
        raise HTTPException(status_code=404, detail="Movement not found")
    return movement