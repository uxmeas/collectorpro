import { NextRequest, NextResponse } from 'next/server'

interface Notification {
  id: string
  type: 'new_offer' | 'expiring' | 'counter' | 'accepted' | 'similar_sold' | 'strategy_insight'
  title: string
  message: string
  asset?: {
    name: string
    image: string
    floorPrice: number
  }
  offer?: {
    amount: number
    expiresAt: string
    isHot: boolean
    isFair: boolean
    isLow: boolean
    isExpiring: boolean
    isStrategic: boolean
  }
  timestamp: string
  isRead: boolean
  priority: 'high' | 'medium' | 'low'
  actionRequired?: boolean
}

interface NotificationSettings {
  pushEnabled: boolean
  soundEnabled: boolean
  emailEnabled: boolean
  desktopEnabled: boolean
  mobileEnabled: boolean
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
}

// Mock data for notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'new_offer',
    title: 'New offer received on LeBron James #23',
    message: 'You received a $2,450 offer for your LeBron James moment',
    asset: {
      name: 'LeBron James #23',
      image: '/api/placeholder/60/60',
      floorPrice: 2400
    },
    offer: {
      amount: 2450,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      isHot: true,
      isFair: false,
      isLow: false,
      isExpiring: false,
      isStrategic: false
    },
    timestamp: new Date().toISOString(),
    isRead: false,
    priority: 'high',
    actionRequired: true
  },
  {
    id: '2',
    type: 'expiring',
    title: 'Offer expiring in 2 hours',
    message: 'Your $1,800 offer on Curry #30 expires soon',
    asset: {
      name: 'Stephen Curry #30',
      image: '/api/placeholder/60/60',
      floorPrice: 1750
    },
    offer: {
      amount: 1800,
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      isHot: false,
      isFair: true,
      isLow: false,
      isExpiring: true,
      isStrategic: false
    },
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    isRead: false,
    priority: 'high',
    actionRequired: true
  },
  {
    id: '3',
    type: 'counter',
    title: 'Counter-offer received',
    message: 'Seller countered your offer with $2,200',
    asset: {
      name: 'Kevin Durant #7',
      image: '/api/placeholder/60/60',
      floorPrice: 2100
    },
    offer: {
      amount: 2200,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      isHot: false,
      isFair: true,
      isLow: false,
      isExpiring: false,
      isStrategic: true
    },
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    isRead: false,
    priority: 'medium',
    actionRequired: true
  },
  {
    id: '4',
    type: 'accepted',
    title: 'Your offer was accepted!',
    message: 'Congratulations! Your $1,950 offer was accepted',
    asset: {
      name: 'Giannis Antetokounmpo #34',
      image: '/api/placeholder/60/60',
      floorPrice: 1900
    },
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    isRead: false,
    priority: 'medium'
  },
  {
    id: '5',
    type: 'similar_sold',
    title: 'Similar asset sold for more',
    message: 'Similar LeBron moment sold for $2,600 (you declined $2,450)',
    asset: {
      name: 'LeBron James #23',
      image: '/api/placeholder/60/60',
      floorPrice: 2400
    },
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    isRead: true,
    priority: 'low'
  }
]

