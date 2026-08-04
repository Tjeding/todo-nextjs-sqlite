"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createTask, updateTask, archiveTask } from "./taskRepository";
import { validateTaskInput } from "./validators";
import { isStatus } from "./constants";

function readTaskFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    dueDate: String(formData.get("dueDate") ?? ""),
    topic: String(formData.get("topic") ?? ""),
  };
}

export async function createTaskAction(formData: FormData) {
  const input = readTaskFields(formData);
  const { valid, errors } = validateTaskInput(input);

  if (!valid) {
    const query = new URLSearchParams({ error: Object.values(errors).join(" ") });
    redirect(`/create?${query.toString()}`);
  }

  createTask(input);
  revalidatePath("/");
  redirect("/");
}

export async function updateTaskAction(id: number, formData: FormData) {
  const input = readTaskFields(formData);
  const statusRaw = String(formData.get("status") ?? "");
  const status = isStatus(statusRaw) ? statusRaw : "Todo";

  const { valid, errors } = validateTaskInput({ ...input, status });
  if (!valid) {
    const query = new URLSearchParams({ error: Object.values(errors).join(" ") });
    redirect(`/edit/${id}?${query.toString()}`);
  }

  updateTask(id, { ...input, status });
  revalidatePath("/");
  revalidatePath(`/edit/${id}`);
  redirect("/");
}

export async function archiveTaskAction(id: number) {
  archiveTask(id);
  revalidatePath("/");
  revalidatePath("/archive");
  redirect("/");
}
