"""Programs router — program CRUD, library, and examples."""
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import get_current_user, get_or_create_user
from app.models.user import User
from app.models.program import Program
from app.schemas.program import ProgramCreate, ProgramSchema

router = APIRouter()


@router.post("", response_model=ProgramSchema)
async def create_program(
    body: ProgramCreate,
    user: User = Depends(get_or_create_user),
    db: AsyncSession = Depends(get_db),
):
    """Persist a client-held program (e.g. generated anonymously, then signed in).

    Anonymous generations are never stored server-side, so after sign-in the
    frontend submits the full program here to save it as a fresh version 1.
    """
    program = Program(
        user_id=user.id,
        name=body.name,
        goal_tag=body.goal_tag,
        difficulty=body.difficulty,
        split=body.split,
        user_level=body.user_level,
        design_view=body.design_view.model_dump(),
        execution_view=body.execution_view,
        version=1,
        is_active=True,
        is_example=False,
    )
    db.add(program)
    await db.commit()
    await db.refresh(program)
    return program


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


def _authorize_program_access(program: Program | None, user: User | None) -> Program:
    """404 unless the program is an example or owned by the caller."""
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    if program.is_example:
        return program
    if user is None or program.user_id != user.id:
        raise HTTPException(status_code=404, detail="Program not found")
    return program


@router.get("/{program_id}", response_model=ProgramSchema)
async def get_program(
    program_id: str,
    user: User | None = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get single program by ID (examples are public; others owner-only)."""
    result = await db.execute(select(Program).where(Program.id == program_id))
    return _authorize_program_access(result.scalar_one_or_none(), user)


@router.post("/{program_id}/save", response_model=ProgramSchema)
async def save_program(
    program_id: str,
    user: User = Depends(get_or_create_user),
    db: AsyncSession = Depends(get_db),
):
    """Save a program to user's library (copies the program under user's ID)."""
    result = await db.execute(select(Program).where(Program.id == program_id))
    original = _authorize_program_access(result.scalar_one_or_none(), user)

    # Create a copy owned by this user. Only bump the version when the user
    # is iterating on a program they already own; copying an example or an
    # unowned program starts their lineage at version 1.
    is_iteration = original.user_id == user.id
    saved = Program(
        user_id=user.id,
        name=original.name,
        goal_tag=original.goal_tag,
        difficulty=original.difficulty,
        split=original.split,
        user_level=original.user_level,
        design_view=original.design_view,
        execution_view=original.execution_view,
        version=original.version + 1 if is_iteration else 1,
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