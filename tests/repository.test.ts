import { describe, it, expect } from "vitest";
import { createTask, updateTask, listTasks } from "@/lib/taskRepository";
import type { Status } from "@/lib/constants";

// Every task created here uses a unique topic marker so assertions are
// unaffected by tasks other test files may have left in tests/test.db.
const MARKER = `repo-test-${Date.now()}`;

describe("task repository", () => {
  it("creates a task with all four required fields and defaults status to Todo", () => {
    const task = createTask({
      title: "Write report",
      description: "First draft",
      dueDate: "2026-09-01",
      topic: MARKER,
    });

    expect(task.title).toBe("Write report");
    expect(task.description).toBe("First draft");
    expect(task.dueDate).toBe("2026-09-01");
    expect(task.topic).toBe(MARKER);
    expect(task.status).toBe("Todo");
    expect(task.archivedAt).toBeNull();
  });

  it("persists an edit so it is visible on a fresh read", () => {
    const created = createTask({
      title: "Original title",
      dueDate: "2026-09-02",
      topic: MARKER,
    });

    updateTask(created.id, {
      title: "Updated title",
      description: "Updated description",
      dueDate: "2026-10-05",
      topic: MARKER,
      status: "In-Progress",
    });

    const reread = listTasks({ archived: false }).find((t) => t.id === created.id);
    expect(reread?.title).toBe("Updated title");
    expect(reread?.status).toBe("In-Progress");
    expect(reread?.dueDate).toBe("2026-10-05");
  });

  it("sorts by status in fixed lifecycle order, not alphabetically", () => {
    createTask({ title: "A", dueDate: "2026-01-01", topic: MARKER, status: "Complete" as Status });
    createTask({ title: "B", dueDate: "2026-01-01", topic: MARKER, status: "Todo" as Status });
    createTask({ title: "C", dueDate: "2026-01-01", topic: MARKER, status: "In-Progress" as Status });

    const sorted = listTasks({ archived: false, sortBy: "status" }).filter((t) => t.topic === MARKER);
    const statusesInOrder = sorted.map((t) => t.status);

    // Todo must precede In-Progress, which must precede Complete, for every
    // pair of tasks sharing this marker - alphabetical order would put
    // Complete before In-Progress before Todo instead.
    const firstComplete = statusesInOrder.indexOf("Complete");
    const firstTodo = statusesInOrder.indexOf("Todo");
    const firstInProgress = statusesInOrder.indexOf("In-Progress");

    expect(firstTodo).toBeLessThan(firstInProgress);
    expect(firstInProgress).toBeLessThan(firstComplete);
  });

  it("sorts by due date ascending", () => {
    createTask({ title: "Later", dueDate: "2027-01-01", topic: `${MARKER}-dd` });
    createTask({ title: "Sooner", dueDate: "2026-01-01", topic: `${MARKER}-dd` });

    const sorted = listTasks({ archived: false, sortBy: "dueDate" }).filter((t) =>
      t.topic === `${MARKER}-dd`
    );

    expect(sorted[0].title).toBe("Sooner");
    expect(sorted[1].title).toBe("Later");
  });
});
