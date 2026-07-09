"""Auth router — magic link authentication."""
from fastapi import APIRouter

from app.services.auth_service import mint_jwt, send_magic_link, verify_token

router = APIRouter()


def _safe_return_to(return_to: str | None) -> str | None:
    """Only allow relative paths ("/...") — reject absolute/protocol-relative URLs."""
    if return_to and return_to.startswith("/") and not return_to.startswith("//"):
        return return_to
    return None


@router.post("/request-link")
async def request_link(email: str, return_to: str | None = None):
    """Send magic link to email. Optional return_to rides along in the link."""
    return_to = _safe_return_to(return_to)
    token, is_dev = await send_magic_link(email, return_to)
    response: dict = {"message": "Magic link sent"}
    if is_dev:
        from urllib.parse import quote

        from app.config import settings
        dev_link = f"{settings.app_url}/auth/callback?token={token}"
        if return_to:
            dev_link += f"&returnTo={quote(return_to, safe='')}"
        response["dev_link"] = dev_link
    return response


@router.post("/verify")
async def verify(token: str, return_to: str | None = None):
    """Verify magic link token and mint a session JWT."""
    email = await verify_token(token)
    return {
        "email": email,
        "token": mint_jwt(email),
        "status": "verified",
        "return_to": _safe_return_to(return_to),
    }


@router.get("/me")
async def me():
    """Health check endpoint for auth. Actual user fetch is via /api/users/me."""
    return {"status": "auth service operational"}
