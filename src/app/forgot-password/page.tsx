import { AuthPanel } from "@/components/auth/auth-panel";
import { PasswordForm } from "@/components/auth/password-form";
import { Brand } from "@/components/layout/brand";

export default function ForgotPasswordPage() {
  return (
    <main className="auth-background min-h-svh px-4 py-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
        <Brand />
        <AuthPanel
          description="填写注册邮箱。如果账户存在，我们会发送密码重置链接。"
          title="找回密码"
        >
          <PasswordForm mode="request" />
        </AuthPanel>
      </div>
    </main>
  );
}
