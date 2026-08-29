from pydantic import BaseModel, ConfigDict, Field

from app.models.ticket import (
    AnimalType,
    PriorityLevel,
    Severity,
    TicketStatus,
)


class TicketCreate(BaseModel):
    animal_type: AnimalType
    description: str = Field(min_length=5, max_length=5000)
    severity: Severity = Severity.UNKNOWN
    latitude: float
    longitude: float
    address_text: str | None = None


class TicketResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    ticket_code: str
    reported_by_id: int | None
    animal_type: AnimalType
    description: str
    severity: Severity
    priority_level: PriorityLevel
    priority_score: int
    latitude: float
    longitude: float
    address_text: str | None
    status: TicketStatus


class TicketUpdate(BaseModel):
    animal_type: AnimalType | None = None
    description: str | None = Field(
        default=None,
        min_length=5,
        max_length=5000,
    )
    severity: Severity | None = None
    latitude: float | None = None
    longitude: float | None = None
    address_text: str | None = None


class TicketStatusUpdate(BaseModel):
    status: TicketStatus
    note: str | None = Field(
        default=None,
        max_length=1000,
    )