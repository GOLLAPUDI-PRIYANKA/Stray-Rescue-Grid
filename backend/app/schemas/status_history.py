from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class TicketStatusHistoryResponse(BaseModel):
    id: int
    ticket_id: int
    old_status: Optional[str] = None
    new_status: str
    changed_by_id: int
    note: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
