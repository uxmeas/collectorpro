import { NextRequest, NextResponse } from 'next/server';
import { users, verificationTokens } from '../../../../lib/data';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        totalUsers: users.length,
        totalTokens: Object.keys(verificationTokens).length,
        users: users.map((u: { email: string; emailVerified: boolean; verificationToken?: string; verificationTokenExpires?: string }) => ({
          email: u.email,
          verified: u.emailVerified,
          hasToken: !!u.verificationToken,
          tokenExpires: u.verificationTokenExpires
        })),
        tokens: Object.entries(verificationTokens).map(([token, data]) => ({
          tokenPreview: token.substring(0, 10) + '...',
          email: (data as { email: string; expires: number }).email,
          expires: new Date((data as { email: string; expires: number }).expires).toISOString(),
          isExpired: Date.now() > (data as { email: string; expires: number }).expires
        }))
      }
    });
  } catch (error) {
    console.error('Debug tokens error:', error);
    return NextResponse.json({ error: 'Failed to get debug info' }, { status: 500 });
  }
} 