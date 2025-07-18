'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import { 
  Bell, 
  X, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  Smartphone,
  Volume2,
  VolumeX,
  Mail,
  Monitor
} from 'lucide-react'

interface Notification {
  id: string
  type: 'offer' | 'expiration' | 'acceptance' | 'counter' | 'insight'
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  priority: 'high' | 'medium' | 'low'
  data?: any
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

const OfferNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [settings, setSettings] = useState<NotificationSettings>({
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
  })
  const [isConnected, setIsConnected] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    // Initialize WebSocket connection for real-time notifications
    initializeWebSocket()
    
    // Request notification permissions
    requestNotificationPermission()
    
    // Load notification settings from localStorage
    loadSettings()
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  const initializeWebSocket = () => {
    // Simulate WebSocket connection for demo
    // In production, connect to your WebSocket server
    console.log('Initializing WebSocket connection...')
    setIsConnected(true)
    
    // Simulate incoming notifications
    const interval = setInterval(() => {
      const mockNotifications = generateMockNotifications()
      mockNotifications.forEach(notification => {
        addNotification(notification)
      })
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }

  const generateMockNotifications = (): Notification[] => {
    const types = ['offer', 'expiration', 'acceptance', 'counter', 'insight']
    const titles = [
      'New offer received on LeBron James #23',
      'Offer expiring in 2 hours',
      'Your offer was accepted!',
      'Counter-offer received',
      'Strategy insight: Tuesday offers have highest acceptance rate'
    ]
    const messages = [
      'You received a $2,450 offer for your LeBron James moment',
      'Your $1,800 offer on Curry #30 expires soon',
      'Congratulations! Your $1,950 offer was accepted',
      'Seller countered your offer with $2,200',
      'Offers made on Tuesdays have a 67% acceptance rate'
    ]

    const randomIndex = Math.floor(Math.random() * types.length)
    return [{
      id: Date.now().toString(),
      type: types[randomIndex] as any,
      title: titles[randomIndex],
      message: messages[randomIndex],
      timestamp: new Date(),
      isRead: false,
      priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
      data: {
        assetId: 'lebron-23',
        offerAmount: 2450,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    }]
  }

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 9)]) // Keep last 10
    
