"use server";

import { connectDB, User, VerificationToken } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verificiation-token";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  // Connect to database
  await connectDB();
  
  // Update user email verification
  await User.findByIdAndUpdate(
    existingUser.id,
    { 
      emailVerified: new Date(),
      email: existingToken.email,
    }
  );

  // Delete verification token
  await VerificationToken.findByIdAndDelete(existingToken.id);

  return { success: "Email verified!" };
};