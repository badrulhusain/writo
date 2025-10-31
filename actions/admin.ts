"use server";

import { currentRole } from "@/lib/auth";
import { UserRole } from "@/types/user-role";

export const admin = async () => {
  const role = await currentRole();

  if (role === UserRole.ADMIN) {
    return { success: "Allowed Server Action!" };
  }

  return { error: "Forbidden Server Action!" }
};
