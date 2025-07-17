"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [dapperWallet, setDapperWallet] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setUserEmail(data.email);
        setDapperWallet(data.dapperWallet || "");
        setLoading(false);
      } catch (err) {
        setError("Failed to load profile");
        setLoading(false);
      }
    }
    loadProfile();
  }, [router]);

  const handleSaveWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/profile/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dapperWallet }),
      });

      if (!res.ok) {
        setError("Failed to save wallet address");
        return;
      }

      setSuccess("Dapper wallet address saved successfully!");
    } catch (err) {
      setError("Failed to save wallet address");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#181 to-[#1 flex items-center justify-center">
        <span className="inline-block h-12 w-12 border-4r-[#FDB927rder-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181 to-[#1D428] font-[Inter,sans-serif] text-white relative overflow-x-hidden">
      {/* Subtle court background */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'url("/court-pattern.svg") repeat, opacity:0.08}} />
      
      {/* Header */}
      <header className="relative z-10 bg-black/70rop-blur-md border-b border-[#222    <div className=max-w-7xl mx-auto px-4:px-6 lg:px-8 flex justify-between items-center py-6    <div className=flex items-center gap-3>
            <div className=flex items-center justify-center h-10 w-10d-full bg-gradient-to-br from-[#C8102E] to-[#1D428A] mr-2>             <span className="text-2xl">🏆</span>
              <span className=text-xl -ml-2">📊</span>
            </div>
            <h1 className=text-2xl sm:text-3extrabold tracking-tight text-white>CollectorPRO</h1
          </div>
          <div className=flexitems-center space-x-4
            <span className="text-gray-300ext-sm">{userEmail}</span>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-gradient-to-r from-[#C8102to-[#1428] hover:from-[#FDB927] hover:to-[#C8102E] text-white px-4 py-2 rounded-full font-bold transition-all duration-200hadow-lg focus:outline-none focus:ring-2ocus:ring-[#FDB927   >
              Dashboard
            </button>
          </div>
        </div>
      </header>
[object Object]/* Profile Content */}
      <main className=relative z-10 max-w-4xl mx-auto px-4sm:px-6-8 py-10    <div className="bg-[#1811]/90op-blur-xl rounded-2dow-2xl p-8order border-[#23272A]">
          <h2 className="text-3nt-bold text-white mb-8>Profile Settings</h2>
          
          {/* Account Info */}
          <div className="mb-8>     <h3 className="text-xl font-semibold text-white mb-4">Account Information</h3>
            <div className="bg-[#23272 rounded-lg p-4>              <div className="flex justify-between items-center>
                <span className="text-gray-30n>
                <span className="text-white font-medium">{userEmail}</span>
              </div>
              <div className="flex justify-between items-center mt-2>
                <span className="text-gray-300ccount Type:</span>
                <span className="text-[#FDB927 font-medium">FREE</span>
              </div>
            </div>
          </div>

          {/* Dapper Wallet Integration */}
          <div className="mb-8>     <h3 className="text-xl font-semibold text-white mb-4">NBA Top Shot Integration</h3>
            <div className="bg-[#23272 rounded-lg p-6>              <div className=flex items-center gap-3 mb-4>
                <div className={`w-3-3nded-full ${dapperWallet ? bg-green-500:bg-[#FDB927]'}`}></div>
                <span className={`font-medium ${dapperWallet ? text-green-400 : text-[#FDB927]'}`}>
                  {dapperWallet ? Connected :Not Connected}                </span>
              </div>
              
              <form onSubmit={handleSaveWallet} className="space-y-4>
                <div>
                  <label htmlFor="dapperWallet className="block text-sm font-medium text-gray-200 mb-2">
                    Dapper Wallet Address
                  </label>
                  <input
                    id="dapperWallet"
                    type="text"
                    value={dapperWallet}
                    onChange={(e) => setDapperWallet(e.target.value)}
                    placeholder=Enteryour Dapper wallet address (0x...)"
                    className="w-full px-4py-3ounded-lg bg-[#181 text-white border border-[#333focus:outline-none focus:ring-2ocus:ring-[#FDB927] focus:border-[#FDB927ition-all duration-200 placeholder-gray-400"
                  />
                  <p className=text-xs text-gray-400 mt-2">
                    This connects your NBA Top Shot collection to CollectorPRO for real portfolio tracking.
                  </p>
                </div>
                
                {error && <div className=text-red-40text-sm">{error}</div>}
                {success && <div className="text-green-400 text-sm">{success}</div>}
                
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-[#C8102to-[#1428] hover:from-[#FDB927] hover:to-[#C8102E] text-white px-6 py-3 rounded-full font-bold transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2hadow-lg focus:outline-none focus:ring-2ocus:ring-[#FDB927]"
                >
                  {saving && <span className="inline-block h-5 w-5der-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                  {saving ? "Saving..." : "Save Wallet Address}                </button>
              </form>
            </div>
          </div>

   [object Object]/* Account Actions */}
          <div className=border-t border-[#333] pt-6>     <h3 className="text-xl font-semibold text-white mb-4>Account Actions</h3>
            <div className="space-y-3>           <button className="text-red-40hover:text-red-300 text-sm font-medium transition-colors>            Delete Account
              </button>
              <button className="text-[#FDB927] hover:text-yellow-300 text-sm font-medium transition-colors>            Export Data
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 