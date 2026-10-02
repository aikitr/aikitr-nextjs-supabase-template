"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/action-state";
import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { readStringField, todoTitleSchema } from "@/lib/validation";
import { z } from "zod";

const todoIdSchema = z.string().uuid();

function invalidTodoState(message: string): ActionState {
  return { status: "error", message };
}

export async function createTodoAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsedTitle = todoTitleSchema.safeParse(
    readStringField(formData, "title"),
  );

  if (!parsedTitle.success) {
    return invalidTodoState(
      parsedTitle.error.issues[0]?.message ?? "请检查待办事项",
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("todos").insert({
    title: parsedTitle.data,
    user_id: user.id,
  });

  if (error) {
    return invalidTodoState("暂时无法保存待办事项，请稍后重试。");
  }

  revalidatePath("/dashboard");
  return { status: "success", message: "" };
}

export async function toggleTodoAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsedId = todoIdSchema.safeParse(readStringField(formData, "id"));
  const nextValue = readStringField(formData, "isComplete");

  if (!parsedId.success || (nextValue !== "true" && nextValue !== "false")) {
    return invalidTodoState("无效的待办事项。");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("todos")
    .update({ is_complete: nextValue === "true" })
    .eq("id", parsedId.data)
    .eq("user_id", user.id)
    .select("id");

  if (error) {
    return invalidTodoState("暂时无法更新待办事项，请稍后重试。");
  }

  if (!data.length) {
    return invalidTodoState("待办事项不存在，或你没有权限操作。");
  }

  revalidatePath("/dashboard");
  return { status: "success", message: "" };
}

export async function deleteTodoAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsedId = todoIdSchema.safeParse(readStringField(formData, "id"));

  if (!parsedId.success) {
    return invalidTodoState("无效的待办事项。");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("todos")
    .delete()
    .eq("id", parsedId.data)
    .eq("user_id", user.id)
    .select("id");

  if (error) {
    return invalidTodoState("暂时无法删除待办事项，请稍后重试。");
  }

  if (!data.length) {
    return invalidTodoState("待办事项不存在，或你没有权限操作。");
  }

  revalidatePath("/dashboard");
  return { status: "success", message: "" };
}
