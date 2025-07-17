# CollectorPRO Deployment Guide

## 🚀 Deploy to Vercel

### Prerequisites
- Vercel account
- PostgreSQL database (Vercel Postgres, Supabase, or PlanetScale)
- Email service (SendGrid, Mailgun, or AWS SES)

### Step1: Database Setup

#### Option A: Vercel Postgres (Recommended)
1. Go to Vercel Dashboard
2. Create a new Postgres database
3. Copy the connection string
4. Add to environment variables as `DATABASE_URL`

#### Option B: Supabase1 Create account at supabase.com
2. Create new project3. Go to Settings > Database
4 connection string
5. Add to environment variables as `DATABASE_URL`

### Step 2: Environment Variables

Add these to your Vercel project settings:

```bash
# Database
DATABASE_URL="postgresql://..."

# Authentication
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long"
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="https://your-domain.vercel.app"

# Email Configuration
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM="noreply@your-domain.com"

# App Configuration
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
NEXT_PUBLIC_APP_NAME="CollectorPRO
# Security
RATE_LIMIT_MAX_REQUESTS=10
RATE_LIMIT_WINDOW_MS=9000SSION_SECRET="your-session-secret-key# Development
NODE_ENV=production
```

### Step 3: Database Migration
1Install Vercel CLI: `npm i -g vercel`
2. Run database migration:
```bash
npx prisma db push
npx prisma generate
```

### Step4: Deploy to Vercel
1 Push your code to GitHub
2. Connect your repository to Vercel
3ironment variables in Vercel dashboard
4. Deploy!

### Step 5 Post-Deployment

1atabase connection
2. Test user registration and email verification
3. Monitor logs for any issues
4. Set up custom domain (optional)

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check `DATABASE_URL` format
   - Ensure database is accessible from Vercel2*Email Not Sending**
   - Verify email service credentials
   - Check email service quotas

3. **Build Failures**
   - Check Prisma client generation
   - Verify all dependencies are installed

### Support

For issues, check:
- Vercel deployment logs
- Database connection status
- Environment variable configuration 