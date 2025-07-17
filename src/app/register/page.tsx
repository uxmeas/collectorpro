"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccess(false);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed.");
        setLoading(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1200);
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1D428A] to-[#181A1B] font-[Inter,sans-serif] px-2 relative overflow-x-hidden">
      {/* Subtle universal court background */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'url("/court-pattern.svg") repeat', opacity: 0.08 }} />
      <div className="relative z-10 bg-[#181A1B]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md border border-[#23272A] transition-all duration-300 glass-card">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-[#C8102E] to-[#1D428A]">
              <span className="text-2xl">🏆</span>
              <span className="text-xl -ml-2">📊</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white">CollectorPRO</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 tracking-tight">Create your account</h2>
          <p className="text-gray-400 text-xs">Professional analytics for digital collectibles</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="w-full px-4 py-3 rounded-lg bg-[#23272A] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#FDB927] focus:border-[#FDB927] transition-all duration-200 placeholder-gray-400"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">Password</label>
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
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                className="w-full px-4 py-3 rounded-lg bg-[#23272A] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#FDB927] focus:border-[#FDB927] transition-all duration-200 placeholder-gray-400"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter your password"
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
          <div className="flex items-center">
            <input id="terms" type="checkbox" required className="mr-2" />
            <label htmlFor="terms" className="text-xs text-gray-300">I agree to the <a href="/terms" className="text-[#FDB927] hover:underline">Terms of Service</a> and <a href="/privacy" className="text-[#FDB927] hover:underline">Privacy Policy</a></label>
          </div>
          {error && <div className="text-red-400 text-sm text-center animate-shake mt-2">{error}</div>}
          {success && <div className="text-green-400 text-sm text-center mt-2">Registration successful! Redirecting...</div>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#C8102E] to-[#1D428A] hover:from-[#FDB927] hover:to-[#C8102E] text-white py-3 rounded-full font-bold text-lg transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FDB927]"
            disabled={loading}
          >
            {loading && <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <div className="mt-8 flex flex-col items-center space-y-2">
          <span className="text-xs text-gray-400">Already have an account? <a href="/login" className="text-[#FDB927] hover:underline">Sign in</a></span>
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