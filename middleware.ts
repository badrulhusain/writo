import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(publicRoutes);
const isAuthRoute = createRouteMatcher(authRoutes);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { nextUrl } = req;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

  // 1. If it's an API auth route (like /api/auth/...), let it pass (though we might not need this with Clerk)
  if (isApiAuthRoute) {
      return; 
  }

  // 2. If user is logged in and trying to access an auth route (login/register), redirect to dashboard
  if (userId && isAuthRoute(req)) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  // 3. If user is logged in and trying to access the landing page (which is public), redirect to dashboard?
  // NOTE: The previous logic redirected logged-in users from public routes to dashboard.
  // We'll keep that behavior for the root path '/' if that was the intent, OR strictly follow the "public routes" check.
  // The previous legacy middleware said: 
  // "If user is logged in and accessing a public route, redirect to dashboard"
  // This is often annoying (e.g. can't view landing page), so cautiously:
  if (userId && nextUrl.pathname === "/") {
     return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }
  
  // 4. Protect all routes that are not public and not auth routes
  if (!isPublicRoute(req) && !isAuthRoute(req)) {
      await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};