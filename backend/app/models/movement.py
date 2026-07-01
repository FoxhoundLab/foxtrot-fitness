"""Movement SQLAlchemy model."""
from datetime import datetime
from sqlalchemy import String, DateTime, func
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Movement(Base):
    __tablename__ = "movements"

    id: Mapped[str] = mapped_column(String, primary_key=True)  # e.g., "back-squat"
    name: Mapped[str] = mapped_column(String, nullable=False)
    aliases: Mapped[list] = mapped_column(ARRAY(String), default=list)
    equipment_required: Mapped[list] = mapped_column(ARRAY(String), default=list)
    muscle_groups: Mapped[list] = mapped_column(ARRAY(String), default=list)
    movement_pattern: Mapped[str] = mapped_column(String, nullable=True)
    difficulty: Mapped[str] = mapped_column(String, default="intermediate")
    tempo_default: Mapped[str] = mapped_column(String, nullable=True)
    alternatives: Mapped[list] = mapped_column(ARRAY(String), default=list)
    contraindications: Mapped[list] = mapped_column(ARRAY(String), default=list)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )