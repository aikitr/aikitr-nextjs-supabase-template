import "server-only";

export function getSiteUrl(): string {
  const value = process.env.SITE_URL?.trim() || "http://localhost:3000";

  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("SITE_URL must use http or https.");
    }

    return url.origin;
  } catch {
    throw new Error("SITE_URL must be a valid absolute http(s) URL.");
  }
}

export function getAuthCallbackUrl(nextPath: string): string {
  const callbackUrl = new URL("/auth/callback", getSiteUrl());
  callbackUrl.searchParams.set("next", nextPath);
  return callbackUrl.toString();
}
