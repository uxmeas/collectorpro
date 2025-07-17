import { NextRequest, NextResponse } from 'next/server';
import { dapperOAuth } from '../../../../../lib/dapper-oauth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const state = searchParams.get('state');
    const dapperEmail = searchParams.get('email'); // This is the Dapper account email, not the CollectorPRO login email

    if (!state || !dapperEmail) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Simulate OAuth callback with mock data
    const mockCode = 'demo-auth-code-' + Math.random().toString(36).substring(7);
    
    // Process the OAuth callback - this connects to the Dapper account, not the CollectorPRO account
    const tokens = await dapperOAuth.handleCallback(mockCode, state, dapperEmail);

    // Redirect back to the app with success
    // The wallet address is now connected to your CollectorPRO account, regardless of email differences
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://collectorpro.vercel.app'}/dashboard?oauth=success&wallet=${tokens.walletAddress}`;
    
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Demo OAuth error:', error);
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://collectorpro.vercel.app'}/dashboard?oauth=error`;
    return NextResponse.redirect(redirectUrl);
  }
} 