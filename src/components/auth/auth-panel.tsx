import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AuthPanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card className="border-border/70 mx-auto w-full max-w-md shadow-lg shadow-slate-950/5">
      <CardHeader className="gap-2 px-6 pt-7">
        <CardTitle className="text-2xl tracking-tight">{title}</CardTitle>
        <CardDescription className="text-sm leading-6">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-7">{children}</CardContent>
    </Card>
  );
}
