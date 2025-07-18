import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import SmartInsights from '@/components/offers/SmartInsights'

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

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Brain: () => <span data-testid="brain">🧠</span>,
  TrendingUp: () => <span data-testid="trending-up">📈</span>,
  Calendar: () => <span data-testid="calendar">📅</span>,
  Target: () => <span data-testid="target">🎯</span>,
  CheckCircle: () => <span data-testid="check-circle">✅</span>,
  Flame: () => <span data-testid="flame">🔥</span>,
  BarChart3: () => <span data-testid="bar-chart">📊</span>,
  Lightbulb: () => <span data-testid="lightbulb">💡</span>,
  Clock: () => <span data-testid="clock">⏰</span>,
  Users: () => <span data-testid="users">👥</span>
}))

describe('SmartInsights', () => {
  it('renders the component with header', () => {
    render(<SmartInsights />)
    
    expect(screen.getByText('🧠 Smart Insights')).toBeInTheDocument()
    expect(screen.getByText('AI-powered market intelligence and patterns')).toBeInTheDocument()
    expect(screen.getByText('AI Powered')).toBeInTheDocument()
  })

  it('displays key insights', () => {
    render(<SmartInsights />)
    
    // Check for main insights
    expect(screen.getByText('Monday Offer Surge')).toBeInTheDocument()
    expect(screen.getByText('Curry Market Hot')).toBeInTheDocument()
    expect(screen.getByText('Above Average Acceptance')).toBeInTheDocument()
    expect(screen.getByText('Hot Assets Alert')).toBeInTheDocument()
  })

  it('displays insight descriptions', () => {
    render(<SmartInsights />)
    
    expect(screen.getByText('You get 40% more offers on Monday')).toBeInTheDocument()
    expect(screen.getByText('Curry moments get 2x more offers')).toBeInTheDocument()
    expect(screen.getByText('Your acceptance rate is above average')).toBeInTheDocument()
    expect(screen.getByText('3 assets are "hot" (multiple offers)')).toBeInTheDocument()
  })

  it('displays insight values', () => {
    render(<SmartInsights />)
    
    expect(screen.getByText('+40%')).toBeInTheDocument()
    expect(screen.getByText('2x')).toBeInTheDocument()
    
    // Use getAllByText to check for multiple instances
    const plus15Elements = screen.getAllByText('+15%')
    expect(plus15Elements.length).toBeGreaterThan(0)
    
    const threeElements = screen.getAllByText('3')
    expect(threeElements.length).toBeGreaterThan(0)
  })

  it('displays confidence levels', () => {
    render(<SmartInsights />)
    
    expect(screen.getByText('95% confidence')).toBeInTheDocument()
    expect(screen.getByText('88% confidence')).toBeInTheDocument()
    expect(screen.getByText('92% confidence')).toBeInTheDocument()
    expect(screen.getByText('85% confidence')).toBeInTheDocument()
  })

  it('displays actionable badges', () => {
    render(<SmartInsights />)
    
    const actionableBadges = screen.getAllByText('Actionable')
    expect(actionableBadges.length).toBeGreaterThan(0)
    
    const informationalBadges = screen.getAllByText('Informational')
    expect(informationalBadges.length).toBeGreaterThan(0)
  })

  it('displays category labels', () => {
    render(<SmartInsights />)
    
    // Use getAllByText to check for multiple instances
    const timingElements = screen.getAllByText('Timing')
    expect(timingElements.length).toBeGreaterThan(0)
    
    const playerElements = screen.getAllByText('Player')
    expect(playerElements.length).toBeGreaterThan(0)
    
    const performanceElements = screen.getAllByText('Performance')
    expect(performanceElements.length).toBeGreaterThan(0)
    
    const marketElements = screen.getAllByText('Market')
    expect(marketElements.length).toBeGreaterThan(0)
  })

  it('displays summary stats', () => {
    render(<SmartInsights />)
    
    expect(screen.getByText('Insight Summary')).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('87%')).toBeInTheDocument()
    
    // Use getAllByText to check for multiple instances
    const threeElements = screen.getAllByText('3')
    expect(threeElements.length).toBeGreaterThan(0)
  })

  it('displays quick actions', () => {
    render(<SmartInsights />)
    
    expect(screen.getByText('Quick Actions')).toBeInTheDocument()
    expect(screen.getByText('Schedule Monday Offers')).toBeInTheDocument()
    expect(screen.getByText('Focus on Curry')).toBeInTheDocument()
    expect(screen.getByText('Monitor Hot Assets')).toBeInTheDocument()
  })

  it('displays action descriptions', () => {
    render(<SmartInsights />)
    
    expect(screen.getByText('Set reminders for Monday offer creation')).toBeInTheDocument()
    expect(screen.getByText('Prioritize Curry moment acquisitions')).toBeInTheDocument()
    expect(screen.getByText('Track the 3 hot assets closely')).toBeInTheDocument()
  })

  it('displays actionable insights with action text', () => {
    render(<SmartInsights />)
    
    // Use getAllByText to check for multiple instances
    const timingActions = screen.getAllByText(/Schedule offers for optimal timing/)
    expect(timingActions.length).toBeGreaterThan(0)
    
    const playerActions = screen.getAllByText(/Focus on high-demand players/)
    expect(playerActions.length).toBeGreaterThan(0)
    
    const marketActions = screen.getAllByText(/Monitor hot assets closely/)
    expect(marketActions.length).toBeGreaterThan(0)
  })
}) 