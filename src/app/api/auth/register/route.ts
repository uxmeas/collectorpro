import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { users, verificationTokens } from '../../../../lib/data';

// In-memory user store (replace with DB later)
interface User {
  email: string;
  passwordHash: string;
  createdAt: string;
  emailVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: string;
}

// Email regex for basic validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Generate secure verification token
function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Send verification email (placeholder for now)
function sendVerificationEmail(email: string, token: string): void {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${token}`;
  console.log(`📧 Verification email would be sent to ${email}`);
  console.log(`🔗 Verification URL: ${verificationUrl}`);
  // TODO: Integrate with real email service (SendGrid, AWS SES, etc.)
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, confirmPassword } = await req.json();

    // Input validation
    if (!email || !password || !confirmPassword) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 });
    }
    // Check if user already exists
    if (users.some((u: User) => u.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json({ error: 'Email already registered.' }, { status: 409 });
    }
    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    // Generate verification token
    const verificationToken = generateVerificationToken();
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const user: User = {
      email: email.toLowerCase(),
      passwordHash,
      createdAt: new Date().toISOString(),
      emailVerified: false,
      verificationToken,
      verificationTokenExpires: tokenExpires.toISOString(),
    };
    users.push(user);
    // Store verification token
    verificationTokens[verificationToken] = {
      email: email.toLowerCase(),
      expires: tokenExpires.getTime(),
    };
    // Send verification email
    sendVerificationEmail(email, verificationToken);
    // Return success message
    return NextResponse.json({
      success: true,
      message: 'Account created successfully! Please check your email to verify your account.',
      user: {
        email: user.email,
        createdAt: user.createdAt,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error: unknown) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed.' }, { status: 500 });
  }
} 