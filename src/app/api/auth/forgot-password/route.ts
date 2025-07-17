import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { users, passwordResetTokens } from '../../../../lib/data';
import { sendPasswordResetEmail } from '../../../../lib/email';

// Generate secure reset token
function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    // Find user
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({ 
        success: true, 
        message: 'If an account with that email exists, a password reset link has been sent.' 
      });
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const tokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store reset token
    passwordResetTokens[resetToken] = {
      email: user.email,
      expires: tokenExpires.getTime(),
    };

    // Send password reset email
    await sendPasswordResetEmail(user.email, resetToken);

    return NextResponse.json({ 
      success: true, 
      message: 'If an account with that email exists, a password reset link has been sent.' 
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
} 