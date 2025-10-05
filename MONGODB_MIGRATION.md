# MongoDB Migration Guide

This document outlines the steps taken to migrate the Writo blog platform from Prisma (PostgreSQL) to MongoDB.

## 🔄 Migration Overview

The migration involved updating the database layer to use MongoDB with Mongoose ODM instead of Prisma with PostgreSQL. All data access patterns were updated to work with MongoDB's document-based model.

## 📁 Files Updated

### 1. Database Connection (`lib/db.ts`)
- Replaced Prisma client with MongoDB connection
- Added connection pooling and caching
- Exported Mongoose models for use in other files

### 2. MongoDB Connection (`lib/mongodb.ts`)
- Created new MongoDB connection utility
- Implemented connection caching to prevent multiple connections
- Added proper error handling

### 3. MongoDB Adapter (`lib/mongodb-adapter.ts`)
- Created custom MongoDB adapter for NextAuth
- Implemented all required adapter methods for user, account, session, and token management

### 4. Data Access Functions (`data/*.ts`)
- Updated all data access functions to use Mongoose models
- Modified return formats to match MongoDB document structure
- Added proper ID conversion from ObjectId to string

### 5. Actions (`actions/*.ts`)
- Updated server actions to use Mongoose instead of Prisma
- Modified database operations to use MongoDB syntax
- Updated token and user management functions

### 6. NextAuth Configuration (`Auth.ts`)
- Replaced Prisma adapter with custom MongoDB adapter
- Updated connection handling
- Maintained all existing authentication flows

### 7. Models (`models/index.ts`)
- Kept existing Mongoose models
- Ensured proper schema definitions
- Maintained all relationships and indexes

## 🛠️ Key Changes

### Database Connection
```typescript
// Before (Prisma)
import { PrismaClient } from "@prisma/client";
export const db = new PrismaClient();

// After (MongoDB)
import { connectToDatabase } from './mongodb';
import { User, Blog, Category } from '@/models';
export async function connectDB() { /* connection logic */ }
```

### Data Access Patterns
```typescript
// Before (Prisma)
const user = await db.user.findUnique({ where: { email } });

// After (MongoDB)
const user = await User.findOne({ email });
```

### User ID Handling
```typescript
// MongoDB documents use _id (ObjectId) instead of id (string)
const userData = user.toObject();
return {
  ...userData,
  id: user.id.toString(), // Convert ObjectId to string
};
```

## 🔄 Migration Steps

1. **Updated Database Connection**
   - Replaced Prisma client with MongoDB connection
   - Implemented connection caching
   - Added proper error handling

2. **Created MongoDB Adapter**
   - Built custom adapter for NextAuth
   - Implemented all required methods
   - Maintained compatibility with existing auth flows

3. **Updated Data Access Functions**
   - Converted all Prisma queries to Mongoose operations
   - Updated return formats
   - Added proper error handling

4. **Modified Server Actions**
   - Updated database operations to use MongoDB syntax
   - Modified token and user management
   - Maintained existing business logic

5. **Updated NextAuth Configuration**
   - Replaced Prisma adapter with MongoDB adapter
   - Updated connection handling
   - Maintained all authentication flows

## 🧪 Testing

After migration, the following components were tested:

1. **User Authentication**
   - Login with email/password
   - OAuth login (Google, GitHub)
   - Password reset flow
   - Email verification

2. **User Management**
   - User registration
   - Profile updates
   - Role-based access control

3. **Blog Operations**
   - Create, read, update, delete posts
   - Category and tag management
   - Comment system

4. **Data Integrity**
   - User data consistency
   - Relationship maintenance
   - Token validation

## 📈 Benefits of Migration

1. **Flexible Schema**
   - Document-based storage allows for flexible data structures
   - Easy to add new fields without migrations

2. **Scalability**
   - MongoDB's horizontal scaling capabilities
   - Better performance for read-heavy operations

3. **Simplified Deployment**
   - Easier to set up with cloud MongoDB services
   - No need for complex SQL database management

4. **JSON-Native**
   - Natural fit for web applications
   - Direct mapping to JavaScript objects

## ⚠️ Considerations

1. **Data Migration**
   - Existing data would need to be migrated from PostgreSQL to MongoDB
   - Custom scripts would be required for data transformation

2. **Query Differences**
   - Some complex joins may need to be restructured
   - Aggregation pipelines may be needed for complex queries

3. **Indexing**
   - MongoDB indexes need to be properly configured
   - Performance tuning may be required

## 🚀 Next Steps

1. **Data Migration Script**
   - Create scripts to migrate existing data from PostgreSQL to MongoDB
   - Ensure data integrity during migration

2. **Performance Testing**
   - Test application performance with MongoDB
   - Optimize queries and indexes

3. **Monitoring**
   - Set up MongoDB monitoring
   - Implement proper logging

4. **Backup Strategy**
   - Configure MongoDB backups
   - Test restore procedures