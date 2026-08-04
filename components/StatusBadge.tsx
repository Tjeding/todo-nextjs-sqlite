import { Status } from "@/lib/constants";

const STATUS_CLASS: Record<Status, string> = {
  Todo: "status-todo",
  "In-Progress": "status-in-progress",
  Complete: "status-complete",
};

export default function StatusBadge({ status }: { status: Status }) {
  return <span className={`status-badge ${STATUS_CLASS[status]}`}>{status}</span>;
}
