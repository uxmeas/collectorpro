import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { users } from '../register/route';

interface User {
  email: string;
  passwordHash: string;
  emailVerified?: boolean;
  verificationToken?: string;
  createdAt: string;
}

// In-memory rate limit store (by IP)
const failedAttempts: Record<string, { count: number; lastAttempt: number; lockedUntil?: number }> = {};
const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = '24h';

function resendVerificationEmail(user: User) {
  if (!user.verificationToken) return;
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email/${user.verificationToken}`;
  console.log(`📧 Resending verification email to ${user.email}`);
  console.log(`🔗 Verification URL: ${verificationUrl}`);
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    // Rate limiting
    const rate = failedAttempts[ip] || { count: 0, lastAttempt: 0 };
    if (rate.lockedUntil && now < rate.lockedUntil) {
      return NextResponse.json({ error: 'Too many failed attempts. Try again later.' }, { status: 429 });
    }
    const { email, password, resend } = await req.json();
    if (!email || (!password && !resend)) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }
    // Find user
    const user = users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      failedAttempts[ip] = { count: rate.count + 1, lastAttempt: now };
      if (failedAttempts[ip].count >= MAX_ATTEMPTS) {
        failedAttempts[ip].lockedUntil = now + LOCKOUT_MINUTES * 60 * 1000;
      }
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }
    // If resend requested
    if (resend) {
      resendVerificationEmail(user);
      return NextResponse.json({ success: true, message: 'Verification email resent.' });
    }
    // Check password
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      failedAttempts[ip] = { count: rate.count + 1, lastAttempt: now };
      if (failedAttempts[ip].count >= MAX_ATTEMPTS) {
        failedAttempts[ip].lockedUntil = now + LOCKOUT_MINUTES * 60 * 1000;
      }
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }
    // Check if email is verified
    if (!user.emailVerified) {
      return NextResponse.json({ error: 'Please verify your email first.', unverified: true }, { status: 403 });
    }
    // Reset failed attempts on success
    delete failedAttempts[ip];
    // Generate JWT
    const token = jwt.sign({ email: user.email, createdAt: user.createdAt }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    // Set httpOnly cookie
    const response = NextResponse.json({
      success: true,
      user: {
        email: user.email,
        createdAt: user.createdAt,
      },
    });
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    return response;
  } catch (error: unknown) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed.' }, { status: 500 });
  }
} 