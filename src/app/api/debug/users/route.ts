import { NextResponse } from 'next/server';
import { users } from '../../../../lib/data';

export async function GET() {
  try {
    // Return list of users (without sensitive data)
    const userList = users.map(user => ({
      email: user.email,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      hasVerificationToken: !!user.verificationToken
    }));

    return NextResponse.json({
      success: true,
      totalUsers: users.length,
      users: userList
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to get users',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 