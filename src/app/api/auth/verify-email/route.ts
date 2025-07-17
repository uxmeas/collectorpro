import { NextRequest, NextResponse } from 'next/server';
// In-memory only: import stores from data file
import { users, verificationTokens } from '../../../../lib/data';

export async function GET(req: NextRequest) {
  console.log('🔍 Verification API called');
  console.log('📄Request URL:', req.url);
  
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  const origin = req.nextUrl.origin;
  
  console.log('🔑 Token from query params:', token);
  console.log('🏠 Origin:', origin);
  console.log('📊 Available tokens:', Object.keys(verificationTokens));
  console.log('👥 Available users:', users.map(u => ({ email: u.email, verified: u.emailVerified })));
  
  if (!token) {
    console.log('❌ No token provided');
    return NextResponse.redirect(`${origin}/login?verify=error`);
  }
  
  const record = verificationTokens[token];
  console.log('🔍 Token record found:', record);
  
  if (!record) {
    console.log('❌ Token not found in verificationTokens');
    return NextResponse.redirect(`${origin}/login?verify=invalid`);
  }
  
  console.log('⏰ Token expires at:', new Date(record.expires));
  console.log('⏰ Current time:', new Date());
  console.log('⏰ Is expired:', Date.now() > record.expires);
  
  if (Date.now() > record.expires) {
    console.log('❌ Token expired');
    delete verificationTokens[token];
    return NextResponse.redirect(`${origin}/login?verify=expired`);
  }
  
  // Find user and set emailVerified
  const user = users.find((u) => u.email === record.email);
  console.log('👤 User found:', user ? { email: user.email, verified: user.emailVerified } : 'Not found');
  
  if (!user) {
    console.log('❌ User not found for email:', record.email);
    delete verificationTokens[token];
    return NextResponse.redirect(`${origin}/login?verify=error`);
  }
  
  console.log('✅ Verifying user email');
  user.emailVerified = true;
  delete user.verificationToken;
  delete user.verificationTokenExpires;
  delete verificationTokens[token];
  
  console.log('✅ Email verification successful');
  console.log('📊 Remaining tokens:', Object.keys(verificationTokens));
  console.log('👥 Updated users:', users.map(u => ({ email: u.email, verified: u.emailVerified })));
  
  return NextResponse.redirect(`${origin}/login?verify=success`);
} 