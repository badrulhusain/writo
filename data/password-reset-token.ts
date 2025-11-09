import { connectDB, PasswordResetToken } from "@/lib/db";

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    await connectDB();
    const passwordRese  tToken = await PasswordResetToken.findOne({ token });

    return passwordResetToken ? passwordResetToken.toObject() : null;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    await connectDB();
    const passwordResetToken = await PasswordResetToken.findOne({ email });

    return passwordResetToken ? passwordResetToken.toObject() : null;
  } catch {
    return null;
  }
};