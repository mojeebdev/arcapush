import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";


const PROTECTED_ROUTES = ["/submit", "/pricing", "/dashboard"];


const POST_ONBOARDING_ROUTES = ["/submit", "/dashboard"];

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const path = nextUrl.pathname;

 
  const needsAuth = PROTECTED_ROUTES.some((r) => path.startsWith(r));
  const needsOnboarding = POST_ONBOARDING_ROUTES.some((r) => path.startsWith(r));

  if (!needsAuth) return NextResponse.next();

  
  if (!session) {
    const signInUrl = new URL("/auth/signin", nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(signInUrl);
  }

 
  if (needsOnboarding && !(session.user as any)?.onboardingComplete) {
    if (!path.startsWith("/onboarding")) {
      return NextResponse.redirect(new URL("/onboarding", nextUrl.origin));
    }
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