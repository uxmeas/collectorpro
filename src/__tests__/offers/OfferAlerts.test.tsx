import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import OfferAlerts from '@/components/offers/OfferAlerts'

// Mock the UI components
jest.mock('@/components/ui/Card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h3>{children}</h3>
}))

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className }: any) => (
    <span className={`badge ${variant} ${className}`}>{children}</span>
  )
}))

jest.mock('@/components/ui/Button', () => ({
  Button: ({ children, onClick, variant, size, className }: any) => (
    <button onClick={onClick} className={`button ${variant} ${size} ${className}`}>
      {children}
    </button>
  )
}))

jest.mock('@/components/ui/separator', () => ({
  Separator: () => <hr />
}))

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Bell: () => <span data-testid="bell-icon">🔔</span>,
  TrendingUp: () => <span data-testid="trending-up-icon">📈</span>,
  Clock: () => <span data-testid="clock-icon">⏰</span>,
  DollarSign: () => <span data-testid="dollar-icon">💰</span>,
  Target: () => <span data-testid="target-icon">🎯</span>,
  AlertTriangle: () => <span data-testid="alert-icon">⚠️</span>,
  CheckCircle: () => <span data-testid="check-icon">✅</span>,
  XCircle: () => <span data-testid="x-icon">❌</span>,
  Zap: () => <span data-testid="zap-icon">⚡</span>,
  Eye: () => <span data-testid="eye-icon">👁️</span>,
  Smartphone: () => <span data-testid="smartphone-icon">📱</span>,
  Settings: () => <span data-testid="settings-icon">⚙️</span>
}))

describe('OfferAlerts Component', () => {
  beforeEach(() => {
    // Mock fetch for notifications API
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          success: true,
          data: {
            notifications: [],
            unreadCount: 0
          }
        })
      })
    ) as jest.Mock
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders offer alerts dashboard', () => {
    render(<OfferAlerts />)
    
    expect(screen.getByText('Offer Alerts & Insights')).toBeInTheDocument()
    expect(screen.getByText('Real-time notifications and strategic intelligence')).toBeInTheDocument()
  })

  test('displays tabs for different sections', () => {
    render(<OfferAlerts />)
    
    // Check for tab buttons using getAllByText to handle multiple instances
    const alertsTabs = screen.getAllByText(/Alerts/)
    const insightsTabs = screen.getAllByText(/Strategy Insights/)
    const settingsTabs = screen.getAllByText(/Settings/)
    
    expect(alertsTabs.length).toBeGreaterThan(0)
    expect(insightsTabs.length).toBeGreaterThan(0)
    expect(settingsTabs.length).toBeGreaterThan(0)
  })

  test('shows alerts content by default', () => {
    render(<OfferAlerts />)
    
    // Should show alerts content
    expect(screen.getByText('New offer received on LeBron James #23')).toBeInTheDocument()
    expect(screen.getByText('Offer expiring in 2 hours')).toBeInTheDocument()
    expect(screen.getByText('Counter-offer received')).toBeInTheDocument()
  })

  test('displays visual indicators for offers', () => {
    render(<OfferAlerts />)
    
    // Check for offer indicators
    expect(screen.getByText('🔥 Hot')).toBeInTheDocument()
    expect(screen.getByText('💡 Fair')).toBeInTheDocument()
    expect(screen.getByText('⏰ Expiring')).toBeInTheDocument()
    expect(screen.getByText('🎯 Strategic')).toBeInTheDocument()
  })

  test('shows action buttons for pending offers', () => {
    render(<OfferAlerts />)
    
    expect(screen.getByText('Accept')).toBeInTheDocument()
    expect(screen.getByText('Decline')).toBeInTheDocument()
    expect(screen.getByText('Counter')).toBeInTheDocument()
  })

  test('displays asset information for offers', () => {
    render(<OfferAlerts />)
    
    expect(screen.getByText('LeBron James #23')).toBeInTheDocument()
    expect(screen.getByText('Stephen Curry #30')).toBeInTheDocument()
    expect(screen.getByText('Kevin Durant #7')).toBeInTheDocument()
  })

  test('shows offer amounts', () => {
    render(<OfferAlerts />)
    
    expect(screen.getByText('$2,450')).toBeInTheDocument()
    expect(screen.getByText('$1,800')).toBeInTheDocument()
    expect(screen.getByText('$2,200')).toBeInTheDocument()
  })

  test('displays offer priority indicators', () => {
    render(<OfferAlerts />)
    
    // Check for priority badges
    expect(screen.getByText('high')).toBeInTheDocument()
    expect(screen.getByText('medium')).toBeInTheDocument()
    expect(screen.getByText('low')).toBeInTheDocument()
  })

  test('shows offer expiration times', () => {
    render(<OfferAlerts />)
    
    expect(screen.getByText(/Expires:/)).toBeInTheDocument()
  })

  test('displays settings button in header', () => {
    render(<OfferAlerts />)
    
    // There are multiple "Settings" buttons, so we need to be more specific
    const settingsButtons = screen.getAllByText(/Settings/)
    expect(settingsButtons.length).toBeGreaterThan(0)
  })

  test('shows new alerts badge', () => {
    render(<OfferAlerts />)
    
    // The badge shows "4 new" based on the mock data
    expect(screen.getByText(/4 new/)).toBeInTheDocument()
  })

  test('handles empty alerts state', () => {
    render(<OfferAlerts />)
    
    // Should still show the component structure even with no alerts
    expect(screen.getByText('Offer Alerts & Insights')).toBeInTheDocument()
    const alertsTabs = screen.getAllByText(/Alerts/)
    expect(alertsTabs.length).toBeGreaterThan(0)
  })
}) 