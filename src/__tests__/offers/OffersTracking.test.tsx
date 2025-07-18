import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import OffersTrackingDashboard from '@/components/offers/OffersTrackingDashboard'

// Mock the API response
const mockTrackingData = {
  performance: {
    totalOffers: 47,
    acceptedOffers: 32,
    rejectedOffers: 12,
    pendingOffers: 3,
    successRate: 68.1,
    avgResponseTime: 4.2,
    totalValue: 42500,
    totalROI: 12.3,
    winLossRatio: 2.67
  },
  platformBreakdown: [
    {
      platform: 'TopShot',
      offers: 22,
      successRate: 77.3,
      avgAmount: 950,
      avgResponseTime: 3.8,
      totalValue: 20900
    },
    {
      platform: 'AllDay',
      offers: 15,
      successRate: 60.0,
      avgAmount: 1200,
      avgResponseTime: 5.1,
      totalValue: 18000
    },
    {
      platform: 'Panini',
      offers: 10,
      successRate: 50.0,
      avgAmount: 360,
      avgResponseTime: 4.7,
      totalValue: 3600
    }
  ],
  timeAnalysis: {
    hourlyDistribution: [
      { hour: 9, offers: 3, successRate: 67 },
      { hour: 10, offers: 5, successRate: 80 },
      { hour: 11, offers: 4, successRate: 75 }
    ],
    dailyDistribution: [
      { day: 'Monday', offers: 8, successRate: 75 },
      { day: 'Tuesday', offers: 12, successRate: 83 },
      { day: 'Wednesday', offers: 6, successRate: 67 }
    ],
    weeklyTrends: [
      { week: 'Week 1', offers: 12, successRate: 75, avgAmount: 890 },
      { week: 'Week 2', offers: 15, successRate: 80, avgAmount: 920 }
    ]
  },
  marketIntelligence: {
    priceAnalysis: {
      avgOfferVsMarket: -8.5,
      priceEfficiency: 87.2,
      marketPosition: 'conservative'
    },
    competitorAnalysis: {
      avgCompetitorOffers: 12.3,
      marketShare: 15.7,
      competitiveAdvantage: 23.4
    },
    trends: {
      marketDirection: 'bullish',
      volumeTrend: 'increasing',
      priceTrend: 'stable'
    }
  },
  insights: {
    recommendations: [
      {
        title: 'Increase TopShot Activity',
        description: 'Your TopShot success rate is 77.3%, 9.2% above average.',
        impact: 'high',
        confidence: 89,
        action: 'Make 3-4 additional TopShot offers'
      }
    ],
    alerts: [
      {
        type: 'success',
        title: 'Success Rate Milestone',
        message: 'Your success rate reached 68.1%, exceeding your 65% target!',
        timestamp: new Date()
      }
    ]
  }
}

// Mock fetch
global.fetch = jest.fn()

