# Production Deployment Checklist

Use this checklist to ensure your Writo application is ready for production deployment on Vercel.

## Pre-Deployment

### Code & Configuration
- [x] `vercel.json` created with proper build configuration
- [x] `next.config.js` updated with production settings
- [x] Image domains configured for OAuth providers
- [ ] Email sender address updated in `lib/mail.ts` (change `support@myapp.com` to your verified Resend domain)

### Environment Variables Prepared
- [ ] `DATABASE_URL` - MongoDB production connection string
- [ ] `AUTH_SECRET` - Generated secure random string
- [ ] `GITHUB_CLIENT_ID` - GitHub OAuth credentials
- [ ] `GITHUB_CLIENT_SECRET` - GitHub OAuth credentials
- [ ] `GOOGLE_CLIENT_ID` - Google OAuth credentials
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth credentials
- [ ] `RESEND_API_KEY` - Resend API key
- [ ] `NEXT_PUBLIC_APP_URL` - Will be your Vercel URL

### External Services
- [ ] MongoDB Atlas cluster created and configured
- [ ] MongoDB network access allows Vercel connections (0.0.0.0/0 or specific IPs)
- [ ] Resend account created with verified domain
- [ ] GitHub OAuth app created
- [ ] Google OAuth app created

---

## During Deployment

### Vercel Setup
- [ ] Vercel account created
- [ ] Repository connected to Vercel
- [ ] All environment variables added in Vercel dashboard
- [ ] Environment variables set to "Production" scope
- [ ] Initial deployment triggered

### Post-First-Deploy
- [ ] Note the assigned Vercel URL
- [ ] Update `NEXT_PUBLIC_APP_URL` in Vercel environment variables
- [ ] Redeploy application

### OAuth Configuration
- [ ] GitHub OAuth callback URL updated to: `https://your-app.vercel.app/api/auth/callback/github`
- [ ] Google OAuth redirect URI updated to: `https://your-app.vercel.app/api/auth/callback/google`
- [ ] Google authorized JavaScript origins updated to: `https://your-app.vercel.app`

---

## Post-Deployment Verification

### Authentication Tests
- [ ] Homepage loads successfully
- [ ] User registration works
- [ ] Email login works
- [ ] GitHub OAuth login works
- [ ] Google OAuth login works
- [ ] Password reset email received
- [ ] Email verification works (if enabled)

### Feature Tests
- [ ] Create blog post
- [ ] Upload image to blog post
- [ ] View blog post
- [ ] Like a post
- [ ] Comment on a post
- [ ] Edit profile
- [ ] View user profile page
- [ ] Admin dashboard accessible (if applicable)

### Performance & Quality
- [ ] Page load times acceptable
- [ ] Images load correctly
- [ ] Mobile responsiveness works
- [ ] No console errors in browser
- [ ] Check Vercel deployment logs for errors

---

## Optional Enhancements

### Custom Domain
- [ ] Custom domain purchased
- [ ] Domain added in Vercel dashboard
- [ ] DNS records configured
- [ ] SSL certificate issued
- [ ] `NEXT_PUBLIC_APP_URL` updated to custom domain
- [ ] OAuth callback URLs updated to custom domain

### Monitoring
- [ ] Vercel Analytics enabled
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Uptime monitoring set up

---

## Important Files Reference

- **Deployment Guide**: [DEPLOYMENT.md](file:///c:/Users/muhsi/Music/writo/DEPLOYMENT.md)
- **Vercel Config**: [vercel.json](file:///c:/Users/muhsi/Music/writo/vercel.json)
- **Next.js Config**: [next.config.js](file:///c:/Users/muhsi/Music/writo/next.config.js)
- **Environment Template**: [.env.example](file:///c:/Users/muhsi/Music/writo/.env.example)

---

## Need to Update

### Before First Deploy
**Critical**: Update email sender in `lib/mail.ts`:
```typescript
// Lines 9, 26, 43 - Change from:
from: "support@myapp.com"
// To:
from: "noreply@yourdomain.com" // Your verified Resend domain
```

---

## Quick Commands

### Test Build Locally
```bash
npm run build
```

### Deploy via CLI
```bash
vercel --prod
```

### View Logs
```bash
vercel logs
```
