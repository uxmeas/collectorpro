# CollectorPRO - NBA Top Shot Analytics Platform

The ultimate professional-grade NBA Top Shot analytics platform for collectors, traders, and investors.

## 🚀 Features

### 📊 Advanced Portfolio Analytics
- Real-time portfolio valuation and tracking
- ROI analysis with gain/loss percentages  
- Performance charts and trend analysis
- 40+ comprehensive data fields per moment
- Rarity distribution and scarcity scoring

### 🏪 Marketplace Intelligence
- Live market data and price predictions
- Opportunity alerts for buy/sell signals
- Professional trading interface
- Advanced filtering and search capabilities
- Grid and list view modes

### 💻 Bloomberg Terminal Mode
- Professional trader interface
- Real-time data streaming
- Ultra-fast performance (<200ms filtering)
- Advanced analytics dashboard
- Customizable layouts and widgets

### 💳 Subscription Management
- Multiple pricing tiers (Starter, Pro, Enterprise)
- Stripe integration for secure payments
- Subscription management and billing
- Feature-based access control

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Payments**: Stripe
- **Blockchain**: Flow Network integration
- **Performance**: Virtual scrolling, memoization, caching

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/collectorpro.git
cd collectorpro
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the environment template:
```bash
cp env.example .env.local
```

Update `.env.local` with your configuration:
```env
# Flow Blockchain
FLOW_ACCESS_NODE=https://rest-mainnet.onflow.org
TOPSHOT_CONTRACT_ADDRESS=A.0b2a3299cc857e29.TopShot

# Stripe (get from https://dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs (create products in Stripe)
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...

# App Configuration
NEXT_PUBLIC_DOMAIN=http://localhost:3000
```

### 4. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📋 Usage

### Demo Mode
Visit `/dashboard?wallet=demo-wallet` to see the platform with sample data.

### Real Data
1. Enter a valid Flow wallet address (format: `0x` + 16 hex characters)
2. Examples of real collector wallets:
   - `0x1d4b4b0d7f8e9c2a`
   - `0x2c3d4e5f6a7b8c9d`

### Features Available

#### Analytics Tab
- Portfolio overview with total value and P&L
- Performance charts (line, area, bar, pie)
- Best/worst performers analysis
- Rarity breakdown and insights

#### Marketplace Tab  
- Professional trading interface
- Grid and list view modes
- Advanced filtering (price, rarity, serial, etc.)
- Sorting and search capabilities

#### Terminal Tab
- Bloomberg-style professional interface
- Real-time performance metrics
- Live data streaming indicators
- Advanced data visualization

## 💳 Stripe Integration

### Setup Stripe
1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard → Developers → API keys
3. Create products and prices for subscription plans
4. Set up webhook endpoint at `/api/stripe/webhook`

### Subscription Plans
- **Starter**: $9.99/month - Basic analytics, up to 100 moments
- **Pro**: $19.99/month - Advanced analytics, unlimited moments
- **Enterprise**: $49.99/month - Full features, multi-portfolio

### Test Payments
Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

## 🚀 Production Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Deployment
```bash
npm run build
npm start
```

### Environment Variables for Production
```env
# Use live Stripe keys
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Set production domain
NEXT_PUBLIC_DOMAIN=https://your-domain.com

# Configure webhook endpoint
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 🔧 Configuration

### Performance Optimization
- Virtual scrolling enabled for 2000+ items
- Debounced search with 150ms delay
- Memoized components prevent unnecessary re-renders
- Smart caching for API responses

### Security
- Stripe webhook signature verification
- Environment variable protection
- HTTPS enforced in production
- No sensitive data in client-side code

## 📊 Analytics Features

### Portfolio Metrics
- Total portfolio value
- Total profit/loss ($ and %)
- Average ROI and holding period
- Best/worst performing moments

### Market Data
- Real-time price tracking
- 4h, 24h, 7d, 30d price changes
- Volume and sales count metrics
- Floor price and market trends

### Advanced Analytics
- Rarity scoring and distribution
- Historical performance tracking
- Market sentiment analysis
- Opportunity identification

## 🛡 Flow Blockchain Integration

### Supported Features
- Real wallet address validation
- NBA Top Shot moment fetching
- Market price data retrieval
- Comprehensive metadata access

### Fallback System
1. Try comprehensive Flow API
2. Fall back to regular Flow API  
3. Use demo data if APIs fail
4. Always provide working experience

## 🎨 UI/UX Features

### Professional Design
- Dark theme optimized for traders
- Bloomberg Terminal-inspired interface
- Responsive design for all devices
- Smooth animations and transitions

### Performance Indicators
- Real-time performance metrics in header
- Live data streaming indicators
- Loading states and error handling
- Ultra-fast filtering (<200ms)

## 🔍 Troubleshooting

### Common Issues

**Charts not loading**: Ensure recharts is installed
```bash
npm install recharts
```

**Stripe errors**: Check API keys and webhook configuration

**Flow API failures**: Platform automatically falls back to demo data

**Performance issues**: Enable virtual scrolling for large datasets

### Debug Mode
Set `NODE_ENV=development` to see detailed console logs.

## 📞 Support

- **Email**: support@collectorpro.com
- **Documentation**: Check this README
- **Issues**: Create GitHub issue

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

**CollectorPRO** - Take your NBA Top Shot collection to the next level with professional-grade analytics.
