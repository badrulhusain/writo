import { connectDB, VerificationToken } from "@/lib/db";

export const getVerificationTokenByToken = async (
  token: string
) => {
  try {
    await connectDB();
    const verificationToken = await VerificationToken.findOne({ token });

    return verificationToken ? verificationToken.toObject() : null;
  } catch {
    return null;
  }
}

export const getVerificationTokenByEmail = async (
  email: string
) => {
  try {
    await connectDB();
    const verificationToken = await VerificationToken.findOne({ email });

    return verificationToken ? verificationToken.toObject() : null;
  } catch {
    return null;
  }
}