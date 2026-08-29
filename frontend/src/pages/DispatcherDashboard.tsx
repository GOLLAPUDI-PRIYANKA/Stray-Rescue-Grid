import { useMemo, useState } from "react";

import DispatcherMap from "../components/DispatcherMap";
import TicketQueue from "../components/TicketQueue";
import TicketDetails from "../components/TicketDetails";

import { mockTickets } from "../data/mockTickets";

import type { Ticket } from "../types/ticket";

export default function DispatcherDashboard() {
  // =========================
  // STATE
  // =========================

  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [animalType, setAnimalType] = useState("");

  const [selectedTicket, setSelectedTicket] =
    useState<Ticket | null>(null);

  // =========================
  // FILTER TICKETS
  // =========================

  const filteredTickets = useMemo(() => {
    return mockTickets.filter((ticket) => {
      const priorityMatch =
        priority === "" ||
        ticket.priority_level === priority;

      const statusMatch =
        status === "" ||
        ticket.status === status;

      // IMPORTANT:
      // Ticket uses animal_type
      const animalMatch =
        animalType === "" ||
        ticket.animal_type === animalType;

      return (
        priorityMatch &&
        statusMatch &&
        animalMatch
      );
    });
  }, [priority, status, animalType]);

  // =========================
  // CLEAR FILTERS
  // =========================

  const clearFilters = () => {
    setPriority("");
    setStatus("");
    setAnimalType("");
  };

  // =========================
  // DASHBOARD
  // =========================

  return (
    <div className="dashboard">

      {/* ================= HEADER ================= */}

      <div className="dashboard-header">
        <h1>Dispatcher Dashboard</h1>

        <p>
          Manage and filter rescue tickets
        </p>
      </div>

      {/* ================= FILTERS ================= */}

      <div className="filter-panel">

        <div className="filter-header">

          <h2>Ticket Filters</h2>

          <button
            className="clear-filters"
            onClick={clearFilters}
          >
            Clear Filters
          </button>

        </div>

        <div className="filter-controls">

          {/* PRIORITY */}

          <div className="filter-group">
            <label htmlFor="priority">
              Priority
            </label>

            <select
              id="priority"
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value)
              }
            >
              <option value="">
                All Priorities
              </option>

              <option value="Critical">
                Critical
              </option>

              <option value="High">
                High
              </option>

              <option value="Normal">
                Normal
              </option>

              <option value="Low">
                Low
              </option>
            </select>
          </div>

          {/* STATUS */}

          <div className="filter-group">
            <label htmlFor="status">
              Status
            </label>

            <select
              id="status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
            >
              <option value="">
                All Statuses
              </option>

              <option value="New">
                New
              </option>

              <option value="Under Review">
                Under Review
              </option>

              <option value="Assigned">
                Assigned
              </option>

              <option value="Resolved">
                Resolved
              </option>
            </select>
          </div>

          {/* ANIMAL TYPE */}

          <div className="filter-group">
            <label htmlFor="animalType">
              Animal Type
            </label>

            <select
              id="animalType"
              value={animalType}
              onChange={(e) =>
                setAnimalType(e.target.value)
              }
            >
              <option value="">
                All Animals
              </option>

              <option value="Dog">
                Dog
              </option>

              <option value="Cat">
                Cat
              </option>

              <option value="Bird">
                Bird
              </option>
            </select>
          </div>

        </div>
      </div>

      {/* ================= TICKET COUNT ================= */}

      <div className="ticket-count">
        Showing{" "}
        <strong>
          {filteredTickets.length}
        </strong>{" "}
        of{" "}
        <strong>
          {mockTickets.length}
        </strong>{" "}
        tickets
      </div>

      {/* ================= MAP ================= */}

      <div className="map-section">

        <h2>Rescue Location Map</h2>

        <div className="map-container">
          <DispatcherMap
            tickets={filteredTickets}
          />
        </div>

      </div>

      {/* ================= TICKET LIST ================= */}

      <div className="ticket-list-section">

        <h2>Rescue Tickets</h2>

        <TicketQueue
          tickets={filteredTickets}
          onTicketSelect={setSelectedTicket}
        />

      </div>

      {/* ================= TICKET DETAILS ================= */}

      {selectedTicket && (
        <div className="ticket-details-section">

          <TicketDetails
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
          />

        </div>
      )}

    </div>
  );
}