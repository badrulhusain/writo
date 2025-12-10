import { auth } from "@/Auth";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth();
  
  if (!session || !session.user) {
    redirect("/auth/login");
  }
  
  if (session.user.role !== "ADMIN") {
    redirect("/");
  }
  
  return session;
}

export async function isAdmin() {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}
