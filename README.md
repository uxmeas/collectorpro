# CollectorPRO 🏆📊

Professional NBA Top Shot portfolio analytics platform for digital collectibles across multiple blockchains.

## 🚀 Live Demo
Deploy to Vercel](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/collectorpro)

## ✨ Features

- **🔐 Secure Authentication** - JWT-based auth with email verification
- **💎 Portfolio Analytics** - Track your NBA Top Shot collection value
- **📈 Real-time Data** - Live pricing and market trends
- **🔗 Wallet Integration** - Connect your Dapper wallet
- **📊 Advanced Analytics** - ROI tracking and performance metrics
- **🎨 Professional UI** - Modern, responsive design
- **🔒 Enterprise Security** - Rate limiting, audit logs, GDPR compliance

## 🛠 Tech Stack

- **Frontend**: Next.js 15act 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Vercel Postgres, Supabase)
- **Authentication**: JWT, bcrypt, email verification
- **Deployment**: Vercel
- **Email**: SendGrid/Mailgun integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Email service (SendGrid, Mailgun)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/collectorpro.git
cd collectorpro
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp env.example .env.local
# Edit .env.local with your configuration
```

4. **Set up database**
```bash
npx prisma db push
npx prisma generate
```

5. **Run development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## 🌐 Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. **Fork this repository**2 **Connect to Vercel**
3. **Add environment variables**
4**Deploy!**

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Main dashboard
│   └── globals.css     # Global styles
├── components/         # Reusable components
├── lib/               # Utilities and configurations
└── types/             # TypeScript type definitions
```

## 🔧 Configuration

### Environment Variables

Required environment variables:

```bash
# Database
DATABASE_URL="postgresql://..."

# Authentication
JWT_SECRET=your-jwt-secret"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="https://your-domain.vercel.app

#Email
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM="noreply@your-domain.com"

# App
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
NEXT_PUBLIC_APP_NAME="CollectorPRO"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@collectorpro.com
- 💬 Discord: [Join our community](https://discord.gg/collectorpro)
- 📖 Documentation: [docs.collectorpro.com](https://docs.collectorpro.com)

---

Built with ❤️ for the NBA Top Shot community
# CollectorPRO - Environment variables updated
// Force fresh deployment
