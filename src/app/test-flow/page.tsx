'use client'

import { useState } from 'react'

export default function TestFlow() {
  const [walletAddress, setWalletAddress] = useState('')
  const [debugResult, setDebugResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const testWallet = async () => {
    if (!walletAddress.trim()) {
      setError('Please enter a wallet address')
      return
    }

    setLoading(true)
    setError('')
    setDebugResult(null)

    try {
      const response = await fetch(`/api/debug/flow-test?address=${encodeURIComponent(walletAddress.trim())}`)
      const data = await response.json()

      if (data.success) {
        setDebugResult(data.debug)
      } else {
        setError(data.error || 'Debug test failed')
      }
    } catch (err) {
      setError('Failed to test wallet')
      console.error('Debug test error:', err)
    } finally {
      setLoading(false)
    }
  }

  const testKnownWallets = async () => {
    const knownWallets = [
      '0x1d4b4b0d7f8e9c2a',
      '0x2c3d4e5f6a7b8c9d', 
      '0x3e4f5a6b7c8d9e0f'
    ]

    setLoading(true)
    setError('')
    setDebugResult(null)

    try {
      const wallet = knownWallets[Math.floor(Math.random() * knownWallets.length)]
      setWalletAddress(wallet)
      
      const response = await fetch(`/api/debug/flow-test?address=${encodeURIComponent(wallet)}`)
      const data = await response.json()

      if (data.success) {
        setDebugResult(data.debug)
      } else {
        setError(data.error || 'Debug test failed')
      }
    } catch (err) {
      setError('Failed to test known wallet')
      console.error('Debug test error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1D428A] to-[#181A1B] font-[Inter,sans-serif] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Flow Wallet Debug Tool</h1>
        
        <div className="bg-[#23272A]/80 rounded-xl p-6 border border-[#333] shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4">Test Flow Wallet Connection</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Flow Wallet Address
              </label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0x1234567890abcdef"
                className="w-full px-4 py-3 bg-[#181A1B] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent font-mono"
              />
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={testWallet}
                disabled={loading}
                className="bg-[#C8102E] hover:bg-[#FDB927] text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test Wallet'}
              </button>
              
              <button
                onClick={testKnownWallets}
                disabled={loading}
                className="bg-[#1D428A] hover:bg-[#2C2F33] text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                Test Known Wallet
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-8">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {debugResult && (
          <div className="space-y-6">
            <div className="bg-[#23272A]/80 rounded-xl p-6 border border-[#333] shadow-lg">
              <h3 className="text-lg font-bold mb-4">Debug Results</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-400 text-sm">Wallet Address</p>
                  <p className="text-white font-mono">{debugResult.walletAddress}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Valid Format</p>
                  <p className={debugResult.isValidAddress ? 'text-green-400' : 'text-red-400'}>
                    {debugResult.isValidAddress ? '✅ Yes' : '❌ No'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border border-[#333] rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Account Info Test</h4>
                  <p className={`text-sm ${debugResult.tests.accountInfo.success ? 'text-green-400' : 'text-red-400'}`}>
                    {debugResult.tests.accountInfo.success ? '✅ Success' : '❌ Failed'}
                  </p>
                  {debugResult.tests.accountInfo.error && (
                    <p className="text-red-300 text-sm mt-1">{debugResult.tests.accountInfo.error}</p>
                  )}
                  {debugResult.tests.accountInfo.data && (
                    <div className="mt-2 text-sm">
                      <p>Balance: {debugResult.tests.accountInfo.data.balance || 'N/A'}</p>
                      <p>Contracts: {debugResult.tests.accountInfo.data.contracts?.length || 0}</p>
                      <p>Keys: {debugResult.tests.accountInfo.data.keys || 0}</p>
                    </div>
                  )}
                </div>

                <div className="border border-[#333] rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Moments Test</h4>
                  <p className={`text-sm ${debugResult.tests.moments.success ? 'text-green-400' : 'text-red-400'}`}>
                    {debugResult.tests.moments.success ? '✅ Success' : '❌ Failed'}
                  </p>
                  {debugResult.tests.moments.error && (
                    <p className="text-red-300 text-sm mt-1">{debugResult.tests.moments.error}</p>
                  )}
                  <p className="text-sm mt-1">Found {debugResult.tests.moments.count} moments</p>
                  {debugResult.tests.moments.sample?.length > 0 && (
                    <div className="mt-2 text-sm">
                      <p className="text-gray-400">Sample moments:</p>
                      {debugResult.tests.moments.sample.map((moment: any, index: number) => (
                        <p key={index} className="text-gray-300">
                          {moment.playerName} ({moment.rarity}) - ${moment.currentValue}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border border-[#333] rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Collection Stats Test</h4>
                  <p className={`text-sm ${debugResult.tests.collectionStats.success ? 'text-green-400' : 'text-red-400'}`}>
                    {debugResult.tests.collectionStats.success ? '✅ Success' : '❌ Failed'}
                  </p>
                  {debugResult.tests.collectionStats.error && (
                    <p className="text-red-300 text-sm mt-1">{debugResult.tests.collectionStats.error}</p>
                  )}
                  {debugResult.tests.collectionStats.data && (
                    <div className="mt-2 text-sm">
                      <p>Total Moments: {debugResult.tests.collectionStats.data.totalMoments}</p>
                      <p>Rarity Breakdown: {JSON.stringify(debugResult.tests.collectionStats.data.rarityBreakdown)}</p>
                    </div>
                  )}
                </div>

                <div className="border border-[#333] rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Portfolio Test</h4>
                  <p className={`text-sm ${debugResult.tests.portfolio.success ? 'text-green-400' : 'text-red-400'}`}>
                    {debugResult.tests.portfolio.success ? '✅ Success' : '❌ Failed'}
                  </p>
                  {debugResult.tests.portfolio.data && (
                    <div className="mt-2 text-sm">
                      <p>Total Value: ${debugResult.tests.portfolio.data.totalValue}</p>
                      <p>Total Moments: {debugResult.tests.portfolio.data.totalMoments}</p>
                      <p>Total Profit: ${debugResult.tests.portfolio.data.totalProfit}</p>
                      <p>ROI: {debugResult.tests.portfolio.data.profitPercentage}%</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-[#23272A]/80 rounded-xl p-6 border border-[#333] shadow-lg">
              <h3 className="text-lg font-bold mb-4">Recommendations</h3>
              
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-gray-400">Has TopShot Contract:</span>
                  <span className={debugResult.recommendations.hasTopShotContract ? 'text-green-400 ml-2' : 'text-red-400 ml-2'}>
                    {debugResult.recommendations.hasTopShotContract ? '✅ Yes' : '❌ No'}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-400">Has Moment Collection:</span>
                  <span className={debugResult.recommendations.hasMomentCollection ? 'text-green-400 ml-2' : 'text-red-400 ml-2'}>
                    {debugResult.recommendations.hasMomentCollection ? '✅ Yes' : '❌ No'}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-400">Is Test Wallet:</span>
                  <span className={debugResult.recommendations.isTestWallet ? 'text-yellow-400 ml-2' : 'text-gray-400 ml-2'}>
                    {debugResult.recommendations.isTestWallet ? '🧪 Yes' : 'No'}
                  </span>
                </p>
              </div>

              <div className="mt-4">
                <p className="text-gray-400 text-sm mb-2">Next Steps:</p>
                <ul className="text-sm space-y-1">
                  {debugResult.recommendations.nextSteps.map((step: string, index: number) => (
                    <li key={index} className="text-gray-300">• {step}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 