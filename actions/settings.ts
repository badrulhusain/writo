"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { connectDB, User } from "@/lib/db";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

async function syncUser(user: any, email: string) {
  await connectDB();
  const newUser = await User.create({
    name: user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user.username || "User",
    email: email,
    image: user.imageUrl,
    role: "USER",
  });
  return {
    ...newUser.toObject(),
    id: (newUser as any)._id.toString(),
  };
}

async function handleSecurityUpdate(values: z.infer<typeof SettingsSchema>, dbUser: any) {
  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(values.password, dbUser.password);
    if (!passwordsMatch) {
      return { error: "Incorrect password!" };
    }
    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }
  return null;
}

export const settings = async (
  values: z.infer<typeof SettingsSchema>
) => {
  const user = await currentUser();

  if (!user || !user.emailAddresses?.[0]?.emailAddress) {
    return { error: "Unauthorized" }
  }

  const email = user.emailAddresses[0].emailAddress;
  let dbUser = await getUserByEmail(email);

  if (!dbUser) {
    dbUser = await syncUser(user, email);
  }

  const isOAuth = user.externalAccounts && user.externalAccounts.length > 0;

  if (isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== dbUser.id) {
      return { error: "Email already in use!" }
    }

    const verificationToken = await generateVerificationToken(
      values.email
    );
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { success: "Verification email sent!" };
  }

  const securityError = await handleSecurityUpdate(values, dbUser);
  if (securityError) return securityError;

  // Connect to database
  await connectDB();

  // Update user
  await User.findByIdAndUpdate(
    dbUser.id,
    {
      ...values,
    },
    { new: true }
  );

  // Note: Session update removed as update function not available in NextAuth v5

  return { success: "Settings Updated!" }
}