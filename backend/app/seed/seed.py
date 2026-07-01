"""Database seeding script.

Run with: cd backend && python -m app.seed.seed

Populates equipment catalog, movement database, finisher library, and example programs.
"""
import asyncio
import json
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import async_session_maker, engine, Base
from app.models.equipment import Equipment
from app.models.finisher import Finisher
from app.models.movement import Movement
from app.models.program import Program

SEED_DIR = Path(__file__).parent


async def seed_equipment(session: AsyncSession):
    """Seed the equipment catalog."""
    with open(SEED_DIR / "equipment_catalog.json") as f:
        equipment_list = json.load(f)

    for item in equipment_list:
        existing = await session.execute(
            select(Equipment).where(Equipment.id == item["id"])
        )
        if existing.scalar_one_or_none():
            continue

        equipment = Equipment(**item)
        session.add(equipment)

    await session.commit()
    print(f"✓ Seeded {len(equipment_list)} equipment items")


async def seed_movements(session: AsyncSession):
    """Seed the movement database."""
    with open(SEED_DIR / "movement_database.json") as f:
        movements = json.load(f)

    for item in movements:
        existing = await session.execute(
            select(Movement).where(Movement.id == item["id"])
        )
        if existing.scalar_one_or_none():
            continue

        movement = Movement(**item)
        session.add(movement)

    await session.commit()
    print(f"✓ Seeded {len(movements)} movements")


async def seed_finishers(session: AsyncSession):
    """Seed the finisher library."""
    with open(SEED_DIR / "finisher_library.json") as f:
        finishers = json.load(f)

    for item in finishers:
        existing = await session.execute(
            select(Finisher).where(Finisher.id == item["id"])
        )
        if existing.scalar_one_or_none():
            continue

        finisher = Finisher(**item)
        session.add(finisher)

    await session.commit()
    print(f"✓ Seeded {len(finishers)} finishers")


async def seed_example_programs(session: AsyncSession):
    """Seed the 3 example programs (Genesis Protocol, Cobalt Fury, Sanguine Thunder)."""
    with open(SEED_DIR / "example_programs.json") as f:
        programs = json.load(f)

    for item in programs:
        existing = await session.execute(
            select(Program).where(Program.name == item["name"])
        )
        if existing.scalar_one_or_none():
            continue

        program = Program(
            user_id=None,
            name=item["name"],
            goal_tag=item["goal_tag"],
            difficulty=item["difficulty"],
            split=item["split"],
            user_level=item["user_level"],
            design_view=item["design_view"],
            execution_view=item["execution_view"],
            version=1,
            is_active=False,
            is_example=item.get("is_example", False),
        )
        session.add(program)

    await session.commit()
    print(f"✓ Seeded {len(programs)} example programs")


async def main():
    """Run all seed functions."""
    print("Creating tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_maker() as session:
        await seed_equipment(session)
        await seed_movements(session)
        await seed_finishers(session)
        await seed_example_programs(session)

    print("\n✓ Database seeded successfully")


if __name__ == "__main__":
    asyncio.run(main())