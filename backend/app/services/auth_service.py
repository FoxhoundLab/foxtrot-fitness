"""Email magic link authentication (simplified for MVP).

Uses an in-memory token store. For production, replace with Redis or DB table.
"""

import secrets
import time
from datetime import datetime, timedelta, timezone

import httpx
import jwt as pyjwt
from fastapi import HTTPException

from app.config import settings

# In-memory token store: {token: {"email": str, "expires_at": float}}
_token_store: dict[str, dict] = {}

TOKEN_TTL_SECONDS = 3600  # 1 hour

# In-memory rate limiter: {key: [timestamps]}
_rate_counters: dict[str, list[float]] = {}


def check_rate_limit(key: str, limit: int, window_seconds: int = 3600) -> bool:
    """Return True if this call is within the rate limit."""
    now = time.time()
    hits = [t for t in _rate_counters.get(key, []) if now - t < window_seconds]
    if len(hits) >= limit:
        _rate_counters[key] = hits
        return False
    hits.append(now)
    _rate_counters[key] = hits
    return True


def mint_jwt(email: str) -> str:
    """Mint a signed session JWT for a verified email."""
    now = datetime.now(timezone.utc)
    payload = {
        "sub": email,
        "iat": now,
        "exp": now + timedelta(hours=settings.jwt_expiry_hours),
    }
    return pyjwt.encode(payload, settings.jwt_secret, algorithm="HS256")


def decode_jwt(token: str) -> str | None:
    """Return the email from a valid session JWT, or None if invalid/expired."""
    try:
        payload = pyjwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
        return payload.get("sub")
    except pyjwt.PyJWTError:
        return None


async def send_magic_link(email: str, return_to: str | None = None) -> tuple[str, bool]:
    """Generate magic link token, store it, and send via Resend.

    Returns (token, is_dev) where is_dev=True means the link was printed
    to console instead of emailed (no Resend API key configured).
    """
    token = secrets.token_urlsafe(32)

    _token_store[token] = {
        "email": email,
        "expires_at": time.time() + TOKEN_TTL_SECONDS,
    }

    # Clean expired tokens (lightweight GC)
    _cleanup_expired()

    magic_link = f"{settings.app_url}/auth/callback?token={token}"
    if return_to:
        from urllib.parse import quote

        magic_link += f"&returnTo={quote(return_to, safe='')}"
    is_dev = not settings.resend_api_key
    await send_email(
        email,
        "Your Foxtrot Fitness Magic Link",
        f"Click to log in: {magic_link}\n\nThis link expires in 1 hour.",
    )

    return token, is_dev


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
        # Dev mode: skip sending, log the full body so the link is usable locally
        print(f"[DEV MAGIC LINK] Email to {to}: {subject}\n{body}")
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