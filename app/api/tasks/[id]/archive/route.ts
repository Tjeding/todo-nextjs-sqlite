import { NextRequest, NextResponse } from "next/server";
import { archiveTask } from "@/lib/taskRepository";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const task = archiveTask(Number(id));

  if (!task) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  return NextResponse.json({ task });
}
