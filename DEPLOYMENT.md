# Deploying Writo to Vercel - Production Guide

This guide will walk you through deploying your Writo application to Vercel for production.

## Prerequisites

- A Vercel account (sign up at https://vercel.com)
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
- MongoDB Atlas database (production cluster)
- Resend account with verified domain
- OAuth apps configured for production URLs

---

## Step 1: Prepare Your Environment Variables

Based on your `.env.example`, you need to configure the following environment variables in Vercel. Here's what each variable is for:

### Required Environment Variables

| Variable | Description | Example/Notes |
|----------|-------------|---------------|
| `DATABASE_URL` | MongoDB connection string | `mongodb+srv://username:password@cluster.mongodb.net/writo?retryWrites=true&w=majority` |
| `AUTH_SECRET` | NextAuth.js secret key | Generate with: `openssl rand -base64 32` |
| `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID | From GitHub OAuth App settings |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Secret | From GitHub OAuth App settings |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | From Google Cloud Console |
| `RESEND_API_KEY` | Resend API key for emails | From Resend dashboard |
| `NEXT_PUBLIC_APP_URL` | Your production URL | `https://your-app.vercel.app` |

### Optional Environment Variables (Social Media Links)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_GITHUB_URL` | Your GitHub profile URL |
| `NEXT_PUBLIC_LINKEDIN_URL` | Your LinkedIn profile URL |
| `NEXT_PUBLIC_X_URL` | Your X (Twitter) profile URL |
| `NEXT_PUBLIC_YOUTUBE_URL` | Your YouTube channel URL |

---

## Step 2: Update OAuth Callback URLs

Before deploying, you need to update your OAuth application settings to include your production URL.

### GitHub OAuth App
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Select your OAuth app
3. Update **Authorization callback URL** to: `https://your-app.vercel.app/api/auth/callback/github`
4. Add your production URL to **Homepage URL**

### Google OAuth App
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Select your OAuth 2.0 Client ID
3. Add to **Authorized redirect URIs**: `https://your-app.vercel.app/api/auth/callback/google`
4. Add to **Authorized JavaScript origins**: `https://your-app.vercel.app`

---

## Step 3: Update Email Configuration

**IMPORTANT**: Update the email sender address in `lib/mail.ts`:

1. Open `lib/mail.ts`
2. Replace `support@myapp.com` with your verified Resend domain email on lines:
   - Line 9 (Two-Factor Email)
   - Line 26 (Password Reset Email)
   - Line 43 (Verification Email)

Example:
```typescript
from: "noreply@yourdomain.com", // Use your verified Resend domain
```

---

## Step 4: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Login to Vercel**
   - Go to https://vercel.com and sign in

2. **Import Your Project**
   - Click "Add New..." → "Project"
   - Select your Git repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add all variables from Step 1 above
   - Make sure to select "Production" environment
   - Click "Add" for each variable

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 2-5 minutes)

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Add Environment Variables**
   ```bash
   vercel env add DATABASE_URL production
   vercel env add AUTH_SECRET production
   # ... repeat for all environment variables
   ```

---

## Step 5: Post-Deployment Configuration

### Update NEXT_PUBLIC_APP_URL

After your first deployment, Vercel will assign you a URL (e.g., `https://writo-xyz.vercel.app`).

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_APP_URL` to your actual Vercel URL
3. Redeploy the application (Vercel → Deployments → Redeploy)

### Update OAuth Callback URLs (Again)

If Vercel assigned you a different URL than expected:
1. Update GitHub OAuth callback URL with the actual Vercel URL
2. Update Google OAuth redirect URIs with the actual Vercel URL

---

## Step 6: Verify Deployment

Test the following features to ensure everything works:

### Authentication
- [ ] Visit your production URL
- [ ] Test user registration
- [ ] Test email login
- [ ] Test GitHub OAuth login
- [ ] Test Google OAuth login
- [ ] Test password reset email

### Core Features
- [ ] Create a new blog post
- [ ] Upload an image
- [ ] Like a post
- [ ] Comment on a post
- [ ] View user profile
- [ ] Test admin dashboard (if applicable)

### Performance
- [ ] Check page load times
- [ ] Verify images are loading correctly
- [ ] Test on mobile devices

---

## Step 7: Set Up Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed by Vercel
4. Update `NEXT_PUBLIC_APP_URL` environment variable to your custom domain
5. Update OAuth callback URLs to use custom domain
6. Redeploy

---

## Troubleshooting

### Build Fails
- Check Vercel build logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check MongoDB Atlas network access (allow Vercel IPs or use 0.0.0.0/0)
- Ensure database user has correct permissions

### OAuth Not Working
- Verify callback URLs match exactly (including https://)
- Check that CLIENT_ID and CLIENT_SECRET are correct
- Ensure OAuth apps are not in development mode

### Emails Not Sending
- Verify Resend API key is correct
- Check that sender email domain is verified in Resend
- Review Resend dashboard for error logs

### Environment Variables Not Loading
- Ensure variables are set for "Production" environment
- Redeploy after adding new variables
- Check variable names match exactly (case-sensitive)

---

## Monitoring and Maintenance

### View Logs
- Vercel Dashboard → Your Project → Deployments → [Latest] → Logs

### Analytics
- Vercel Dashboard → Your Project → Analytics

### Automatic Deployments
- Every push to your main branch will trigger a new deployment
- Pull requests create preview deployments automatically

---

## Security Checklist

- [ ] `AUTH_SECRET` is a strong, random string
- [ ] Database credentials are secure and not exposed
- [ ] OAuth secrets are kept confidential
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled for API routes
- [ ] Environment variables are not committed to Git

---

## Need Help?

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **NextAuth.js Documentation**: https://next-auth.js.org

---

## Quick Reference: Environment Variables Checklist

Copy this checklist when setting up environment variables in Vercel:

```
✓ DATABASE_URL
✓ AUTH_SECRET
✓ GITHUB_CLIENT_ID
✓ GITHUB_CLIENT_SECRET
✓ GOOGLE_CLIENT_ID
✓ GOOGLE_CLIENT_SECRET
✓ RESEND_API_KEY
✓ NEXT_PUBLIC_APP_URL
□ NEXT_PUBLIC_GITHUB_URL (optional)
□ NEXT_PUBLIC_LINKEDIN_URL (optional)
□ NEXT_PUBLIC_X_URL (optional)
□ NEXT_PUBLIC_YOUTUBE_URL (optional)
```

---

**Congratulations!** 🎉 Your Writo application is now live on Vercel!
