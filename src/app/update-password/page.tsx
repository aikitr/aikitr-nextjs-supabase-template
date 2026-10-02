import { redirect } from "next/navigation";
import { AuthPanel } from "@/components/auth/auth-panel";
import { PasswordForm } from "@/components/auth/password-form";
import { Brand } from "@/components/layout/brand";
import { getCurrentUser } from "@/lib/supabase/auth";

export default async function UpdatePasswordPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?error=invalid-link");
  }

  return (
    <main className="auth-background min-h-svh px-4 py-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
        <Brand />
        <AuthPanel
          description="设置新密码后即可继续使用你的账户。"
          title="设置新密码"
        >
          <PasswordForm mode="update" />
        </AuthPanel>
      </div>
    </main>
  );
}
