"use server";

import { redirect } from "next/navigation";
import { getAuthCallbackUrl } from "@/lib/site-url";
import { getSafeRedirectPath } from "@/lib/redirects";
import type { ActionState } from "@/lib/action-state";
import {
  passwordResetRequestSchema,
  passwordUpdateSchema,
  readStringField,
  signInSchema,
  signUpSchema,
} from "@/lib/validation";
import { createClient } from "@/lib/supabase/server";

export async function signInAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = signInSchema.safeParse({
    email: readStringField(formData, "email"),
    password: readStringField(formData, "password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "请检查输入内容",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { status: "error", message: "邮箱或密码不正确，请重试。" };
  }

  redirect(getSafeRedirectPath(readStringField(formData, "next")));
}

export async function signUpAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = signUpSchema.safeParse({
    email: readStringField(formData, "email"),
    password: readStringField(formData, "password"),
    confirmPassword: readStringField(formData, "confirmPassword"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "请检查输入内容",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { emailRedirectTo: getAuthCallbackUrl("/dashboard") },
  });

  if (error) {
    return { status: "error", message: "暂时无法创建账户，请稍后重试。" };
  }

  if (data.session) {
    redirect("/dashboard");
  }

  return {
    status: "success",
    message: "如果邮箱确认已启用，请查收确认邮件并完成验证。",
  };
}

export async function requestPasswordResetAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = passwordResetRequestSchema.safeParse({
    email: readStringField(formData, "email"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "请检查邮箱地址",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    {
      redirectTo: getAuthCallbackUrl("/update-password"),
    },
  );

  if (error) {
    return { status: "error", message: "暂时无法发送重置邮件，请稍后重试。" };
  }

  return {
    status: "success",
    message: "如果该邮箱已注册，你会收到密码重置邮件。",
  };
}

export async function updatePasswordAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = passwordUpdateSchema.safeParse({
    password: readStringField(formData, "password"),
    confirmPassword: readStringField(formData, "confirmPassword"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "请检查密码",
    };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (
    claimsError ||
    !claimsData ||
    typeof claimsData.claims?.sub !== "string"
  ) {
    return { status: "error", message: "重置链接无效或已过期，请重新申请。" };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return {
      status: "error",
      message: "暂时无法更新密码，请重新申请重置邮件。",
    };
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
