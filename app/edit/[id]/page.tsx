import { notFound } from "next/navigation";
import TaskForm from "@/components/TaskForm";
import { getTaskById } from "@/lib/taskRepository";
import { updateTaskAction } from "@/lib/actions";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function EditTaskPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { error } = await searchParams;

  const task = getTaskById(Number(id));
  if (!task) {
    notFound();
  }

  const boundAction = updateTaskAction.bind(null, task.id);

  return (
    <div className="page page-narrow">
      <h1>Edit Task</h1>
      <TaskForm action={boundAction} task={task} error={error} submitLabel="Save Changes" />
    </div>
  );
}
