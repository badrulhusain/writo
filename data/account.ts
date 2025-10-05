import { connectDB, Account } from "@/lib/db";

export const getAccountByUserId = async (userId: string) => {
  try {
    await connectDB();
    const account = await Account.findOne({ userId });

    return account ? account.toObject() : null;
  } catch {
    return null;
  }
};