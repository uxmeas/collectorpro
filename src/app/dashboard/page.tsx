'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const TEAM_LOGOS: { [key: string]: string } = {
  Lakers: '/nba/lakers.svg',
  Warriors: '/nba/warriors.svg',
  Bucks: '/nba/bucks.svg',
  Grizzlies: '/nba/grizzlies.svg',
  Mavericks: '/nba/mavericks.svg',
  Nets: '/nba/nets.svg',
  Celtics: '/nba/celtics.svg',
  Thunder: '/nba/thunder.svg',
  Suns: '/nba/suns.svg',
  Heat: '/nba/heat.svg',
  // Add more as needed
}

const PLAYER_PHOTOS: { [key: string]: string } = {
  'LeBron James': '/nba/players/lebron.png',
  'Stephen Curry': '/nba/players/curry.png',
  'Giannis Antetokounmpo': '/nba/players/giannis.png',
  'Ja Morant': '/nba/players/jamorant.png',
  'Luka Dončić': '/nba/players/luka.png',
  'Kevin Durant': '/nba/players/durant.png',
  'Russell Westbrook': '/nba/players/westbrook.png',
  // Add more as needed
}

const MOMENTS = [
  {
    id: '1',
    player: 'LeBron James',
    team: 'Lakers',
    name: 'Dunk vs Celtics',
    serial: 2341,
    price: 234,
    rarity: 'Rare',
  },
  {
    id: '2',
    player: 'Stephen Curry',
    team: 'Warriors',
    name: '3PT vs Nets',
    serial: 1567,
    price: 189,
    rarity: 'Legendary',
  },
  {
    id: '3',
    player: 'Giannis Antetokounmpo',
    team: 'Bucks',
    name: 'Block',
    serial: 3421,
    price: 156,
    rarity: 'Rare',
  },
  {
    id: '4',
    player: 'Ja Morant',
    team: 'Grizzlies',
    name: 'Alley-Oop',
    serial: 4532,
    price: 134,
    rarity: 'Common',
  },
  {
    id: '5',
    player: 'Luka Dončić',
    team: 'Mavericks',
    name: 'Fadeaway',
    serial: 2789,
    price: 198,
    rarity: 'Rare',
  },
]

const TRANSACTIONS = [
  {
    id: 't1',
    type: 'Purchase',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    amount: 89,
    moment: 'Kevin Durant 3-Pointer',
    player: 'Kevin Durant',
    team: 'Nets',
    photo: '/nba/players/durant.png',
  },
  {
    id: 't2',
    type: 'Sale',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    amount: 156,
    moment: 'Russell Westbrook Dunk',
    player: 'Russell Westbrook',
    team: 'Lakers',
    photo: '/nba/players/westbrook.png',
  },
  {
    id: 't3',
    type: 'Pack Opened',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    amount: 0,
    moment: 'Series 4 Base Pack',
    player: '',
    team: '',
    photo: '',
  },
]

const PORTFOLIO_HISTORY = [
  { date: '2024-05-01', value: 1800 },
  { date: '2024-05-08', value: 2100 },
  { date: '2024-05-15', value: 2300 },
  { date: '2024-05-22', value: 2450 },
  { date: '2024-05-29', value: 2847 },
]

