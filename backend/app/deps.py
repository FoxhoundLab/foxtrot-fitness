"""Shared FastAPI dependencies for authentication."""
import logging

from fastapi import Depends, Header, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.models.user import User
from app.services.auth_service import decode_jwt

logger = logging.getLogger(__name__)


def _resolve_email(
    authorization: str | None,
    x_user_email: str | None,
) -> str | None:
    """Resolve the caller's email from a Bearer JWT, with dev-only header fallback."""
    if authorization and authorization.lower().startswith("bearer "):
        email = decode_jwt(authorization[7:])
        if email:
            return email
        raise HTTPException(status_code=401, detail="Invalid or expired session token")
    if x_user_email and settings.env == "development":
        logger.warning("Auth via X-User-Email dev fallback for %s", x_user_email)
        return x_user_email
    return None


async def get_current_user(
    db: AsyncSession = Depends(get_db),
    authorization: str | None = Header(None),
    x_user_email: str | None = Header(None, alias="X-User-Email"),
) -> User | None:
    """Get current user from session JWT. Returns None if not authenticated."""
    email = _resolve_email(authorization, x_user_email)
    if not email:
        return None
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def get_or_create_user(
    db: AsyncSession = Depends(get_db),
    authorization: str | None = Header(None),
    x_user_email: str | None = Header(None, alias="X-User-Email"),
) -> User:
    """Get or create user from session JWT. Raises 401 if missing."""
    email = _resolve_email(authorization, x_user_email)
    if not email:
        raise HTTPException(status_code=401, detail="Not authenticated — sign in first")
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user:
        user = User(email=email)
        db.add(user)
        await db.commit()
        await db.refresh(user)
    return user
