import { NextRequest, NextResponse } from 'next/server'

interface ScoutResponse {
  message: string
  type: 'hobby-chat' | 'collection-insight' | 'safety-redirect' | 'conversation-starter' | 'enthusiasm'
  metadata?: {
    insightType?: string
    cardName?: string
    playerName?: string
    safetyFlag?: boolean
    emotion?: string
  }
}

// Comprehensive mock response system
const MOCK_RESPONSES = {
  // Player enthusiasm responses
  giannis: [
    "Whoa, that Giannis poster dunk is INSANE! 🔥 The way they captured him mid-air is just perfect. That photographer nailed it!",
    "The Greek Freak! His dunks are absolutely legendary! That's a collector's dream right there! 🌟",
    "Giannis is such a unique player! His story from Greece to NBA MVP is incredible! 🏀",
    "That Giannis moment is pure power! The way he dominates the paint is just amazing! 💪"
  ],
  curry: [
    "Curry is absolutely legendary! His 3-point shooting changed the game forever. That's a sweet card to have in your collection! 🏀✨",
    "Steph's game is pure magic! Those deep threes are collector favorites! 🔥",
    "Curry's impact on the game is incredible! What a player to collect! 🌟",
    "That Curry moment is pure gold! The way he revolutionized the game with his shooting! 🎯"
  ],
  lebron: [
    "LeBron is one of the greatest ever! His career has been amazing to watch! 👑",
    "King James! His highlights are always collector favorites! 🏀",
    "LeBron's journey from high school to NBA legend is incredible! 🌟",
    "That LeBron moment captures pure greatness! The way he's dominated for so long! 💪"
  ],
  kobe: [
    "Kobe! The Mamba mentality is legendary! That's a piece of basketball history! 🐍",
    "Kobe's work ethic and killer instinct were unmatched! What a player to collect! 💜💛",
    "The Black Mamba! His highlights are timeless collector pieces! 🌟",
    "That Kobe moment is pure greatness! The way he approached the game! 🏆"
  ],
  jordan: [
    "Jordan! The GOAT! That's a piece of basketball royalty! 👑",
    "MJ's impact on the game is unmatched! What a legend to collect! 🏀",
    "His Airness! Jordan moments are the gold standard for collectors! 🌟",
    "That Jordan moment is pure history! The way he dominated the 90s! 🏆"
  ],

  // Team enthusiasm responses
  lakers: [
    "The Lakers have such an amazing history! Purple and gold is such a classic look. Your Lakers collection must be incredible! 💜💛",
    "Lakers pride! That's a franchise with so much history and greatness! 🏀",
    "Purple and gold forever! The Lakers have such an incredible legacy! 🌟",
    "That Lakers moment is pure tradition! The way they've dominated for decades! 🏆"
  ],
  warriors: [
    "The Warriors' dynasty was incredible to watch! Those championship runs were legendary! 🏆",
    "Dub Nation! The way they changed the game with their style! 🏀",
    "Golden State's run was amazing! Curry, Klay, and Draymond were unstoppable! 🌟",
    "That Warriors moment captures pure dynasty energy! What a team! 💪"
  ],
  celtics: [
    "Celtics pride! That's a franchise with the most championships! 🏆",
    "Boston's history is incredible! The way they've dominated for generations! 🍀",
    "Green runs deep! The Celtics have such an amazing legacy! 🌟",
    "That Celtics moment is pure tradition! The way they've built winners! 💪"
  ],

  // Collection insights
  defensive: [
    "I noticed you're collecting a lot of defensive plays - blocks, steals, that sick Kawhi steal. That's such a unique theme! Most people go for dunks and 3-pointers 🛡️",
    "So cool! Defense wins championships, right? That collection tells a great story about the other side of basketball 🏀",
    "Love seeing defensive highlights get the love they deserve! That's a collector who appreciates the full game! 🛡️",
    "Defensive plays are so underrated! Your collection shows real basketball knowledge! 💪"
  ],
  rookie: [
    "Rookie cards are so special! They capture that moment when a player's journey begins. That's a piece of basketball history right there! 🌟",
    "First moments are priceless! The beginning of what could be an amazing career! 🏀",
    "Rookie cards tell such great stories! The potential and excitement of what's to come! ✨",
    "That rookie moment is pure possibility! The start of something special! 🌟"
  ],
  championship: [
    "Championship moments are the ultimate! That's when legends are made! 🏆",
    "Playoff basketball is different! The intensity and drama captured in those moments! 🔥",
    "Finals moments are pure history! The biggest stage in basketball! 🌟",
    "That championship moment is pure glory! The culmination of everything! 🏆"
  ],

  // Basketball knowledge
  dunk: [
    "That dunk is absolutely filthy! The power and athleticism is incredible! 🔥",
    "Poster dunks are the best! The way they get the crowd going! 💪",
    "That's a highlight reel dunk right there! Pure entertainment! 🏀",
    "Dunks like that are why we love basketball! Pure excitement! 🔥"
  ],
  three: [
    "That 3-pointer is pure skill! The range and accuracy is amazing! 🎯",
    "Deep threes are so exciting! The way they can change a game! 🔥",
    "That's a clutch three right there! Pure confidence and skill! 🏀",
    "Three-pointers like that are game-changers! Pure shooting! 🎯"
  ],
  pass: [
    "That pass is pure vision! The court awareness is incredible! 👁️",
    "Great playmaking is so underrated! The way they set up teammates! 🏀",
    "That's a dime right there! Pure basketball IQ! 🧠",
    "Assists like that show real basketball intelligence! Pure teamwork! 🤝"
  ],

  // Safety redirects
  safety: [
    "I love talking about cards, but I can't give buying or selling advice! I'm here to chat about collecting as a hobby - the cool designs, player history, and fun of building your collection. What's your favorite card in your collection? 🎨",
    "I'm here to talk collecting, not investing! Let's focus on the fun of the hobby - the amazing moments, player stories, and collection building! What's the coolest card you own? ✨",
    "I can't give buying/selling advice, but I love talking cards! Let's chat about the hobby - the designs, the players, the collecting journey! What's your collecting story? 🤝",
    "Let's keep it fun and focus on the collecting! I'm here to celebrate the hobby, not give financial advice. What's your favorite part of collecting? 🎉"
  ],

  // General conversation responses
  general: [
    "That's awesome! I love hearing about collectors' experiences! 🤝",
    "What a cool story! This is what makes collecting so fun! ✨",
    "That's the kind of thing that makes this hobby special! 🎉",
    "I'm always excited to hear about great collections! 🌟",
    "That sounds amazing! Collecting is all about the passion! 🔥",
    "That's what I love about this hobby - every collector has their own story! 📖",
    "You're really building something special there! 🌟",
    "That's the kind of enthusiasm that makes collecting great! 💪"
  ],
  collection: [
    "Your collection has great variety across different seasons! 📊",
    "I see you prefer action shots over posed cards - love that style! 📸",
    "You've got some really unique serial numbers! 🔢",
    "Your collection is really coming together nicely! 🌟",
    "That's a complete set - awesome dedication! 🏆"
  ],
  card: [
    "That card has such cool artwork - the artist really captured the moment! 🎨",
    "That's a beautiful card! Some collectors like to showcase their best pieces ✨",
    "That's a fun addition to any collection - great player! 🏀",
    "The design on that card is absolutely stunning! 🔥",
    "That's a collector's dream right there! 🌟"
  ]
}

