import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "请输入邮箱地址")
  .email("请输入有效的邮箱地址");

export const passwordSchema = z
  .string()
  .min(8, "密码至少需要 8 个字符")
  .max(128, "密码不能超过 128 个字符");

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "请输入密码").max(128, "密码不能超过 128 个字符"),
});

export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
  });

export const passwordResetRequestSchema = z.object({ email: emailSchema });

export const passwordUpdateSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
  });

export const todoTitleSchema = z
  .string()
  .trim()
  .min(1, "请输入待办事项")
  .max(200, "待办事项不能超过 200 个字符");

export function readStringField(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}
