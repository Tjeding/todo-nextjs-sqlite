import TaskForm from "@/components/TaskForm";
import { createTaskAction } from "@/lib/actions";

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function CreateTaskPage({ searchParams }: PageProps) {
  const { error } = await searchParams;

  return (
    <div className="page page-narrow">
      <h1>New Task</h1>
      <TaskForm action={createTaskAction} error={error} submitLabel="Create Task" />
    </div>
  );
}
