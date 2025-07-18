import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock the components to avoid Icon issues
jest.mock('@/components/offers/OffersReceived', () => {
  return function MockOffersReceived({ offers }: { offers: any[] }) {
    return (
      <div data-testid="offers-received">
        {offers.length > 0 ? (
          offers.map(offer => (
            <div key={offer.id} data-testid={`offer-${offer.id}`}>
              {offer.assetName}
            </div>
          ))
        ) : (
          <div>No offers received</div>
        )}
      </div>
    )
  }
})

jest.mock('@/components/offers/OffersMade', () => {
  return function MockOffersMade({ offers }: { offers: any[] }) {
    return (
      <div data-testid="offers-made">
        {offers.length > 0 ? (
          offers.map(offer => (
            <div key={offer.id} data-testid={`offer-${offer.id}`}>
              {offer.assetName}
            </div>
          ))
        ) : (
          <div>No offers made</div>
        )}
      </div>
    )
  }
})

jest.mock('@/components/offers/OfferHistory', () => {
  return function MockOfferHistory({ offers }: { offers: any[] }) {
    return (
      <div data-testid="offer-history">
        {offers.length > 0 ? (
          offers.map(offer => (
            <div key={offer.id} data-testid={`offer-${offer.id}`}>
              {offer.assetName}
            </div>
          ))
        ) : (
          <div>No offer history</div>
        )}
      </div>
    )
  }
})

jest.mock('@/components/offers/MarketPulse', () => {
  return function MockMarketPulse({ offers }: { offers: any[] }) {
    return (
      <div data-testid="market-pulse">
        <div>Market Overview</div>
        <div>Offer Trends (30d)</div>
        <div>Platform Distribution</div>
        <div>Market Sentiment</div>
        <div>Acceptance Rate Trend</div>
        <div>Market Insights</div>
      </div>
    )
  }
})

// Mock the Icon component
jest.mock('@/components/design-system/atoms/Icon', () => {
  return function MockIcon({ icon: IconComponent, children, ...props }: any) {
    return <span data-testid="icon" {...props}>{children}</span>
  }
})

// Mock the Text component
jest.mock('@/components/design-system/atoms/Text', () => {
  return function MockText({ children, ...props }: any) {
    return <span {...props}>{children}</span>
  }
})

// Mock the Heading component
jest.mock('@/components/design-system/atoms/Heading', () => {
  return function MockHeading({ children, level, ...props }: any) {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements
    return <Tag {...props}>{children}</Tag>
  }
})

// Mock the PriceDisplay component
jest.mock('@/components/design-system/molecules/PriceDisplay', () => {
  return function MockPriceDisplay({ amount, ...props }: any) {
    return <span {...props}>${amount}</span>
  }
})

// Mock fetch
global.fetch = jest.fn()

const mockOffers = [
  {
    id: '1',
    type: 'received',
    assetId: 'moment_1',
    assetName: 'LeBron James - 2023 Playoffs',
    assetImage: '/api/placeholder/60/60',
    platform: 'topshot',
    offerAmount: 1250,
    currentValue: 1100,
    percentageChange: 13.6,
    status: 'pending',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000),
    buyerAddress: '0x1234...5678',
    offerTrend: 'increasing',
    marketSentiment: 'bullish'
  },
  {
    id: '2',
    type: 'made',
    assetId: 'moment_2',
    assetName: 'Stephen Curry - Championship Moment',
    assetImage: '/api/placeholder/60/60',
    platform: 'topshot',
    offerAmount: 850,
    currentValue: 920,
    percentageChange: -7.6,
    status: 'pending',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000),
    sellerAddress: '0x8765...4321',
    offerTrend: 'decreasing',
    marketSentiment: 'bearish'
  }
]

describe('Offers Management System - Simple Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders offers dashboard with API data', async () => {
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

    // Import the component dynamically to avoid issues
    const { default: OffersDashboard } = await import('@/components/offers/OffersDashboard')
    
    render(<OffersDashboard walletAddress="demo-wallet" />)

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Offers Received')).toBeInTheDocument()
    })

    // Check that offers are displayed
    await waitFor(() => {
      expect(screen.getByText('LeBron James - 2023 Playoffs')).toBeInTheDocument()
    })
  })

  it('handles API errors gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'))

    const { default: OffersDashboard } = await import('@/components/offers/OffersDashboard')
    
    render(<OffersDashboard walletAddress="demo-wallet" />)

    // Should still render with fallback data
    await waitFor(() => {
      expect(screen.getByText('Offers Received')).toBeInTheDocument()
    })
  })

  it('displays market pulse section', async () => {
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

    const { default: OffersDashboard } = await import('@/components/offers/OffersDashboard')
    
    render(<OffersDashboard walletAddress="demo-wallet" />)

    // Click on Market Pulse tab
    await waitFor(() => {
      expect(screen.getByText('Market Pulse')).toBeInTheDocument()
    })

    // Check that market pulse content is displayed
    expect(screen.getByText('Market Overview')).toBeInTheDocument()
    expect(screen.getByText('Offer Trends (30d)')).toBeInTheDocument()
    expect(screen.getByText('Platform Distribution')).toBeInTheDocument()
  })
}) 