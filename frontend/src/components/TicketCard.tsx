import type { Ticket } from "../types/ticket";

interface TicketCardProps {
  ticket: Ticket;
  onClick: (ticket: Ticket) => void;
}

const priorityStyles = {
  Critical: "bg-red-100 text-red-700",
  High: "bg-orange-100 text-orange-700",
  Normal: "bg-blue-100 text-blue-700",
  Low: "bg-gray-100 text-gray-700",
};

export default function TicketCard({
  ticket,
  onClick,
}: TicketCardProps) {
  return (
    <div
      onClick={() => onClick(ticket)}
      className="cursor-pointer rounded-lg border bg-white p-4 shadow-sm hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">
          {ticket.ticket_code}
        </h3>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            priorityStyles[ticket.priority_level]
          }`}
        >
          {ticket.priority_level}
        </span>
      </div>

      <p className="mt-2 text-sm text-gray-600">
        {ticket.animal_type}
      </p>

      <p className="mt-1 text-sm text-gray-500">
        {ticket.description}
      </p>

      <div className="mt-3 flex justify-between text-xs text-gray-500">
        <span>{ticket.status}</span>
        <span>{ticket.address}</span>
      </div>
    </div>
  );
}