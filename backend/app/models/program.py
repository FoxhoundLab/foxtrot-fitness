"""Program SQLAlchemy model."""
from datetime import datetime
from sqlalchemy import String, DateTime, Integer, Boolean, JSON, func
from sqlalchemy.orm import Mapped, mapped_column
import uuid

from app.database import Base
from app.types import GUID


class Program(Base):
    __tablename__ = "programs"

    id: Mapped[uuid.UUID] = mapped_column(
        GUID(), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        GUID(), nullable=True, index=True
    )
    name: Mapped[str] = mapped_column(String, nullable=False)
    goal_tag: Mapped[str] = mapped_column(String, nullable=True)
    difficulty: Mapped[str] = mapped_column(String, nullable=True)
    split: Mapped[str] = mapped_column(String, nullable=True)
    user_level: Mapped[str] = mapped_column(String, nullable=True)

    design_view: Mapped[dict] = mapped_column(JSON, nullable=False)
    execution_view: Mapped[str] = mapped_column(String, nullable=False)

    version: Mapped[int] = mapped_column(Integer, default=1)
    is_active: Mapped[bool] = mapped_column(Boolean, default=False)
    is_example: Mapped[bool] = mapped_column(Boolean, default=False, index=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )