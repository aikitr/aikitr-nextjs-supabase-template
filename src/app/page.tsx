import Link from "next/link";
import { ArrowUpRight, Database, LockKeyhole, Sparkles } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: LockKeyhole,
    title: "认证已打底",
    description: "邮箱注册、确认、登录、登出和密码重置流程。",
  },
  {
    icon: Database,
    title: "数据按用户隔离",
    description: "待办示例通过 Postgres RLS 限制每位用户的数据范围。",
  },
  {
    icon: Sparkles,
    title: "组件从这里开始",
    description: "shadcn/ui 与 Tailwind CSS 已配置，可按需添加组件。",
  },
];

export default function Home() {
  return (
    <main className="bg-background min-h-svh overflow-hidden">
      <div className="landing-grid pointer-events-none absolute inset-x-0 top-0 h-[620px]" />
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Brand />
        <nav aria-label="主导航" className="flex items-center gap-2">
          <Button
            className="hidden sm:inline-flex"
            render={<Link href="/login" />}
            variant="ghost"
          >
            登录
          </Button>
          <Button render={<Link href="/sign-up" />}>开始使用</Button>
        </nav>
      </header>

      <section className="relative mx-auto max-w-6xl px-4 pt-16 pb-16 sm:px-6 sm:pt-24 sm:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="border-border/70 bg-background/80 text-muted-foreground mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium shadow-sm">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Next.js 16 · shadcn/ui · Supabase
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            从可靠的基础开始，
            <span className="text-muted-foreground block">
              专注构建你的产品。
            </span>
          </h1>
          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-base leading-7 text-pretty sm:text-lg sm:leading-8">
            一个轻量的 Next.js
            全栈模板，包含服务端认证、用户数据隔离和可扩展的组件基础。
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              className="h-10 px-4"
              render={<Link href="/sign-up" />}
              size="lg"
            >
              创建账户
              <ArrowUpRight aria-hidden="true" />
            </Button>
            <Button
              className="h-10 px-4"
              render={<Link href="/dashboard" />}
              size="lg"
              variant="outline"
            >
              查看示例仪表盘
            </Button>
          </div>
          <p className="text-muted-foreground mt-4 text-xs">
            开始前请先在 README 中配置 Supabase 项目。
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-4 sm:grid-cols-3 sm:gap-5">
          {features.map(({ icon: Icon, title, description }) => (
            <Card
              className="border-border/70 bg-background/90 shadow-sm shadow-slate-950/5"
              key={title}
            >
              <CardHeader className="gap-3">
                <span className="bg-primary/5 text-primary grid size-9 place-items-center rounded-xl">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-6">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-border/60 border-t">
        <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>Aikitr · 可复用的全栈应用起步模板</span>
          <Link className="hover:text-foreground" href="/dashboard">
            打开待办事项示例
          </Link>
        </div>
      </footer>
    </main>
  );
}
