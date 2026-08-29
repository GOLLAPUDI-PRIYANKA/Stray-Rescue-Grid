import type { Ticket } from "../types/ticket";

interface TicketCardProps {
  ticket: Ticket;
  onClick: () => void;
}

export default function TicketCard({
  ticket,
  onClick,
}: TicketCardProps) {
  return (
    <div className="ticket-card" onClick={onClick}>

      <div className="ticket-card-header">
        <h3>{ticket.ticket_code}</h3>

        <span
          className={`priority-badge priority-${ticket.priority_level.toLowerCase()}`}
        >
          {ticket.priority_level}
        </span>
      </div>

      <div className="ticket-card-body">

        <div className="ticket-info">
          <span className="info-label">Animal</span>
          <span>{ticket.animal_type}</span>
        </div>

        <div className="ticket-info">
          <span className="info-label">Status</span>
          <span>{ticket.status}</span>
        </div>

        <div className="ticket-description">
          {ticket.description}
        </div>

        <div className="ticket-location">
          📍 {ticket.address}
        </div>

      </div>

      <div className="ticket-card-footer">
        <button onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}>
          View Details
        </button>
      </div>

    </div>
  );
}