import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// In-memory storage for wallet addresses (replace with DB later)
const userWallets: Record<string, string> = {};

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    const dapperWallet = userWallets[decoded.email] || '';

    return NextResponse.json({ dapperWallet });
  } catch {
    return NextResponse.json({ error: 'Failed to get wallet' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    const { dapperEmail, dapperPassword } = await req.json();
    
    // Validate credentials
    if (!dapperEmail || !dapperPassword) {
      return NextResponse.json({ error: 'Dapper email and password are required' }, { status: 400 });
    }

    // For demo purposes, generate a sample wallet address
    // In production, this would authenticate with Dapper and get the real wallet address
    const sampleWalletAddress = '0x' + Math.random().toString(16).substring(2, 18);
    
    // Save wallet address (derived from credentials)
    userWallets[decoded.email] = sampleWalletAddress;
    
    return NextResponse.json({ 
      success: true, 
      dapperWallet: sampleWalletAddress,
      message: 'Wallet connected successfully'
    });
  } catch {
    return NextResponse.json({ error: 'Failed to save wallet' }, { status: 500 });
  }
} 