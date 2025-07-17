import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { users } from '../../../../lib/data';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Check if user already exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    
    // Create user (pre-verified for testing)
    const user = {
      email: email.toLowerCase(),
      passwordHash,
      createdAt: new Date().toISOString(),
      emailVerified: true, // Pre-verified for testing
    };
    
    users.push(user);
    
    return NextResponse.json({
      success: true,
      message: 'User created and verified successfully!',
      data: {
        email: user.email,
        verified: user.emailVerified,
        totalUsers: users.length,
      }
    });
  } catch (error) {
    console.error('Simple register error:', error);
    return NextResponse.json({ 
      error: 'Failed to create user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 