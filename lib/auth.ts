import { currentUser as clerkCurrentUser, auth } from "@clerk/nextjs/server";

export const currentUser = async () => {
  const user = await clerkCurrentUser();
  return user;
};

export const currentRole = async () => {
  const { sessionClaims } = await auth();
  // @ts-expect-error: Clerk sessionClaims metadata role is not typed
  return sessionClaims?.metadata?.role as "ADMIN" | "USER" | undefined;
};
