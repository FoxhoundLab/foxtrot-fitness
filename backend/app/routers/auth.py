"""Auth router — magic link authentication."""
from fastapi import APIRouter

from app.services.auth_service import mint_jwt, send_magic_link, verify_token

router = APIRouter()


@router.post("/request-link")
async def request_link(email: str):
    """Send magic link to email."""
    await send_magic_link(email)
    return {"message": "Magic link sent"}


@router.post("/verify")
async def verify(token: str):
    """Verify magic link token and mint a session JWT."""
    email = await verify_token(token)
    return {"email": email, "token": mint_jwt(email), "status": "verified"}


@router.get("/me")
async def me():
    """Health check endpoint for auth. Actual user fetch is via /api/users/me."""
    return {"status": "auth service operational"}