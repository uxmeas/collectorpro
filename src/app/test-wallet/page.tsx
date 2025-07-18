'use client'

import { useState, useEffect } from 'react'

export default function TestWallet() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function testAPI() {
      try {
        setLoading(true)
        
        // Test demo API
        const response = await fetch('/api/demo?address=demo-wallet')
        const result = await response.json()
        
        if (result.success) {
          setData(result.data)
          console.log(`✅ Loaded ${result.data.moments.length} demo moments`)
        } else {
          setError('API returned error: ' + result.error)
        }
      } catch (err) {
        setError('Failed to load data: ' + (err instanceof Error ? err.message : 'Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    testAPI()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1E2124] flex items-center justify-center">
        <div className="text-white text-xl">Loading test data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1E2124] flex items-center justify-center">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1E2124] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">CollectorPRO Data Test</h1>
        
        {data && (
          <div className="space-y-6">
            <div className="bg-[#23272A] rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">✅ API Connection Successful</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#2C2F33] p-4 rounded">
                  <div className="text-sm text-gray-400">Total Moments</div>
                  <div className="text-2xl font-bold text-green-400">{data.moments.length}</div>
                </div>
                <div className="bg-[#2C2F33] p-4 rounded">
                  <div className="text-sm text-gray-400">Total Value</div>
                  <div className="text-2xl font-bold text-green-400">
                    ${data.analytics.overview.totalValue.toFixed(0)}
                  </div>
                </div>
                <div className="bg-[#2C2F33] p-4 rounded">
                  <div className="text-sm text-gray-400">Profit</div>
                  <div className="text-2xl font-bold text-green-400">
                    ${data.analytics.overview.totalProfit.toFixed(0)}
                  </div>
                </div>
                <div className="bg-[#2C2F33] p-4 rounded">
                  <div className="text-sm text-gray-400">ROI</div>
                  <div className="text-2xl font-bold text-green-400">
                    {data.analytics.overview.profitPercentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#23272A] rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Sample Moments</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2C2F33]">
                      <th className="text-left p-2">Player</th>
                      <th className="text-left p-2">Team</th>
                      <th className="text-left p-2">Rarity</th>
                      <th className="text-right p-2">Value</th>
                      <th className="text-right p-2">Serial</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.moments.slice(0, 10).map((moment: any, index: number) => (
                      <tr key={moment.id} className="border-b border-[#2C2F33]">
                        <td className="p-2">{moment.playerName}</td>
                        <td className="p-2 text-gray-400">{moment.teamName}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            moment.rarity === 'ULTIMATE' ? 'bg-purple-500/20 text-purple-400' :
                            moment.rarity === 'LEGENDARY' ? 'bg-yellow-500/20 text-yellow-400' :
                            moment.rarity === 'RARE' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {moment.rarity}
                          </span>
                        </td>
                        <td className="p-2 text-right font-mono">
                          ${moment.currentValue.toFixed(0)}
                        </td>
                        <td className="p-2 text-right font-mono">
                          #{moment.serialNumber}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-green-400 mb-2">✅ All Systems Working!</h2>
              <p className="text-gray-300">
                The demo API is successfully generating realistic NBA Top Shot portfolio data.
                You can now visit the dashboard with confidence that the data will load properly.
              </p>
              <div className="mt-4">
                <a
                  href="/dashboard?wallet=demo-wallet"
                  className="inline-block bg-[#FDB927] text-black px-6 py-3 rounded font-medium hover:bg-[#E09F0F] transition-colors"
                >
                  Go to Dashboard →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 