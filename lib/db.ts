import { connectToDatabase, mongoose } from './mongodb';
import { User, Blog, Category, Tag, BlogTag, Like, Account, VerificationToken, PasswordResetToken, TwoFactorToken, TwoFactorConfirmation } from '@/models';

// Re-export the robust connection function
export const connectDB = connectToDatabase;

// Export models for use in other files
export {
  User,
  Blog,
  Category,
  Tag,
  BlogTag,
  Like,
  Account,
  VerificationToken,
  PasswordResetToken,
  TwoFactorToken,
  TwoFactorConfirmation
};

// Export mongoose for direct use if needed
export { mongoose };