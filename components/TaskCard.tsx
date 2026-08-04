import Link from "next/link";
import { Task } from "@/lib/taskRepository";
import { isOverdue } from "@/lib/overdue";
import StatusBadge from "./StatusBadge";
import OverdueBadge from "./OverdueBadge";
import { archiveTaskAction } from "@/lib/actions";

export default function TaskCard({ task }: { task: Task }) {
  const overdue = isOverdue(task.dueDate, task.status);
  const isArchived = task.archivedAt !== null;

  return (
    <li className={`task-card ${overdue ? "task-card-overdue" : ""}`}>
      <div className="task-card-main">
        <div className="task-card-title-row">
          <h3 className="task-card-title">{task.title}</h3>
          <StatusBadge status={task.status} />
          {overdue && <OverdueBadge />}
        </div>
        {task.description && <p className="task-card-description">{task.description}</p>}
        <dl className="task-card-meta">
          <div>
            <dt>Topic</dt>
            <dd>{task.topic}</dd>
          </div>
          <div>
            <dt>Due</dt>
            <dd>{task.dueDate}</dd>
          </div>
        </dl>
      </div>
      {!isArchived && (
        <div className="task-card-actions">
          <Link href={`/edit/${task.id}`} className="button button-secondary">
            Edit
          </Link>
          <form action={archiveTaskAction.bind(null, task.id)}>
            <button type="submit" className="button button-danger">
              Archive
            </button>
          </form>
        </div>
      )}
    </li>
  );
}