describe('OffersTrackingDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state initially', () => {
    ;(fetch as jest.Mock).mockImplementation(() => new Promise(() => {}))
    
    render(<OffersTrackingDashboard walletAddress="test-wallet" />)
    
    expect(screen.getByText('Loading tracking analytics...')).toBeInTheDocument()
  })

  it('renders tracking dashboard with data successfully', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        tracking: mockTrackingData
      })
    })

    render(<OffersTrackingDashboard walletAddress="test-wallet" />)

    await waitFor(() => {
      expect(screen.getByText('Offers Tracking Dashboard')).toBeInTheDocument()
    })

    // Check key metrics are displayed
    expect(screen.getByText('68.1%')).toBeInTheDocument()
    expect(screen.getByText('47')).toBeInTheDocument()
    expect(screen.getByText('$42,500')).toBeInTheDocument()
    expect(screen.getByText('2.67')).toBeInTheDocument()
  })

  it('displays platform performance breakdown', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        tracking: mockTrackingData
      })
    })

    render(<OffersTrackingDashboard walletAddress="test-wallet" />)

    await waitFor(() => {
      expect(screen.getByText('TopShot')).toBeInTheDocument()
      expect(screen.getByText('AllDay')).toBeInTheDocument()
      expect(screen.getByText('Panini')).toBeInTheDocument()
    })

    // Check platform success rates
    expect(screen.getByText('77.3%')).toBeInTheDocument()
    expect(screen.getByText('60.0%')).toBeInTheDocument()
    expect(screen.getByText('50.0%')).toBeInTheDocument()
  })

  it('shows market intelligence data', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        tracking: mockTrackingData
      })
    })

    render(<OffersTrackingDashboard walletAddress="test-wallet" />)

    await waitFor(() => {
      expect(screen.getByText('Conservative')).toBeInTheDocument()
      expect(screen.getByText('87.2%')).toBeInTheDocument()
      expect(screen.getByText('15.7%')).toBeInTheDocument()
    })
  })

  it('displays recommendations and insights', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        tracking: mockTrackingData
      })
    })

    render(<OffersTrackingDashboard walletAddress="test-wallet" />)

    await waitFor(() => {
      expect(screen.getByText('Increase TopShot Activity')).toBeInTheDocument()
      expect(screen.getByText('Success Rate Milestone')).toBeInTheDocument()
    })
  })

  it('handles timeframe selection', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        tracking: mockTrackingData
      })
    })

    render(<OffersTrackingDashboard walletAddress="test-wallet" />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('Last 30 days')).toBeInTheDocument()
    })

    const timeframeSelect = screen.getByDisplayValue('Last 30 days')
    fireEvent.change(timeframeSelect, { target: { value: '7d' } })

    expect(timeframeSelect).toHaveValue('7d')
  })

  it('handles API errors gracefully', async () => {
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    render(<OffersTrackingDashboard walletAddress="test-wallet" />)

    await waitFor(() => {
      expect(screen.getByText('Error Loading Data')).toBeInTheDocument()
      expect(screen.getByText('Network error while fetching tracking data')).toBeInTheDocument()
    })
  })

  it('handles API error response', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        error: 'Failed to fetch tracking data'
      })
    })

    render(<OffersTrackingDashboard walletAddress="test-wallet" />)

    await waitFor(() => {
      expect(screen.getByText('Error Loading Data')).toBeInTheDocument()
      expect(screen.getByText('Failed to fetch tracking data')).toBeInTheDocument()
    })
  })

  it('provides retry functionality', async () => {
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    render(<OffersTrackingDashboard walletAddress="test-wallet" />)

    await waitFor(() => {
      expect(screen.getByText('Retry')).toBeInTheDocument()
    })

    const retryButton = screen.getByText('Retry')
    fireEvent.click(retryButton)

    // Should attempt to fetch again
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it('displays export functionality', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        tracking: mockTrackingData
      })
    })

    render(<OffersTrackingDashboard walletAddress="test-wallet" />)

    await waitFor(() => {
      expect(screen.getByText('Export Data')).toBeInTheDocument()
    })
  })

  it('shows comprehensive performance metrics', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        tracking: mockTrackingData
      })
    })

    render(<OffersTrackingDashboard walletAddress="test-wallet" />)

    await waitFor(() => {
      // Check all key metrics are displayed
      expect(screen.getByText('Success Rate')).toBeInTheDocument()
      expect(screen.getByText('Total Offers')).toBeInTheDocument()
      expect(screen.getByText('Total Value')).toBeInTheDocument()
      expect(screen.getByText('Win/Loss Ratio')).toBeInTheDocument()
      
      // Check values
      expect(screen.getByText('68.1%')).toBeInTheDocument()
      expect(screen.getByText('47')).toBeInTheDocument()
      expect(screen.getByText('$42,500')).toBeInTheDocument()
      expect(screen.getByText('2.67')).toBeInTheDocument()
    })
  })

  it('displays market trends correctly', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        tracking: mockTrackingData
      })
    })

    render(<OffersTrackingDashboard walletAddress="test-wallet" />)

    await waitFor(() => {
      expect(screen.getByText('Market Direction')).toBeInTheDocument()
      expect(screen.getByText('Volume Trend')).toBeInTheDocument()
      expect(screen.getByText('Price Trend')).toBeInTheDocument()
      
      // Check trend values
      expect(screen.getByText('bullish')).toBeInTheDocument()
      expect(screen.getByText('increasing')).toBeInTheDocument()
      expect(screen.getByText('stable')).toBeInTheDocument()
    })
  })

  it('shows platform distribution in table format', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        tracking: mockTrackingData
      })
    })

    render(<OffersTrackingDashboard walletAddress="test-wallet" />)

    await waitFor(() => {
      // Check table headers
      expect(screen.getByText('Platform')).toBeInTheDocument()
      expect(screen.getByText('Offers')).toBeInTheDocument()
      expect(screen.getByText('Success Rate')).toBeInTheDocument()
      expect(screen.getByText('Avg Amount')).toBeInTheDocument()
      expect(screen.getByText('Response Time')).toBeInTheDocument()
      expect(screen.getByText('Total Value')).toBeInTheDocument()
      
      // Check platform data
      expect(screen.getByText('TopShot')).toBeInTheDocument()
      expect(screen.getByText('AllDay')).toBeInTheDocument()
      expect(screen.getByText('Panini')).toBeInTheDocument()
    })
  })
}) 