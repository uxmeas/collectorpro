import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmail } from '../../../lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Test email configuration
    console.log('🔧 Testing email configuration:');
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_PORT:', process.env.SMTP_PORT);
    console.log('SMTP_USER:', process.env.SMTP_USER ? 'Set' : 'Not set');
    console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'Set' : 'Not set');
    console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);

    // Generate a test token
    const testToken = 'test-token-' + Date.now();
    
    // Try to send email
    const success = await sendVerificationEmail(email, testToken);
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Test email sent successfully!',
        config: {
          smtpHost: process.env.SMTP_HOST,
          smtpPort: process.env.SMTP_PORT,
          smtpUser: process.env.SMTP_USER ? 'Configured' : 'Missing',
          smtpPass: process.env.SMTP_PASS ? 'Configured' : 'Missing',
          appUrl: process.env.NEXT_PUBLIC_APP_URL
        }
      });
    } else {
      return NextResponse.json({ 
        error: 'Failed to send email',
        config: {
          smtpHost: process.env.SMTP_HOST,
          smtpPort: process.env.SMTP_PORT,
          smtpUser: process.env.SMTP_USER ? 'Configured' : 'Missing',
          smtpPass: process.env.SMTP_PASS ? 'Configured' : 'Missing',
          appUrl: process.env.NEXT_PUBLIC_APP_URL
        }
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({ 
      error: 'Email test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      config: {
        smtpHost: process.env.SMTP_HOST,
        smtpPort: process.env.SMTP_PORT,
        smtpUser: process.env.SMTP_USER ? 'Configured' : 'Missing',
        smtpPass: process.env.SMTP_PASS ? 'Configured' : 'Missing',
        appUrl: process.env.NEXT_PUBLIC_APP_URL
      }
    }, { status: 500 });
  }
} 