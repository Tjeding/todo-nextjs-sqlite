import { describe, it, expect } from "vitest";
import { validateTaskInput } from "@/lib/validators";

describe("validateTaskInput", () => {
  it("accepts a fully-formed task", () => {
    const result = validateTaskInput({
      title: "Do the thing",
      description: "optional",
      dueDate: "2026-12-01",
      topic: "Life",
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("rejects a missing title and a missing topic", () => {
    const result = validateTaskInput({ title: "  ", dueDate: "2026-12-01", topic: "" });
    expect(result.valid).toBe(false);
    expect(result.errors.title).toBeDefined();
    expect(result.errors.topic).toBeDefined();
  });

  it("rejects a due date that isn't YYYY-MM-DD", () => {
    const result = validateTaskInput({ title: "T", dueDate: "01/12/2026", topic: "Life" });
    expect(result.valid).toBe(false);
    expect(result.errors.dueDate).toBeDefined();
  });

  it("rejects a status outside the three fixed values", () => {
    const result = validateTaskInput({
      title: "T",
      dueDate: "2026-12-01",
      topic: "Life",
      status: "Overdue",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.status).toBeDefined();
  });
});
