"""Equipment SQLAlchemy model."""
from datetime import datetime
from sqlalchemy import String, DateTime, func
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import Mapped, mapped_column
import uuid

from app.database import Base


class Equipment(Base):
    __tablename__ = "equipment"

    id: Mapped[str] = mapped_column(String, primary_key=True)  # e.g., "barbell-olympic"
    category: Mapped[str] = mapped_column(String, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    aliases: Mapped[list] = mapped_column(ARRAY(String), default=list)
    requires: Mapped[list] = mapped_column(ARRAY(String), default=list)
    paired_with: Mapped[list] = mapped_column(ARRAY(String), default=list)
    movements: Mapped[list] = mapped_column(ARRAY(String), default=list)
    icon: Mapped[str | None] = mapped_column(String, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )