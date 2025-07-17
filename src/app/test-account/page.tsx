"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TestAccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const createTestAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/debug/simple-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setMessage("✅ Account created successfully! You can now log in.");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setMessage(`❌ Error: ${data.error || "Failed to create account"}`);
      }
    } catch (error) {
      setMessage("❌ Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1D428A] to-[#181A1B] font-[Inter,sans-serif] px-2 relative overflow-x-hidden">
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
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 tracking-tight">Create Test Account</h2>
          <p className="text-gray-400 text-sm text-center">Bypass email verification for testing</p>
        </div>

        {!success ? (
          <form onSubmit={createTestAccount} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#23272A] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#FDB927] focus:border-[#FDB927] transition-all duration-200 placeholder-gray-400"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#23272A] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#FDB927] focus:border-[#FDB927] transition-all duration-200 placeholder-gray-400"
                placeholder="Enter your password"
                required
              />
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-sm ${success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#C8102E] to-[#1D428A] hover:from-[#FDB927] hover:to-[#C8102E] text-white py-3 rounded-full font-bold text-lg transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FDB927]"
            >
              {loading && <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
              {loading ? "Creating Account..." : "Create Test Account"}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="text-green-400 text-lg mb-4">✅ Account Created Successfully!</div>
            <p className="text-gray-300 mb-4">Your account is ready to use. Redirecting to login...</p>
            <button
              onClick={() => router.push("/login")}
              className="bg-gradient-to-r from-[#FDB927] to-[#C8102E] text-black px-6 py-2 rounded-full font-bold transition-all duration-200"
            >
              Go to Login
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700;900&display=swap');
        html { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .glass-card { box-shadow: 0 8px 32px 0 rgba(31,38,135,0.37); border: 1.5px solid rgba(255,255,255,0.10); }
      `}</style>
    </div>
  );
} 