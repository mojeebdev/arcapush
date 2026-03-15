import { auth } from "@/lib/auth-middleware";
import { NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/submit", "/pricing", "/dashboard"];
const POST_ONBOARDING_ROUTES = ["/submit", "/dashboard"];

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;
  const path = nextUrl.pathname;

  
  console.log("🔍 MIDDLEWARE HIT:", path);
  console.log("🔍 SESSION:", JSON.stringify(session));
  console.log("🔍 ALL COOKIES:", req.cookies.getAll().map(c => `${c.name}=${c.value}`).join(", "));

  const needsAuth = PROTECTED_ROUTES.some((r) => path.startsWith(r));
  const needsOnboarding = POST_ONBOARDING_ROUTES.some((r) => path.startsWith(r));

  if (!needsAuth) return NextResponse.next();

  if (!session) {
    const signInUrl = new URL("/auth/signin", nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", path);
    console.log("🔍 REDIRECTING TO SIGNIN - no session");
    return NextResponse.redirect(signInUrl);
  }

  const onboardingComplete = req.cookies.get("onboarding_complete")?.value === "true";
  console.log("🔍 onboarding_complete cookie:", onboardingComplete);

  if (needsOnboarding && !onboardingComplete) {
    console.log("🔍 REDIRECTING TO ONBOARDING - not complete");
    return NextResponse.redirect(new URL("/onboarding", nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/submit/:path*",
    "/pricing/:path*",
    "/dashboard/:path*",
    "/onboarding/:path*",
  ],
};