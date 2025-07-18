# CollectorPRO Deployment Guide

## Making Your App Publicly Accessible on Vercel

### Step 1: Configure Vercel Deployment Protection

1. **Access Vercel Dashboard**
   - Go to https://vercel.com/dashboard
   - Select your CollectorPRO project

2. **Change Deployment Protection Settings**
   - Navigate to **Settings → General**
   - Find the **"Deployment Protection"** section
   - Change from **"All Access"** to **"Unprotected Previews"**
   - This will make your app publicly accessible without requiring authentication

3. **Verify Public Access**
   - Your app should now be accessible at: `https://your-project-name.vercel.app`
   - Anyone can visit and use CollectorPRO without restrictions

### Step 2: Environment Variables Setup

Set these environment variables in your Vercel project settings:

#### Required Variables:
```bash
# Authentication
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters-long"
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="https://your-project-name.vercel.app"

# App Configuration
NEXT_PUBLIC_APP_URL="https://your-project-name.vercel.app"
NEXT_PUBLIC_APP_NAME="CollectorPRO"

# Flow Blockchain API
FLOW_API_URL="https://rest-mainnet.onflow.org"
FLOW_ACCESS_NODE="https://access-mainnet-beta.onflow.org"

# Security
RATE_LIMIT_MAX_REQUESTS=10
RATE_LIMIT_WINDOW_MS=9000
SESSION_SECRET="your-session-secret-key"

# Development
NODE_ENV="production"
```

#### Optional Variables (for full functionality):
```bash
# Database (if using PostgreSQL)
DATABASE_URL="postgresql://username:password@host:port/database"

# Email Configuration
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@your-domain.com"

# Stripe (for future features)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Step 3: Deploy and Test

1. **Trigger a new deployment** in Vercel
2. **Test the public access** by visiting your app URL
3. **Verify login works** with test account:
   - Email: `test@example.com`
   - Password: `test123`

### Step 4: Custom Domain (Optional)

1. **Add custom domain** in Vercel Settings → Domains
2. **Update environment variables** with your custom domain
3. **Configure DNS** as instructed by Vercel

## Troubleshooting

### If app is still not accessible:
- Check Vercel deployment logs for errors
- Verify all environment variables are set correctly
- Ensure the deployment completed successfully
- Check if there are any build errors

### If authentication doesn't work:
- Verify JWT_SECRET is set and secure
- Check that NEXTAUTH_URL matches your deployment URL
- Ensure cookies are working (check browser dev tools)

## Next Steps

Once your app is publicly accessible, we can proceed with:
1. **Flow blockchain integration** for real NBA Top Shot data
2. **Portfolio analytics** implementation
3. **User wallet connection** features
4. **Advanced analytics** and insights

---

**Note:** The app currently uses in-memory data storage. For production with multiple users, consider setting up a PostgreSQL database using the DATABASE_URL environment variable. 