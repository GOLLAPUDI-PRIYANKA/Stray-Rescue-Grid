import type {
  Priority,
  TicketStatus,
  AnimalType,
} from "../types/ticket";

interface FilterPanelProps {
  priority: Priority | "All";
  status: TicketStatus | "All";
  animalType: AnimalType | "All";

  onPriorityChange: (value: Priority | "All") => void;
  onStatusChange: (value: TicketStatus | "All") => void;
  onAnimalTypeChange: (value: AnimalType | "All") => void;

  onClear: () => void;
}

export default function FilterPanel({
  priority,
  status,
  animalType,
  onPriorityChange,
  onStatusChange,
  onAnimalTypeChange,
  onClear,
}: FilterPanelProps) {
  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow">

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Ticket Filters
        </h2>

        <button
          onClick={onClear}
          className="rounded-md border px-3 py-1 text-sm hover:bg-gray-100"
        >
          Clear Filters
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        {/* Priority */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Priority
          </label>

          <select
            value={priority}
            onChange={(e) =>
              onPriorityChange(
                e.target.value as Priority | "All"
              )
            }
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Normal">Normal</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Status
          </label>

          <select
            value={status}
            onChange={(e) =>
              onStatusChange(
                e.target.value as TicketStatus | "All"
              )
            }
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Under Review">Under Review</option>
            <option value="Assigned">Assigned</option>
            <option value="Accepted">Accepted</option>
            <option value="En Route">En Route</option>
            <option value="Rescued">Rescued</option>
            <option value="Referred">Referred</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Animal Type */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Animal Type
          </label>

          <select
            value={animalType}
            onChange={(e) =>
              onAnimalTypeChange(
                e.target.value as AnimalType | "All"
              )
            }
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="All">All Animals</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Bird">Bird</option>
            <option value="Other">Other</option>
          </select>
        </div>

      </div>
    </div>
  );
}