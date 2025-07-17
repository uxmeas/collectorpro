"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage({ params }: { params: Promise<{ token: string }> }) {
  const router = useRouter();
  const [status, setStatus] = useState<'pending'|'success'|'expired'|'invalid'|'error'>('pending');
  const [message, setMessage] = useState('Verifying your email...');
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    async function getToken() {
      const resolvedParams = await params;
      setToken(resolvedParams.token);
    }
    getToken();
  }, [params]);

  useEffect(() => {
    if (!token) return;
    
    async function verify() {
      try {
        console.log('🔍 Verifying token:', token);
        const res = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
        const data = await res.json();
        
        console.log('📄 Verification response:', data);
        
        if (res.ok) {
          setStatus('success');
          setMessage('Your email has been verified! You can now log in.');
          setTimeout(() => router.push('/login?verify=success'), 2000);
        } else {
          if (data.error === 'expired') {
            setStatus('expired');
            setMessage('Verification link expired. You can request a new one below.');
          } else if (data.error === 'invalid') {
            setStatus('invalid');
            setMessage('Invalid verification link. Please check your email for the correct link.');
          } else {
            setStatus('error');
            setMessage('Verification failed. Please try again.');
          }
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('Verification failed. Please try again.');
      }
    }
    verify();
  }, [token, router]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setResending(true);
    setResent(false);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resend: true }),
      });
      const data = await res.json();
      if (res.ok) {
        setResent(true);
      } else {
        setMessage(data.error || 'Failed to resend verification email.');
      }
    } catch {
      setMessage('Failed to resend verification email.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1D428A] to-[#181A1B] font-[Inter,sans-serif] px-2 relative overflow-x-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'url("/court-pattern.svg") repeat', opacity: 0.08 }} />
      <div className="relative z-10 bg-[#181A1B]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md border border-[#23272A] transition-all duration-300 glass-card text-center">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-[#C8102E] to-[#1D428A]">
              <span className="text-2xl">🏆</span>
              <span className="text-xl -ml-2">📊</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white">CollectorPRO</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 tracking-tight">Email Verification</h2>
        </div>
        <div className="mb-6 text-white text-base min-h-[2.5em]">{message}</div>
        {(status === 'expired' || status === 'invalid') && (
          <form onSubmit={handleResend} className="space-y-4 animate-fade-in">
            <input
              type="email"
              className="w-full px-4 py-3 rounded-lg bg-[#23272A] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#FDB927] focus:border-[#FDB927] transition-all duration-200 placeholder-gray-400"
              placeholder="Enter your email to resend"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#C8102E] to-[#1D428A] hover:from-[#FDB927] hover:to-[#C8102E] text-white py-3 rounded-full font-bold text-lg transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FDB927]"
              disabled={resending}
            >
              {resending ? 'Resending...' : 'Resend Verification Email'}
            </button>
            {resent && <div className="text-green-400 text-sm text-center mt-2">Verification email resent! Check your inbox.</div>}
          </form>
        )}
        {status === 'success' && (
          <div className="text-green-400 text-sm text-center mt-2">Redirecting to login...</div>
        )}
        {status === 'error' && (
          <div className="text-red-400 text-sm text-center mt-2">Something went wrong. Please try again or contact support.</div>
        )}
      </div>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700;900&display=swap');
        html { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .glass-card { box-shadow: 0 8px 32px 0 rgba(31,38,135,0.37); border: 1.5px solid rgba(255,255,255,0.10); }
        .animate-fade-in { animation: fadeIn 0.5s; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @media (max-width: 640px) {
          .glass-card { padding: 1.25rem !important; }
        }
      `}</style>
    </div>
  );
} 