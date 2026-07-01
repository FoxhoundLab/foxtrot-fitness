"""Shared FastAPI dependencies for authentication."""
import uuid
from fastapi import Header, HTTPException, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User


async def get_current_user(
    db: AsyncSession = Depends(get_db),
    x_user_email: str | None = Header(None, alias="X-User-Email"),
) -> User | None:
    """Get current user from X-User-Email header. Returns None if not set."""
    if not x_user_email:
        return None
    result = await db.execute(select(User).where(User.email == x_user_email))
    return result.scalar_one_or_none()


async def get_or_create_user(
    db: AsyncSession = Depends(get_db),
    x_user_email: str | None = Header(None, alias="X-User-Email"),
) -> User:
    """Get or create user from X-User-Email header. Raises 401 if missing."""
    if not x_user_email:
        raise HTTPException(status_code=401, detail="Not authenticated — provide X-User-Email header")
    result = await db.execute(select(User).where(User.email == x_user_email))
    user = result.scalar_one_or_none()
    if not user:
        user = User(email=x_user_email)
        db.add(user)
        await db.commit()
        await db.refresh(user)
    return user