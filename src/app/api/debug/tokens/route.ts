import { NextRequest, NextResponse } from 'next/server';
import { users, verificationTokens } from '../../../../lib/data';

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: {
        totalUsers: users.length,
        totalTokens: Object.keys(verificationTokens).length,
        users: users.map((u: any) => ({
          email: u.email,
          verified: u.emailVerified,
          hasToken: !!u.verificationToken,
          tokenExpires: u.verificationTokenExpires
        })),
        tokens: Object.entries(verificationTokens).map(([token, data]) => ({
          tokenPreview: token.substring(0, 10) + '...',
          email: (data as any).email,
          expires: new Date((data as any).expires).toISOString(),
          isExpired: Date.now() > (data as any).expires
        }))
      }
    });
  } catch (error) {
    console.error('Debug tokens error:', error);
    return NextResponse.json({ error: 'Failed to get debug info' }, { status: 500 });
  }
} 