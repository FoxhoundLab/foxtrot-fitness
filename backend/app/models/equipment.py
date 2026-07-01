"""Equipment SQLAlchemy model."""
from datetime import datetime
from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base
from app.types import StringList
from app.database import Base


class Equipment(Base):
    __tablename__ = "equipment"

    id: Mapped[str] = mapped_column(String, primary_key=True)  # e.g., "barbell-olympic"
    category: Mapped[str] = mapped_column(String, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    aliases: Mapped[list] = mapped_column(StringList, default=list)
    requires: Mapped[list] = mapped_column(StringList, default=list)
    paired_with: Mapped[list] = mapped_column(StringList, default=list)
    movements: Mapped[list] = mapped_column(StringList, default=list)
    icon: Mapped[str | None] = mapped_column(String, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )