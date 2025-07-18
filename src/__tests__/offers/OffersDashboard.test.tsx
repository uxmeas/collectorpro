import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import OffersDashboard from '@/components/offers/OffersDashboard'
import OffersReceived from '@/components/offers/OffersReceived'
import OffersMade from '@/components/offers/OffersMade'
import OfferHistory from '@/components/offers/OfferHistory'
import MarketPulse from '@/components/offers/MarketPulse'

// Mock the API calls
global.fetch = jest.fn()

const mockOffers = [
  {
    id: '1',
    type: 'received' as const,
    assetId: 'moment_1',
    assetName: 'LeBron James - 2023 Playoffs',
    assetImage: '/api/placeholder/60/60',
    platform: 'topshot' as const,
    offerAmount: 1250,
    currentValue: 1100,
    percentageChange: 13.6,
    status: 'pending' as const,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000),
    buyerAddress: '0x1234...5678',
    offerTrend: 'increasing' as const,
    marketSentiment: 'bullish' as const
  },
  {
    id: '2',
    type: 'made' as const,
    assetId: 'moment_2',
    assetName: 'Stephen Curry - Championship Moment',
    assetImage: '/api/placeholder/60/60',
    platform: 'topshot' as const,
    offerAmount: 850,
    currentValue: 920,
    percentageChange: -7.6,
    status: 'pending' as const,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000),
    sellerAddress: '0x8765...4321',
    offerTrend: 'decreasing' as const,
    marketSentiment: 'bearish' as const
  },
  {
    id: '3',
    type: 'completed' as const,
    assetId: 'moment_3',
    assetName: 'Giannis Antetokounmpo - MVP Season',
    assetImage: '/api/placeholder/60/60',
    platform: 'allday' as const,
    offerAmount: 2100,
    currentValue: 2100,
    percentageChange: 0,
    status: 'accepted' as const,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    buyerAddress: '0x1234...5678',
    offerTrend: 'stable' as const,
    marketSentiment: 'neutral' as const
  }
]

