import { Check, ListChecks } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { TodoForm } from "@/components/dashboard/todo-form";
import { TodoRow } from "@/components/dashboard/todo-row";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/actions/auth";
import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const user = await requireUser("/dashboard");
  const supabase = await createClient();
  const { data: todos, error } = await supabase
    .from("todos")
    .select("id, user_id, title, is_complete, created_at")
    .order("created_at", { ascending: false });

  const todoList = todos ?? [];
  const completedCount = todoList.filter((todo) => todo.is_complete).length;

  return (
    <main className="bg-muted/40 min-h-svh">
      <header className="border-border/70 bg-background/90 border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Brand />
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground hidden max-w-52 truncate text-sm sm:inline">
              {user.email}
            </span>
            <form action={signOutAction}>
              <Button size="sm" type="submit" variant="outline">
                退出登录
              </Button>
            </form>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-primary mb-2 text-sm font-medium">
              Supabase 数据示例
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              你的待办事项
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-6">
              数据通过服务端操作写入，并由 Postgres RLS 按用户隔离。
            </p>
          </div>
          <div className="border-border/70 bg-background text-muted-foreground flex items-center gap-2 rounded-full border px-3 py-2 text-sm">
            <Check aria-hidden="true" className="size-4 text-emerald-600" />
            已完成 {completedCount} / {todoList.length}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
          <section className="border-border/70 bg-background rounded-2xl border p-4 shadow-sm sm:p-6">
            <TodoForm />
            {error ? (
              <Alert className="mt-5" variant="destructive">
                <AlertTitle>暂时无法读取待办事项</AlertTitle>
                <AlertDescription>
                  请确认已连接 Supabase 项目并应用仓库中的数据库迁移。
                </AlertDescription>
              </Alert>
            ) : todoList.length ? (
              <ul className="mt-5 space-y-2">
                {todoList.map((todo) => (
                  <TodoRow key={todo.id} todo={todo} />
                ))}
              </ul>
            ) : (
              <div className="border-border mt-5 rounded-xl border border-dashed px-5 py-10 text-center">
                <span className="bg-muted text-muted-foreground mx-auto mb-3 grid size-10 place-items-center rounded-full">
                  <ListChecks aria-hidden="true" className="size-5" />
                </span>
                <h2 className="text-sm font-medium">这里还没有待办事项</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  添加一条内容，开始体验受保护的数据读写。
                </p>
              </div>
            )}
          </section>

          <aside className="border-border/70 bg-background h-fit rounded-2xl border p-5 shadow-sm">
            <p className="text-sm font-semibold">示例包含</p>
            <ul className="text-muted-foreground mt-4 space-y-3 text-sm leading-5">
              <li>邮箱确认、登录和密码重置</li>
              <li>通过 Server Actions 创建和更新数据</li>
              <li>Postgres RLS 限制用户只能访问自己的记录</li>
            </ul>
          </aside>
        </div>
      </section>
    </main>
  );
}
