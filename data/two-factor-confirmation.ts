import { connectDB, TwoFactorConfirmation } from "@/lib/db";

export const getTwoFactorConfirmationByUserId = async (
  userId: string
) => {
  try {
    await connectDB();
    const twoFactorConfirmation = await TwoFactorConfirmation.findOne({ userId });

    return twoFactorConfirmation ? twoFactorConfirmation.toObject() : null;
  } catch {
    return null;
  }
};