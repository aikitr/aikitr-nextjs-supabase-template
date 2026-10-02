import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { getSafeRedirectPath } from "@/lib/redirects";
import { getSiteUrl } from "@/lib/site-url";
import { createClient } from "@/lib/supabase/server";

const supportedOtpTypes = new Set<EmailOtpType>([
  "email",
  "signup",
  "recovery",
]);

function redirectToSite(path: string) {
  const response = NextResponse.redirect(new URL(path, getSiteUrl()));
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const nextPath = getSafeRedirectPath(requestUrl.searchParams.get("next"));
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const otpType = requestUrl.searchParams.get("type");
  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return redirectToSite(nextPath);
    }
  } else if (
    tokenHash &&
    otpType &&
    supportedOtpTypes.has(otpType as EmailOtpType)
  ) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: otpType as EmailOtpType,
    });

    if (!error) {
      return redirectToSite(nextPath);
    }
  }

  return redirectToSite("/login?error=invalid-link");
}
