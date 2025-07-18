#!/bin/bash

# CollectorPRO Production Deployment Script
# Multi-Platform Sports Digital Collectibles Collection Manager

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="collectorpro"
PROJECT_DIR="$(pwd)"
ENV_FILE=".env.production"
VERCEL_PROJECT_ID="your-vercel-project-id"

echo -e "${BLUE}🚀 CollectorPRO Production Deployment${NC}"
echo -e "${BLUE}=====================================${NC}"

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_status "Starting production deployment..."

# Step 1: Environment Setup
echo -e "\n${BLUE}📋 Step 1: Environment Setup${NC}"

if [ ! -f "$ENV_FILE" ]; then
    print_warning "Production environment file not found. Creating from example..."
    if [ -f "env.production.example" ]; then
        cp env.production.example "$ENV_FILE"
        print_warning "Please configure your production environment variables in $ENV_FILE"
        print_warning "Then run this script again."
        exit 1
    else
        print_error "env.production.example not found. Please create your production environment file."
        exit 1
    fi
fi

print_status "Environment file found"

# Step 2: Install Dependencies
echo -e "\n${BLUE}📦 Step 2: Install Dependencies${NC}"

if [ -f "package-lock.json" ]; then
    npm ci --production
else
    npm install --production
fi

print_status "Dependencies installed"

# Step 3: Database Setup
echo -e "\n${BLUE}🗄️  Step 3: Database Setup${NC}"

# Check if Prisma is configured
if [ -d "prisma" ]; then
    print_status "Prisma configuration found"
    
    # Generate Prisma client
    npx prisma generate
    
    # Run database migrations
    print_status "Running database migrations..."
    npx prisma migrate deploy
    
    print_status "Database setup complete"
else
    print_warning "Prisma configuration not found. Skipping database setup."
fi

# Step 4: Build Application
echo -e "\n${BLUE}🔨 Step 4: Build Application${NC}"

print_status "Building application..."
npm run build

if [ $? -eq 0 ]; then
    print_status "Build successful"
else
    print_error "Build failed"
    exit 1
fi

# Step 5: Environment Variables Validation
echo -e "\n${BLUE}🔍 Step 5: Environment Variables Validation${NC}"

# Load environment variables
source "$ENV_FILE"

# Check required variables
required_vars=(
    "DATABASE_URL"
    "NEXTAUTH_SECRET"
    "NEXTAUTH_URL"
    "STRIPE_SECRET_KEY"
    "STRIPE_PUBLISHABLE_KEY"
)

missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ] || [ "${!var}" = "your-$var" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -gt 0 ]; then
    print_error "Missing or unconfigured environment variables:"
    for var in "${missing_vars[@]}"; do
        echo -e "  ${RED}- $var${NC}"
    done
    print_warning "Please configure these variables in $ENV_FILE before deployment."
    exit 1
fi

print_status "Environment variables validated"

# Step 6: Security Checks
echo -e "\n${BLUE}🔒 Step 6: Security Checks${NC}"

# Check for hardcoded secrets
if grep -r "sk_live\|pk_live\|your-" src/ --exclude-dir=node_modules 2>/dev/null; then
    print_warning "Found potential hardcoded secrets in source code"
    print_warning "Please ensure all secrets are properly configured via environment variables"
fi

# Check for debug mode
if grep -r "DEBUG.*true\|NODE_ENV.*development" "$ENV_FILE" 2>/dev/null; then
    print_warning "Debug mode or development environment detected in production config"
fi

print_status "Security checks completed"

# Step 7: Performance Optimization
echo -e "\n${BLUE}⚡ Step 7: Performance Optimization${NC}"

# Optimize images if possible
if command -v imagemin &> /dev/null; then
    print_status "Optimizing images..."
    npx imagemin public/**/*.{jpg,jpeg,png,svg} --out-dir=public/optimized
fi

# Bundle analysis (optional)
if [ "$ANALYZE_BUNDLE" = "true" ]; then
    print_status "Analyzing bundle size..."
    npm run analyze
fi

print_status "Performance optimization completed"

# Step 8: Deploy to Vercel
echo -e "\n${BLUE}🚀 Step 8: Deploy to Vercel${NC}"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Deploy to production
print_status "Deploying to Vercel production..."

if [ -n "$VERCEL_PROJECT_ID" ]; then
    vercel --prod --confirm
else
    vercel --prod
fi

if [ $? -eq 0 ]; then
    print_status "Deployment successful!"
else
    print_error "Deployment failed"
    exit 1
fi

# Step 9: Post-Deployment Setup
echo -e "\n${BLUE}🔧 Step 9: Post-Deployment Setup${NC}"

# Get deployment URL
DEPLOYMENT_URL=$(vercel ls | grep "$APP_NAME" | head -1 | awk '{print $2}')

if [ -n "$DEPLOYMENT_URL" ]; then
    print_status "Deployment URL: $DEPLOYMENT_URL"
    
    # Health check
    print_status "Performing health check..."
    sleep 10  # Wait for deployment to be ready
    
    if curl -f -s "$DEPLOYMENT_URL/api/health" > /dev/null; then
        print_status "Health check passed"
    else
        print_warning "Health check failed. Please verify deployment manually."
    fi
fi

# Step 10: Analytics Setup
echo -e "\n${BLUE}📊 Step 10: Analytics Setup${NC}"

if [ -n "$NEXT_PUBLIC_GA_ID" ]; then
    print_status "Google Analytics configured"
fi

if [ -n "$NEXT_PUBLIC_POSTHOG_KEY" ]; then
    print_status "PostHog Analytics configured"
fi

if [ -n "$NEXT_PUBLIC_SENTRY_DSN" ]; then
    print_status "Sentry error monitoring configured"
fi

# Step 11: Platform Integration Status
echo -e "\n${BLUE}🔗 Step 11: Platform Integration Status${NC}"

platforms=(
    "NBA TopShot:TOPSHOT_API_KEY"
    "Panini NFT:PANINI_API_KEY"
    "NFL All Day:NFL_ALLDAY_API_KEY"
)

for platform in "${platforms[@]}"; do
    IFS=':' read -r name var <<< "$platform"
    if [ -n "${!var}" ] && [ "${!var}" != "your-$var" ]; then
        print_status "$name integration configured"
    else
        print_warning "$name integration not configured"
    fi
done

# Step 12: Final Status
echo -e "\n${BLUE}🎉 Deployment Complete!${NC}"

print_status "CollectorPRO v10.1 successfully deployed to production"
print_status "Multi-platform sports digital collectibles collection manager is live"

echo -e "\n${GREEN}📋 Next Steps:${NC}"
echo -e "  1. Verify all platform integrations are working"
echo -e "  2. Test user onboarding flow"
echo -e "  3. Monitor analytics and error tracking"
echo -e "  4. Set up automated backups"
echo -e "  5. Configure monitoring alerts"

echo -e "\n${GREEN}🔗 Useful Links:${NC}"
echo -e "  • Production URL: $DEPLOYMENT_URL"
echo -e "  • Vercel Dashboard: https://vercel.com/dashboard"
echo -e "  • Analytics: https://app.posthog.com"
echo -e "  • Error Monitoring: https://sentry.io"

echo -e "\n${GREEN}📞 Support:${NC}"
echo -e "  • Email: support@collectorpro.com"
echo -e "  • Discord: https://discord.gg/collectorpro"

print_status "Deployment script completed successfully!" 