    // Show desktop notification
    if (settings.desktopEnabled && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id,
        requireInteraction: notification.priority === 'high'
      })
    }
    
    // Play sound
    if (settings.soundEnabled && audioRef.current) {
      audioRef.current.play().catch(console.error)
    }
    
    // Send push notification (if implemented)
    if (settings.pushEnabled) {
      sendPushNotification(notification)
    }
  }

  const sendPushNotification = async (notification: Notification) => {
    try {
      // In production, send to your push notification service
      console.log('Sending push notification:', notification)
      
      // Example: Send to Firebase Cloud Messaging or similar
      // await fetch('/api/push-notifications', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(notification)
      // })
    } catch (error) {
      console.error('Failed to send push notification:', error)
    }
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      console.log('Notification permission:', permission)
    }
  }

  const loadSettings = () => {
    const saved = localStorage.getItem('notification-settings')
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }

  const saveSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings)
    localStorage.setItem('notification-settings', JSON.stringify(newSettings))
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    )
  }

  const clearAll = () => {
    setNotifications([])
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'offer':
        return <Bell className="w-4 h-4 text-blue-500" />
      case 'expiration':
        return <Clock className="w-4 h-4 text-orange-500" />
      case 'acceptance':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'counter':
        return <TrendingUp className="w-4 h-4 text-purple-500" />
      case 'insight':
        return <TrendingUp className="w-4 h-4 text-indigo-500" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-red-500/30 bg-red-500/10'
      case 'medium':
        return 'border-orange-500/30 bg-orange-500/10'
      case 'low':
        return 'border-gray-500/30 bg-gray-500/10'
      default:
        return 'border-gray-500/30 bg-gray-500/10'
    }
  }

  const handleQuickAction = (notification: Notification, action: 'accept' | 'decline' | 'view') => {
    console.log(`${action} notification:`, notification)
    markAsRead(notification.id)
    
    // In production, handle the action (API call, navigation, etc.)
    switch (action) {
      case 'accept':
        // Navigate to offers dashboard or show accept modal
        break
      case 'decline':
        // Navigate to offers dashboard or show decline modal
        break
      case 'view':
        // Navigate to relevant page
        break
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="space-y-4">
      {/* Notification Sound */}
      <audio ref={audioRef} preload="auto">
        <source src="/notification-sound.mp3" type="audio/mpeg" />
      </audio>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-6 h-6 text-blue-400" />
            {unreadCount > 0 && (
              <Badge 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-red-500"
              >
                {unreadCount}
              </Badge>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
            <p className="text-sm text-gray-400">
              {isConnected ? 'Connected' : 'Disconnected'} • {unreadCount} unread
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Smartphone className="w-4 h-4 mr-2" />
            Settings
          </Button>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-4 space-y-4">
            <h4 className="font-semibold text-white">Notification Settings</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Push Notifications</p>
                  <p className="text-sm text-gray-400">Mobile & desktop alerts</p>
                </div>
                <Button
                  variant={settings.pushEnabled ? "primary" : "outline"}
                  size="sm"
                  onClick={() => saveSettings({ ...settings, pushEnabled: !settings.pushEnabled })}
                  className="flex items-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  {settings.pushEnabled ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Sound Alerts</p>
                  <p className="text-sm text-gray-400">Audio notifications</p>
                </div>
                <Button
                  variant={settings.soundEnabled ? "primary" : "outline"}
                  size="sm"
                  onClick={() => saveSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
                  className="flex items-center gap-2"
                >
                  <Volume2 className="w-4 h-4" />
                  {settings.soundEnabled ? 'On' : 'Off'}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Email Notifications</p>
                  <p className="text-sm text-gray-400">Daily summaries</p>
                </div>
                <Button
                  variant={settings.emailEnabled ? "primary" : "outline"}
                  size="sm"
                  onClick={() => saveSettings({ ...settings, emailEnabled: !settings.emailEnabled })}
                  className="flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {settings.emailEnabled ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Desktop Notifications</p>
                  <p className="text-sm text-gray-400">Browser notifications</p>
                </div>
                <Button
                  variant={settings.desktopEnabled ? "primary" : "outline"}
                  size="sm"
                  onClick={() => saveSettings({ ...settings, desktopEnabled: !settings.desktopEnabled })}
                  className="flex items-center gap-2"
                >
                  <Monitor className="w-4 h-4" />
                  {settings.desktopEnabled ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <Bell className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400">No notifications yet</p>
              <p className="text-sm text-gray-500">New offers and updates will appear here</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card 
              key={notification.id}
              className={`transition-all duration-200 hover:shadow-lg cursor-pointer ${
                notification.isRead ? 'opacity-60' : 'opacity-100'
              } ${getPriorityColor(notification.priority)}`}
              onClick={() => markAsRead(notification.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`font-medium text-sm ${notification.isRead ? 'text-gray-400' : 'text-white'}`}>
                          {notification.title}
                        </h4>
                        <p className="text-gray-400 text-xs mt-1">{notification.message}</p>
                        <p className="text-gray-500 text-xs mt-2">
                          {notification.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      
                      {!notification.isRead && notification.type === 'offer' && (
                        <div className="flex gap-1 ml-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white h-6 px-2"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleQuickAction(notification, 'accept')
                            }}
                          >
                            <CheckCircle className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 px-2"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleQuickAction(notification, 'decline')
                            }}
                          >
                            <XCircle className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Mobile Features Info */}
      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-blue-400" />
            <div>
              <h4 className="font-medium text-white">Mobile Optimized</h4>
              <p className="text-sm text-gray-400">
                Swipe right to accept, left to decline • Quick counter buttons • Push notifications
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default OfferNotifications 