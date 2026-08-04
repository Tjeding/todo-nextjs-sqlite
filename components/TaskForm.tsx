import { STATUSES } from "@/lib/constants";
import { Task } from "@/lib/taskRepository";

interface TaskFormProps {
  action: (formData: FormData) => void;
  task?: Task;
  error?: string;
  submitLabel: string;
}

export default function TaskForm({ action, task, error, submitLabel }: TaskFormProps) {
  return (
    <form action={action} className="task-form">
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <label className="form-field">
        <span>Title</span>
        <input type="text" name="title" defaultValue={task?.title} required />
      </label>

      <label className="form-field">
        <span>Description</span>
        <textarea name="description" defaultValue={task?.description} rows={4} />
      </label>

      <label className="form-field">
        <span>Due Date</span>
        <input type="date" name="dueDate" defaultValue={task?.dueDate} required />
      </label>

      <label className="form-field">
        <span>Topic</span>
        <input type="text" name="topic" defaultValue={task?.topic} required />
      </label>

      {task && (
        <label className="form-field">
          <span>Status</span>
          <select name="status" defaultValue={task.status}>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      )}

      <button type="submit" className="button button-primary">
        {submitLabel}
      </button>
    </form>
  );
}
