"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null,
): Promise<{ error?: string; success?: string; twoFactor?: boolean } | undefined> => {
  throw new Error("Login action is deprecated. Use Clerk SignIn.");
};