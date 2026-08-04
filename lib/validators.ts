import { isStatus } from "./constants";

export interface TaskInput {
  title: string;
  description: string;
  dueDate: string;
  topic: string;
  status?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof TaskInput, string>>;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function validateTaskInput(input: Partial<TaskInput>): ValidationResult {
  const errors: ValidationResult["errors"] = {};

  if (!input.title || !input.title.trim()) {
    errors.title = "Title is required.";
  }

  if (!input.topic || !input.topic.trim()) {
    errors.topic = "Topic is required.";
  }

  if (!input.dueDate || !DATE_RE.test(input.dueDate)) {
    errors.dueDate = "Due date is required and must be in YYYY-MM-DD format.";
  } else if (Number.isNaN(new Date(input.dueDate + "T00:00:00").getTime())) {
    errors.dueDate = "Due date is not a valid calendar date.";
  }

  if (input.status !== undefined && !isStatus(input.status)) {
    errors.status = "Status must be one of Todo, In-Progress, Complete.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
