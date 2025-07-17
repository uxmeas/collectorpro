import { NextRequest, NextResponse } from 'next/server;
import jwt fromjsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ||dev-secret';

// In-memory storage for wallet addresses (replace with DB later)
const userWallets: Record<string, string> =[object Object]ort async function POST(req: NextRequest) {
  try[object Object]
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: Not authenticated },{ status: 401;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    const { dapperWallet } = await req.json();

    // Validate wallet address format (basic check)
    if (dapperWallet && !dapperWallet.startsWith('0x)) {
      return NextResponse.json({ error: 'Invalid wallet address format },{ status: 400 });
    }

    // Save wallet address
    userWallets[decoded.email] = dapperWallet;

    return NextResponse.json({ success: true, dapperWallet });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save wallet },[object Object] status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try[object Object]
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: Not authenticated },{ status: 401;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    const dapperWallet = userWallets[decoded.email] || '';

    return NextResponse.json({ dapperWallet });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to get wallet },[object Object] status: 500 });
  }
} 