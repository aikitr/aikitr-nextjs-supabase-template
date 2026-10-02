import "server-only";

import { redirect } from "next/navigation";
import { getSafeRedirectPath } from "@/lib/redirects";
import { createClient } from "./server";

export type CurrentUser = {
  id: string;
  email: string | null;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data) {
    return null;
  }

  const subject = data.claims?.sub;

  if (typeof subject !== "string") {
    return null;
  }

  return {
    id: subject,
    email: typeof data.claims.email === "string" ? data.claims.email : null,
  };
}

export async function requireUser(nextPath = "/dashboard") {
  const user = await getCurrentUser();

  if (!user) {
    const safeNextPath = getSafeRedirectPath(nextPath);
    redirect(`/login?next=${encodeURIComponent(safeNextPath)}`);
  }

  return user;
}
