export const UserRole = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const isUserRole = (v: unknown): v is UserRole =>
  v === UserRole.ADMIN || v === UserRole.USER;
