

import type { Ticket } from "../types/ticket";

interface TicketDetailsProps {
  ticket: Ticket | null;
  onClose: () => void;
}

export default function TicketDetails({
  ticket,
  onClose,
}: TicketDetailsProps) {
  if (!ticket) {
    return (
      <div className="ticket-details empty">
        <p>Select a ticket to view its details.</p>
      </div>
    );
  }

  return (
    <div className="ticket-details">
      <div className="ticket-details-header">
        <h2>{ticket.ticket_code}</h2>

        <button onClick={onClose}>Close</button>
      </div>

      <div className="ticket-details-content">
        <p>
          <strong>Priority:</strong> {ticket.priority_level}
        </p>

        <p>
          <strong>Status:</strong> {ticket.status}
        </p>

        <p>
          <strong>Animal Type:</strong> {ticket.animal_type}
        </p>

        <p>
          <strong>Description:</strong> {ticket.description}
        </p>

        <p>
          <strong>Address:</strong> {ticket.address}
        </p>

        <p>
          <strong>Latitude:</strong> {ticket.latitude}
        </p>

        <p>
          <strong>Longitude:</strong> {ticket.longitude}
        </p>

        <p>
          <strong>Created At:</strong> {ticket.created_at}
        </p>
      </div>
    </div>
  );
}