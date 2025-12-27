import { currentUser as clerkCurrentUser, auth } from "@clerk/nextjs/server";

export const currentUser = async () => {
  const user = await clerkCurrentUser();
  return user;
};

export const currentRole = async () => {
  const { sessionClaims } = await auth();
  // @ts-ignore
  return sessionClaims?.metadata?.role as "ADMIN" | "USER" | undefined;
};
