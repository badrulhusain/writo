import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const { userId, sessionClaims } = await auth();
  
  if (!userId) {
    redirect("/auth/login");
  }
  
  // @ts-expect-error: Clerk sessionClaims metadata role is not typed
  if (sessionClaims?.metadata?.role !== "ADMIN") {
    redirect("/");
  }
  
  return { userId };
}

export async function isAdmin() {
  const { sessionClaims } = await auth();
  // @ts-expect-error: Clerk sessionClaims metadata role is not typed
  return sessionClaims?.metadata?.role === "ADMIN";
}
