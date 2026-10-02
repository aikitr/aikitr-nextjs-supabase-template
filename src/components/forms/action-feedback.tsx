import { CircleAlert, CircleCheck } from "lucide-react";
import type { ActionState } from "@/lib/action-state";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ActionFeedback({ state }: { state: ActionState }) {
  if (state.status === "idle" || !state.message) {
    return null;
  }

  const isError = state.status === "error";

  return (
    <Alert
      className={isError ? "border-destructive/40" : "border-emerald-600/30"}
      variant={isError ? "destructive" : "default"}
    >
      {isError ? (
        <CircleAlert aria-hidden="true" />
      ) : (
        <CircleCheck aria-hidden="true" />
      )}
      <AlertDescription>{state.message}</AlertDescription>
    </Alert>
  );
}
