"use server";

import { signOut } from "@/Auth";

export const logout = async () => {
  await signOut();
};
