'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [unverified, setUnverified] = useState(false)
  const [resent, setResent] = useState(false)
  const [resending, setResending] = useState(false)
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    // Show success message if redirected from verification
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('verify') === 'success') {
        setSuccess('Your email has been verified! You can now log in.')
        setTimeout(() => setSuccess(''), 4000)
      }
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setUnverified(false)
    setResent(false)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Login failed.')
        if (data.unverified) setUnverified(true)
        setLoading(false)
        return
      }
      router.push('/dashboard')
    } catch {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    setResending(true)
    setResent(false)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resend: true }),
      })
      const data = await res.json()
      if (res.ok) {
        setResent(true)
      } else {
        setError(data.error || 'Failed to resend verification email.')
      }
    } catch {
      setError('Failed to resend verification email.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181A1B] to-[#1D428A] font-[Inter,sans-serif] px-2 relative overflow-x-hidden">
      {/* Subtle universal court background */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{background: 'url("/court-pattern.svg") repeat', opacity: 0.13}} />
      <div className={`relative z-10 bg-[#181A1B]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md border border-[#23272A] transition-all duration-300 glass-card` } style={{boxShadow:'0 8px 32px 0 rgba(31,38,135,0.37)'}}>
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-[#C8102E] to-[#1D428A]">
              <span className="text-2xl">🏆</span>
              <span className="text-xl -ml-2">📊</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white">CollectorPRO</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 tracking-tight">Sign in to your account</h2>
          <p className="text-gray-400 text-xs">Professional analytics for digital collectibles</p>
        </div>
        {success && <div className="text-green-400 text-sm text-center mb-2 animate-fade-in">{success}</div>}
        <form onSubmit={handleLogin} className="space-y-6 animate-fade-in">
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
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-lg bg-[#23272A] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#FDB927] focus:border-[#FDB927] transition-all duration-200 placeholder-gray-400"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#FDB927] transition-colors duration-200 focus:outline-none focus:text-[#FDB927]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <a href="/forgot-password" className="text-xs text-[#FDB927] hover:underline font-medium transition-colors">Forgot password?</a>
            </div>
          </div>
          {error && <div className="text-red-400 text-sm text-center animate-shake mt-2">{error}</div>}
          {unverified && (
            <form onSubmit={handleResend} className="mt-4 animate-fade-in">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FDB927] to-[#C8102E] hover:from-[#C8102E] hover:to-[#1D428A] text-white py-2 rounded-full font-bold text-base transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FDB927]"
                disabled={resending}
              >
                {resending ? 'Resending...' : 'Resend Verification Email'}
              </button>
              {resent && <div className="text-green-400 text-xs text-center mt-2">Verification email resent! Check your inbox.</div>}
            </form>
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#C8102E] to-[#1D428A] hover:from-[#FDB927] hover:to-[#C8102E] text-white py-3 rounded-full font-bold text-lg transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FDB927]"
            disabled={loading}
          >
            {loading && <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-8 flex flex-col items-center space-y-2">
          <span className="text-xs text-gray-400">Don&apos;t have an account? <a href="/register" className="text-[#FDB927] hover:underline">Sign up</a></span>
          <a href="/terms" className="text-[#FDB927] hover:underline text-xs font-medium transition-colors">Terms of Service</a>
          <a href="/privacy" className="text-[#FDB927] hover:underline text-xs font-medium transition-colors">Privacy Policy</a>
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
  )
} 