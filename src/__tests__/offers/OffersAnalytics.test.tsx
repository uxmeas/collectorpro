import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import OffersAnalytics from '@/components/offers/OffersAnalytics'

// Mock the API response
const mockAnalyticsData = {
  successRate: {
    accepted: 35,
    declined: 45,
    expired: 20
  },
  priceRanges: [
    { range: '$0-100', count: 12, avgSuccessRate: 75 },
    { range: '$100-500', count: 28, avgSuccessRate: 68 },
    { range: '$500-1000', count: 15, avgSuccessRate: 62 },
    { range: '$1000+', count: 8, avgSuccessRate: 55 }
  ],
  activityOverTime: [
    { date: 'Mon', received: 5, made: 3, successRate: 70 },
    { date: 'Tue', received: 8, made: 6, successRate: 75 },
    { date: 'Wed', received: 3, made: 4, successRate: 65 }
  ],
  priceVsFloor: [
    { offerPrice: 150, floorPrice: 120, percentage: 25, status: 'accepted', assetName: 'LeBron James' },
    { offerPrice: 200, floorPrice: 180, percentage: 11, status: 'declined', assetName: 'Stephen Curry' },
    { offerPrice: 80, floorPrice: 100, percentage: -20, status: 'expired', assetName: 'Giannis' }
  ],
  hotAssets: [
    { assetName: 'LeBron James - 2023 Playoffs', offerCount: 15, avgPrice: 250, successRate: 80, trend: 'increasing' },
    { assetName: 'Stephen Curry - Championship', offerCount: 12, avgPrice: 180, successRate: 75, trend: 'stable' }
  ],
  offerTrends: [
    { period: 'Week 1', avgOfferPercentage: 15, floorPriceChange: 5, volume: 25 },
    { period: 'Week 2', avgOfferPercentage: 18, floorPriceChange: 8, volume: 30 }
  ],
  bestOffers: [
    { assetName: 'LeBron James - 2023 Playoffs', offerPrice: 300, floorPrice: 200, percentage: 50, status: 'accepted', timestamp: new Date() }
  ],
  missedOpportunities: [
    { assetName: 'LeBron James - 2023 Playoffs', offerPrice: 280, floorPrice: 200, percentage: 40, expiredAt: new Date(), currentValue: 320 }
  ],
  negotiationStats: {
    totalCounterOffers: 25,
    acceptedCounters: 18,
    successRate: 72,
    avgCounterPercentage: 8.5,
    avgResponseTime: 2.3
  }
}

// Mock fetch
global.fetch = jest.fn()

