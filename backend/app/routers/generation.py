"""Generation router — the AI program generation endpoint."""
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import get_current_user
from app.models.equipment import Equipment
from app.models.program import Program
from app.models.user import User
from app.schemas.generation import GenerationRequest, GenerationResponse
from app.schemas.program import ProgramSchema
from app.services.auth_service import check_rate_limit
from app.services.program_generator import generate_program

router = APIRouter()

GENERATIONS_PER_HOUR = 5


@router.post("", response_model=GenerationResponse)
async def generate(
    request: GenerationRequest,
    http_request: Request,
    user: User | None = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Generate a new program based on equipment + goals + preferences.

    Generation is PUBLIC — no auth required. If the user is signed in,
    the program is persisted to their library. If anonymous, the program
    is returned but not saved (user can sign in to save it later).
    """
    # Rate limit: use user ID if authenticated, otherwise IP address
    rate_key = f"generate:{user.id}" if user else f"generate:anon:{http_request.client.host if http_request.client else 'unknown'}"
    if not check_rate_limit(rate_key, GENERATIONS_PER_HOUR):
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit reached — max {GENERATIONS_PER_HOUR} generations per hour",
        )

    # Fetch equipment names from IDs
    result = await db.execute(
        select(Equipment).where(Equipment.id.in_(request.equipment_ids))
    )
    equipment_items = result.scalars().all()

    # Format equipment list for the prompt
    if equipment_items:
        equipment_list = "\n".join(
            f"- {e.name} ({e.category})" for e in equipment_items
        )
    else:
        equipment_list = "- Bodyweight only (no equipment)"

    # Generate the program
    program_schema = await generate_program(
        equipment_ids=request.equipment_ids,
        equipment_list=equipment_list,
        goals=request.goals,
        preferences=request.preferences,
        user_level=request.user_level,
        session=db,
    )

    # Persist to database only if user is authenticated
    if user:
        program = Program(
            user_id=user.id,
            name=program_schema.name,
            goal_tag=program_schema.goal_tag,
            difficulty=program_schema.difficulty,
            split=program_schema.split,
            user_level=program_schema.user_level,
            design_view=program_schema.design_view.model_dump(),
            execution_view=program_schema.execution_view,
            version=1,
            is_active=False,
            is_example=False,
        )
        db.add(program)
        await db.commit()
        await db.refresh(program)
        return GenerationResponse(program=ProgramSchema.model_validate(program, from_attributes=True))

    # Anonymous: return the program without persisting
    return GenerationResponse(program=program_schema)