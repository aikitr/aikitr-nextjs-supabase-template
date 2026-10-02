"use client";

import { useActionState } from "react";
import { Check, Trash2 } from "lucide-react";
import { deleteTodoAction, toggleTodoAction } from "@/lib/actions/todos";
import { initialActionState } from "@/lib/action-state";
import type { Database } from "@/types/database";
import { Button } from "@/components/ui/button";
import { ActionFeedback } from "@/components/forms/action-feedback";

type Todo = Database["public"]["Tables"]["todos"]["Row"];

export function TodoRow({ todo }: { todo: Todo }) {
  const [toggleState, toggleFormAction, togglePending] = useActionState(
    toggleTodoAction,
    initialActionState,
  );
  const [deleteState, deleteFormAction, deletePending] = useActionState(
    deleteTodoAction,
    initialActionState,
  );

  return (
    <li className="space-y-2">
      <div className="border-border/70 bg-background flex items-center gap-3 rounded-xl border px-3 py-3">
        <form action={toggleFormAction}>
          <input name="id" type="hidden" value={todo.id} />
          <input
            name="isComplete"
            type="hidden"
            value={String(!todo.is_complete)}
          />
          <button
            aria-label={todo.is_complete ? "重新打开待办" : "标记为已完成"}
            className={`focus-visible:ring-ring grid size-6 place-items-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 ${
              todo.is_complete
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-background hover:border-primary text-transparent"
            }`}
            disabled={togglePending}
            type="submit"
          >
            <Check aria-hidden="true" className="size-3.5" />
          </button>
        </form>
        <span
          className={`min-w-0 flex-1 text-sm ${
            todo.is_complete ? "text-muted-foreground line-through" : ""
          }`}
        >
          {todo.title}
        </span>
        <form action={deleteFormAction}>
          <input name="id" type="hidden" value={todo.id} />
          <Button
            aria-label={`删除：${todo.title}`}
            disabled={deletePending}
            size="icon-sm"
            type="submit"
            variant="ghost"
          >
            <Trash2 aria-hidden="true" />
          </Button>
        </form>
      </div>
      {toggleState.message ? <ActionFeedback state={toggleState} /> : null}
      {deleteState.message ? <ActionFeedback state={deleteState} /> : null}
    </li>
  );
}
