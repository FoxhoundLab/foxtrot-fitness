"""Generation router — the AI program generation endpoint."""
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.equipment import Equipment
from app.models.program import Program
from app.schemas.generation import GenerationRequest, GenerationResponse
from app.schemas.program import ProgramSchema
from app.services.program_generator import generate_program

router = APIRouter()


@router.post("", response_model=GenerationResponse)
async def generate(request: GenerationRequest, db: AsyncSession = Depends(get_db)):
    """Generate a new program based on equipment + goals + preferences."""

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

    # Persist to database
    program = Program(
        user_id=None,
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