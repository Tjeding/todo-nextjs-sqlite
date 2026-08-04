import { listTasks } from "@/lib/taskRepository";
import { isSortField, SortField } from "@/lib/constants";
import TaskList from "@/components/TaskList";
import SortControls from "@/components/SortControls";

interface PageProps {
  searchParams: Promise<{ sort?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const { sort } = await searchParams;
  const sortBy: SortField = sort && isSortField(sort) ? sort : "dueDate";

  const tasks = listTasks({ archived: false, sortBy });

  return (
    <div className="page">
      <div className="page-header">
        <h1>Active Tasks</h1>
        <SortControls activeSort={sortBy} basePath="/" />
      </div>
      <TaskList tasks={tasks} emptyMessage="No active tasks. Create one to get started." />
    </div>
  );
}
