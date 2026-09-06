from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class TicketAssignment(Base):
    __tablename__ = "ticket_assignments"

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    ticket_id: Mapped[int] = mapped_column(
        ForeignKey(
            "rescue_tickets.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    assigned_to_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    assigned_by_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id"),
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="assigned",
        nullable=False,
    )

    note: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    ticket = relationship(
        "RescueTicket",
        back_populates="assignments",
    )

    assigned_to = relationship(
        "User",
        foreign_keys=[assigned_to_id],
        back_populates="assignments",
    )

    assigned_by = relationship(
        "User",
        foreign_keys=[assigned_by_id],
    )