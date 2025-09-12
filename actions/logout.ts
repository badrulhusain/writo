"use server";

import { signOut } from "@/Auth";

export const logout = async () => {
  console.log("Logging out...");
  
  await signOut();
};
