"use client";

import Link from "next/link";
import { useActionState } from "react";
import { initialActionState } from "@/lib/action-state";
import { signInAction, signUpAction } from "@/lib/actions/auth";
import { ActionFeedback } from "@/components/forms/action-feedback";
import { SubmitButton } from "@/components/forms/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthForm({
  mode,
  nextPath = "/dashboard",
}: {
  mode: "login" | "signup";
  nextPath?: string;
}) {
  const action = mode === "login" ? signInAction : signUpAction;
  const [state, formAction] = useActionState(action, initialActionState);
  const isLogin = mode === "login";

  return (
    <form action={formAction} className="space-y-5">
      {isLogin ? <input name="next" type="hidden" value={nextPath} /> : null}
      {state.message ? <ActionFeedback state={state} /> : null}

      <div className="space-y-2">
        <Label htmlFor={`${mode}-email`}>邮箱</Label>
        <Input
          autoComplete="email"
          autoFocus
          id={`${mode}-email`}
          name="email"
          placeholder="name@example.com"
          required
          type="email"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor={`${mode}-password`}>密码</Label>
          {isLogin ? (
            <Link
              className="text-muted-foreground hover:text-foreground text-xs underline-offset-4 hover:underline"
              href="/forgot-password"
            >
              忘记密码？
            </Link>
          ) : null}
        </div>
        <Input
          autoComplete={isLogin ? "current-password" : "new-password"}
          id={`${mode}-password`}
          minLength={isLogin ? 1 : 8}
          name="password"
          required
          type="password"
        />
        {!isLogin ? (
          <p className="text-muted-foreground text-xs">至少 8 个字符</p>
        ) : null}
      </div>

      {!isLogin ? (
        <div className="space-y-2">
          <Label htmlFor="signup-confirm-password">确认密码</Label>
          <Input
            autoComplete="new-password"
            id="signup-confirm-password"
            minLength={8}
            name="confirmPassword"
            required
            type="password"
          />
        </div>
      ) : null}

      <SubmitButton pendingLabel={isLogin ? "正在登录…" : "正在创建账户…"}>
        {isLogin ? "登录" : "创建账户"}
      </SubmitButton>

      <p className="text-muted-foreground text-center text-sm">
        {isLogin ? "还没有账户？" : "已经有账户了？"}{" "}
        <Button
          className="h-auto p-0 text-sm font-medium"
          render={<Link href={isLogin ? "/sign-up" : "/login"} />}
          variant="link"
        >
          {isLogin ? "立即注册" : "返回登录"}
        </Button>
      </p>
    </form>
  );
}
