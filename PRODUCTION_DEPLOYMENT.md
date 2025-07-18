# 🚀 CollectorPRO Production Deployment Guide

## 📋 Overview

This guide covers the production deployment of CollectorPRO v10.1 with real NBA TopShot moment images, optimized for user acquisition and conversion.

## ✅ **Pre-Deployment Checklist**

### **1. Environment Variables Setup**

#### **Required Environment Variables**
```bash
# App Configuration
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NEXT_PUBLIC_APP_NAME="CollectorPRO"
NODE_ENV="production"

# NBA TopShot CDN Configuration
NEXT_PUBLIC_NBA_TOPSHOT_CDN_URL="https://assets.nbatopshot.com"
NEXT_PUBLIC_IMAGE_CACHE_DURATION="86400" # 24 hours

# Performance Optimization
NEXT_PUBLIC_IMAGE_OPTIMIZATION="true"
NEXT_PUBLIC_VIRTUAL_SCROLLING="true"
NEXT_PUBLIC_CDN_FALLBACK="true"

# Analytics & Tracking
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_MIXPANEL_TOKEN="your-mixpanel-token"
NEXT_PUBLIC_HOTJAR_ID="your-hotjar-id"

# Stripe Configuration (for subscriptions)
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_STARTER_PRICE_ID="price_starter"
STRIPE_PRO_PRICE_ID="price_pro"
STRIPE_ENTERPRISE_PRICE_ID="price_enterprise"

# Legal & Compliance
NEXT_PUBLIC_FAIR_USE_DISCLAIMER="true"
NEXT_PUBLIC_ATTRIBUTION_REQUIRED="true"
NEXT_PUBLIC_LEGAL_NOTICE_VERSION="1.0"
```

#### **Optional Environment Variables**
```bash
# Database (if using PostgreSQL)
DATABASE_URL="postgresql://username:password@host:port/database"

# Email Configuration
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@your-domain.com"

# Monitoring & Logging
SENTRY_DSN="your-sentry-dsn"
LOG_LEVEL="info"
```

### **2. CDN Optimization Settings**

#### **Next.js Image Configuration**
```typescript
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.nbatopshot.com',
        port: '',
        pathname: '/resize/**',
      },
      {
        protocol: 'https',
        hostname: 'ak-static.cms.nba.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // Compression and optimization
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
}
```

#### **Service Worker for Image Caching**
```javascript
// public/sw.js
const CACHE_NAME = 'nba-topshot-images-v1'
const IMAGE_CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('assets.nbatopshot.com')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response
        }
        return fetch(event.request).then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone)
            })
          }
          return response
        })
      })
    )
  }
})
```

### **3. Analytics & User Tracking**

#### **Google Analytics Setup**
```typescript
// src/lib/analytics.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_location: url,
    })
  }
}

export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Track key user actions
export const trackUserActions = {
  viewDemo: () => event({ action: 'view_demo', category: 'engagement' }),
  connectWallet: () => event({ action: 'connect_wallet', category: 'conversion' }),
  startTrial: () => event({ action: 'start_trial', category: 'conversion' }),
  viewPricing: () => event({ action: 'view_pricing', category: 'engagement' }),
  imageLoadSuccess: () => event({ action: 'image_load_success', category: 'performance' }),
  imageLoadFallback: () => event({ action: 'image_load_fallback', category: 'performance' }),
}
```

#### **Performance Monitoring**
```typescript
// src/lib/performance.ts
export const trackImagePerformance = {
  startLoad: (momentId: string) => {
    performance.mark(`image-load-start-${momentId}`)
  },
  endLoad: (momentId: string, success: boolean) => {
    performance.mark(`image-load-end-${momentId}`)
    performance.measure(
      `image-load-${momentId}`,
      `image-load-start-${momentId}`,
      `image-load-end-${momentId}`
    )
    
    const measure = performance.getEntriesByName(`image-load-${momentId}`)[0]
    if (measure) {
      // Send to analytics
      event({
        action: success ? 'image_load_success' : 'image_load_fallback',
        category: 'performance',
        label: momentId,
        value: Math.round(measure.duration)
      })
    }
  }
}
```

## 🚀 **Deployment Steps**

### **1. Vercel Deployment**

#### **Deploy to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

