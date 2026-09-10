from fastapi import APIRouter, Depends, HTTPException, status

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.security import require_roles
from app.db.session import get_db

from app.models.assignment import TicketAssignment
from app.models.status_history import TicketStatusHistory
from app.models.ticket import RescueTicket, TicketStatus, TicketMedia
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
    "/availability",
)
def update_volunteer_availability(
    is_available: bool,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.VOLUNTEER,
        )
    ),
):
    current_user.is_available = is_available

    try:
        db.commit()
        db.refresh(current_user)

        return {
            "message": "Volunteer availability updated successfully",
            "volunteer_id": current_user.id,
            "is_available": current_user.is_available,
        }

    except SQLAlchemyError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update volunteer availability",
        )


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

    if ticket is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rescue ticket not found",
        )

    old_status = ticket.status

    assignment.status = "accepted"
    ticket.status = TicketStatus.ACCEPTED

    status_history = TicketStatusHistory(
        ticket_id=ticket.id,
        old_status=old_status.value,
        new_status=TicketStatus.ACCEPTED.value,
        changed_by_id=current_user.id,
        note="Volunteer accepted the assignment",
    )

    try:
        db.add(status_history)
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
    "/{assignment_id}/reject",
    response_model=AssignmentResponse,
)
def reject_assignment(
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
            detail="Assignment cannot be rejected",
        )

    assignment.status = "rejected"

    try:
        db.commit()

        db.refresh(assignment)

        return assignment

    except SQLAlchemyError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to reject assignment",
        )


@router.post(
    "/{assignment_id}/en-route",
    response_model=AssignmentResponse,
)
def mark_en_route(
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
            detail="Assignment must be accepted before going en route",
        )

    ticket = (
        db.query(RescueTicket)
        .filter(
            RescueTicket.id == assignment.ticket_id
        )
        .first()
    )

    if ticket is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rescue ticket not found",
        )

    old_status = ticket.status

    assignment.status = "en_route"
    ticket.status = TicketStatus.EN_ROUTE

    status_history = TicketStatusHistory(
        ticket_id=ticket.id,
        old_status=old_status.value,
        new_status=TicketStatus.EN_ROUTE.value,
        changed_by_id=current_user.id,
        note="Volunteer is en route to the rescue location",
    )

    try:
        db.add(status_history)
        db.commit()

        db.refresh(assignment)

        return assignment

    except SQLAlchemyError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update assignment status",
        )


@router.post(
    "/{assignment_id}/arrived",
    response_model=AssignmentResponse,
)
def mark_arrived(
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

    if assignment.status != "en_route":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assignment must be en route before marking arrived",
        )

    ticket = (
        db.query(RescueTicket)
        .filter(
            RescueTicket.id == assignment.ticket_id
        )
        .first()
    )

    if ticket is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rescue ticket not found",
        )

    old_status = ticket.status

    assignment.status = "arrived"
    ticket.status = TicketStatus.ARRIVED

    status_history = TicketStatusHistory(
        ticket_id=ticket.id,
        old_status=old_status.value,
        new_status=TicketStatus.ARRIVED.value,
        changed_by_id=current_user.id,
        note="Volunteer arrived at the rescue location",
    )

    try:
        db.add(status_history)
        db.commit()

        db.refresh(assignment)

        return assignment

    except SQLAlchemyError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update assignment status",
        )


@router.post(
    "/{assignment_id}/proof",
)
def upload_completion_proof(
    assignment_id: int,
    file_url: str,
    file_type: str,
    file_size: int | None = None,
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

    if assignment.status != "arrived":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Proof can only be uploaded after arrival",
        )

    if not file_url.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Proof file URL is required",
        )

    if not file_type.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Proof file type is required",
        )

    proof = TicketMedia(
        ticket_id=assignment.ticket_id,
        file_url=file_url,
        file_type=file_type,
        file_size=file_size,
        uploaded_by_id=current_user.id,
    )

    try:
        db.add(proof)
        db.commit()
        db.refresh(proof)

        return {
            "message": "Completion proof uploaded successfully",
            "proof_id": proof.id,
            "ticket_id": proof.ticket_id,
            "file_url": proof.file_url,
            "file_type": proof.file_type,
        }

    except SQLAlchemyError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload completion proof",
        )


@router.post(
    "/{assignment_id}/complete",
    response_model=AssignmentResponse,
)
def complete_assignment(
    assignment_id: int,
    outcome: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.VOLUNTEER,
        )
    ),
):
    allowed_outcomes = {
        "rescued",
        "not_found",
        "transferred",
        "referred",
        "unsafe",
    }

    if outcome not in allowed_outcomes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Invalid outcome. Choose one of: "
                "rescued, not_found, transferred, referred, unsafe"
            ),
        )

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

    if assignment.status != "arrived":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assignment must be arrived before completion",
        )

    proof = (
        db.query(TicketMedia)
        .filter(
            TicketMedia.ticket_id == assignment.ticket_id,
            TicketMedia.uploaded_by_id == current_user.id,
        )
        .first()
    )

    if proof is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Completion proof is required before completing the assignment",
        )

    ticket = (
        db.query(RescueTicket)
        .filter(
            RescueTicket.id == assignment.ticket_id
        )
        .first()
    )

    if ticket is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rescue ticket not found",
        )

    old_status = ticket.status

    assignment.status = "completed"
    assignment.outcome = outcome

    if outcome == "rescued":
        ticket.status = TicketStatus.RESCUED

    elif outcome == "not_found":
        ticket.status = TicketStatus.NOT_FOUND

    elif outcome == "referred":
        ticket.status = TicketStatus.REFERRED

    elif outcome in {"transferred", "unsafe"}:
        ticket.status = TicketStatus.CLOSED

    status_history = TicketStatusHistory(
        ticket_id=ticket.id,
        old_status=old_status.value,
        new_status=ticket.status.value,
        changed_by_id=current_user.id,
        note=f"Volunteer completed rescue with outcome: {outcome}",
    )

    try:
        db.add(status_history)
        db.commit()

        db.refresh(assignment)

        return assignment

    except SQLAlchemyError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to complete assignment",
        )