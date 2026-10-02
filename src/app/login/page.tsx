import { AuthForm } from "@/components/auth/auth-form";
import { AuthPanel } from "@/components/auth/auth-panel";
import { Brand } from "@/components/layout/brand";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getSafeRedirectPath } from "@/lib/redirects";

type LoginPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = getSafeRedirectPath(params.next);

  return (
    <main className="auth-background min-h-svh px-4 py-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
        <Brand />
        <AuthPanel
          description="登录后继续体验这套 Next.js 与 Supabase 起步模板。"
          title="欢迎回来"
        >
          <div className="space-y-5">
            {params.error === "invalid-link" ? (
              <Alert variant="destructive">
                <AlertDescription>
                  验证链接无效或已过期，请重新登录或申请新的重置邮件。
                </AlertDescription>
              </Alert>
            ) : null}
            <AuthForm mode="login" nextPath={nextPath} />
          </div>
        </AuthPanel>
        <p className="text-muted-foreground text-center text-xs">
          继续即表示你已阅读本项目的隐私和使用说明。
        </p>
      </div>
    </main>
  );
}
