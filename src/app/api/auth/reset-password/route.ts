import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { users } from '../../../../lib/data';
import { passwordResetTokens } from '../forgot-password/route';

export async function POST(req: NextRequest) {
  try {
    const { token, password, confirmPassword } = await req.json();

    if (!token || !password || !confirmPassword) {
      return NextResponse.json({ error: 'Token, password, and confirm password are required.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 });
    }

    // Find reset token
    const resetRecord = passwordResetTokens[token];
    
    if (!resetRecord) {
      return NextResponse.json({ error: 'Invalid or expired reset token.' }, { status: 400 });
    }

    // Check if token is expired
    if (Date.now() > resetRecord.expires) {
      delete passwordResetTokens[token];
      return NextResponse.json({ error: 'Reset token has expired.' }, { status: 400 });
    }

    // Find user
    const user = users.find((u: { email: string }) => u.email === resetRecord.email);
    
    if (!user) {
      delete passwordResetTokens[token];
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 12);
    
    // Update user password
    user.passwordHash = passwordHash;
    
    // Clear reset token
    delete passwordResetTokens[token];

    return NextResponse.json({ 
      success: true, 
      message: 'Password has been reset successfully. You can now log in with your new password.' 
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Failed to reset password.' }, { status: 500 });
  }
} 