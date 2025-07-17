"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccess(false);
    
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError(data.error || "Failed to reset password.");
      }
    } catch {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181A1B] to-[#1D428A] font-[Inter,sans-serif] px-2 relative overflow-x-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none" style={{background: 'url("/court-pattern.svg") repeat', opacity: 0.13}} />
        <div className="relative z-10 bg-[#181A1B]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md border border-[#23272A] glass-card text-center">
          <div className="text-red-400 text-lg mb-4">❌ Invalid Reset Link</div>
          <p className="text-gray-300 text-sm mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <a 
            href="/forgot-password" 
            className="bg-gradient-to-r from-[#C8102E] to-[#1D428A] text-white px-6 py-2 rounded-full font-bold transition-all duration-200 hover:from-[#FDB927] hover:to-[#C8102E]"
          >
            Request New Reset Link
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181A1B] to-[#1D428A] font-[Inter,sans-serif] px-2 relative overflow-x-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none" style={{background: 'url("/court-pattern.svg") repeat', opacity: 0.13}} />
      <div className="relative z-10 bg-[#181A1B]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md border border-[#23272A] glass-card">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-[#C8102E] to-[#1D428A]">
              <span className="text-2xl">🏆</span>
              <span className="text-xl -ml-2">📊</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white">CollectorPRO</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 tracking-tight">Reset Password</h2>
          <p className="text-gray-400 text-sm text-center">Enter your new password</p>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">New Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-lg bg-[#23272A] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#FDB927] focus:border-[#FDB927] transition-all duration-200 placeholder-gray-400"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#FDB927] transition-colors duration-200 focus:outline-none focus:text-[#FDB927]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-1">Confirm New Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-lg bg-[#23272A] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#FDB927] focus:border-[#FDB927] transition-all duration-200 placeholder-gray-400"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Re-enter your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#FDB927] transition-colors duration-200 focus:outline-none focus:text-[#FDB927]"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            
            {error && <div className="text-red-400 text-sm text-center animate-shake">{error}</div>}
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#C8102E] to-[#1D428A] hover:from-[#FDB927] hover:to-[#C8102E] text-white py-3 rounded-full font-bold text-lg transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FDB927]"
              disabled={loading}
            >
              {loading && <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        ) : (
          <div className="text-center animate-fade-in">
            <div className="text-green-400 text-lg mb-4">✅ Password Reset Successfully!</div>
            <p className="text-gray-300 text-sm mb-6">
              Your password has been updated. You can now log in with your new password.
            </p>
            <div className="text-gray-400 text-xs">Redirecting to login...</div>
          </div>
        )}

        <div className="mt-8 flex flex-col items-center space-y-2">
          <a href="/login" className="text-[#FDB927] hover:underline text-sm font-medium transition-colors">
            ← Back to Login
          </a>
        </div>
      </div>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700;900&display=swap');
        html { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .glass-card { box-shadow: 0 8px 32px 0 rgba(31,38,135,0.37); border: 1.5px solid rgba(255,255,255,0.10); }
        .animate-fade-in { animation: fadeIn 0.5s; }
        .animate-shake { animation: shake 0.3s; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes shake { 10%, 90% { transform: translateX(-1px); } 20%, 80% { transform: translateX(2px); } 30%, 50%, 70% { transform: translateX(-4px); } 40%, 60% { transform: translateX(4px); } }
        @media (max-width: 640px) {
          .glass-card { padding: 1.25rem !important; }
        }
      `}</style>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181A1B] to-[#1D428A] font-[Inter,sans-serif] px-2 relative overflow-x-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none" style={{background: 'url("/court-pattern.svg") repeat', opacity: 0.13}} />
        <div className="relative z-10 bg-[#181A1B]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md border border-[#23272A] glass-card text-center">
          <div className="text-gray-300 text-lg mb-4">Loading...</div>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
} 