describe('Offers Management System', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('OffersDashboard', () => {
    it('renders offers dashboard with all sections', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({
          success: true,
          offers: mockOffers,
          stats: {
            totalReceived: 1,
            totalMade: 1,
            totalValue: 2100,
            avgResponseTime: 4.2,
            acceptanceRate: 50
          }
        })
      })

      render(<OffersDashboard walletAddress="demo-wallet" />)

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.getByText('Offers Received')).toBeInTheDocument()
      })

      // Check all tabs are present
      expect(screen.getByText('Offers Received')).toBeInTheDocument()
      expect(screen.getByText('Offers Made')).toBeInTheDocument()
      expect(screen.getByText('Offer History')).toBeInTheDocument()
      expect(screen.getByText('Market Pulse')).toBeInTheDocument()

      // Check stats cards
      expect(screen.getByText('1')).toBeInTheDocument() // Total Received
      expect(screen.getByText('$2,100')).toBeInTheDocument() // Total Value
      expect(screen.getByText('50.0%')).toBeInTheDocument() // Acceptance Rate
    })

    it('switches between tabs correctly', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({
          success: true,
          offers: mockOffers,
          stats: {
            totalReceived: 1,
            totalMade: 1,
            totalValue: 2100,
            avgResponseTime: 4.2,
            acceptanceRate: 50
          }
        })
      })

      render(<OffersDashboard walletAddress="demo-wallet" />)

      await waitFor(() => {
        expect(screen.getByText('Offers Received')).toBeInTheDocument()
      })

      // Click on Offers Made tab
      fireEvent.click(screen.getByText('Offers Made'))
      expect(screen.getByText('Stephen Curry - Championship Moment')).toBeInTheDocument()

      // Click on Offer History tab
      fireEvent.click(screen.getByText('Offer History'))
      expect(screen.getByText('Giannis Antetokounmpo - MVP Season')).toBeInTheDocument()

      // Click on Market Pulse tab
      fireEvent.click(screen.getByText('Market Pulse'))
      expect(screen.getByText('Market Overview')).toBeInTheDocument()
    })

    it('handles API errors gracefully', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'))

      render(<OffersDashboard walletAddress="demo-wallet" />)

      await waitFor(() => {
        expect(screen.getByText('Offers Received')).toBeInTheDocument()
      })

      // Should still render with fallback data
      expect(screen.getByText('Offers Received')).toBeInTheDocument()
    })
  })

  describe('OffersReceived', () => {
    it('renders received offers with action buttons', () => {
      const receivedOffers = mockOffers.filter(o => o.type === 'received')
      
      render(<OffersReceived offers={receivedOffers} />)

      expect(screen.getByText('LeBron James - 2023 Playoffs')).toBeInTheDocument()
      expect(screen.getByText('Accept')).toBeInTheDocument()
      expect(screen.getByText('Reject')).toBeInTheDocument()
      expect(screen.getByText('Counter')).toBeInTheDocument()
      expect(screen.getByText('$1,250')).toBeInTheDocument() // Offer amount
      expect(screen.getByText('$1,100')).toBeInTheDocument() // Current value
      expect(screen.getByText('+13.6%')).toBeInTheDocument() // Percentage change
    })

    it('shows empty state when no offers', () => {
      render(<OffersReceived offers={[]} />)

      expect(screen.getByText('No Offers Received')).toBeInTheDocument()
      expect(screen.getByText("You haven't received any offers yet.")).toBeInTheDocument()
    })

    it('displays market intelligence indicators', () => {
      const receivedOffers = mockOffers.filter(o => o.type === 'received')
      
      render(<OffersReceived offers={receivedOffers} />)

      expect(screen.getByText('bullish')).toBeInTheDocument()
      expect(screen.getByText('increasing')).toBeInTheDocument()
    })
  })

  describe('OffersMade', () => {
    it('renders made offers with status indicators', () => {
      const madeOffers = mockOffers.filter(o => o.type === 'made')
      
      render(<OffersMade offers={madeOffers} />)

      expect(screen.getByText('Stephen Curry - Championship Moment')).toBeInTheDocument()
      expect(screen.getByText('Withdraw')).toBeInTheDocument()
      expect(screen.getByText('pending')).toBeInTheDocument()
      expect(screen.getByText('$850')).toBeInTheDocument() // Offer amount
      expect(screen.getByText('$920')).toBeInTheDocument() // Current value
      expect(screen.getByText('-7.6%')).toBeInTheDocument() // Percentage change
    })

    it('shows different status badges correctly', () => {
      const completedOffers = mockOffers.filter(o => o.status === 'accepted')
      
      render(<OffersMade offers={completedOffers} />)

      expect(screen.getByText('Offer Accepted!')).toBeInTheDocument()
    })

    it('shows empty state when no offers', () => {
      render(<OffersMade offers={[]} />)

      expect(screen.getByText('No Offers Made')).toBeInTheDocument()
      expect(screen.getByText("You haven't made any offers yet.")).toBeInTheDocument()
    })
  })

  describe('OfferHistory', () => {
    it('renders offer history with filters', () => {
      const historyOffers = mockOffers.filter(o => ['completed', 'expired', 'rejected'].includes(o.status))
      
      render(<OfferHistory offers={historyOffers} />)

      expect(screen.getByText('Giannis Antetokounmpo - MVP Season')).toBeInTheDocument()
      expect(screen.getByText('All')).toBeInTheDocument()
      expect(screen.getByText('Accepted')).toBeInTheDocument()
      expect(screen.getByText('Rejected')).toBeInTheDocument()
      expect(screen.getByText('Expired')).toBeInTheDocument()
    })

    it('filters offers correctly', () => {
      const historyOffers = mockOffers.filter(o => ['completed', 'expired', 'rejected'].includes(o.status))
      
      render(<OfferHistory offers={historyOffers} />)

      // Click on Accepted filter
      fireEvent.click(screen.getByText('Accepted'))
      expect(screen.getByText('Giannis Antetokounmpo - MVP Season')).toBeInTheDocument()

      // Click on Rejected filter
      fireEvent.click(screen.getByText('Rejected'))
      expect(screen.queryByText('Giannis Antetokounmpo - MVP Season')).not.toBeInTheDocument()
    })

    it('sorts offers correctly', () => {
      const historyOffers = mockOffers.filter(o => ['completed', 'expired', 'rejected'].includes(o.status))
      
      render(<OfferHistory offers={historyOffers} />)

      const sortSelect = screen.getByDisplayValue('Date')
      fireEvent.change(sortSelect, { target: { value: 'amount' } })
      expect(sortSelect).toHaveValue('amount')
    })

    it('shows empty state when no history', () => {
      render(<OfferHistory offers={[]} />)

      expect(screen.getByText('No Offer History')).toBeInTheDocument()
      expect(screen.getByText("Your offer history will appear here")).toBeInTheDocument()
    })
  })

  describe('MarketPulse', () => {
    it('renders market pulse with charts and insights', () => {
      render(<MarketPulse offers={mockOffers} />)

      expect(screen.getByText('Market Overview')).toBeInTheDocument()
      expect(screen.getByText('Offer Trends (30d)')).toBeInTheDocument()
      expect(screen.getByText('Platform Distribution')).toBeInTheDocument()
      expect(screen.getByText('Market Sentiment')).toBeInTheDocument()
      expect(screen.getByText('Acceptance Rate Trend')).toBeInTheDocument()
      expect(screen.getByText('Market Insights')).toBeInTheDocument()
    })

    it('displays market insights correctly', () => {
      render(<MarketPulse offers={mockOffers} />)

      expect(screen.getByText('TopShot Offer Volume Up 23%')).toBeInTheDocument()
      expect(screen.getByText('AllDay Acceptance Rate Declining')).toBeInTheDocument()
      expect(screen.getByText('Panini Market Stabilizing')).toBeInTheDocument()
    })

    it('shows timeframe filters', () => {
      render(<MarketPulse offers={mockOffers} />)

      expect(screen.getByText('7d')).toBeInTheDocument()
      expect(screen.getByText('30d')).toBeInTheDocument()
      expect(screen.getByText('90d')).toBeInTheDocument()
    })

    it('shows platform filters', () => {
      render(<MarketPulse offers={mockOffers} />)

      const platformSelect = screen.getByDisplayValue('All Platforms')
      expect(platformSelect).toBeInTheDocument()
    })
  })

  describe('API Integration', () => {
    it('fetches offers data from API', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({
          success: true,
          offers: mockOffers,
          stats: {
            totalReceived: 1,
            totalMade: 1,
            totalValue: 2100,
            avgResponseTime: 4.2,
            acceptanceRate: 50
          }
        })
      })

      render(<OffersDashboard walletAddress="demo-wallet" />)

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/offers?address=demo-wallet')
      })

      await waitFor(() => {
        expect(screen.getByText('LeBron James - 2023 Playoffs')).toBeInTheDocument()
      })
    })

    it('handles offer actions via API', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => ({
            success: true,
            offers: mockOffers,
            stats: { totalReceived: 1, totalMade: 1, totalValue: 2100, avgResponseTime: 4.2, acceptanceRate: 50 }
          })
        })
        .mockResolvedValueOnce({
          json: async () => ({ success: true, message: 'Offer accepted' })
        })

      render(<OffersDashboard walletAddress="demo-wallet" />)

      await waitFor(() => {
        expect(screen.getByText('Accept')).toBeInTheDocument()
      })

      // Click accept button
      fireEvent.click(screen.getByText('Accept'))

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/offers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'accept', offerId: '1' })
        })
      })
    })
  })

  describe('Professional UI Elements', () => {
    it('displays Bloomberg Terminal-style design', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({
          success: true,
          offers: mockOffers,
          stats: { totalReceived: 1, totalMade: 1, totalValue: 2100, avgResponseTime: 4.2, acceptanceRate: 50 }
        })
      })

      render(<OffersDashboard walletAddress="demo-wallet" />)

      await waitFor(() => {
        expect(screen.getByText('Offers Received')).toBeInTheDocument()
      })

      // Check for professional styling classes
      const dashboard = screen.getByText('Offers Received').closest('div')
      expect(dashboard).toHaveClass('space-y-6')
    })

    it('shows color-coded status indicators', () => {
      const receivedOffers = mockOffers.filter(o => o.type === 'received')
      
      render(<OffersReceived offers={receivedOffers} />)

      // Check for color-coded elements
      const acceptButton = screen.getByText('Accept')
      expect(acceptButton).toHaveClass('bg-green-600')
      
      const rejectButton = screen.getByText('Reject')
      expect(rejectButton).toHaveClass('border-red-500')
    })

    it('displays market intelligence badges', () => {
      const receivedOffers = mockOffers.filter(o => o.type === 'received')
      
      render(<OffersReceived offers={receivedOffers} />)

      expect(screen.getByText('bullish')).toBeInTheDocument()
      expect(screen.getByText('increasing')).toBeInTheDocument()
    })
  })
}) 