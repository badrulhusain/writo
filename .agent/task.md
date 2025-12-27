# Task: Migrate from NextAuth to Clerk and Fix Build Errors

## Status

- [x] Identify NextAuth files and usages
- [x] Remove NextAuth files:
  - [x] `auth.ts`
  - [x] `auth.config.ts`
  - [x] `lib/mongodb-adapter.ts`
  - [x] `types/next-auth.d.ts`
  - [x] `next-auth.d.ts`
  - [x] `app/api/auth` directory
- [x] Update `app/auth/layout.tsx` (Remove SessionProvider)
- [x] Update API routes to use Clerk:
  - [x] `app/api/views/route.ts`
  - [x] `app/api/blogs/route.ts`
  - [x] `app/api/blogs/[id]/like/route.ts`
  - [x] `app/api/bookmarks/route.ts`
  - [x] `app/api/comments/route.ts`
  - [x] `app/api/user/profile/route.ts`
  - [x] `app/api/user/blogs/route.ts`
  - [x] `app/api/admin/blogs/route.ts`
- [x] Update Pages:
  - [x] `app/(app)/home/page.tsx`
- [x] Disable NextAuth actions:
  - [x] `actions/login.ts`
  - [x] `actions/logout.ts`
- [x] Verify build passes (Files neutralized)
