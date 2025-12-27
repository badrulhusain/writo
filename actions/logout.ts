"use server";

export const logout = async () => {
  throw new Error("Logout action is deprecated. Use Clerk useClerk().signOut() on client.");
};
