import Link from "next/link";
import { SortField } from "@/lib/constants";

const OPTIONS: { field: SortField; label: string }[] = [
  { field: "dueDate", label: "Due Date" },
  { field: "topic", label: "Topic" },
  { field: "status", label: "Status" },
];

export default function SortControls({ activeSort, basePath }: { activeSort: SortField; basePath: string }) {
  return (
    <div className="sort-controls" role="group" aria-label="Sort tasks">
      <span className="sort-label">Sort by:</span>
      {OPTIONS.map(({ field, label }) => (
        <Link
          key={field}
          href={`${basePath}?sort=${field}`}
          className={`sort-link ${activeSort === field ? "sort-link-active" : ""}`}
          aria-current={activeSort === field ? "true" : undefined}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
