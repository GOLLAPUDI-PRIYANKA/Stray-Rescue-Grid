import { useState } from "react";
import TicketQueue from "../components/TicketQueue";
import { mockTickets } from "../data/mockTickets";
import type { Ticket } from "../types/ticket";

export default function DispatcherDashboard() {
  const [tickets] = useState<Ticket[]>(mockTickets);

  const [selectedTicket, setSelectedTicket] =
    useState<Ticket | null>(null);

  const openCount = tickets.filter(
    (ticket) => ticket.status !== "Closed"
  ).length;

  const criticalCount = tickets.filter(
    (ticket) => ticket.priority_level === "Critical"
  ).length;

  const completedCount = tickets.filter(
    (ticket) => ticket.status === "Rescued"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100">

      <header className="border-b bg-white px-6 py-4">
        <h1 className="text-2xl font-bold">
          Dispatcher Command Center
        </h1>

        <p className="text-sm text-gray-500">
          Stray Animal Rescue & Veterinary Dispatch Grid
        </p>
      </header>

      <main className="p-6">

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="rounded-lg bg-white p-5 shadow">
            <p className="text-sm text-gray-500">
              Open Cases
            </p>

            <p className="mt-2 text-3xl font-bold">
              {openCount}
            </p>
          </div>

          <div className="rounded-lg bg-white p-5 shadow">
            <p className="text-sm text-gray-500">
              Critical Cases
            </p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {criticalCount}
            </p>
          </div>

          <div className="rounded-lg bg-white p-5 shadow">
            <p className="text-sm text-gray-500">
              Completed Rescues
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {completedCount}
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          <section className="rounded-lg bg-gray-50 p-4">

            <div className="mb-4 flex justify-between">
              <h2 className="text-lg font-semibold">
                Rescue Tickets
              </h2>

              <span className="text-sm text-gray-500">
                {tickets.length} tickets
              </span>
            </div>

            <TicketQueue
              tickets={tickets}
              onTicketSelect={setSelectedTicket}
            />

          </section>

          <section className="flex min-h-[500px] items-center justify-center rounded-lg bg-gray-200">

            <div className="text-center">
              <p className="text-4xl">🗺️</p>

              <h2 className="mt-3 text-lg font-semibold">
                Live Rescue Map
              </h2>

              <p className="text-sm text-gray-500">
                Map will be added in Task 3.
              </p>
            </div>

          </section>

        </div>

        {selectedTicket && (
          <section className="mt-6 rounded-lg bg-white p-6 shadow">

            <div className="flex justify-between">

              <h2 className="text-xl font-bold">
                {selectedTicket.ticket_code}
              </h2>

              <button
                onClick={() => setSelectedTicket(null)}
                className="rounded px-3 py-1 hover:bg-gray-100"
              >
                Close
              </button>

            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">

              <div>
                <p className="text-sm text-gray-500">
                  Animal
                </p>

                <p className="font-medium">
                  {selectedTicket.animal_type}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Priority
                </p>

                <p className="font-medium">
                  {selectedTicket.priority_level}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Status
                </p>

                <p className="font-medium">
                  {selectedTicket.status}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Location
                </p>

                <p className="font-medium">
                  {selectedTicket.address}
                </p>
              </div>

            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Description
              </p>

              <p>
                {selectedTicket.description}
              </p>
            </div>

          </section>
        )}

      </main>
    </div>
  );
}