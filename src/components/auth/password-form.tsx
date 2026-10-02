"use client";

import Link from "next/link";
import { useActionState } from "react";
import { initialActionState } from "@/lib/action-state";
import {
  requestPasswordResetAction,
  updatePasswordAction,
} from "@/lib/actions/auth";
import { ActionFeedback } from "@/components/forms/action-feedback";
import { SubmitButton } from "@/components/forms/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PasswordForm({ mode }: { mode: "request" | "update" }) {
  const action =
    mode === "request" ? requestPasswordResetAction : updatePasswordAction;
  const [state, formAction] = useActionState(action, initialActionState);
  const isRequest = mode === "request";

  return (
    <form action={formAction} className="space-y-5">
      {state.message ? <ActionFeedback state={state} /> : null}

      {isRequest ? (
        <div className="space-y-2">
          <Label htmlFor="reset-email">邮箱</Label>
          <Input
            autoComplete="email"
            autoFocus
            id="reset-email"
            name="email"
            placeholder="name@example.com"
            required
            type="email"
          />
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="new-password">新密码</Label>
            <Input
              autoComplete="new-password"
              id="new-password"
              minLength={8}
              name="password"
              required
              type="password"
            />
            <p className="text-muted-foreground text-xs">至少 8 个字符</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-new-password">确认新密码</Label>
            <Input
              autoComplete="new-password"
              id="confirm-new-password"
              minLength={8}
              name="confirmPassword"
              required
              type="password"
            />
          </div>
        </>
      )}

      <SubmitButton pendingLabel={isRequest ? "正在发送…" : "正在更新…"}>
        {isRequest ? "发送重置邮件" : "更新密码"}
      </SubmitButton>

      <p className="text-muted-foreground text-center text-sm">
        <Button
          className="h-auto p-0 text-sm font-medium"
          render={<Link href="/login" />}
          variant="link"
        >
          返回登录
        </Button>
      </p>
    </form>
  );
}
