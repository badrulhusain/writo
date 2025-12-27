"use server";

export const login = async (
): Promise<{ error?: string; success?: string; twoFactor?: boolean } | undefined> => {
  throw new Error("Login action is deprecated. Use Clerk SignIn.");
};