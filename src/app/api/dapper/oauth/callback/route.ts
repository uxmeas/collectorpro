import { NextRequest, NextResponse } from 'next/server';
import { dapperOAuth } from '../../../../../lib/dapper-oauth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      return NextResponse.redirect(
        `${process.env.APP_URL || 'http://localhost:3000'}/dashboard?error=oauth_denied`
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.APP_URL || 'http://localhost:3000'}/dashboard?error=oauth_invalid`
      );
    }

    // For demo purposes, we'll use a mock email
    // In production, you'd get this from the state or session
    const userEmail = 'demo@example.com';

    try {
      // Handle OAuth callback
      const tokens = await dapperOAuth.handleCallback(code, state, userEmail);

      // Redirect to dashboard with success
      return NextResponse.redirect(
        `${process.env.APP_URL || 'http://localhost:3000'}/dashboard?oauth=success&wallet=${tokens.walletAddress}`
      );
    } catch (callbackError) {
      console.error('OAuth callback error:', callbackError);
      return NextResponse.redirect(
        `${process.env.APP_URL || 'http://localhost:3000'}/dashboard?error=oauth_failed`
      );
    }
  } catch (error) {
    console.error('OAuth callback route error:', error);
    return NextResponse.redirect(
      `${process.env.APP_URL || 'http://localhost:3000'}/dashboard?error=oauth_error`
    );
  }
} 