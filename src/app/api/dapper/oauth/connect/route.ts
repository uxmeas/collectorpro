import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { dapperOAuth } from '../../../../../lib/dapper-oauth';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function POST(req: NextRequest) {
  try {
    // Get user from JWT token
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    const userEmail = decoded.email;

    // Check if user already has OAuth connection
    if (dapperOAuth.hasConnection(userEmail)) {
      return NextResponse.json({
        success: true,
        message: 'Already connected to Dapper',
        walletAddress: dapperOAuth.getWalletAddressForUser(userEmail),
      });
    }

    // Generate OAuth authorization URL
    const authUrl = dapperOAuth.generateAuthUrl(userEmail);

    return NextResponse.json({
      success: true,
      authUrl,
      message: 'Redirect to Dapper for authorization',
    });
  } catch (error) {
    console.error('OAuth connect error:', error);
    return NextResponse.json({ 
      error: 'Failed to initiate OAuth connection',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
} 