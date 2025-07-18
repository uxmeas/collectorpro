'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { 
  MessageCircle, 
  Send, 
  Sparkles, 
  Heart, 
  Star, 
  Trophy,
  Users,
  Target,
  Zap,
  Shield,
  Bot,
  Smile,
  TrendingUp,
  BookOpen,
  Award,
  Lightbulb,
  Camera,
  Crown
} from 'lucide-react'

interface ChatMessage {
  id: string
  sender: 'user' | 'scout'
  message: string
  timestamp: Date
  type: 'text' | 'collection-insight' | 'conversation-starter' | 'safety-reminder' | 'reaction'
  metadata?: {
    cardName?: string
    playerName?: string
    setName?: string
    insightType?: string
    emotion?: string
  }
}

interface MockResponse {
  triggers: string[]
  responses: string[]
  category: 'enthusiasm' | 'collection-insight' | 'basketball-knowledge' | 'safety-redirect' | 'conversation'
  priority: number
}

const ScoutChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showStarters, setShowStarters] = useState(true)
  const [conversationMemory, setConversationMemory] = useState<Set<string>>(new Set())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Comprehensive mock response system
  const mockResponses: MockResponse[] = [
    // Player enthusiasm responses
    {
      triggers: ['giannis', 'antetokounmpo', 'greek freak'],
      responses: [
        "Whoa, that Giannis poster dunk is INSANE! 🔥 The way they captured him mid-air is just perfect. That photographer nailed it!",
        "The Greek Freak! His dunks are absolutely legendary! That's a collector's dream right there! 🌟",
        "Giannis is such a unique player! His story from Greece to NBA MVP is incredible! 🏀",
        "That Giannis moment is pure power! The way he dominates the paint is just amazing! 💪"
      ],
      category: 'enthusiasm',
      priority: 10
    },
    {
      triggers: ['curry', 'stephen', 'steph'],
      responses: [
        "Curry is absolutely legendary! His 3-point shooting changed the game forever. That's a sweet card to have in your collection! 🏀✨",
        "Steph's game is pure magic! Those deep threes are collector favorites! 🔥",
        "Curry's impact on the game is incredible! What a player to collect! 🌟",
        "That Curry moment is pure gold! The way he revolutionized the game with his shooting! 🎯"
      ],
      category: 'enthusiasm',
      priority: 10
    },
    {
      triggers: ['lebron', 'james', 'king'],
      responses: [
        "LeBron is one of the greatest ever! His career has been amazing to watch! 👑",
        "King James! His highlights are always collector favorites! 🏀",
        "LeBron's journey from high school to NBA legend is incredible! 🌟",
        "That LeBron moment captures pure greatness! The way he's dominated for so long! 💪"
      ],
      category: 'enthusiasm',
      priority: 10
    },
    {
      triggers: ['kobe', 'bryant', 'mamba'],
      responses: [
        "Kobe! The Mamba mentality is legendary! That's a piece of basketball history! 🐍",
        "Kobe's work ethic and killer instinct were unmatched! What a player to collect! 💜💛",
        "The Black Mamba! His highlights are timeless collector pieces! 🌟",
        "That Kobe moment is pure greatness! The way he approached the game! 🏆"
      ],
      category: 'enthusiasm',
      priority: 10
    },
    {
      triggers: ['jordan', 'mike', 'mj'],
      responses: [
        "Jordan! The GOAT! That's a piece of basketball royalty! 👑",
        "MJ's impact on the game is unmatched! What a legend to collect! 🏀",
        "His Airness! Jordan moments are the gold standard for collectors! 🌟",
        "That Jordan moment is pure history! The way he dominated the 90s! 🏆"
      ],
      category: 'enthusiasm',
      priority: 10
    },

    // Team enthusiasm responses
    {
      triggers: ['lakers', 'laker'],
      responses: [
        "The Lakers have such an amazing history! Purple and gold is such a classic look. Your Lakers collection must be incredible! 💜💛",
        "Lakers pride! That's a franchise with so much history and greatness! 🏀",
        "Purple and gold forever! The Lakers have such an incredible legacy! 🌟",
        "That Lakers moment is pure tradition! The way they've dominated for decades! 🏆"
      ],
      category: 'enthusiasm',
      priority: 8
    },
    {
      triggers: ['warriors', 'golden state'],
      responses: [
        "The Warriors' dynasty was incredible to watch! Those championship runs were legendary! 🏆",
        "Dub Nation! The way they changed the game with their style! 🏀",
        "Golden State's run was amazing! Curry, Klay, and Draymond were unstoppable! 🌟",
        "That Warriors moment captures pure dynasty energy! What a team! 💪"
      ],
      category: 'enthusiasm',
      priority: 8
    },
    {
      triggers: ['celtics', 'boston'],
      responses: [
        "Celtics pride! That's a franchise with the most championships! 🏆",
        "Boston's history is incredible! The way they've dominated for generations! 🍀",
        "Green runs deep! The Celtics have such an amazing legacy! 🌟",
        "That Celtics moment is pure tradition! The way they've built winners! 💪"
      ],
      category: 'enthusiasm',
      priority: 8
    },

    // Collection insights
    {
      triggers: ['defensive', 'defense', 'block', 'steal'],
      responses: [
        "I noticed you're collecting a lot of defensive plays - blocks, steals, that sick Kawhi steal. That's such a unique theme! Most people go for dunks and 3-pointers 🛡️",
        "So cool! Defense wins championships, right? That collection tells a great story about the other side of basketball 🏀",
        "Love seeing defensive highlights get the love they deserve! That's a collector who appreciates the full game! 🛡️",
        "Defensive plays are so underrated! Your collection shows real basketball knowledge! 💪"
      ],
      category: 'collection-insight',
      priority: 9
    },
    {
      triggers: ['rookie', 'first', 'debut'],
      responses: [
        "Rookie cards are so special! They capture that moment when a player's journey begins. That's a piece of basketball history right there! 🌟",
        "First moments are priceless! The beginning of what could be an amazing career! 🏀",
        "Rookie cards tell such great stories! The potential and excitement of what's to come! ✨",
        "That rookie moment is pure possibility! The start of something special! 🌟"
      ],
      category: 'collection-insight',
      priority: 8
    },
    {
      triggers: ['championship', 'finals', 'playoff'],
      responses: [
        "Championship moments are the ultimate! That's when legends are made! 🏆",
        "Playoff basketball is different! The intensity and drama captured in those moments! 🔥",
        "Finals moments are pure history! The biggest stage in basketball! 🌟",
        "That championship moment is pure glory! The culmination of everything! 🏆"
      ],
      category: 'collection-insight',
      priority: 8
    },

    // Basketball knowledge
    {
      triggers: ['dunk', 'poster', 'jam'],
      responses: [
        "That dunk is absolutely filthy! The power and athleticism is incredible! 🔥",
        "Poster dunks are the best! The way they get the crowd going! 💪",
        "That's a highlight reel dunk right there! Pure entertainment! 🏀",
        "Dunks like that are why we love basketball! Pure excitement! 🔥"
      ],
      category: 'basketball-knowledge',
      priority: 7
    },
    {
      triggers: ['three', '3-pointer', 'three pointer'],
      responses: [
        "That 3-pointer is pure skill! The range and accuracy is amazing! 🎯",
        "Deep threes are so exciting! The way they can change a game! 🔥",
        "That's a clutch three right there! Pure confidence and skill! 🏀",
        "Three-pointers like that are game-changers! Pure shooting! 🎯"
      ],
      category: 'basketball-knowledge',
      priority: 7
    },
    {
      triggers: ['pass', 'assist', 'playmaking'],
      responses: [
        "That pass is pure vision! The court awareness is incredible! 👁️",
        "Great playmaking is so underrated! The way they set up teammates! 🏀",
        "That's a dime right there! Pure basketball IQ! 🧠",
        "Assists like that show real basketball intelligence! Pure teamwork! 🤝"
      ],
      category: 'basketball-knowledge',
      priority: 7
    },

    // Safety redirects (financial language)
    {
      triggers: ['invest', 'investment', 'profit', 'return', 'roi', 'gains', 'losses', 'buy', 'sell', 'purchase', 'market', 'price', 'value', 'worth', 'money', 'cash', 'dollar', 'expensive', 'cheap', 'afford', 'recommend', 'advice', 'should', 'opportunity', 'timing'],
      responses: [
        "I love talking about cards, but I can't give buying or selling advice! I'm here to chat about collecting as a hobby - the cool designs, player history, and fun of building your collection. What's your favorite card in your collection? 🎨",
        "I'm here to talk collecting, not investing! Let's focus on the fun of the hobby - the amazing moments, player stories, and collection building! What's the coolest card you own? ✨",
        "I can't give buying/selling advice, but I love talking cards! Let's chat about the hobby - the designs, the players, the collecting journey! What's your collecting story? 🤝",
        "Let's keep it fun and focus on the collecting! I'm here to celebrate the hobby, not give financial advice. What's your favorite part of collecting? 🎉"
      ],
      category: 'safety-redirect',
      priority: 15
    },

    // General conversation responses
    {
      triggers: ['love', 'like', 'favorite', 'best'],
      responses: [
        "That's awesome! I love hearing about collectors' experiences! 🤝",
        "What a cool story! This is what makes collecting so fun! ✨",
        "That's the kind of thing that makes this hobby special! 🎉",
        "I'm always excited to hear about great collections! 🌟",
        "That sounds amazing! Collecting is all about the passion! 🔥"
      ],
      category: 'conversation',
      priority: 5
    },
    {
      triggers: ['collection', 'collect'],
      responses: [
        "Your collection has great variety across different seasons! 📊",
        "I see you prefer action shots over posed cards - love that style! 📸",
        "You've got some really unique serial numbers! 🔢",
        "Your collection is really coming together nicely! 🌟",
        "That's a complete set - awesome dedication! 🏆"
      ],
      category: 'conversation',
      priority: 6
    },
    {
      triggers: ['card', 'moment'],
      responses: [
        "That card has such cool artwork - the artist really captured the moment! 🎨",
        "That's a beautiful card! Some collectors like to showcase their best pieces ✨",
        "That's a fun addition to any collection - great player! 🏀",
        "The design on that card is absolutely stunning! 🔥",
        "That's a collector's dream right there! 🌟"
      ],
      category: 'conversation',
      priority: 5
    }
  ]

  // Conversation starters
  const conversationStarters = [
    {
      id: '1',
      question: "What's your favorite card in your collection?",
      category: 'favorites',
      icon: '❤️',
      response: "I love hearing about favorite cards! Each one has a story, right? What makes that card special to you? ❤️"
    },
    {
      id: '2',
      question: "Any players or teams you're hoping to collect next?",
      category: 'goals',
      icon: '🎯',
      response: "That's exciting! Having collecting goals makes the hobby so much fun. I'm rooting for you! 🎯"
    },
    {
      id: '3',
      question: "Do you remember your first pack rip?",
      category: 'memories',
      icon: '📦',
      response: "Those first pack memories are priceless! It's amazing how collecting creates such lasting memories! 📦"
    },
    {
      id: '4',
      question: "Have you ever traded with another collector?",
      category: 'community',
      icon: '🤝',
      response: "The collector community is amazing! Trading and sharing with other collectors is what makes this hobby special! 🤝"
    },
    {
      id: '5',
      question: "Which set was the most fun to complete?",
      category: 'collection',
      icon: '🏆',
      response: "Set completion is such a satisfying feeling! The dedication it takes is incredible! 🏆"
    },
    {
      id: '6',
      question: "Got any cards with a cool backstory?",
      category: 'memories',
      icon: '📖',
      response: "Every card has a story! I love hearing about the personal connections collectors have with their cards! 📖"
    }
  ]

  // Collection insights (triggered periodically)
  const collectionInsights = [
    {
      trigger: 'curry_count',
      message: "I noticed you have 8 Curry cards—are you building a Curry collection? That's awesome! 🏀",
      confidence: 0.95
    },
    {
      trigger: 'lakers_theme',
      message: "Cool seeing your Lakers collection grow! Purple and gold everywhere. 💜💛",
      confidence: 0.88
    },
    {
      trigger: 'low_serials',
      message: "You seem to like rare serials under #100. That's a true collector's touch! ✨",
      confidence: 0.92
    },
    {
      trigger: 'series1_progress',
      message: "You're just 3 cards away from completing Series 1! Almost there! 🎯",
      confidence: 0.87
    },
    {
      trigger: 'season_variety',
      message: "Your collection has great variety across different seasons. Love the mix! 🌟",
      confidence: 0.85
    },
    {
      trigger: 'defensive_theme',
      message: "I noticed you're collecting a lot of defensive plays - blocks, steals, that sick Kawhi steal. That's such a unique theme! Most people go for dunks and 3-pointers 🛡️",
      confidence: 0.90
    }
  ]

  useEffect(() => {
    // Initial greeting from Scout
    const initialMessage: ChatMessage = {
      id: '1',
      sender: 'scout',
      message: "Hey there! I'm Scout, your collecting buddy! 🤖✨ I'm here to chat about cards, collections, and all things collecting fun. What's on your mind today?",
      timestamp: new Date(),
      type: 'text'
    }
    setMessages([initialMessage])

    // Show a collection insight after a few seconds
    setTimeout(() => {
      const insight = collectionInsights[Math.floor(Math.random() * collectionInsights.length)]
      const insightMessage: ChatMessage = {
        id: '2',
        sender: 'scout',
        message: insight.message,
        timestamp: new Date(),
        type: 'collection-insight',
        metadata: {
          insightType: insight.trigger
        }
      }
      setMessages(prev => [...prev, insightMessage])
    }, 3000)
  }, [])

  useEffect(() => {
    if (messagesEndRef.current?.scrollIntoView) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const generateMockResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Add to conversation memory
    setConversationMemory(prev => new Set([...prev, lowerMessage]))

    // Find matching responses by priority
    const matchingResponses = mockResponses
      .filter(response => 
        response.triggers.some(trigger => lowerMessage.includes(trigger))
      )
      .sort((a, b) => b.priority - a.priority)

    if (matchingResponses.length > 0) {
      const topResponse = matchingResponses[0]
      const responses = topResponse.responses
      return responses[Math.floor(Math.random() * responses.length)]
    }

    // Default responses based on message length and content
    if (lowerMessage.length < 10) {
      return "That's awesome! Tell me more about your collection! 🌟"
    }

    if (lowerMessage.includes('?')) {
      return "Great question! I love talking about collecting. What's your take on that? 🤔"
    }

    // Random enthusiastic response
    const defaultResponses = [
      "That's awesome! I love hearing about collectors' experiences! 🤝",
      "What a cool story! This is what makes collecting so fun! ✨",
      "That's the kind of thing that makes this hobby special! 🎉",
      "I'm always excited to hear about great collections! 🌟",
      "That sounds amazing! Collecting is all about the passion! 🔥",
      "That's what I love about this hobby - every collector has their own story! 📖",
      "You're really building something special there! 🌟",
      "That's the kind of enthusiasm that makes collecting great! 💪"
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: inputMessage,
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setShowStarters(false)

    // Simulate typing delay
    setIsTyping(true)
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    const response = generateMockResponse(inputMessage)
    const scoutMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'scout',
      message: response,
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, scoutMessage])
    setIsTyping(false)
  }

  const handleConversationStarter = async (starter: any) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: starter.question,
      timestamp: new Date(),
      type: 'conversation-starter',
      metadata: {
        insightType: starter.category
      }
    }

    setMessages(prev => [...prev, userMessage])
    setShowStarters(false)

    // Simulate typing delay
    setIsTyping(true)
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500))

    const scoutMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'scout',
      message: starter.response,
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, scoutMessage])
    setIsTyping(false)
  }

  const getMessageIcon = (message: ChatMessage) => {
    if (message.sender === 'scout') {
      return <Bot className="w-6 h-6 text-blue-400" />
    }
    return <Smile className="w-6 h-6 text-green-400" />
  }

  const getMessageStyle = (message: ChatMessage) => {
    if (message.sender === 'scout') {
      return 'bg-blue-500/20 border-blue-500/30 text-white'
    }
    return 'bg-green-500/20 border-green-500/30 text-white'
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700 h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-400" />
          Scout - Your AI Collecting Buddy
          <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
            <Shield className="w-3 h-3 mr-1" />
            Hobby Safe
          </Badge>
          <Badge variant="outline" className="text-xs bg-purple-500/20 text-purple-400 border-purple-500">
            <Lightbulb className="w-3 h-3 mr-1" />
            Demo Mode
          </Badge>
        </CardTitle>
        <p className="text-sm text-gray-400">
          Chat about collecting, not investing! 🤝
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'scout' && (
                <div className="flex-shrink-0">
                  {getMessageIcon(message)}
                </div>
              )}
              
              <div className={`max-w-[80%] p-3 rounded-lg border ${getMessageStyle(message)}`}>
                <p className="text-sm">{message.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {message.sender === 'user' && (
                <div className="flex-shrink-0">
                  {getMessageIcon(message)}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <Bot className="w-6 h-6 text-blue-400" />
              <div className="bg-blue-500/20 border-blue-500/30 text-white p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Conversation Starters */}
        {showStarters && (
          <div className="p-4 border-t border-gray-700">
            <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              Start a conversation:
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {conversationStarters.slice(0, 4).map((starter) => (
                <Button
                  key={starter.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleConversationStarter(starter)}
                  className="text-xs h-auto p-2 text-left justify-start"
                >
                  <span className="mr-1">{starter.icon}</span>
                  {starter.question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Chat with Scout about collecting..."
              className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              size="sm"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Safety Reminder */}
          <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Scout is your collecting buddy - no financial advice, just hobby fun! 🤝
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ScoutChat 