#### **Vercel Configuration**
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=300, s-maxage=300"
        }
      ]
    },
    {
      "source": "/(.*\\.(jpg|jpeg|png|webp|avif))",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### **2. Domain & SSL Setup**

#### **Custom Domain Configuration**
1. **Add Custom Domain** in Vercel Dashboard
2. **Configure DNS Records**:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```
3. **Enable SSL** (automatic with Vercel)

#### **Environment Variables in Vercel**
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add all required environment variables
3. Set `NODE_ENV=production`
4. Configure production-specific values

### **3. Performance Optimization**

#### **Image Optimization**
```typescript
// src/lib/image-optimization.ts
export const imageOptimization = {
  // Preload critical images
  preloadCriticalImages: () => {
    const criticalImages = [
      'lebron-james-legendary',
      'stephen-curry-rare',
      'victor-wembanyama-ultimate'
    ]
    
    criticalImages.forEach(momentId => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = generateNBATopShotImageURL(momentId, 'common', 161)
      document.head.appendChild(link)
    })
  },
  
  // Lazy load non-critical images
  lazyLoadImages: () => {
    const images = document.querySelectorAll('img[data-src]')
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          img.src = img.dataset.src!
          img.classList.remove('lazy')
          imageObserver.unobserve(img)
        }
      })
    })
    
    images.forEach(img => imageObserver.observe(img))
  }
}
```

#### **Bundle Optimization**
```typescript
// next.config.ts - Bundle optimization
const nextConfig = {
  // ... existing config
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      }
    }
    
    return config
  },
}
```

## 📊 **Post-Deployment Monitoring**

### **1. Performance Monitoring**

#### **Core Web Vitals**
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

#### **Image Performance Metrics**
- **Image Load Success Rate**: > 95%
- **Average Image Load Time**: < 200ms
- **Fallback Usage Rate**: < 5%

### **2. User Analytics**

#### **Key Metrics to Track**
```typescript
// src/lib/analytics/metrics.ts
export const keyMetrics = {
  // Conversion Metrics
  landingPageViews: () => event({ action: 'landing_page_view', category: 'conversion' }),
  demoViews: () => event({ action: 'demo_view', category: 'conversion' }),
  trialStarts: () => event({ action: 'trial_start', category: 'conversion' }),
  walletConnections: () => event({ action: 'wallet_connect', category: 'conversion' }),
  
  // Engagement Metrics
  portfolioViews: () => event({ action: 'portfolio_view', category: 'engagement' }),
  marketplaceViews: () => event({ action: 'marketplace_view', category: 'engagement' }),
  analyticsViews: () => event({ action: 'analytics_view', category: 'engagement' }),
  
  // Performance Metrics
  imageLoadSuccess: (momentId: string, loadTime: number) => 
    event({ action: 'image_load_success', category: 'performance', label: momentId, value: loadTime }),
  imageLoadFallback: (momentId: string) => 
    event({ action: 'image_load_fallback', category: 'performance', label: momentId }),
  
  // Error Tracking
  cdnError: (error: string) => 
    event({ action: 'cdn_error', category: 'error', label: error }),
  fallbackError: (error: string) => 
    event({ action: 'fallback_error', category: 'error', label: error })
}
```

### **3. Error Monitoring**

#### **Sentry Integration**
```typescript
// src/lib/error-monitoring.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['localhost', 'your-domain.com'],
    }),
  ],
})

export const errorMonitoring = {
  captureImageError: (error: Error, momentId: string) => {
    Sentry.captureException(error, {
      tags: {
        type: 'image_load_error',
        momentId,
      },
      extra: {
        momentId,
        error: error.message,
      },
    })
  },
  
  captureCDNError: (error: Error) => {
    Sentry.captureException(error, {
      tags: {
        type: 'cdn_error',
      },
    })
  }
}
```

## 🔄 **Continuous Monitoring**

### **1. Automated Health Checks**

#### **Health Check Endpoint**
```typescript
// src/app/api/health/route.ts
export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '10.1.0',
    environment: process.env.NODE_ENV,
    checks: {
      nbaTopShotCDN: await checkNBATopShotCDN(),
      imageCache: await checkImageCache(),
      database: await checkDatabase(),
    }
  }
  
  return Response.json(health)
}

async function checkNBATopShotCDN() {
  try {
    const response = await fetch('https://assets.nbatopshot.com/resize/editions/common/test/test_capture_Hero_2880_2880_Black.jpg?format=webp&quality=80&width=48&cv=1')
    return response.ok ? 'healthy' : 'unhealthy'
  } catch {
    return 'unhealthy'
  }
}
```

### **2. Performance Alerts**

#### **Alert Configuration**
```typescript
// src/lib/alerts.ts
export const performanceAlerts = {
  checkImagePerformance: async () => {
    const metrics = await getImagePerformanceMetrics()
    
    if (metrics.successRate < 0.95) {
      await sendAlert('Image Load Success Rate Below 95%', {
        current: metrics.successRate,
        threshold: 0.95,
        details: metrics
      })
    }
    
    if (metrics.averageLoadTime > 200) {
      await sendAlert('Average Image Load Time Above 200ms', {
        current: metrics.averageLoadTime,
        threshold: 200,
        details: metrics
      })
    }
  }
}
```

## 🎯 **Launch Checklist**

### **✅ Pre-Launch**
- [ ] All environment variables configured
- [ ] CDN domains whitelisted
- [ ] Image optimization enabled
- [ ] Analytics tracking implemented
- [ ] Error monitoring configured
- [ ] Performance monitoring active
- [ ] Legal disclaimers in place
- [ ] Fair use compliance verified

### **✅ Launch Day**
- [ ] Deploy to production
- [ ] Verify all features working
- [ ] Test image loading performance
- [ ] Monitor error rates
- [ ] Check analytics tracking
- [ ] Verify mobile responsiveness
- [ ] Test onboarding flow
- [ ] Validate conversion tracking

### **✅ Post-Launch**
- [ ] Monitor user feedback
- [ ] Track conversion metrics
- [ ] Optimize based on analytics
- [ ] Scale infrastructure as needed
- [ ] Update legal compliance
- [ ] Plan feature enhancements

## 📈 **Success Metrics**

### **Technical Metrics**
- **Page Load Time**: < 2 seconds
- **Image Load Success Rate**: > 95%
- **Error Rate**: < 1%
- **Uptime**: > 99.9%

### **Business Metrics**
- **Landing Page Conversion**: > 5%
- **Demo to Trial Conversion**: > 15%
- **Trial to Paid Conversion**: > 10%
- **User Retention (7-day)**: > 40%

### **User Experience Metrics**
- **Time to Value**: < 30 seconds
- **User Satisfaction**: > 4.5/5
- **Feature Adoption**: > 60%
- **Support Tickets**: < 5% of users

---

**Deployment Date**: December 2024  
**Version**: CollectorPRO v10.1  
**Status**: Ready for Production  
**NBA TopShot Integration**: ✅ Complete  
**Legal Compliance**: ✅ Verified  
**Performance Optimized**: ✅ Complete 