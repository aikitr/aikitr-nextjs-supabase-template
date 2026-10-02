import { AuthForm } from "@/components/auth/auth-form";
import { AuthPanel } from "@/components/auth/auth-panel";
import { Brand } from "@/components/layout/brand";

export default function SignUpPage() {
  return (
    <main className="auth-background min-h-svh px-4 py-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
        <Brand />
        <AuthPanel
          description="创建账户后，你可以查看只属于自己的待办事项。"
          title="创建账户"
        >
          <AuthForm mode="signup" />
        </AuthPanel>
        <p className="text-muted-foreground text-center text-xs">
          注册后请按照邮件提示完成邮箱验证。
        </p>
      </div>
    </main>
  );
}
