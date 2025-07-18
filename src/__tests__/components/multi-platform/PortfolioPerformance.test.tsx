import React from 'react'
import { render, screen } from '@testing-library/react'
import { PortfolioPerformance } from '@/components/multi-platform/PortfolioPerformance'
import { Activity, Asset } from '@/types/multi-platform'

// Mock the design system components
jest.mock('@/components/ui/Card', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card" className={className}>{children}</div>
  )
}))

jest.mock('@/components/design-system/atoms/Text', () => ({
  Text: ({ children, variant, className }: { children: React.ReactNode; variant?: string; className?: string }) => (
    <div data-testid={`text-${variant || 'default'}`} className={className}>{children}</div>
  )
}))

jest.mock('@/components/design-system/atoms/Icon', () => ({
  Icon: ({ name, className }: { name: string; className?: string }) => (
    <div data-testid={`icon-${name}`} className={className}>{name}</div>
  )
}))

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className }: { children: React.ReactNode; variant?: string; className?: string }) => (
    <div data-testid={`badge-${variant || 'default'}`} className={className}>{children}</div>
  )
}))

describe('PortfolioPerformance', () => {
  const mockAssets: Asset[] = [
    {
      id: 'curry-3pt-4567',
      platform: 'topshot',
      player: 'Stephen Curry',
      team: 'Warriors',
      currentPrice: 124,
      acquisitionPrice: 89,
      profit: 35,
      roi: 39.3,
      serialNumber: '4567',
      rarity: 'Common',
      set: 'Series 2024-25',
      imageUrl: '/api/placeholder/300/400',
      momentUrl: '#',
      lastSale: '2024-01-15',
      volume24h: 15,
      marketCap: 124000,
      offers: [],
      isPack: false
    },
    {
      id: 'lebron-dunk-2847',
      platform: 'topshot',
      player: 'LeBron James',
      team: 'Lakers',
      currentPrice: 987,
      acquisitionPrice: 987,
      profit: 213,
      roi: 21.6,
      serialNumber: '2847',
      rarity: 'Rare',
      set: 'Series 2024-25',
      imageUrl: '/api/placeholder/300/400',
      momentUrl: '#',
      lastSale: '2024-01-14',
      volume24h: 25,
      marketCap: 987000,
      offers: [],
      isPack: false
    }
  ]

  const mockActivities: Activity[] = [
    {
      id: 'activity-1',
      type: 'buy',
      platform: 'topshot',
      asset: mockAssets[0],
      amount: 89,
      quantity: 1,
      timestamp: new Date().toISOString(),
      description: 'Bought: Curry 3PT #4567 for $89',
      transactionHash: '0x1234567890abcdef'
    },
    {
      id: 'activity-2',
      type: 'sell',
      platform: 'topshot',
      asset: mockAssets[1],
      amount: 1200,
      quantity: 1,
      timestamp: new Date().toISOString(),
      description: 'Sold: LeBron Dunk #2847 for $1,200',
      transactionHash: '0xabcdef1234567890'
    }
  ]

  const defaultProps = {
    totalInvested: 2847,
    currentValue: 3234,
    totalProfit: 387,
    roi: 13.6,
    recentActivity: mockActivities,
    topAssets: mockAssets
  }

  it('renders portfolio performance summary with correct metrics', () => {
    render(<PortfolioPerformance {...defaultProps} />)
    
    // Check for main performance metrics
    expect(screen.getByText('🎯 Portfolio Performance')).toBeInTheDocument()
    expect(screen.getByText('$2,847')).toBeInTheDocument() // Total Invested
    expect(screen.getByText('$3,234')).toBeInTheDocument() // Current Value
    expect(screen.getByText('$387')).toBeInTheDocument() // Total Profit
    expect(screen.getByText('(+13.6%)')).toBeInTheDocument() // ROI
    expect(screen.getByText('📈')).toBeInTheDocument() // Performance icon
  })

  it('renders transaction history section', () => {
    render(<PortfolioPerformance {...defaultProps} />)
    
    expect(screen.getByText('📅 Transaction History')).toBeInTheDocument()
    expect(screen.getByText('2 transactions')).toBeInTheDocument()
  })

  it('displays specific transaction examples correctly', () => {
    render(<PortfolioPerformance {...defaultProps} />)
    
    // Check for Curry transaction - use getAllByText to handle multiple instances
    const curryElements = screen.getAllByText(/Stephen Curry.*#4567/)
    expect(curryElements.length).toBeGreaterThan(0)
    expect(screen.getByText(/Bought: \$89 → Floor: \$124/)).toBeInTheDocument()
    const percentageElements = screen.getAllByText(/\+39\.3%/)
    expect(percentageElements.length).toBeGreaterThan(0)
    expect(screen.getByText('Strong performer')).toBeInTheDocument()
    
    // Check for LeBron transaction
    const lebronElements = screen.getAllByText(/LeBron James.*#2847/)
    expect(lebronElements.length).toBeGreaterThan(0)
    expect(screen.getByText(/Sold: \$1,200 → Floor: \$987/)).toBeInTheDocument()
    expect(screen.getByText('Profit: $213')).toBeInTheDocument()
    expect(screen.getByText('smart timing 🎯')).toBeInTheDocument()
  })

  it('renders performance insights section', () => {
    render(<PortfolioPerformance {...defaultProps} />)
    
    expect(screen.getByText('💡 Performance Insights')).toBeInTheDocument()
    expect(screen.getByText('Best Performer')).toBeInTheDocument()
    expect(screen.getByText('Portfolio Health')).toBeInTheDocument()
  })

  it('displays best performer correctly', () => {
    render(<PortfolioPerformance {...defaultProps} />)
    
    // Use getAllByText to handle multiple instances
    const curryElements = screen.getAllByText(/Stephen Curry.*#4567/)
    expect(curryElements.length).toBeGreaterThan(0)
    const percentageElements = screen.getAllByText(/\+39\.3%/)
    expect(percentageElements.length).toBeGreaterThan(0)
  })

  it('shows portfolio health status', () => {
    render(<PortfolioPerformance {...defaultProps} />)
    
    expect(screen.getByText('Profitable portfolio')).toBeInTheDocument()
  })

  it('handles negative performance correctly', () => {
    const negativeProps = {
      ...defaultProps,
      totalProfit: -500,
      roi: -15.2
    }
    
    render(<PortfolioPerformance {...negativeProps} />)
    
    expect(screen.getByText('-$500')).toBeInTheDocument()
    expect(screen.getByText('(-15.2%)')).toBeInTheDocument()
    expect(screen.getByText('📉')).toBeInTheDocument() // Down arrow
  })

  it('handles empty activity list', () => {
    const emptyProps = {
      ...defaultProps,
      recentActivity: []
    }
    
    render(<PortfolioPerformance {...emptyProps} />)
    
    expect(screen.getByText('0 transactions')).toBeInTheDocument()
    expect(screen.getByText('No recent transactions')).toBeInTheDocument()
  })

  it('formats currency values correctly', () => {
    render(<PortfolioPerformance {...defaultProps} />)
    
    // Check that large numbers are formatted with commas
    expect(screen.getByText('$2,847')).toBeInTheDocument()
    expect(screen.getByText('$3,234')).toBeInTheDocument()
  })

  it('applies correct color coding for performance', () => {
    render(<PortfolioPerformance {...defaultProps} />)
    
    // Positive performance should have green color class
    const profitElement = screen.getByText('$387')
    expect(profitElement).toHaveClass('text-green-600')
    
    const roiElement = screen.getByText('(+13.6%)')
    expect(roiElement).toHaveClass('text-green-600')
  })
}) 