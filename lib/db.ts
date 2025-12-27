import { connectToDatabase, mongoose } from './mongodb';
import { User, Blog, Category, Tag, BlogTag, Like } from '@/models';

// Re-export the robust connection function
export const connectDB = connectToDatabase;

// Export models for use in other files
export {
  User,
  Blog,
  Category,
  Tag,
  BlogTag,
  Like
};

// Export mongoose for direct use if needed
export { mongoose };