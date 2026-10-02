"use client";

import { useActionState } from "react";
import { Plus } from "lucide-react";
import { createTodoAction } from "@/lib/actions/todos";
import { initialActionState } from "@/lib/action-state";
import { ActionFeedback } from "@/components/forms/action-feedback";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";

export function TodoForm() {
  const [state, formAction] = useActionState(
    createTodoAction,
    initialActionState,
  );

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          aria-label="新的待办事项"
          autoComplete="off"
          maxLength={200}
          name="title"
          placeholder="例如：完善 Supabase 数据访问层"
          required
        />
        <SubmitButton className="w-full sm:w-auto" pendingLabel="正在添加…">
          <Plus aria-hidden="true" />
          添加待办
        </SubmitButton>
      </div>
      {state.message ? <ActionFeedback state={state} /> : null}
    </form>
  );
}
