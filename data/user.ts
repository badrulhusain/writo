import { connectDB, User } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    await connectDB();
    const user = await User.findOne({ email }).select('+password');

    if (!user) return null;
    
    const userData: any = user.toObject();
    return {
      ...userData,
      id: user.id.toString(),
      emailVerified: userData.emailVerified ? userData.emailVerified.toISOString() : null,
    };
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    await connectDB();
    const user = await User.findById(id);

    if (!user) return null;
    
    const userData: any = user.toObject();
    return {
      ...userData,
      id: user.id.toString(),
      emailVerified: userData.emailVerified ? userData.emailVerified.toISOString() : null,
    };
  } catch {
    return null;
  }
};