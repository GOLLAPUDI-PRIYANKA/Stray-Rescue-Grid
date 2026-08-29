from datetime import datetime

from pydantic import BaseModel, ConfigDict


class AssignmentCreate(BaseModel):
    volunteer_id: int


class AssignmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    ticket_id: int
    assigned_to_id: int
    assigned_by_id: int | None
    status: str
    note: str | None
    created_at: datetime