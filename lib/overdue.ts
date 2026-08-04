import { Status } from "./constants";

/**
 * A task is overdue when its due date is strictly before the start of
 * today, and it has not been completed. This is derived at read time
 * (never stored) so it can never go stale relative to due_date/status.
 *
 * `now` is injectable so tests are deterministic instead of depending on
 * the real system clock.
 */
export function isOverdue(dueDate: string, status: Status, now: Date = new Date()): boolean {
  if (status === "Complete") return false;

  const due = new Date(dueDate + "T00:00:00");
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return due.getTime() < startOfToday.getTime();
}
