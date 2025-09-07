import NextAuth from "next-auth";
import { NextResponse } from 'next/server';
import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

// Helper function to create route matchers (similar to Clerk's createRouteMatcher)
const createRouteMatcher = (routes) => {
  return (req) => routes.includes(req.nextUrl.pathname);
};

const isPublicRoute = createRouteMatcher(publicRoutes);
const isAuthRoute = createRouteMatcher(authRoutes);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  
  const currentUrl = new URL(req.url);
  const isApiAuthRoute = currentUrl.pathname.startsWith(apiAuthPrefix);
  const isAccessingDefaultRedirect = currentUrl.pathname === DEFAULT_LOGIN_REDIRECT;

  // Skip middleware for API auth routes
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // If user is logged in and accessing an auth route (like login/register)
  if (isLoggedIn && isAuthRoute(req)) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  // If user is not logged in
  if (!isLoggedIn) {
    // If user is trying to access a protected route (including home page)
    if (!isPublicRoute(req) && !isAuthRoute(req)) {
      let callbackUrl = nextUrl.pathname;
      if (nextUrl.search) {
        callbackUrl += nextUrl.search;
      }

      const encodedCallbackUrl = encodeURIComponent(callbackUrl);
      
      return NextResponse.redirect(new URL(
        `/auth/login?callbackUrl=${encodedCallbackUrl}`,
        nextUrl
      ));
    }
  }

  // If user is logged in and accessing a public route, redirect to dashboard
  if (isLoggedIn && isPublicRoute(req)) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  return NextResponse.next();
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};