describe('OffersAnalytics', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state initially', () => {
    ;(fetch as jest.Mock).mockImplementation(() => new Promise(() => {}))
    
    render(<OffersAnalytics walletAddress="test-wallet" />)
    
    expect(screen.getByText('Loading offers analytics...')).toBeInTheDocument()
  })

  it('renders analytics dashboard with data successfully', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        analytics: mockAnalyticsData
      })
    })

    render(<OffersAnalytics walletAddress="test-wallet" />)

    await waitFor(() => {
      expect(screen.getByText('Offers Analytics & Intelligence')).toBeInTheDocument()
    })

    // Check navigation tabs are displayed
    expect(screen.getByText('Charts & Analytics')).toBeInTheDocument()
    expect(screen.getByText('Market Intelligence')).toBeInTheDocument()
    expect(screen.getByText('Performance Metrics')).toBeInTheDocument()
  })

  it('displays charts tab content correctly', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        analytics: mockAnalyticsData
      })
    })

    render(<OffersAnalytics walletAddress="test-wallet" />)

    await waitFor(() => {
      expect(screen.getByText('Offer Success Rate')).toBeInTheDocument()
      expect(screen.getByText('Offers by Price Range')).toBeInTheDocument()
      expect(screen.getByText('Offer Activity Over Time')).toBeInTheDocument()
      expect(screen.getByText('Offer Price vs Floor Price')).toBeInTheDocument()
    })
  })

  it('displays intelligence tab content correctly', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        analytics: mockAnalyticsData
      })
    })

    render(<OffersAnalytics walletAddress="test-wallet" />)

    await waitFor(() => {
      // Click on intelligence tab
      const intelligenceTab = screen.getByText('Market Intelligence')
      fireEvent.click(intelligenceTab)
    })

    await waitFor(() => {
      expect(screen.getByText('🔥 Hot Assets')).toBeInTheDocument()
      expect(screen.getByText('📈 Offer Trends')).toBeInTheDocument()
      expect(screen.getByText('🏆 Best Offers')).toBeInTheDocument()
      expect(screen.getByText('⏰ Missed Opportunities')).toBeInTheDocument()
    })
  })

  it('displays performance metrics tab content correctly', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        analytics: mockAnalyticsData
      })
    })

    render(<OffersAnalytics walletAddress="test-wallet" />)

    await waitFor(() => {
      // Click on performance tab
      const performanceTab = screen.getByText('Performance Metrics')
      fireEvent.click(performanceTab)
    })

    await waitFor(() => {
      expect(screen.getByText('🤝 Negotiation Performance')).toBeInTheDocument()
      expect(screen.getByText('💡 Performance Insights')).toBeInTheDocument()
      expect(screen.getByText('🎯 Actionable Recommendations')).toBeInTheDocument()
    })
  })

  it('shows hot assets data correctly', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        analytics: mockAnalyticsData
      })
    })

    render(<OffersAnalytics walletAddress="test-wallet" />)

    await waitFor(() => {
      const intelligenceTab = screen.getByText('Market Intelligence')
      fireEvent.click(intelligenceTab)
    })

    await waitFor(() => {
      expect(screen.getByText('LeBron James - 2023 Playoffs')).toBeInTheDocument()
      expect(screen.getByText('Stephen Curry - Championship')).toBeInTheDocument()
      expect(screen.getByText('15')).toBeInTheDocument() // offer count
      expect(screen.getByText('12')).toBeInTheDocument() // offer count
    })
  })

  it('shows negotiation performance metrics', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        analytics: mockAnalyticsData
      })
    })

    render(<OffersAnalytics walletAddress="test-wallet" />)

    await waitFor(() => {
      const performanceTab = screen.getByText('Performance Metrics')
      fireEvent.click(performanceTab)
    })

    await waitFor(() => {
      expect(screen.getByText('25')).toBeInTheDocument() // total counter offers
      expect(screen.getByText('18')).toBeInTheDocument() // accepted counters
      expect(screen.getByText('72%')).toBeInTheDocument() // success rate
      expect(screen.getByText('2.3h')).toBeInTheDocument() // avg response time
    })
  })

  it('handles timeframe selection', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        analytics: mockAnalyticsData
      })
    })

    render(<OffersAnalytics walletAddress="test-wallet" />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('Last 30 days')).toBeInTheDocument()
    })

    const timeframeSelect = screen.getByDisplayValue('Last 30 days')
    fireEvent.change(timeframeSelect, { target: { value: '7d' } })

    expect(timeframeSelect).toHaveValue('7d')
  })

  it('handles API errors gracefully', async () => {
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    render(<OffersAnalytics walletAddress="test-wallet" />)

    await waitFor(() => {
      expect(screen.getByText('No analytics data available')).toBeInTheDocument()
    })
  })

  it('displays export functionality', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        analytics: mockAnalyticsData
      })
    })

    render(<OffersAnalytics walletAddress="test-wallet" />)

    await waitFor(() => {
      expect(screen.getByText('Export Report')).toBeInTheDocument()
    })
  })

  it('shows best offers data', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        analytics: mockAnalyticsData
      })
    })

    render(<OffersAnalytics walletAddress="test-wallet" />)

    await waitFor(() => {
      const intelligenceTab = screen.getByText('Market Intelligence')
      fireEvent.click(intelligenceTab)
    })

    await waitFor(() => {
      expect(screen.getByText('LeBron James - 2023 Playoffs')).toBeInTheDocument()
      expect(screen.getByText('+50%')).toBeInTheDocument()
      expect(screen.getByText('accepted')).toBeInTheDocument()
    })
  })

  it('shows missed opportunities data', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        analytics: mockAnalyticsData
      })
    })

    render(<OffersAnalytics walletAddress="test-wallet" />)

    await waitFor(() => {
      const intelligenceTab = screen.getByText('Market Intelligence')
      fireEvent.click(intelligenceTab)
    })

    await waitFor(() => {
      expect(screen.getByText('LeBron James - 2023 Playoffs')).toBeInTheDocument()
      expect(screen.getByText('+40%')).toBeInTheDocument()
    })
  })

  it('displays performance insights', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        analytics: mockAnalyticsData
      })
    })

    render(<OffersAnalytics walletAddress="test-wallet" />)

    await waitFor(() => {
      const performanceTab = screen.getByText('Performance Metrics')
      fireEvent.click(performanceTab)
    })

    await waitFor(() => {
      expect(screen.getByText('Strong Counter-Offer Performance')).toBeInTheDocument()
      expect(screen.getByText('Quick Response Advantage')).toBeInTheDocument()
      expect(screen.getByText('Optimization Opportunity')).toBeInTheDocument()
    })
  })

  it('shows actionable recommendations', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        analytics: mockAnalyticsData
      })
    })

    render(<OffersAnalytics walletAddress="test-wallet" />)

    await waitFor(() => {
      const performanceTab = screen.getByText('Performance Metrics')
      fireEvent.click(performanceTab)
    })

    await waitFor(() => {
      expect(screen.getByText('Immediate Actions')).toBeInTheDocument()
      expect(screen.getByText('Strategic Improvements')).toBeInTheDocument()
      expect(screen.getByText('Increase counter-offer amounts by 2-3%')).toBeInTheDocument()
      expect(screen.getByText('Focus on hot assets with high offer counts')).toBeInTheDocument()
    })
  })
}) 