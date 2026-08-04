// The three fixed, non-customisable task statuses.
export const STATUSES = ["Todo", "In-Progress", "Complete"] as const;
export type Status = (typeof STATUSES)[number];

export function isStatus(value: string): value is Status {
  return (STATUSES as readonly string[]).includes(value);
}

export const SORT_FIELDS = ["topic", "status", "dueDate"] as const;
export type SortField = (typeof SORT_FIELDS)[number];

export function isSortField(value: string): value is SortField {
  return (SORT_FIELDS as readonly string[]).includes(value);
}
