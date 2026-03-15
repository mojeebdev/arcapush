import { auth } from "@/lib/auth-proxy";
import { NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/submit", "/pricing", "/dashboard"];
const POST_ONBOARDING_ROUTES = ["/submit", "/dashboard"];

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;
  const path = nextUrl.pathname;

  const needsAuth = PROTECTED_ROUTES.some((r) => path.startsWith(r));
  const needsOnboarding = POST_ONBOARDING_ROUTES.some((r) => path.startsWith(r));

  if (!needsAuth) return NextResponse.next();

  if (!session) {
    const signInUrl = new URL("/auth/signin", nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(signInUrl);
  }

  
  const onboardingComplete = (session.user as any)?.onboardingComplete === true;

  if (needsOnboarding && !onboardingComplete) {
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
