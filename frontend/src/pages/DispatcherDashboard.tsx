import { useMemo, useState } from "react";
import FilterPanel from "../components/FilterPanel";
import TicketQueue from "../components/TicketQueue";
import { mockTickets } from "../data/mockTickets";

import type {
  Ticket,
  Priority,
  TicketStatus,
  AnimalType,
} from "../types/ticket";

function DispatcherDashboard() {
  // All tickets
  const [tickets] = useState<Ticket[]>(mockTickets);

  // Selected ticket from Task 1
  const [selectedTicket, setSelectedTicket] =
    useState<Ticket | null>(null);

  // Task 2 filters
  const [priority, setPriority] =
    useState<Priority | "All">("All");

  const [status, setStatus] =
    useState<TicketStatus | "All">("All");

  const [animalType, setAnimalType] =
    useState<AnimalType | "All">("All");

  // Filter tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const priorityMatch =
        priority === "All" ||
        ticket.priority_level === priority;

      const statusMatch =
        status === "All" ||
        ticket.status === status;

      const animalMatch =
        animalType === "All" ||
        ticket.animal_type === animalType;

      return (
        priorityMatch &&
        statusMatch &&
        animalMatch
      );
    });
  }, [tickets, priority, status, animalType]);

  // Clear all filters
  const clearFilters = () => {
    setPriority("All");
    setStatus("All");
    setAnimalType("All");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Dispatcher Dashboard
        </h1>

        <p className="mt-1 text-gray-600">
          Manage and filter rescue tickets
        </p>
      </div>

      {/* Task 2 - Filter Panel */}
      <FilterPanel
        priority={priority}
        status={status}
        animalType={animalType}
        onPriorityChange={setPriority}
        onStatusChange={setStatus}
        onAnimalTypeChange={setAnimalType}
        onClear={clearFilters}
      />

      {/* Ticket count */}
      <div className="mb-4 rounded-lg bg-white p-4 shadow">
        <p className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-bold text-gray-900">
            {filteredTickets.length}
          </span>{" "}
          of{" "}
          <span className="font-bold text-gray-900">
            {tickets.length}
          </span>{" "}
          tickets
        </p>
      </div>

      {/* Task 1 - Ticket Queue */}
      <TicketQueue
        tickets={filteredTickets}
        onTicketSelect={setSelectedTicket}
      />

      {/* Selected ticket */}
      {selectedTicket && (
        <div className="mt-6 rounded-lg bg-white p-4 shadow">
          <h2 className="text-lg font-semibold">
            Selected Ticket
          </h2>

          <p className="mt-2 text-gray-700">
            Ticket ID: {selectedTicket.id}
          </p>
        </div>
      )}

    </div>
  );
}

export default DispatcherDashboard;