// Financial/investment keywords to detect and redirect
const FINANCIAL_KEYWORDS = [
  'invest', 'investment', 'profit', 'return', 'roi', 'gains', 'losses',
  'buy', 'sell', 'purchase', 'market', 'price', 'value', 'worth',
  'money', 'cash', 'dollar', 'expensive', 'cheap', 'afford',
  'recommend', 'advice', 'should', 'opportunity', 'timing'
]

// Collection insights based on user data
const COLLECTION_INSIGHTS = [
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

function detectFinancialLanguage(message: string): boolean {
  const lowerMessage = message.toLowerCase()
  return FINANCIAL_KEYWORDS.some(keyword => lowerMessage.includes(keyword))
}

function generateMockResponse(userMessage: string): ScoutResponse {
  const lowerMessage = userMessage.toLowerCase()

  // Check for financial language and redirect
  if (detectFinancialLanguage(userMessage)) {
    const responses = MOCK_RESPONSES.safety
    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      type: 'safety-redirect',
      metadata: {
        safetyFlag: true
      }
    }
  }

  // Player-specific responses
  if (lowerMessage.includes('giannis') || lowerMessage.includes('antetokounmpo') || lowerMessage.includes('greek freak')) {
    const responses = MOCK_RESPONSES.giannis
    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      type: 'enthusiasm',
      metadata: {
        playerName: 'giannis',
        emotion: 'excited'
      }
    }
  }

  if (lowerMessage.includes('curry') || lowerMessage.includes('stephen') || lowerMessage.includes('steph')) {
    const responses = MOCK_RESPONSES.curry
    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      type: 'enthusiasm',
      metadata: {
        playerName: 'curry',
        emotion: 'excited'
      }
    }
  }

  if (lowerMessage.includes('lebron') || lowerMessage.includes('james') || lowerMessage.includes('king')) {
    const responses = MOCK_RESPONSES.lebron
    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      type: 'enthusiasm',
      metadata: {
        playerName: 'lebron',
        emotion: 'excited'
      }
    }
  }

  if (lowerMessage.includes('kobe') || lowerMessage.includes('bryant') || lowerMessage.includes('mamba')) {
    const responses = MOCK_RESPONSES.kobe
    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      type: 'enthusiasm',
      metadata: {
        playerName: 'kobe',
        emotion: 'excited'
      }
    }
  }

  if (lowerMessage.includes('jordan') || lowerMessage.includes('mike') || lowerMessage.includes('mj')) {
    const responses = MOCK_RESPONSES.jordan
    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      type: 'enthusiasm',
      metadata: {
        playerName: 'jordan',
        emotion: 'excited'
      }
    }
  }

  // Team-specific responses
  if (lowerMessage.includes('lakers') || lowerMessage.includes('laker')) {
    const responses = MOCK_RESPONSES.lakers
    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      type: 'enthusiasm',
      metadata: {
        playerName: 'lakers',
        emotion: 'excited'
      }
    }
  }

  if (lowerMessage.includes('warriors') || lowerMessage.includes('golden state')) {
    const responses = MOCK_RESPONSES.warriors
    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      type: 'enthusiasm',
      metadata: {
        playerName: 'warriors',
        emotion: 'excited'
      }
    }
  }

  if (lowerMessage.includes('celtics') || lowerMessage.includes('boston')) {
    const responses = MOCK_RESPONSES.celtics
    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      type: 'enthusiasm',
      metadata: {
        playerName: 'celtics',
        emotion: 'excited'
      }
    }
  }

  // Collection insights
  if (lowerMessage.includes('defensive') || lowerMessage.includes('defense') || lowerMessage.includes('block') || lowerMessage.includes('steal')) {
    const responses = MOCK_RESPONSES.defensive
    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      type: 'collection-insight',
      metadata: {
        insightType: 'defensive_theme'
      }
    }
  }

  if (lowerMessage.includes('rookie') || lowerMessage.includes('first') || lowerMessage.includes('debut')) {
    const responses = MOCK_RESPONSES.rookie
    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      type: 'collection-insight',
      metadata: {
        insightType: 'rookie_cards'
      }
    }
  }

  if (lowerMessage.includes('championship') || lowerMessage.includes('finals') || lowerMessage.includes('playoff')) {
    const responses = MOCK_RESPONSES.championship
    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      type: 'collection-insight',
      metadata: {
        insightType: 'championship_moments'
      }
    }
  }

  // Basketball knowledge
  if (lowerMessage.includes('dunk') || lowerMessage.includes('poster') || lowerMessage.includes('jam')) {
    const responses = MOCK_RESPONSES.dunk
    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      type: 'hobby-chat',
      metadata: {
        insightType: 'dunks'
      }
    }
  }

  if (lowerMessage.includes('three') || lowerMessage.includes('3-pointer') || lowerMessage.includes('three pointer')) {
    const responses = MOCK_RESPONSES.three
    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      type: 'hobby-chat',
      metadata: {
        insightType: 'three_pointers'
      }
    }
  }

  if (lowerMessage.includes('pass') || lowerMessage.includes('assist') || lowerMessage.includes('playmaking')) {
    const responses = MOCK_RESPONSES.pass
    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      type: 'hobby-chat',
      metadata: {
        insightType: 'playmaking'
      }
    }
  }

  // Collection-related responses
  if (lowerMessage.includes('collection') || lowerMessage.includes('collect')) {
    const responses = MOCK_RESPONSES.collection
    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      type: 'hobby-chat'
    }
  }

  // Card appreciation responses
  if (lowerMessage.includes('card') || lowerMessage.includes('moment')) {
    const responses = MOCK_RESPONSES.card
    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      type: 'hobby-chat'
    }
  }

  // Default response
  const responses = MOCK_RESPONSES.general
  return {
    message: responses[Math.floor(Math.random() * responses.length)],
    type: 'hobby-chat'
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    // Validate input
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400 }
      )
    }

    // Generate mock response
    const response = generateMockResponse(message)

    return NextResponse.json({
      success: true,
      response,
      timestamp: new Date().toISOString(),
      demo: true
    })

  } catch (error) {
    console.error('Scout API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        response: {
          message: "Sorry, I'm having trouble right now! But I'm still here to chat about collecting! 🤝",
          type: 'hobby-chat'
        }
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Return conversation starters and collection insights
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

  return NextResponse.json({
    success: true,
    conversationStarters,
    collectionInsights: COLLECTION_INSIGHTS,
    safetyNotice: "Scout is your collecting buddy - no financial advice, just hobby fun! 🤝",
    demo: true
  })
} 