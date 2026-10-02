const DASHBOARD_PATH = "/dashboard";
const APP_ORIGIN = "https://aikitr.invalid";

export function getSafeRedirectPath(value: unknown): string {
  if (typeof value !== "string") {
    return DASHBOARD_PATH;
  }

  const path = value.trim();

  if (
    !path.startsWith("/") ||
    path.startsWith("//") ||
    /[\\\u0000-\u001f\u007f]/.test(path) ||
    /%(?:2f|5c)/i.test(path)
  ) {
    return DASHBOARD_PATH;
  }

  try {
    const url = new URL(path, APP_ORIGIN);

    if (url.origin !== APP_ORIGIN) {
      return DASHBOARD_PATH;
    }

    // URL parsing normalizes encoded dot segments, so validate the normalized
    // path too before returning a redirect target.
    if (url.pathname.startsWith("//")) {
      return DASHBOARD_PATH;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return DASHBOARD_PATH;
  }
}
