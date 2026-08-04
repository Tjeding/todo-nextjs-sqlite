import { listTasks } from "@/lib/taskRepository";
import { isSortField, SortField } from "@/lib/constants";
import TaskList from "@/components/TaskList";
import SortControls from "@/components/SortControls";

interface PageProps {
  searchParams: Promise<{ sort?: string }>;
}

export default async function ArchivePage({ searchParams }: PageProps) {
  const { sort } = await searchParams;
  const sortBy: SortField = sort && isSortField(sort) ? sort : "dueDate";

  const tasks = listTasks({ archived: true, sortBy });

  return (
    <div className="page">
      <div className="page-header">
        <h1>Archived Tasks</h1>
        <SortControls activeSort={sortBy} basePath="/archive" />
      </div>
      <TaskList tasks={tasks} emptyMessage="No archived tasks yet." />
    </div>
  );
}
