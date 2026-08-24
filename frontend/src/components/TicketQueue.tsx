import type { Ticket } from "../types/ticket";
import TicketCard from "./TicketCard";

interface TicketQueueProps {
  tickets: Ticket[];
  onTicketSelect: (ticket: Ticket) => void;
}

export default function TicketQueue({
  tickets,
  onTicketSelect,
}: TicketQueueProps) {
  return (
    <div className="space-y-3">
      {tickets.map((ticket) => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          onClick={() => onTicketSelect(ticket)}
        />
      ))}

      {tickets.length === 0 && (
        <p className="py-8 text-center text-gray-500">
          No tickets found.
        </p>
      )}
    </div>
  );
}