import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import WatchlistDashboard from '@/components/watchlist/WatchlistDashboard'

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

jest.mock('@/components/ui/Button', () => ({
  Button: ({ children, onClick, className, size, variant }: any) => (
    <button onClick={onClick} className={`button ${size} ${variant} ${className}`}>
      {children}
    </button>
  )
}))

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Bookmark: () => <span data-testid="bookmark">📖</span>,
  Bell: () => <span data-testid="bell">🔔</span>,
  TrendingUp: () => <span data-testid="trending-up">📈</span>,
  TrendingDown: () => <span data-testid="trending-down">📉</span>,
  Target: () => <span data-testid="target">🎯</span>,
  Settings: () => <span data-testid="settings">⚙️</span>,
  Plus: () => <span data-testid="plus">➕</span>,
  Search: () => <span data-testid="search">🔍</span>,
  Filter: () => <span data-testid="filter">🔧</span>,
  Star: () => <span data-testid="star">⭐</span>,
  AlertTriangle: () => <span data-testid="alert-triangle">⚠️</span>,
  CheckCircle: () => <span data-testid="check-circle">✅</span>,
  Clock: () => <span data-testid="clock">⏰</span>,
  DollarSign: () => <span data-testid="dollar-sign">💰</span>,
  Eye: () => <span data-testid="eye">👁️</span>,
  Trash2: () => <span data-testid="trash">🗑️</span>,
  Edit3: () => <span data-testid="edit">✏️</span>,
  BellOff: () => <span data-testid="bell-off">🔕</span>,
  BellRing: () => <span data-testid="bell-ring">🔔</span>,
  Zap: () => <span data-testid="zap">⚡</span>
}))

