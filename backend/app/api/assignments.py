from fastapi import APIRouter, Depends, HTTPException, status

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.security import require_roles
from app.db.session import get_db

from app.models.assignment import TicketAssignment
from app.models.status_history import TicketStatusHistory
from app.models.ticket import RescueTicket, TicketStatus
from app.models.user import User, UserRole

from app.schemas.assignment import (
    AssignmentCreate,
    AssignmentResponse,
)


router = APIRouter(
    prefix="/assignments",
    tags=["Assignments"],
)


@router.get("/health")
def assignments_health():
    return {
        "message": "Assignments API is working"
    }


@router.post(
    "/tickets/{ticket_id}",
    response_model=AssignmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def assign_ticket(
    ticket_id: int,
    assignment_data: AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.DISPATCHER,
            UserRole.ADMIN,
        )
    ),
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

    volunteer = (
        db.query(User)
        .filter(User.id == assignment_data.volunteer_id)
        .first()
    )

    if volunteer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Volunteer not found",
        )

    if volunteer.role != UserRole.VOLUNTEER:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Selected user is not a volunteer",
        )

    if ticket.status == TicketStatus.CLOSED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot assign a closed ticket",
        )

    assignment = TicketAssignment(
        ticket_id=ticket.id,
        assigned_to_id=volunteer.id,
        assigned_by_id=current_user.id,
        status="assigned",
    )

    old_status = ticket.status

    ticket.assigned_volunteer_id = volunteer.id
    ticket.status = TicketStatus.ASSIGNED

    status_history = TicketStatusHistory(
        ticket_id=ticket.id,
        old_status=old_status.value,
        new_status=TicketStatus.ASSIGNED.value,
        changed_by_id=current_user.id,
        note="Ticket assigned to volunteer",
    )

    try:
        db.add(assignment)
        db.add(status_history)
        db.commit()

        db.refresh(assignment)

        return assignment

    except SQLAlchemyError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to assign ticket",
        )


@router.get(
    "/",
    response_model=list[AssignmentResponse],
)
def get_assignments(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.VOLUNTEER,
            UserRole.DISPATCHER,
            UserRole.ADMIN,
        )
    ),
):
    query = db.query(TicketAssignment)

    if current_user.role == UserRole.VOLUNTEER:
        query = query.filter(
            TicketAssignment.assigned_to_id == current_user.id
        )

    assignments = (
        query
        .order_by(
            TicketAssignment.created_at.desc()
        )
        .all()
    )

    return assignments


@router.post(
    "/{assignment_id}/accept",
    response_model=AssignmentResponse,
)
def accept_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.VOLUNTEER,
        )
    ),
):
    assignment = (
        db.query(TicketAssignment)
        .filter(TicketAssignment.id == assignment_id)
        .first()
    )

    if assignment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found",
        )

    if assignment.assigned_to_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not assigned to this rescue",
        )

    if assignment.status != "assigned":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assignment cannot be accepted",
        )

    ticket = (
        db.query(RescueTicket)
        .filter(
            RescueTicket.id == assignment.ticket_id
        )
        .first()
    )

    old_status = ticket.status if ticket is not None else None

    assignment.status = "accepted"

    if ticket is not None:
        ticket.status = TicketStatus.ACCEPTED

        status_history = TicketStatusHistory(
            ticket_id=ticket.id,
            old_status=old_status.value,
            new_status=TicketStatus.ACCEPTED.value,
            changed_by_id=current_user.id,
            note="Volunteer accepted the assignment",
        )

        db.add(status_history)

    try:
        db.commit()

        db.refresh(assignment)

        return assignment

    except SQLAlchemyError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to accept assignment",
        )


@router.post(
    "/{assignment_id}/complete",
    response_model=AssignmentResponse,
)
def complete_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.VOLUNTEER,
        )
    ),
):
    assignment = (
        db.query(TicketAssignment)
        .filter(TicketAssignment.id == assignment_id)
        .first()
    )

    if assignment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found",
        )

    if assignment.assigned_to_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not assigned to this rescue",
        )

    if assignment.status != "accepted":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assignment must be accepted before completion",
        )

    ticket = (
        db.query(RescueTicket)
        .filter(
            RescueTicket.id == assignment.ticket_id
        )
        .first()
    )

    old_status = ticket.status if ticket is not None else None

    assignment.status = "completed"

    if ticket is not None:
        ticket.status = TicketStatus.CLOSED

        status_history = TicketStatusHistory(
            ticket_id=ticket.id,
            old_status=old_status.value,
            new_status=TicketStatus.CLOSED.value,
            changed_by_id=current_user.id,
            note="Volunteer completed the rescue assignment",
        )

        db.add(status_history)

    try:
        db.commit()

        db.refresh(assignment)

        return assignment

    except SQLAlchemyError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to complete assignment",
        )