import { describe, expect, it } from "vitest";
import {
  emailSchema,
  passwordSchema,
  signInSchema,
  todoTitleSchema,
} from "./validation";

describe("authentication validation", () => {
  it("accepts trimmed email addresses and non-empty sign-in passwords", () => {
    expect(
      signInSchema.safeParse({ email: " user@example.com ", password: "x" })
        .success,
    ).toBe(true);
  });

  it("rejects invalid email addresses", () => {
    expect(emailSchema.safeParse("not-an-email").success).toBe(false);
  });

  it("requires a reasonable password length for signup and recovery", () => {
    expect(passwordSchema.safeParse("short").success).toBe(false);
    expect(passwordSchema.safeParse("correct-horse-battery").success).toBe(
      true,
    );
  });
});

describe("todo title validation", () => {
  it("trims valid titles", () => {
    expect(todoTitleSchema.parse("  Buy milk  ")).toBe("Buy milk");
  });

  it("rejects blank and overly long titles", () => {
    expect(todoTitleSchema.safeParse("   ").success).toBe(false);
    expect(todoTitleSchema.safeParse("x".repeat(201)).success).toBe(false);
  });
});
