import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { users, verificationTokens } from '../../../../lib/data';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if user already exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash('testpassword123', 12);
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    // Create user
    const user = {
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
    
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/verify-email/${verificationToken}`;
    
    return NextResponse.json({
      success: true,
      message: 'Test user created successfully!',
      data: {
        email: user.email,
        verificationToken,
        verificationUrl,
        tokenLength: verificationToken.length,
        totalUsers: users.length,
        totalTokens: Object.keys(verificationTokens).length,
      }
    });
  } catch (error) {
    console.error('Test registration error:', error);
    return NextResponse.json({ 
      error: 'Failed to create test user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 