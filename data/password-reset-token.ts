import { connectDB, PasswordResetToken } from "@/lib/db";

/**
 * Retrieve a password reset token document by its token string.
 * Returns the plain object representation or null if not found.
 */
export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    await connectDB();
    const passwordResetToken = await PasswordResetToken.findOne({ token });
    return passwordResetToken ? passwordResetToken.toObject() : null;
  } catch (error) {
    console.error("Error fetching password reset token by token:", error);
    return null;
  }
};

/**
 * Retrieve a password reset token document by the associated email.
 */
export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    await connectDB();
    const passwordResetToken = await PasswordResetToken.findOne({ email });
    return passwordResetToken ? passwordResetToken.toObject() : null;
  } catch (error) {
    console.error("Error fetching password reset token by email:", error);
    return null;
  }
};