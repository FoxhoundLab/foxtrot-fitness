"""Finisher SQLAlchemy model."""
from datetime import datetime
from sqlalchemy import String, DateTime, Integer, JSON, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base
from app.types import StringList


class Finisher(Base):
    __tablename__ = "finishers"

    id: Mapped[str] = mapped_column(String, primary_key=True)  # e.g., "the-compression"
    name: Mapped[str] = mapped_column(String, nullable=False)
    format: Mapped[str] = mapped_column(String, nullable=False)
    duration_minutes: Mapped[int | None] = mapped_column(Integer, nullable=True)
    rounds: Mapped[int | None] = mapped_column(Integer, nullable=True)
    rest_between_rounds: Mapped[int | None] = mapped_column(Integer, nullable=True)
    reps_scheme: Mapped[str | None] = mapped_column(String, nullable=True)

    movements: Mapped[list] = mapped_column(JSON, default=list)
    equipment_required: Mapped[list] = mapped_column(StringList, default=list)
    type: Mapped[str] = mapped_column(String, nullable=True)
    difficulty: Mapped[str] = mapped_column(String, default="intermediate")
    notes: Mapped[str | None] = mapped_column(String, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )