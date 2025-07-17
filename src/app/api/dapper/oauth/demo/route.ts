import { NextRequest, NextResponse } from 'next/server';
import { dapperOAuth } from '../../../../../lib/dapper-oauth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const state = searchParams.get('state');
    const email = searchParams.get('email');

    if (!state || !email) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Simulate OAuth callback with mock data
    const mockCode = 'demo-auth-code-' + Math.random().toString(36).substring(7);
    
    // Process the OAuth callback
    const tokens = await dapperOAuth.handleCallback(mockCode, state, email);

    // Redirect back to the app with success
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://collectorpro.vercel.app'}/dashboard?oauth=success&wallet=${tokens.walletAddress}`;
    
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Demo OAuth error:', error);
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://collectorpro.vercel.app'}/dashboard?oauth=error`;
    return NextResponse.redirect(redirectUrl);
  }
} 