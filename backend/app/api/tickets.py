from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.ticket import RescueTicket, TicketStatus
from app.schemas.ticket import TicketCreate, TicketResponse, TicketUpdate


router = APIRouter(
    prefix="/tickets",
    tags=["Tickets"],
)


@router.get("/health")
def tickets_health():
    return {
        "message": "Tickets API is working"
    }


@router.post(
    "/",
    response_model=TicketResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_ticket(
    ticket_data: TicketCreate,
    db: Session = Depends(get_db),
):
    ticket_code = f"SR-{uuid4().hex[:8].upper()}"

    ticket = RescueTicket(
        ticket_code=ticket_code,
        reported_by_id=None,
        animal_type=ticket_data.animal_type,
        description=ticket_data.description,
        severity=ticket_data.severity,
        latitude=ticket_data.latitude,
        longitude=ticket_data.longitude,
        address_text=ticket_data.address_text,
    )

    try:
        db.add(ticket)
        db.commit()
        db.refresh(ticket)

        return ticket

    except SQLAlchemyError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create rescue ticket",
        )


@router.get(
    "/",
    response_model=list[TicketResponse],
)
def get_tickets(
    db: Session = Depends(get_db),
):
    tickets = (
        db.query(RescueTicket)
        .order_by(RescueTicket.created_at.desc())
        .all()
    )

    return tickets


@router.get(
    "/{ticket_id}",
    response_model=TicketResponse,
)
def get_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
):
    ticket = (
        db.query(RescueTicket)
        .filter(RescueTicket.id == ticket_id)
        .first()
    )

    if ticket is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rescue ticket not found",
        )

    return ticket


@router.patch(
    "/{ticket_id}",
    response_model=TicketResponse,
)
def update_ticket(
    ticket_id: int,
    ticket_data: TicketUpdate,
    db: Session = Depends(get_db),
):
    ticket = (
        db.query(RescueTicket)
        .filter(RescueTicket.id == ticket_id)
        .first()
    )

    if ticket is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rescue ticket not found",
        )

    update_data = ticket_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(ticket, field, value)

    try:
        db.commit()
        db.refresh(ticket)

        return ticket

    except SQLAlchemyError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update rescue ticket",
        )


@router.post(
    "/{ticket_id}/close",
    response_model=TicketResponse,
)
def close_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
):
    ticket = (
        db.query(RescueTicket)
        .filter(RescueTicket.id == ticket_id)
        .first()
    )

    if ticket is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rescue ticket not found",
        )

    if ticket.status == TicketStatus.CLOSED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rescue ticket is already closed",
        )

    ticket.status = TicketStatus.CLOSED
    ticket.closed_at = datetime.now(timezone.utc)

    try:
        db.commit()
        db.refresh(ticket)

        return ticket

    except SQLAlchemyError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to close rescue ticket",
        )