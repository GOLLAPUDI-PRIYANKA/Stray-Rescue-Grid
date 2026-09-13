import TicketCard from "./TicketCard";
import type { Ticket } from "../types/ticket";

interface TicketQueueProps {
  tickets: Ticket[];
  onTicketSelect: (ticket: Ticket) => void;
}

export default function TicketQueue({
  tickets,
  onTicketSelect,
}: TicketQueueProps) {
  return (
    <div className="ticket-queue">
      {tickets.length === 0 ? (
        <div className="no-tickets">
          No rescue tickets found.
        </div>
      ) : (
        <div className="ticket-grid">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onClick={() => onTicketSelect(ticket)}
            />
          ))}
        </div>
      )}
    </div>
  );
}