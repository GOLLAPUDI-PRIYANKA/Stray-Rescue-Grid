from datetime import datetime
from enum import Enum

from sqlalchemy import (
    DateTime,
    Enum as SqlEnum,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class AnimalType(str, Enum):
    DOG = "dog"
    CAT = "cat"
    BIRD = "bird"
    OTHER = "other"
    UNKNOWN = "unknown"


class Severity(str, Enum):
    CRITICAL = "critical"
    SERIOUS = "serious"
    MODERATE = "moderate"
    UNKNOWN = "unknown"


class PriorityLevel(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    NORMAL = "normal"
    LOW = "low"
    NEEDS_REVIEW = "needs_review"


class TicketStatus(str, Enum):
    NEW = "new"
    UNDER_REVIEW = "under_review"
    ASSIGNED = "assigned"
    ACCEPTED = "accepted"
    EN_ROUTE = "en_route"
    ARRIVED = "arrived"
    RESCUED = "rescued"
    REFERRED = "referred"
    NOT_FOUND = "not_found"
    CLOSED = "closed"
    CANCELLED = "cancelled"


class RescueTicket(Base):
    __tablename__ = "rescue_tickets"

    id: Mapped[int] = mapped_column(primary_key=True)

    ticket_code: Mapped[str] = mapped_column(
        String(20),
        unique=True,
        index=True,
        nullable=False,
    )

    reported_by_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id"),
        nullable=True,
    )

    animal_type: Mapped[AnimalType] = mapped_column(
        SqlEnum(AnimalType, name="animal_type"),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    severity: Mapped[Severity] = mapped_column(
        SqlEnum(Severity, name="severity"),
        default=Severity.UNKNOWN,
        nullable=False,
    )

    priority_level: Mapped[PriorityLevel] = mapped_column(
        SqlEnum(PriorityLevel, name="priority_level"),
        default=PriorityLevel.NEEDS_REVIEW,
        nullable=False,
    )

    priority_score: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    latitude: Mapped[float] = mapped_column(
        Numeric(9, 6),
        nullable=False,
    )

    longitude: Mapped[float] = mapped_column(
        Numeric(9, 6),
        nullable=False,
    )

    address_text: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    status: Mapped[TicketStatus] = mapped_column(
        SqlEnum(TicketStatus, name="ticket_status"),
        default=TicketStatus.NEW,
        nullable=False,
        index=True,
    )

    assigned_volunteer_id: Mapped[int | None] = mapped_column(
        nullable=True,
    )

    destination_facility_id: Mapped[int | None] = mapped_column(
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    closed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    reporter = relationship(
        "User",
        back_populates="reported_tickets",
        foreign_keys=[reported_by_id],
    )

    media = relationship(
        "TicketMedia",
        back_populates="ticket",
        cascade="all, delete-orphan",
    )

    status_history = relationship(
        "TicketStatusHistory",
        back_populates="ticket",
        cascade="all, delete-orphan",
        order_by="TicketStatusHistory.created_at",
    )

    assignments = relationship(
        "TicketAssignment",
        back_populates="ticket",
        cascade="all, delete-orphan",
    )


class TicketMedia(Base):
    __tablename__ = "ticket_media"

    id: Mapped[int] = mapped_column(primary_key=True)

    ticket_id: Mapped[int] = mapped_column(
        ForeignKey(
            "rescue_tickets.id",
            ondelete="CASCADE",
        )
    )

    file_url: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    file_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    file_size: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    uploaded_by_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id"),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    ticket = relationship(
        "RescueTicket",
        back_populates="media",
    )