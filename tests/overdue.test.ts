import { describe, it, expect } from "vitest";
import { isOverdue } from "@/lib/overdue";

const REFERENCE_NOW = new Date("2026-08-04T12:00:00");

describe("isOverdue", () => {
  it("flags a task whose due date has passed and is not complete", () => {
    expect(isOverdue("2026-08-01", "Todo", REFERENCE_NOW)).toBe(true);
    expect(isOverdue("2026-08-01", "In-Progress", REFERENCE_NOW)).toBe(true);
  });

  it("does not flag a completed task even if its due date has passed", () => {
    expect(isOverdue("2026-08-01", "Complete", REFERENCE_NOW)).toBe(false);
  });

  it("does not flag a task due today or in the future", () => {
    expect(isOverdue("2026-08-04", "Todo", REFERENCE_NOW)).toBe(false);
    expect(isOverdue("2026-08-05", "Todo", REFERENCE_NOW)).toBe(false);
  });
});
