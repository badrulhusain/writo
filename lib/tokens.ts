import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

import { connectDB, TwoFactorToken, PasswordResetToken, VerificationToken } from "@/lib/db";
import { getVerificationTokenByEmail } from "@/data/verificiation-token";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await connectDB();
    await TwoFactorToken.deleteOne({ _id: existingToken._id });
  }

  await connectDB();
  const twoFactorToken = new TwoFactorToken({
    email,
    token,
    expires,
  });
  await twoFactorToken.save();

  return twoFactorToken.toObject();
}

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await connectDB();
    await PasswordResetToken.deleteOne({ _id: existingToken._id });
  }

  await connectDB();
  const passwordResetToken = new PasswordResetToken({
    email,
    token,
    expires
  });
  await passwordResetToken.save();

  return passwordResetToken.toObject();
}

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await connectDB();
    await VerificationToken.deleteOne({ _id: existingToken._id });
  }

  await connectDB();
  const verificationToken = new VerificationToken({
    email,
    token,
    expires,
  });
  await verificationToken.save();

  return verificationToken.toObject();
};
