import { useUser } from "@clerk/nextjs";

export const useCurrentUser = () => {
  const { user } = useUser();

  if (!user) return undefined;

  return {
    id: user.id,
    name: user.fullName || user.username,
    email: user.primaryEmailAddress?.emailAddress,
    image: user.imageUrl,
    role: user.publicMetadata?.role as "ADMIN" | "USER" | undefined,
    isTwoFactorEnabled: user.twoFactorEnabled,
  };
};
