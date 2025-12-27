import { useUser } from "@clerk/nextjs";

export const useCurrentRole = () => {
  const { user } = useUser();

  return user?.publicMetadata?.role as "ADMIN" | "USER" | undefined;
};