export default function Dashboard() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Portfolio stats
  const totalMoments = 47
  const portfolioValue = 2847
  const totalSpent = 1920
  const roi = '+48.3%'

  useEffect(() => {
    async function checkAuth() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setUserEmail(data.email);
        setLoading(false);
      } catch (err) {
        setError("Session expired. Please log in again.");
        setLoading(false);
        setTimeout(() => router.push("/login"), 1500);
      }
    }
    checkAuth();
    // eslint-disable-next-line
  }, []);

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    }
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181A1B] to-[#1D428A] font-[Inter,sans-serif] text-white relative overflow-x-hidden">
      {/* Basketball court pattern background */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{background: 'url("/court-pattern.svg") repeat', opacity: 0.13}} />
      {/* Header */}
      <header className="relative z-10 bg-black/70 backdrop-blur-md border-b border-[#222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-[#C8102E] to-[#1D428A] mr-2">
              <span className="text-2xl">🏆</span>
              <span className="text-xl -ml-2">📊</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">CollectorPRO</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2">
              <div className="w-2-2ounded-full bg-red-500"></div>
              <span className="text-red-400 text-sm font-semibold">Demo Mode</span>
            </div>
            <span className="text-gray-300 text-sm">{userEmail}</span>
            <button
              onClick={signOut}
              className="bg-gradient-to-r from-[#C8102E] to-[#1D428A] hover:from-[#FDB927] hover:to-[#C8102E] text-white px-4 py-2 rounded-full font-bold transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FDB927]"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>
      {/* Tagline & Disclaimer */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 flex flex-col sm:flex-row sm:justify-between items-center text-xs text-gray-400">
        <span className="font-semibold">Unofficial portfolio analytics for NBA Top Shot collectors</span>
        <span className="mt-2 sm:mt-0">Not affiliated with NBA Top Shot or Dapper Labs</span>
      </div>
      {/* Dashboard Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <span className="inline-block h-12 w-12 border-4 border-[#FDB927] border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="text-4xl mb-4">⚠️</div>
            <div className="text-white text-lg font-semibold mb-2">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-gradient-to-r from-[#C8102E] to-[#1D428A] text-white px-6 py-2 rounded-full font-bold transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FDB927]"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Portfolio Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-[#23272A]/80 rounded-xl p-6 border border-[#333] shadow-md flex flex-col items-center">
                <span className="text-2xl mb-2">💎</span>
                <div className="text-2xl font-bold text-white">{totalMoments}</div>
                <div className="text-xs text-gray-400 mt-1">Total Moments</div>
              </div>
              <div className="bg-[#23272A]/80 rounded-xl p-6 border border-[#333] shadow-md flex flex-col items-center">
                <span className="text-2xl mb-2">📈</span>
                <div className="text-2xl font-bold text-[#FDB927]">${portfolioValue.toLocaleString()}</div>
                <div className="text-xs text-gray-400 mt-1">Portfolio Value</div>
              </div>
              <div className="bg-[#23272A]/80 rounded-xl p-6 border border-[#333] shadow-md flex flex-col items-center">
                <span className="text-2xl mb-2">💰</span>
                <div className="text-2xl font-bold text-[#FDB927]">${totalSpent.toLocaleString()}</div>
                <div className="text-xs text-gray-400 mt-1">Total Spent</div>
              </div>
              <div className="bg-[#23272A]/80 rounded-xl p-6 border border-[#333] shadow-md flex flex-col items-center">
                <span className="text-2xl mb-2">🏆</span>
                <div className="text-2xl font-bold text-green-400">{roi}</div>
                <div className="text-xs text-gray-400 mt-1">ROI</div>
              </div>
            </div>
            {/* Portfolio Value Chart */}
            <div className="bg-[#23272A]/80 rounded-xl p-6 border border-[#333] shadow-md mb-10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>📊</span> Portfolio Value Over Time</h3>
              {/* Simple SVG line chart for demo */}
              <svg width="100%" height="80" viewBox="0 0 400 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline
                  fill="none"
                  stroke="#FDB927"
                  strokeWidth="4"
                  strokeLinejoin="round"
                  points="0,70 80,60 160,50 240,40 320,20 400,10"
                />
                <circle cx="0" cy="70" r="4" fill="#FDB927" />
                <circle cx="80" cy="60" r="4" fill="#FDB927" />
                <circle cx="160" cy="50" r="4" fill="#FDB927" />
                <circle cx="240" cy="40" r="4" fill="#FDB927" />
                <circle cx="320" cy="20" r="4" fill="#FDB927" />
                <circle cx="400" cy="10" r="4" fill="#FDB927" />
              </svg>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                {PORTFOLIO_HISTORY.map((pt) => (
                  <span key={pt.date}>{pt.date.slice(5)}</span>
                ))}
              </div>
            </div>
            {/* Moments Collection */}
            <div className="mb-10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>🏀</span> My Moments</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {MOMENTS.map((moment) => (
                  <div key={moment.id} className="bg-[#181A1B]/90 rounded-xl p-4 border border-[#333] shadow-md flex flex-col items-center hover:scale-105 transition-transform duration-200">
                    <div className="flex items-center gap-2 mb-2">
                      <img src={TEAM_LOGOS[moment.team]} alt={moment.team} className="h-7 w-7 rounded-full border border-[#FDB927] bg-white" />
                      <span className="text-sm font-bold" style={{color: teamColor(moment.team)}}>{moment.team}</span>
                    </div>
                    <img src={PLAYER_PHOTOS[moment.player]} alt={moment.player} className="h-16 w-16 rounded-lg object-cover border-2 border-[#23272A] mb-2" />
                    <div className="text-base font-bold text-white mb-1 text-center">{moment.player}</div>
                    <div className="text-xs text-gray-400 mb-1 text-center">{moment.name}</div>
                    <div className="text-xs text-gray-500 mb-1">Serial #{moment.serial}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-bold text-[#FDB927]">${moment.price}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${rarityColor(moment.rarity)}`}>{moment.rarity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Recent Transactions */}
            <div className="mb-10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>💸</span> Recent Transactions</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="text-gray-400">
                      <th className="py-2 px-2">Type</th>
                      <th className="py-2 px-2">Moment</th>
                      <th className="py-2 px-2">Player</th>
                      <th className="py-2 px-2">Team</th>
                      <th className="py-2 px-2">Date</th>
                      <th className="py-2 px-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TRANSACTIONS.map((tx) => (
                      <tr key={tx.id} className="border-t border-[#23272A] hover:bg-[#23272A]/60 transition-colors">
                        <td className="py-2 px-2 font-bold">
                          <span className={tx.type === 'Purchase' ? 'text-green-400' : tx.type === 'Sale' ? 'text-red-400' : 'text-[#FDB927]'}>{tx.type}</span>
                        </td>
                        <td className="py-2 px-2">{tx.moment}</td>
                        <td className="py-2 px-2">
                          {tx.photo && <img src={tx.photo} alt={tx.player} className="inline h-6 w-6 rounded-full mr-2 align-middle border border-[#FDB927] bg-white" />}
                          {tx.player}
                        </td>
                        <td className="py-2 px-2">
                          {tx.team && <img src={TEAM_LOGOS[tx.team]} alt={tx.team} className="inline h-6 w-6 rounded-full mr-2 align-middle border border-[#FDB927] bg-white" />}
                          {tx.team}
                        </td>
                        <td className="py-2 px-2">{tx.date}</td>
                        <td className="py-2 px-2 font-bold">{tx.amount > 0 ? `$${tx.amount}` : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700;900&display=swap');
        html { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
      `}</style>
    </div>
  )
}

function rarityColor(rarity: string) {
  if (rarity === 'Legendary') return 'bg-gradient-to-r from-[#FDB927] to-[#C8102E] text-black';
  if (rarity === 'Rare') return 'bg-gradient-to-r from-[#1D428A] to-[#FDB927] text-white';
  return 'bg-[#23272A] text-gray-200';
}

function teamColor(team: string) {
  const colors: Record<string, string> = {
    Lakers: '#FDB927',
    Warriors: '#1D428A',
    Bucks: '#00471B',
    Grizzlies: '#5D76A9',
    Mavericks: '#00538C',
    Nets: '#000000',
    Celtics: '#007A33',
    Thunder: '#007AC1',
    Suns: '#1D1160',
    Heat: '#98002E',
  }
  return colors[team] || '#FDB927';
} 