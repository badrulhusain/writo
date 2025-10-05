import { connectDB, TwoFactorToken } from "@/lib/db";

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    await connectDB();
    const twoFactorToken = await TwoFactorToken.findOne({ token });

    return twoFactorToken ? twoFactorToken.toObject() : null;
  } catch {
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    await connectDB();
    const twoFactorToken = await TwoFactorToken.findOne({ email });

    return twoFactorToken ? twoFactorToken.toObject() : null;
  } catch {
    return null;
  }
};