"""Users router — user profile CRUD."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import get_or_create_user
from app.models.user import User
from app.schemas.user import UserSchema, UserUpdate

router = APIRouter()


@router.get("/me", response_model=UserSchema)
async def get_me(user: User = Depends(get_or_create_user)):
    """Get current user profile."""
    return user


@router.put("/me", response_model=UserSchema)
async def update_me(
    update: UserUpdate,
    user: User = Depends(get_or_create_user),
    db: AsyncSession = Depends(get_db),
):
    """Update user profile."""
    if update.name is not None:
        user.name = update.name
    if update.equipment_ids is not None:
        user.equipment_ids = update.equipment_ids
    if update.goals is not None:
        user.goals = update.goals.model_dump()
    if update.preferences is not None:
        user.preferences = update.preferences.model_dump()
    if update.user_level is not None:
        user.user_level = update.user_level

    await db.commit()
    await db.refresh(user)
    return user