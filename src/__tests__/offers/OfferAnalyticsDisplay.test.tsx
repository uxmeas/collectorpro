import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import OfferAnalyticsDisplay from '@/components/offers/OfferAnalyticsDisplay'

// Mock the UI components
jest.mock('@/components/ui/Card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children, className }: any) => <h3 className={className}>{children}</h3>
}))

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className }: any) => (
    <span className={`badge ${variant} ${className}`}>{children}</span>
  )
}))

jest.mock('@/components/ui/progress', () => ({
  Progress: ({ value, className }: any) => (
    <div className={className} data-testid="progress" data-value={value}></div>
  )
}))

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  TrendingUp: () => <span data-testid="trending-up">📈</span>,
  TrendingDown: () => <span data-testid="trending-down">📉</span>,
  Clock: () => <span data-testid="clock">⏰</span>,
  CheckCircle: () => <span data-testid="check-circle">✅</span>,
  XCircle: () => <span data-testid="x-circle">❌</span>,
  AlertTriangle: () => <span data-testid="alert-triangle">⚠️</span>
}))

describe('OfferAnalyticsDisplay', () => {
  it('renders the component with header', () => {
    render(<OfferAnalyticsDisplay />)
    
    expect(screen.getByText('Offer Analytics')).toBeInTheDocument()
    expect(screen.getByText('Real-time')).toBeInTheDocument()
  })

  it('displays active offers section', () => {
    render(<OfferAnalyticsDisplay />)
    
    expect(screen.getByText('📬 Active Offers (5)')).toBeInTheDocument()
    expect(screen.getByText('LeBron')).toBeInTheDocument()
    expect(screen.getByText('Curry')).toBeInTheDocument()
    expect(screen.getByText('Durant')).toBeInTheDocument()
  })

  it('displays my offers section', () => {
    render(<OfferAnalyticsDisplay />)
    
    expect(screen.getByText('📤 My Offers (3)')).toBeInTheDocument()
    expect(screen.getByText('Giannis')).toBeInTheDocument()
    expect(screen.getByText('Tatum')).toBeInTheDocument()
    expect(screen.getByText('Luka')).toBeInTheDocument()
  })

  it('displays analytics metrics', () => {
    render(<OfferAnalyticsDisplay />)
    
    expect(screen.getByText('📊 Offer Analytics')).toBeInTheDocument()
    expect(screen.getByText('Success Rate')).toBeInTheDocument()
    expect(screen.getByText('35%')).toBeInTheDocument()
    expect(screen.getByText('92% of floor')).toBeInTheDocument()
    expect(screen.getByText('+23% above floor')).toBeInTheDocument()
  })

  it('displays offer amounts correctly', () => {
    render(<OfferAnalyticsDisplay />)
    
    expect(screen.getByText('$1,350')).toBeInTheDocument()
    expect(screen.getByText('$95')).toBeInTheDocument()
    expect(screen.getByText('$187')).toBeInTheDocument()
    expect(screen.getByText('$890')).toBeInTheDocument()
    expect(screen.getByText('$234')).toBeInTheDocument()
    expect(screen.getByText('$445')).toBeInTheDocument()
  })

  it('displays percentage indicators', () => {
    render(<OfferAnalyticsDisplay />)
    
    expect(screen.getByText('+8%')).toBeInTheDocument()
    expect(screen.getByText('-23%')).toBeInTheDocument()
    expect(screen.getByText('-5%')).toBeInTheDocument()
  })

  it('displays status badges', () => {
    render(<OfferAnalyticsDisplay />)
    
    // Use getAllByText to check for multiple instances
    const pendingBadges = screen.getAllByText('Pending')
    expect(pendingBadges.length).toBeGreaterThan(0)
    
    const declinedBadges = screen.getAllByText('Declined')
    expect(declinedBadges.length).toBeGreaterThan(0)
  })

  it('displays progress bar for success rate', () => {
    render(<OfferAnalyticsDisplay />)
    
    const progressBar = screen.getByTestId('progress')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveAttribute('data-value', '35')
  })

  it('displays quick stats', () => {
    render(<OfferAnalyticsDisplay />)
    
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    
    // Use getAllByText to check for multiple instances
    const acceptedElements = screen.getAllByText('Accepted')
    expect(acceptedElements.length).toBeGreaterThan(0)
    
    const declinedElements = screen.getAllByText('Declined')
    expect(declinedElements.length).toBeGreaterThan(0)
    
    const pendingElements = screen.getAllByText('Pending')
    expect(pendingElements.length).toBeGreaterThan(0)
    
    const expiredElements = screen.getAllByText('Expired')
    expect(expiredElements.length).toBeGreaterThan(0)
  })
}) 