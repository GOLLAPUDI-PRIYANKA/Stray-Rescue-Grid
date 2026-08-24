type Status =
  | "critical"
  | "high"
  | "medium"
  | "low"
  | "pending"
  | "assigned"
  | "rescued";

interface StatusBadgeProps {
  status: Status;
}

const statusStyles: Record<Status, string> = {
  critical: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
  pending: "bg-slate-100 text-slate-700",
  assigned: "bg-blue-100 text-blue-700",
  rescued: "bg-green-100 text-green-700",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}