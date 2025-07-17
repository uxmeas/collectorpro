import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Log all environment variables
    console.log('🔧 Detailed email debugging:');
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_PORT:', process.env.SMTP_PORT);
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('SMTP_PASS length:', process.env.SMTP_PASS?.length);
    console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);

    // Create transporter with detailed logging
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      debug: true, // Enable debug output
      logger: true, // Log to console
    });

    // Test SMTP connection
    console.log('🔍 Testing SMTP connection...');
    try {
      await transporter.verify();
      console.log('✅ SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('❌ SMTP verification failed:', verifyError);
      return NextResponse.json({ 
        error: 'SMTP verification failed',
        details: verifyError instanceof Error ? verifyError.message : 'Unknown error',
        config: {
          smtpHost: process.env.SMTP_HOST,
          smtpPort: process.env.SMTP_PORT,
          smtpUser: process.env.SMTP_USER,
          smtpPassLength: process.env.SMTP_PASS?.length,
          appUrl: process.env.NEXT_PUBLIC_APP_URL
        }
      }, { status: 500 });
    }

    // Try to send a test email
    console.log('📧 Attempting to send test email...');
    const testToken = 'debug-token-' + Date.now();
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://collectorpro.vercel.app'}/api/auth/verify-email?token=${testToken}`;
    
    const mailOptions = {
      from: `"CollectorPRO" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Test Email - CollectorPRO Debug',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1>🧪 Test Email</h1>
          <p>This is a test email to verify the SMTP configuration is working.</p>
          <p><strong>Token:</strong> ${testToken}</p>
          <p><strong>URL:</strong> ${verificationUrl}</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent successfully!',
      messageId: info.messageId,
      config: {
        smtpHost: process.env.SMTP_HOST,
        smtpPort: process.env.SMTP_PORT,
        smtpUser: process.env.SMTP_USER,
        smtpPassLength: process.env.SMTP_PASS?.length,
        appUrl: process.env.NEXT_PUBLIC_APP_URL
      }
    });
  } catch (error) {
    console.error('❌ Email debug error:', error);
    return NextResponse.json({ 
      error: 'Email debug failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      config: {
        smtpHost: process.env.SMTP_HOST,
        smtpPort: process.env.SMTP_PORT,
        smtpUser: process.env.SMTP_USER,
        smtpPassLength: process.env.SMTP_PASS?.length,
        appUrl: process.env.NEXT_PUBLIC_APP_URL
      }
    }, { status: 500 });
  }
} 