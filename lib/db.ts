import { connectToDatabase, mongoose } from './mongodb';
import { User, Blog, Category, Tag, BlogTag, Like, Account, VerificationToken, PasswordResetToken, TwoFactorToken, TwoFactorConfirmation } from '@/models';

// Connect to the database
let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    return;
  }
  
  try {
    await connectToDatabase();
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

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