# Environment Variables Quick Reference

This file provides a quick reference for setting up environment variables for production deployment.

## How to Generate AUTH_SECRET

Run this command in your terminal to generate a secure random string:

```bash
openssl rand -base64 32
```

Or use Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Environment Variables Template

Copy this template when setting up environment variables in Vercel:

```env
# Database
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/writo?retryWrites=true&w=majority

# Authentication
AUTH_SECRET=your-generated-secret-here

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Service
RESEND_API_KEY=your-resend-api-key

# Application URL (update after first deploy)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Optional: Social Media Links
NEXT_PUBLIC_GITHUB_URL=https://github.com/yourusername
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/in/yourprofile
NEXT_PUBLIC_X_URL=https://x.com/yourhandle
NEXT_PUBLIC_YOUTUBE_URL=https://youtube.com/@yourchannel
```

## Where to Get Each Value

### DATABASE_URL
1. Go to MongoDB Atlas (https://cloud.mongodb.com)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Replace `<username>` with your database username

### AUTH_SECRET
Generate using the command above.

### GITHUB_CLIENT_ID & GITHUB_CLIENT_SECRET
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - Application name: Writo
   - Homepage URL: https://your-app.vercel.app
   - Authorization callback URL: https://your-app.vercel.app/api/auth/callback/github
4. Click "Register application"
5. Copy Client ID and generate a new Client Secret

### GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET
1. Go to Google Cloud Console (https://console.cloud.google.com)
2. Create a new project or select existing
3. Go to APIs & Services → Credentials
4. Click "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add Authorized JavaScript origins: https://your-app.vercel.app
7. Add Authorized redirect URIs: https://your-app.vercel.app/api/auth/callback/google
8. Copy Client ID and Client Secret

### RESEND_API_KEY
1. Go to Resend (https://resend.com)
2. Sign up or log in
3. Go to API Keys
4. Click "Create API Key"
5. Copy the key

### NEXT_PUBLIC_APP_URL
This will be your Vercel deployment URL. After first deploy, update this value.

## Important Notes

- **Never commit** `.env` file to Git (already in .gitignore)
- **All variables** must be set in Vercel dashboard under "Environment Variables"
- **Select "Production"** environment when adding variables in Vercel
- **Redeploy** after adding or updating environment variables
- **NEXT_PUBLIC_*** variables are exposed to the browser (only use for non-sensitive data)

## Vercel CLI Commands for Environment Variables

```bash
# Add a variable
vercel env add VARIABLE_NAME production

# List all variables
vercel env ls

# Remove a variable
vercel env rm VARIABLE_NAME production
```
