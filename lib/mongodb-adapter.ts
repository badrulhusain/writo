import { Adapter, AdapterUser, AdapterAccount, AdapterSession } from "next-auth/adapters";
import { 
  User, 
  Account, 
  VerificationToken 
} from "@/models";

export function MongoDBAdapter(): Adapter {
  return {
    async createUser(user: Omit<AdapterUser, "id">) {
      try {
        const newUser = new User({
          ...user,
          emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
        });
        const savedUser = await newUser.save();
        return {
          ...savedUser.toObject(),
          id: savedUser._id.toString(),
          emailVerified: savedUser.emailVerified ? savedUser.emailVerified.toISOString() : null,
        } as AdapterUser;
      } catch (error) {
        console.error("Error creating user:", error);
        throw error;
      }
    },

    async getUser(id: string) {
      try {
        const user = await User.findById(id);
        if (!user) return null;
        return {
          ...user.toObject(),
          id: user._id.toString(),
          emailVerified: user.emailVerified ? user.emailVerified.toISOString() : null,
        } as AdapterUser;
      } catch (error) {
        console.error("Error getting user:", error);
        return null;
      }
    },

    async getUserByEmail(email: string) {
      try {
        const user = await User.findOne({ email });
        if (!user) return null;
        return {
          ...user.toObject(),
          id: user._id.toString(),
          emailVerified: user.emailVerified ? user.emailVerified.toISOString() : null,
        } as AdapterUser;
      } catch (error) {
        console.error("Error getting user by email:", error);
        return null;
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {
      try {
        const account = await Account.findOne({ providerAccountId, provider }).populate('userId');
        if (!account || !account.userId) return null;
        
        const user = account.userId;
        return {
          ...user.toObject(),
          id: user._id.toString(),
          emailVerified: user.emailVerified ? user.emailVerified.toISOString() : null,
        } as AdapterUser;
      } catch (error) {
        console.error("Error getting user by account:", error);
        return null;
      }
    },

    async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
      try {
        const updatedUser = await User.findByIdAndUpdate(
          user.id,
          { 
            ...user,
            emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
          },
          { new: true }
        );
        
        if (!updatedUser) throw new Error("User not found");
        
        return {
          ...updatedUser.toObject(),
          id: updatedUser._id.toString(),
          emailVerified: updatedUser.emailVerified ? updatedUser.emailVerified.toISOString() : null,
        } as AdapterUser;
      } catch (error) {
        console.error("Error updating user:", error);
        throw error;
      }
    },

    async deleteUser(userId: string) {
      try {
        await User.findByIdAndDelete(userId);
        await Account.deleteMany({ userId });
      } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
      }
    },

    async linkAccount(account: AdapterAccount) {
      try {
        const newAccount = new Account(account);
        await newAccount.save();
      } catch (error) {
        console.error("Error linking account:", error);
        throw error;
      }
    },

    async unlinkAccount({ providerAccountId, provider }) {
      try {
        await Account.deleteOne({ providerAccountId, provider });
      } catch (error) {
        console.error("Error unlinking account:", error);
        throw error;
      }
    },

    async createSession(session: { userId: string; expires: Date; sessionToken: string }) {
      // For JWT strategy, we don't need to implement this
      return session as AdapterSession;
    },

    async getSessionAndUser(sessionToken: string) {
      // For JWT strategy, we don't need to implement this
      return null;
    },

    async updateSession(session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">) {
      // For JWT strategy, we don't need to implement this
      return session as AdapterSession;
    },

    async deleteSession(sessionToken: string) {
      // For JWT strategy, we don't need to implement this
    },

    async createVerificationToken(token: { identifier: string; expires: Date; token: string }) {
      try {
        const verificationToken = new VerificationToken(token);
        const savedToken = await verificationToken.save();
        return {
          ...savedToken.toObject(),
          id: savedToken._id.toString(),
        };
      } catch (error) {
        console.error("Error creating verification token:", error);
        throw error;
      }
    },

    async useVerificationToken({ identifier, token }) {
      try {
        const verificationToken = await VerificationToken.findOneAndDelete({ 
          email: identifier, 
          token 
        });
        
        if (!verificationToken) return null;
        
        return {
          ...verificationToken.toObject(),
          id: verificationToken._id.toString(),
        };
      } catch (error) {
        console.error("Error using verification token:", error);
        throw error;
      }
    },
  };
}