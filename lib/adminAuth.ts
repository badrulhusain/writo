import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const { userId, sessionClaims } = await auth();
  
  if (!userId) {
    redirect("/auth/login");
  }
  
  // @ts-ignore
  if (sessionClaims?.metadata?.role !== "ADMIN") {
    redirect("/");
  }
  
  return { userId };
}

export async function isAdmin() {
  const { sessionClaims } = await auth();
  // @ts-ignore
  return sessionClaims?.metadata?.role === "ADMIN";
}
