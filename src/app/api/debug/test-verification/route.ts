import { NextRequest, NextResponse } from 'next/server';
import { users, verificationTokens } from '../../../../lib/data';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  try {
    // Create a test user
    const testEmail = 'test@example.com';
    const testToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    // Add test user if not exists
    if (!users.find(u => u.email === testEmail)) {
      users.push({
        email: testEmail,
        passwordHash: 'test-hash',
        createdAt: new Date().toISOString(),
        emailVerified: false,
        verificationToken: testToken,
        verificationTokenExpires: tokenExpires.toISOString(),
      });
    }
    
    // Store verification token
    verificationTokens[testToken] = {
      email: testEmail,
      expires: tokenExpires.getTime(),
    };
    
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/verify-email/${testToken}`;
    
    return NextResponse.json({
      success: true,
      data: {
        testEmail,
        testToken,
        verificationUrl,
        tokenLength: testToken.length,
        totalUsers: users.length,
        totalTokens: Object.keys(verificationTokens).length,
        users: users.map(u => ({
          email: u.email,
          verified: u.emailVerified,
          hasToken: !!u.verificationToken
        }))
      }
    });
  } catch (error) {
    console.error('Test verification error:', error);
    return NextResponse.json({ 
      error: 'Failed to create test verification',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 