const mockSettings: NotificationSettings = {
  pushEnabled: true,
  soundEnabled: true,
  emailEnabled: true,
  desktopEnabled: true,
  mobileEnabled: true,
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00'
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('address') || 'demo-wallet'
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '10')
    const unreadOnly = searchParams.get('unread') === 'true'

    console.log(`🔔 NOTIFICATIONS: Fetching notifications for wallet: ${walletAddress}`)

    // Filter notifications based on parameters
    let filteredNotifications = [...mockNotifications]

    if (type) {
      filteredNotifications = filteredNotifications.filter(n => n.type === type)
    }

    if (unreadOnly) {
      filteredNotifications = filteredNotifications.filter(n => !n.isRead)
    }

    // Apply limit
    filteredNotifications = filteredNotifications.slice(0, limit)

    // Add some real-time notifications based on wallet activity
    const realTimeNotifications = generateRealTimeNotifications(walletAddress)
    filteredNotifications = [...realTimeNotifications, ...filteredNotifications]

    const response = {
      success: true,
      data: {
        notifications: filteredNotifications,
        unreadCount: filteredNotifications.filter(n => !n.isRead).length,
        totalCount: filteredNotifications.length,
        settings: mockSettings
      },
      timestamp: new Date().toISOString()
    }

    console.log(`✅ NOTIFICATIONS: Returning ${filteredNotifications.length} notifications`)
    return NextResponse.json(response)

  } catch (error) {
    console.error('❌ NOTIFICATIONS: Error fetching notifications:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch notifications',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, notificationId, settings } = body

    console.log(`🔔 NOTIFICATIONS: Processing action: ${action}`)

    switch (action) {
      case 'mark_read':
        // Mark notification as read
        console.log(`✅ NOTIFICATIONS: Marked notification ${notificationId} as read`)
        return NextResponse.json({ 
          success: true, 
          message: 'Notification marked as read',
          timestamp: new Date().toISOString()
        })

      case 'mark_all_read':
        // Mark all notifications as read
        console.log(`✅ NOTIFICATIONS: Marked all notifications as read`)
        return NextResponse.json({ 
          success: true, 
          message: 'All notifications marked as read',
          timestamp: new Date().toISOString()
        })

      case 'update_settings':
        // Update notification settings
        console.log(`✅ NOTIFICATIONS: Updated notification settings`)
        return NextResponse.json({ 
          success: true, 
          message: 'Settings updated',
          settings: settings,
          timestamp: new Date().toISOString()
        })

      case 'send_push':
        // Send push notification
        console.log(`✅ NOTIFICATIONS: Push notification sent`)
        return NextResponse.json({ 
          success: true, 
          message: 'Push notification sent',
          timestamp: new Date().toISOString()
        })

      default:
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid action',
            timestamp: new Date().toISOString()
          },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('❌ NOTIFICATIONS: Error processing action:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process action',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

function generateRealTimeNotifications(walletAddress: string): Notification[] {
  const now = new Date()
  const notifications: Notification[] = []

  // Simulate real-time notifications based on wallet activity
  const activities = [
    {
      type: 'new_offer' as const,
      title: 'New offer received on Kevin Durant #7',
      message: 'You received a $1,850 offer for your Kevin Durant moment',
      amount: 1850,
      floorPrice: 1800,
      priority: 'medium' as const
    },
    {
      type: 'strategy_insight' as const,
      title: 'Strategy insight: Tuesday offers have highest acceptance rate',
      message: 'Offers made on Tuesdays have a 67% acceptance rate vs 45% average',
      priority: 'low' as const
    }
  ]

  activities.forEach((activity, index) => {
    if (Math.random() > 0.7) { // 30% chance of generating notification
      notifications.push({
        id: `realtime-${Date.now()}-${index}`,
        type: activity.type,
        title: activity.title,
        message: activity.message,
        asset: activity.type !== 'strategy_insight' ? {
          name: 'Kevin Durant #7',
          image: '/api/placeholder/60/60',
          floorPrice: activity.floorPrice || 1800
        } : undefined,
        offer: activity.type === 'new_offer' ? {
          amount: activity.amount || 1850,
          expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
          isHot: (activity.amount || 0) > (activity.floorPrice || 0),
          isFair: Math.abs((activity.amount || 0) - (activity.floorPrice || 0)) < 100,
          isLow: (activity.amount || 0) < (activity.floorPrice || 0) * 0.9,
          isExpiring: false,
          isStrategic: false
        } : undefined,
        timestamp: new Date(now.getTime() - Math.random() * 10 * 60 * 1000).toISOString(),
        isRead: false,
        priority: activity.priority,
        actionRequired: activity.type === 'new_offer'
      })
    }
  })

  return notifications
} 