"""Match finishers to user equipment and preferences."""

import random
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.finisher import Finisher


async def find_matching_finisher(
    session: AsyncSession,
    equipment_ids: list[str],
    difficulty: str = "intermediate",
    finisher_type: Optional[str] = None,
) -> Optional[Finisher]:
    """Find a finisher matching user equipment, difficulty, and type."""
    result = await session.execute(select(Finisher))
    all_finishers = result.scalars().all()

    # Try exact difficulty match first
    candidates = _filter_finishers(all_finishers, equipment_ids, difficulty, finisher_type)
    if candidates:
        return random.choice(candidates)

    # Fallback: ignore difficulty, match equipment + type
    candidates = _filter_finishers(all_finishers, equipment_ids, None, finisher_type)
    if candidates:
        return random.choice(candidates)

    # Last resort: ignore type too, just match equipment
    candidates = _filter_finishers(all_finishers, equipment_ids, None, None)
    if candidates:
        return random.choice(candidates)

    return None


def _filter_finishers(
    finishers: list[Finisher],
    equipment_ids: list[str],
    difficulty: Optional[str],
    finisher_type: Optional[str],
) -> list[Finisher]:
    """Filter finishers by equipment, difficulty, and type."""
    candidates = []
    for f in finishers:
        # Equipment check: all required equipment must be available
        if f.equipment_required:
            if not all(eq in equipment_ids for eq in f.equipment_required):
                continue
        # Difficulty check (optional)
        if difficulty and f.difficulty != difficulty:
            continue
        # Type check (optional)
        if finisher_type and f.type != finisher_type:
            continue
        candidates.append(f)
    return candidates