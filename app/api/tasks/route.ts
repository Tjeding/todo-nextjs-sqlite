import { NextRequest, NextResponse } from "next/server";
import { createTask, listTasks } from "@/lib/taskRepository";
import { validateTaskInput } from "@/lib/validators";
import { isSortField } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const archivedParam = searchParams.get("archived");
  const sortParam = searchParams.get("sort") ?? "dueDate";

  const sortBy = isSortField(sortParam) ? sortParam : "dueDate";
  const archived = archivedParam === "true";

  const tasks = listTasks({ archived, sortBy });
  return NextResponse.json({ tasks });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { valid, errors } = validateTaskInput(body);

  if (!valid) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const task = createTask({
    title: body.title,
    description: body.description ?? "",
    dueDate: body.dueDate,
    topic: body.topic,
  });

  return NextResponse.json({ task }, { status: 201 });
}
