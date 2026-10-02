import { describe, expect, it } from "vitest";
import { getSafeRedirectPath } from "./redirects";

describe("getSafeRedirectPath", () => {
  it("keeps a valid local path and its query string", () => {
    expect(getSafeRedirectPath("/dashboard?tab=active")).toBe(
      "/dashboard?tab=active",
    );
  });

  it.each([
    "https://example.com",
    "//example.com",
    "/\\example.com",
    "/%2f%2fexample.com",
    "/%2e%2e//example.com",
    "javascript:alert(1)",
  ])("uses the fallback for an unsafe path: %s", (path) => {
    expect(getSafeRedirectPath(path)).toBe("/dashboard");
  });

  it("uses the fallback for missing or non-string values", () => {
    expect(getSafeRedirectPath(null)).toBe("/dashboard");
    expect(getSafeRedirectPath(42)).toBe("/dashboard");
  });
});
