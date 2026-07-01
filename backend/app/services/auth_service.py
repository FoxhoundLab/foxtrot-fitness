"""Email magic link authentication (simplified for MVP).

Uses an in-memory token store. For production, replace with Redis or DB table.
"""

import secrets
import time
from datetime import datetime, timedelta

import httpx
from fastapi import HTTPException

from app.config import settings

# In-memory token store: {token: {"email": str, "expires_at": float}}
_token_store: dict[str, dict] = {}

TOKEN_TTL_SECONDS = 3600  # 1 hour


async def send_magic_link(email: str) -> str:
    """Generate magic link token, store it, and send via Resend."""
    token = secrets.token_urlsafe(32)

    _token_store[token] = {
        "email": email,
        "expires_at": time.time() + TOKEN_TTL_SECONDS,
    }

    # Clean expired tokens (lightweight GC)
    _cleanup_expired()

    magic_link = f"{settings.app_url}/auth/callback?token={token}"
    await send_email(
        email,
        "Your Foxtrot Fitness Magic Link",
        f"Click to log in: {magic_link}\n\nThis link expires in 1 hour.",
    )

    return token


async def verify_token(token: str) -> str:
    """Verify magic link token and return email. Raises 401 if invalid."""
    data = _token_store.get(token)
    if not data:
        raise HTTPException(status_code=401, detail="Invalid token")

    if time.time() > data["expires_at"]:
        del _token_store[token]
        raise HTTPException(status_code=401, detail="Token expired")

    email = data["email"]
    # One-time use: consume the token
    del _token_store[token]
    return email


async def send_email(to: str, subject: str, body: str):
    """Send email via Resend API."""
    if not settings.resend_api_key:
        # Dev mode: skip sending, log instead
        print(f"[DEV] Email to {to}: {subject}")
        return

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.resend.com/emails",
            headers={"Authorization": f"Bearer {settings.resend_api_key}"},
            json={
                "from": "Foxtrot Fitness <noreply@foxtrotfitness.com>",
                "to": to,
                "subject": subject,
                "text": body,
            },
        )
        response.raise_for_status()


def _cleanup_expired():
    """Remove expired tokens from the store."""
    now = time.time()
    expired = [t for t, d in _token_store.items() if now > d["expires_at"]]
    for t in expired:
        del _token_store[t]