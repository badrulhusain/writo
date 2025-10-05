import NextAuth from "next-auth"
import { UserRole } from "@prisma/client";
import { MongoDBAdapter } from "@/lib/mongodb-adapter";

import { connectDB } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getAccountByUserId } from "./data/account";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      // Connect to database
      await connectDB();
      // In a real implementation, you would update the user in MongoDB here
      console.log("Linking account for user:", user.id);
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      // Connect to database
      await connectDB();
      
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      if (user.id) {
        const existingUser = await getUserById(user.id);

        // REMOVED: Email verification check since you don't want it
        // if (!existingUser?.emailVerified) return false;

        if (existingUser?.isTwoFactorEnabled) {
          const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

          if (!twoFactorConfirmation) return false;

          // Delete two factor confirmation for next sign in
          // In a real implementation, you would delete from MongoDB here
          console.log("Deleting two factor confirmation:", twoFactorConfirmation.id);
        }
      }

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      // Connect to database
      await connectDB();
      
      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(
        existingUser.id
      );

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    }
  },
  adapter: MongoDBAdapter(),
  session: { strategy: "jwt" },
  ...authConfig,
});