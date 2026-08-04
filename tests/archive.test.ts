import { describe, it, expect } from "vitest";
import { createTask, archiveTask, getTaskById, listTasks } from "@/lib/taskRepository";

const MARKER = `archive-test-${Date.now()}`;

describe("archiving", () => {
  it("removes a task from the active list but keeps it viewable, never deleting it", () => {
    const task = createTask({ title: "Archive me", dueDate: "2026-06-01", topic: MARKER });

    archiveTask(task.id);

    const active = listTasks({ archived: false }).filter((t) => t.topic === MARKER);
    const archived = listTasks({ archived: true }).filter((t) => t.topic === MARKER);
    const stillExists = getTaskById(task.id);

    expect(active.find((t) => t.id === task.id)).toBeUndefined();
    expect(archived.find((t) => t.id === task.id)).toBeDefined();
    expect(stillExists).toBeDefined();
    expect(stillExists?.title).toBe("Archive me");
  });

  it("is represented as a timestamp on the same row, not a copy elsewhere", () => {
    const task = createTask({ title: "Check representation", dueDate: "2026-06-02", topic: MARKER });
    expect(task.archivedAt).toBeNull();

    const archived = archiveTask(task.id);

    expect(archived?.id).toBe(task.id);
    expect(archived?.archivedAt).not.toBeNull();
  });

  it("is idempotent: archiving twice does not change the original archived_at twice over", () => {
    const task = createTask({ title: "Double archive", dueDate: "2026-06-03", topic: MARKER });

    const firstArchive = archiveTask(task.id);
    const secondArchive = archiveTask(task.id);

    expect(firstArchive?.archivedAt).toBe(secondArchive?.archivedAt);
  });
});
