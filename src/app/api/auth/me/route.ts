import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string; createdAt: string };
    return NextResponse.json({ email: decoded.email });
  } catch {
    return NextResponse.json({ error: 'Session expired' }, { status: 401 });
  }
} 