import { NextRequest, NextResponse } from 'next/server';
import { users } from '../../../../lib/data';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Find user
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Mark email as verified
    user.emailVerified = true;
    delete user.verificationToken;
    delete user.verificationTokenExpires;
    
    return NextResponse.json({
      success: true,
      message: 'Email verified successfully!',
      data: {
        email: user.email,
        verified: user.emailVerified,
        totalUsers: users.length,
        verifiedUsers: users.filter(u => u.emailVerified).length
      }
    });
  } catch (error) {
    console.error('Direct verify error:', error);
    return NextResponse.json({ 
      error: 'Failed to verify email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        totalUsers: users.length,
        verifiedUsers: users.filter(u => u.emailVerified).length,
        unverifiedUsers: users.filter(u => !u.emailVerified).length,
        users: users.map(u => ({
          email: u.email,
          verified: u.emailVerified,
          createdAt: u.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Direct verify GET error:', error);
    return NextResponse.json({ error: 'Failed to get users' }, { status: 500 });
  }
} 