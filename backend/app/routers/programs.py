"""Programs router — program CRUD, library, and examples."""
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import get_or_create_user
from app.models.user import User
from app.models.program import Program
from app.schemas.program import ProgramSchema

router = APIRouter()


@router.get("", response_model=list[ProgramSchema])
async def list_programs(
    user: User = Depends(get_or_create_user),
    db: AsyncSession = Depends(get_db),
):
    """List user's programs + example programs."""
    result = await db.execute(
        select(Program)
        .where(
            or_(
                Program.user_id == user.id,
                Program.is_example == True,
            )
        )
        .order_by(Program.created_at.desc())
    )
    return result.scalars().all()


@router.get("/examples", response_model=list[ProgramSchema])
async def list_examples(db: AsyncSession = Depends(get_db)):
    """List example programs (public, no auth needed)."""
    result = await db.execute(
        select(Program)
        .where(Program.is_example == True)
        .order_by(Program.created_at)
    )
    return result.scalars().all()


@router.get("/{program_id}", response_model=ProgramSchema)
async def get_program(program_id: str, db: AsyncSession = Depends(get_db)):
    """Get single program by ID."""
    result = await db.execute(select(Program).where(Program.id == program_id))
    program = result.scalar_one_or_none()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    return program


@router.post("/{program_id}/save", response_model=ProgramSchema)
async def save_program(
    program_id: str,
    user: User = Depends(get_or_create_user),
    db: AsyncSession = Depends(get_db),
):
    """Save a program to user's library (copies the program under user's ID)."""
    result = await db.execute(select(Program).where(Program.id == program_id))
    original = result.scalar_one_or_none()
    if not original:
        raise HTTPException(status_code=404, detail="Program not found")

    # Create a copy owned by this user
    saved = Program(
        user_id=user.id,
        name=original.name,
        goal_tag=original.goal_tag,
        difficulty=original.difficulty,
        split=original.split,
        user_level=original.user_level,
        design_view=original.design_view,
        execution_view=original.execution_view,
        version=original.version + 1,
        is_active=True,
        is_example=False,
    )
    db.add(saved)
    await db.commit()
    await db.refresh(saved)
    return saved


@router.delete("/{program_id}")
async def delete_program(
    program_id: str,
    user: User = Depends(get_or_create_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a program from user's library."""
    result = await db.execute(
        select(Program).where(Program.id == program_id, Program.user_id == user.id)
    )
    program = result.scalar_one_or_none()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found or not owned by user")

    await db.delete(program)
    await db.commit()
    return {"status": "deleted"}