import { NextRequest, NextResponse } from "next/server";
import { getTaskById, updateTask } from "@/lib/taskRepository";
import { validateTaskInput } from "@/lib/validators";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const task = getTaskById(Number(id));

  if (!task) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  return NextResponse.json({ task });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();

  const { valid, errors } = validateTaskInput({ ...body, status: body.status });
  if (!valid) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const task = updateTask(Number(id), {
    title: body.title,
    description: body.description ?? "",
    dueDate: body.dueDate,
    topic: body.topic,
    status: body.status,
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  return NextResponse.json({ task });
}