describe('WatchlistDashboard', () => {
  it('renders the component with header', () => {
    render(<WatchlistDashboard />)
    
    expect(screen.getByText('Watchlist & Alerts')).toBeInTheDocument()
    expect(screen.getByText('Track buying/selling opportunities with smart alerts')).toBeInTheDocument()
  })

  it('displays stats cards', () => {
    render(<WatchlistDashboard />)
    
    expect(screen.getByText('Total Items')).toBeInTheDocument()
    expect(screen.getByText('Active Alerts')).toBeInTheDocument()
    
    // Use getAllByText to check for multiple instances
    const triggeredElements = screen.getAllByText('Triggered')
    expect(triggeredElements.length).toBeGreaterThan(0)
    
    expect(screen.getByText('Total Value')).toBeInTheDocument()
  })

  it('displays navigation tabs', () => {
    render(<WatchlistDashboard />)
    
    expect(screen.getByText('Watchlist')).toBeInTheDocument()
    expect(screen.getByText('Alert Management')).toBeInTheDocument()
    expect(screen.getByText('Notifications')).toBeInTheDocument()
  })

  it('displays watchlist items', () => {
    render(<WatchlistDashboard />)
    
    expect(screen.getByText('LeBron James - Series 1')).toBeInTheDocument()
    expect(screen.getByText('Stephen Curry - Series 2')).toBeInTheDocument()
    expect(screen.getByText('Giannis Antetokounmpo - Series 3')).toBeInTheDocument()
  })

  it('displays asset details', () => {
    render(<WatchlistDashboard />)
    
    // Use getAllByText to check for multiple instances
    const topShotElements = screen.getAllByText('TopShot')
    expect(topShotElements.length).toBeGreaterThan(0)
    
    const highElements = screen.getAllByText('high')
    expect(highElements.length).toBeGreaterThan(0)
    
    const mediumElements = screen.getAllByText('medium')
    expect(mediumElements.length).toBeGreaterThan(0)
    
    const activeElements = screen.getAllByText('active')
    expect(activeElements.length).toBeGreaterThan(0)
    
    const triggeredElements = screen.getAllByText('triggered')
    expect(triggeredElements.length).toBeGreaterThan(0)
  })

  it('displays price information', () => {
    render(<WatchlistDashboard />)
    
    expect(screen.getByText('$1,350')).toBeInTheDocument()
    expect(screen.getByText('$95')).toBeInTheDocument()
    expect(screen.getByText('$520')).toBeInTheDocument()
    expect(screen.getByText('+12.5%')).toBeInTheDocument()
    expect(screen.getByText('-8.3%')).toBeInTheDocument()
    expect(screen.getByText('+15.6%')).toBeInTheDocument()
  })

  it('displays notes', () => {
    render(<WatchlistDashboard />)
    
    expect(screen.getByText('"Watch for playoff performance boost"')).toBeInTheDocument()
    expect(screen.getByText('"Three-point record chase potential"')).toBeInTheDocument()
    expect(screen.getByText('"MVP season momentum"')).toBeInTheDocument()
  })

  it('displays action buttons', () => {
    render(<WatchlistDashboard />)
    
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Add to Watchlist')).toBeInTheDocument()
  })

  it('displays search and filter controls', () => {
    render(<WatchlistDashboard />)
    
    expect(screen.getByPlaceholderText('Search watchlist items...')).toBeInTheDocument()
    expect(screen.getByText('All Priorities')).toBeInTheDocument()
    expect(screen.getByText('All Status')).toBeInTheDocument()
  })

  it('switches to alerts tab', () => {
    render(<WatchlistDashboard />)
    
    const alertsTab = screen.getByText('Alert Management')
    fireEvent.click(alertsTab)
    
    expect(screen.getByText('Price Alerts')).toBeInTheDocument()
    expect(screen.getByText('Volume Alerts')).toBeInTheDocument()
    expect(screen.getByText('Market Alerts')).toBeInTheDocument()
  })

  it('switches to notifications tab', () => {
    render(<WatchlistDashboard />)
    
    const notificationsTab = screen.getByText('Notifications')
    fireEvent.click(notificationsTab)
    
    expect(screen.getByText('Push Notifications')).toBeInTheDocument()
    expect(screen.getByText('Email Notifications')).toBeInTheDocument()
    expect(screen.getByText('SMS Alerts')).toBeInTheDocument()
  })

  it('displays alert management features', () => {
    render(<WatchlistDashboard />)
    
    // Switch to alerts tab
    const alertsTab = screen.getByText('Alert Management')
    fireEvent.click(alertsTab)
    
    expect(screen.getByText('Set price targets for buying and selling opportunities')).toBeInTheDocument()
    expect(screen.getByText('Get notified of unusual trading activity')).toBeInTheDocument()
    expect(screen.getByText('Track new listings and offer activity')).toBeInTheDocument()
  })

  it('displays notification settings', () => {
    render(<WatchlistDashboard />)
    
    // Switch to notifications tab
    const notificationsTab = screen.getByText('Notifications')
    fireEvent.click(notificationsTab)
    
    expect(screen.getByText('Real-time alerts on your device')).toBeInTheDocument()
    expect(screen.getByText('Daily summary and urgent alerts')).toBeInTheDocument()
    expect(screen.getByText('Critical price movements only')).toBeInTheDocument()
  })

  it('handles search input', () => {
    render(<WatchlistDashboard />)
    
    const searchInput = screen.getByPlaceholderText('Search watchlist items...')
    fireEvent.change(searchInput, { target: { value: 'LeBron' } })
    
    expect(searchInput).toHaveValue('LeBron')
  })

  it('displays item action buttons', () => {
    render(<WatchlistDashboard />)
    
    // Check for edit, alert toggle, and remove buttons
    const editButtons = screen.getAllByTestId('edit')
    const trashButtons = screen.getAllByTestId('trash')
    
    expect(editButtons.length).toBeGreaterThan(0)
    expect(trashButtons.length).toBeGreaterThan(0)
  })

  it('displays volume information', () => {
    render(<WatchlistDashboard />)
    
    expect(screen.getByText('Vol: 45.2%')).toBeInTheDocument()
    expect(screen.getByText('Vol: 12.7%')).toBeInTheDocument()
    expect(screen.getByText('Vol: 78.9%')).toBeInTheDocument()
  })

  it('displays floor price information', () => {
    render(<WatchlistDashboard />)
    
    expect(screen.getByText('Floor: $1,200')).toBeInTheDocument()
    expect(screen.getByText('Floor: $85')).toBeInTheDocument()
    expect(screen.getByText('Floor: $450')).toBeInTheDocument()
  })
}) 