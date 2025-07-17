"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface DapperMoment {
  id: string;
  playId: string;
  playerName: string;
  teamName: string;
  playCategory: string;
  playType: string;
  rarity: string;
  serialNumber: number;
  totalCirculation: number;
  acquisitionPrice?: number;
  currentValue?: number;
  acquisitionDate?: string;
  momentURL: string;
  imageURL: string;
}

interface Portfolio {
  totalValue: number;
  totalMoments: number;
  totalAcquisitionCost: number;
  totalProfit: number;
  profitPercentage: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [dapperWallet, setDapperWallet] = useState("");
  const [dapperEmail, setDapperEmail] = useState("");
  const [dapperPassword, setDapperPassword] = useState("");
  const [showCredentials, setShowCredentials] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [moments, setMoments] = useState<DapperMoment[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        // Check authentication
        const authRes = await fetch("/api/auth/me", { credentials: "include" });
        if (!authRes.ok) {
          router.push("/login");
          return;
        }
        const authData = await authRes.json();
        setUserEmail(authData.email);

        // Check for OAuth callback
        const urlParams = new URLSearchParams(window.location.search);
        const oauthStatus = urlParams.get('oauth');
        const oauthWallet = urlParams.get('wallet');
        
        if (oauthStatus === 'success' && oauthWallet) {
          setDapperWallet(oauthWallet);
          await fetchDapperData(oauthWallet);
          // Clear URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          // Get wallet address from profile
          const walletRes = await fetch("/api/profile/wallet", { credentials: "include" });
          if (walletRes.ok) {
            const walletData = await walletRes.json();
            setDapperWallet(walletData.dapperWallet || "");
            
            // If wallet is connected, fetch real data
            if (walletData.dapperWallet) {
              await fetchDapperData(walletData.dapperWallet);
            }
          }
        }

        setLoading(false);
      } catch {
        setError("Failed to load dashboard");
        setLoading(false);
      }
    }
    loadDashboard();
  }, [router]);

  const fetchDapperData = async (walletAddress: string, email?: string, password?: string) => {
    try {
      setConnecting(true);
      setError("");

      let response;
      if (email && password) {
        // Manual connection with credentials
        response = await fetch(`/api/dapper/connect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            walletAddress,
            dapperEmail: email,
            dapperPassword: password
          }),
        });
      } else {
        // OAuth connection (no credentials needed)
        response = await fetch(`/api/dapper/connect?address=${walletAddress}`, {
          credentials: "include",
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.requiresCredentials) {
          setShowCredentials(true);
          setError("Please provide your Dapper credentials to verify wallet ownership");
          return;
        }
        throw new Error(errorData.error || "Failed to connect to Dapper wallet");
      }

      const data = await response.json();
      
      if (data.success) {
        setMoments(data.data.moments);
        setPortfolio(data.data.portfolio);
        setLastUpdated(data.data.lastUpdated);
        setShowCredentials(false); // Hide credentials form on success
      } else {
        throw new Error(data.error || "Failed to fetch Dapper data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect to Dapper wallet. Please check your wallet address and credentials.");
      console.error("Dapper connection error:", err);
    } finally {
      setConnecting(false);
    }
  };

  const handleOAuthConnect = async () => {
    try {
      setConnecting(true);
      setError("");

      const response = await fetch("/api/dapper/oauth/connect", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to initiate OAuth connection");
      }

      const data = await response.json();
      
      if (data.success) {
        if (data.authUrl) {
          // Redirect to Dapper OAuth
          window.location.href = data.authUrl;
        } else if (data.walletAddress) {
          // Already connected
          setDapperWallet(data.walletAddress);
          await fetchDapperData(data.walletAddress);
        }
      } else {
        throw new Error(data.error || "OAuth connection failed");
      }
    } catch (err) {
      setError("Failed to connect with Dapper OAuth");
      console.error("OAuth connection error:", err);
    } finally {
      setConnecting(false);
    }
  };

  const handleConnectWallet = async () => {
    if (!dapperWallet) {
      setError("Please enter your Dapper wallet address");
      return;
    }

    // Validate wallet format
    if (!dapperWallet.toLowerCase().startsWith('0x')) {
      setError("Wallet address must start with 0x");
      return;
    }

    // Check if credentials are required
    if (!dapperEmail || !dapperPassword) {
      setShowCredentials(true);
      setError("Please provide your Dapper credentials to verify wallet ownership");
      return;
    }

    // Save wallet address first
    try {
      const saveRes = await fetch("/api/profile/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ dapperWallet }),
      });

      if (!saveRes.ok) {
        const errorData = await saveRes.json();
        throw new Error(errorData.error || "Failed to save wallet address");
      }

      // Then fetch Dapper data with credentials
      await fetchDapperData(dapperWallet, dapperEmail, dapperPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#181A1B] to-[#1D428A] flex items-center justify-center">
        <span className="inline-block h-12 w-12 border-4 border-[#FDB927] border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181A1B] to-[#1D428A] font-[Inter,sans-serif] text-white relative overflow-x-hidden">
      {/* Subtle court background */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'url("/court-pattern.svg") repeat', opacity: 0.08 }} />
      
      {/* Header */}
      <header className="relative z-10 bg-black/70 backdrop-blur-md border-b border-[#222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-[#C8102E] to-[#1D428A] mr-2">
              <span className="text-2xl">🏀</span>
              <span className="text-xl -ml-2">📊</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">CollectorPRO</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300 text-sm">{userEmail}</span>
            <button
              onClick={() => router.push("/profile")}
              className="bg-gradient-to-r from-[#C8102E] to-[#1D428A] hover:from-[#FDB927] hover:to-[#C8102E] text-white px-4 py-2 rounded-full font-bold transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FDB927]"
            >
              Profile
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Wallet Connection */}
        {!dapperWallet && (
          <div className="bg-[#181A1B]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-[#23272A] mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Connect Your Dapper Wallet</h2>
            <p className="text-gray-300 mb-6">
              Connect your Dapper wallet to view your real NBA Top Shot collection and portfolio analytics.
            </p>
            
            {/* OAuth Connection Option */}
            <div className="mb-6 p-4 bg-[#23272A]/50 rounded-lg border border-[#333]">
              <h3 className="text-lg font-semibold text-white mb-2">🔐 Quick Connect (Recommended)</h3>
              <p className="text-gray-400 text-sm mb-4">
                Connect securely with your Dapper account using OAuth. Your Dapper account email can be different from your CollectorPRO login email.
              </p>
              <button
                onClick={handleOAuthConnect}
                disabled={connecting}
                className="bg-gradient-to-r from-[#FDB927] to-[#C8102E] hover:from-[#1D428A] hover:to-[#FDB927] text-black px-6 py-3 rounded-full font-bold transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FDB927]"
              >
                {connecting && <span className="inline-block h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>}
                {connecting ? "Connecting..." : "🔗 Connect with Dapper"}
              </button>
            </div>

            {/* Manual Connection Option */}
            <div className="p-4 bg-[#23272A]/50 rounded-lg border border-[#333]">
              <h3 className="text-lg font-semibold text-white mb-2">📝 Manual Connection</h3>
              <p className="text-gray-400 text-sm mb-4">
                Enter your Flow wallet address and Dapper credentials to verify ownership. This wallet can be associated with any Dapper account, regardless of your CollectorPRO login email.
              </p>
              
              {/* Wallet Address Input */}
              <div className="mb-4">
                <input
                  type="text"
                  value={dapperWallet}
                  onChange={(e) => setDapperWallet(e.target.value)}
                  placeholder="Enter your Flow wallet address (e.g., 0x1234567890abcdef)"
                  className="w-full px-4 py-3 rounded-lg bg-[#181A1B] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#FDB927] focus:border-[#FDB927] transition-all duration-200 placeholder-gray-400"
                />
              </div>

              {/* Dapper Credentials */}
              {showCredentials && (
                <div className="space-y-4 mb-4">
                  <div>
                    <input
                      type="email"
                      value={dapperEmail}
                      onChange={(e) => setDapperEmail(e.target.value)}
                      placeholder="Your Dapper account email"
                      className="w-full px-4 py-3 rounded-lg bg-[#181A1B] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#FDB927] focus:border-[#FDB927] transition-all duration-200 placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      value={dapperPassword}
                      onChange={(e) => setDapperPassword(e.target.value)}
                      placeholder="Your Dapper account password"
                      className="w-full px-4 py-3 rounded-lg bg-[#181A1B] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#FDB927] focus:border-[#FDB927] transition-all duration-200 placeholder-gray-400"
                    />
                  </div>
                  <p className="text-yellow-400 text-sm">
                    🔒 Your Dapper credentials are only used to verify wallet ownership and are not stored.
                  </p>
                </div>
              )}

              <button
                onClick={handleConnectWallet}
                disabled={connecting}
                className="w-full bg-gradient-to-r from-[#C8102E] to-[#1D428A] hover:from-[#FDB927] hover:to-[#C8102E] text-white px-6 py-3 rounded-full font-bold transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FDB927]"
              >
                {connecting && <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                {connecting ? "Connecting..." : "Connect Wallet"}
              </button>
            </div>
          </div>
        )}

        {/* Portfolio Overview */}
        {portfolio && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#181A1B]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-[#23272A]">
              <h3 className="text-gray-400 text-sm font-medium mb-2">Portfolio Value</h3>
              <p className="text-2xl font-bold text-white">{formatCurrency(portfolio.totalValue)}</p>
            </div>
            <div className="bg-[#181A1B]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-[#23272A]">
              <h3 className="text-gray-400 text-sm font-medium mb-2">Total Moments</h3>
              <p className="text-2xl font-bold text-white">{portfolio.totalMoments}</p>
            </div>
            <div className="bg-[#181A1B]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-[#23272A]">
              <h3 className="text-gray-400 text-sm font-medium mb-2">Total Profit/Loss</h3>
              <p className={`text-2xl font-bold ${portfolio.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(portfolio.totalProfit)}
              </p>
            </div>
            <div className="bg-[#181A1B]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-[#23272A]">
              <h3 className="text-gray-400 text-sm font-medium mb-2">ROI</h3>
              <p className={`text-2xl font-bold ${portfolio.profitPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatPercentage(portfolio.profitPercentage)}
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-8">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Last Updated */}
        {lastUpdated && (
          <div className="text-gray-400 text-sm mb-6">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </div>
        )}

        {/* Moments Grid */}
        {moments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {moments.map((moment) => (
              <div key={moment.id} className="bg-[#181A1B]/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#23272A] overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{moment.playerName}</h3>
                      <p className="text-gray-400 text-sm">{moment.teamName}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      moment.rarity === 'LEGENDARY' ? 'bg-yellow-500/20 text-yellow-400' :
                      moment.rarity === 'RARE' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {moment.rarity}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-300">
                      <span className="font-medium">Play:</span> {moment.playCategory} - {moment.playType}
                    </p>
                    <p className="text-sm text-gray-300">
                      <span className="font-medium">Serial:</span> #{moment.serialNumber} / {moment.totalCirculation}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Current Value</p>
                      <p className="text-lg font-bold text-white">{formatCurrency(moment.currentValue || 0)}</p>
                    </div>
                    {moment.acquisitionPrice && (
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Acquired</p>
                        <p className="text-sm text-white">{formatCurrency(moment.acquisitionPrice)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : dapperWallet ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No moments found in your collection.</p>
            <p className="text-gray-500 text-sm mt-2">Make sure your wallet address is correct and contains NBA Top Shot moments.</p>
          </div>
        ) : null}
      </main>
    </div>
  );
} 