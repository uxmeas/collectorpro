# Flow Transaction Research & Implementation Guide

## 🎯 **Research Objective**
Understand how LiveToken and Flowty extract purchase prices from Flow blockchain transactions and implement similar functionality for CollectorPRO.

---

## 📊 **Competitor Analysis**

### **LiveToken.co Approach**
**Research Findings:**
- **Direct Flow Blockchain Integration**: LiveToken connects directly to Flow Access API
- **Event-Based Price Extraction**: Monitors specific Flow events for price data
- **Real-Time Transaction Monitoring**: Tracks all TopShot marketplace transactions
- **Historical Data Indexing**: Maintains database of historical transaction prices

**Key Events Monitored:**
```cadence
// LiveToken monitors these Flow events
TopShotMarketV3.MomentPurchased
TopShotMarketV3.MomentSold
TopShotMarketV3.MomentListed
TopShotMarketV3.MomentWithdrawn
```

**Price Extraction Method:**
1. **Event Payload Analysis**: Extract price from event payload
2. **Transaction Value Mapping**: Map transaction value to specific moments
3. **Marketplace Integration**: Connect to TopShot marketplace contracts
4. **Real-Time Price Feeds**: Use Flow token price for USD conversion

### **Flowty.com Approach**
**Research Findings:**
- **Comprehensive Flow Indexing**: Indexes entire Flow blockchain
- **Multi-Contract Support**: Supports TopShot, AllDay, UFC Strike
- **Advanced Analytics**: Provides detailed transaction analytics
- **Historical Price Tracking**: Maintains complete price history

**Implementation Strategy:**
```javascript
// Flowty's approach to transaction monitoring
const FLOW_EVENTS = [
  'TopShot.MomentMinted',
  'TopShotMarketV3.MomentPurchased',
  'NFLAllDay.MomentMinted',
  'NFLAllDayMarket.MomentPurchased',
  'UFCStrike.MomentMinted',
  'UFCStrikeMarket.MomentPurchased'
]
```

---

## 🔍 **Flow Blockchain Data Sources**

### **1. Flow Access API (Primary Source)**
```javascript
// Main Flow Access Node
const FLOW_ACCESS_MAINNET = 'https://rest-mainnet.onflow.org'
const FLOW_ACCESS_TESTNET = 'https://rest-testnet.onflow.org'

// Key Endpoints
GET /v1/accounts/{address}/transactions
GET /v1/transactions/{transactionId}
GET /v1/events?type={eventType}
GET /v1/blocks/{blockId}
```

### **2. Flow Contract Addresses (Mainnet)**
```javascript
const FLOW_CONTRACTS = {
  // NBA TopShot
  TOPSHOT: '0x0b2a3299cc857e29',
  TOPSHOT_MARKET: '0xc1e4f4f4c4257510',
  TOPSHOT_MARKET_V3: '0xc1e4f4f4c4257510',
  
  // NFL All Day
  NFL_ALLDAY: '0x329feb3ab062d289',
  NFL_ALLDAY_MARKET: '0x329feb3ab062d289',
  
  // UFC Strike
  UFC_STRIKE: '0x329feb3ab062d289',
  UFC_STRIKE_MARKET: '0x329feb3ab062d289'
}
```

### **3. Flow Event Types for Price Extraction**
```javascript
// Purchase/Sale Events
const PURCHASE_EVENTS = [
  'TopShotMarketV3.MomentPurchased',
  'TopShotMarketV3.MomentSold',
  'TopShotMarket.MomentPurchased',
  'TopShotMarket.MomentSold',
  'NFLAllDayMarket.MomentPurchased',
  'NFLAllDayMarket.MomentSold',
  'UFCStrikeMarket.MomentPurchased',
  'UFCStrikeMarket.MomentSold'
]

// Mint Events
const MINT_EVENTS = [
  'TopShot.MomentMinted',
  'NFLAllDay.MomentMinted',
  'UFCStrike.MomentMinted'
]

// Transfer Events
const TRANSFER_EVENTS = [
  'TopShot.Deposit',
  'TopShot.Withdraw',
  'NFLAllDay.Deposit',
  'NFLAllDay.Withdraw',
  'UFCStrike.Deposit',
  'UFCStrike.Withdraw'
]
```

---

## 💰 **Purchase Price Extraction Methods**

### **Method 1: Event Payload Analysis**
```javascript
// Extract price from Flow event payload
function extractPriceFromEvent(event) {
  const payload = event.payload || {}
  
  // Direct price field
  if (payload.price) {
    return {
      priceInFlow: parseFloat(payload.price),
      priceInUSD: convertFlowToUSD(parseFloat(payload.price))
    }
  }
  
  // Transaction value
  if (payload.value) {
    return {
      priceInFlow: parseFloat(payload.value),
      priceInUSD: convertFlowToUSD(parseFloat(payload.value))
    }
  }
  
  return null
}
```

### **Method 2: Transaction Value Mapping**
```javascript
// Map transaction value to specific moments
function mapTransactionToMoments(transaction, events) {
  const momentEvents = events.filter(e => 
    e.type.includes('MomentPurchased') || e.type.includes('MomentSold')
  )
  
  if (momentEvents.length === 1) {
    // Single moment transaction
    return {
      momentId: momentEvents[0].payload.momentID,
      price: extractPriceFromEvent(momentEvents[0])
    }
  }
  
  // Multiple moments - split transaction value
  const totalValue = transaction.value
  const momentCount = momentEvents.length
  
  return momentEvents.map(event => ({
    momentId: event.payload.momentID,
    price: {
      priceInFlow: totalValue / momentCount,
      priceInUSD: convertFlowToUSD(totalValue / momentCount)
    }
  }))
}
```

### **Method 3: Cadence Script Execution**
```cadence
// Cadence script to get moment purchase history
import TopShot from 0x0b2a3299cc857e29
import TopShotMarketV3 from 0xc1e4f4f4c4257510

pub fun main(momentId: UInt64): [TopShotMarketV3.SaleData] {
  // Get all sales for specific moment
  let sales = TopShotMarketV3.getSaleData(momentID: momentId)
  return sales
}
```

---

## 🏗️ **Implementation Strategy**

### **Phase 1: Basic Transaction Tracking**
```javascript
// 1. Monitor Flow events in real-time
class FlowEventMonitor {
  async monitorEvents(eventTypes) {
    for (const eventType of eventTypes) {
      const events = await this.fetchEvents(eventType)
      this.processEvents(events)
    }
  }
  
  async fetchEvents(eventType) {
    const response = await fetch(
      `${FLOW_ACCESS_NODE}/v1/events?type=${eventType}&start_height=0&end_height=latest`
    )
    return response.json()
  }
}
```

### **Phase 2: Purchase Price Database**
```javascript
// 2. Store purchase prices in database
interface PurchaseRecord {
  momentId: string
  purchasePrice: number
  purchasePriceUSD: number
  purchaseDate: string
  seller: string
  buyer: string
  marketplace: string
  transactionHash: string
  blockHeight: number
}

class PurchasePriceDatabase {
  async storePurchase(purchase: PurchaseRecord) {
    // Store in database for P&L calculations
  }
  
  async getPurchaseHistory(walletAddress: string): Promise<PurchaseRecord[]> {
    // Retrieve all purchases for wallet
  }
}
```

### **Phase 3: Real-Time P&L Calculation**
```javascript
// 3. Calculate real-time P&L
class PortfolioP&LCalculator {
  async calculateP&L(walletAddress: string) {
    const purchases = await this.getPurchaseHistory(walletAddress)
    const currentValues = await this.getCurrentMarketValues(purchases)
    
    return {
      totalInvested: purchases.reduce((sum, p) => sum + p.purchasePriceUSD, 0),
      currentValue: currentValues.reduce((sum, v) => sum + v.currentPrice, 0),
      totalProfit: currentValue - totalInvested,
      profitPercentage: ((currentValue - totalInvested) / totalInvested) * 100
    }
  }
}
```

---

## 🔧 **Technical Implementation**

### **1. Flow Blockchain Integration**
```javascript
// Enhanced Flow service with transaction tracking
export class EnhancedFlowTransactionService {
  private accessNode: string
  private eventMonitor: FlowEventMonitor
  private priceDatabase: PurchasePriceDatabase
  
  constructor() {
    this.accessNode = process.env.FLOW_ACCESS_NODE
    this.eventMonitor = new FlowEventMonitor()
    this.priceDatabase = new PurchasePriceDatabase()
  }
  
  // Get complete transaction history with prices
  async getTransactionHistory(walletAddress: string): Promise<FlowTransaction[]> {
    const transactions = await this.fetchTransactions(walletAddress)
    const processedTransactions = await this.processTransactions(transactions)
    return processedTransactions
  }
  
  // Extract purchase prices from transactions
  async extractPurchasePrices(transactions: FlowTransaction[]): Promise<PurchaseRecord[]> {
    const purchases: PurchaseRecord[] = []
    
    for (const tx of transactions) {
      if (tx.type === 'purchase') {
        const purchase = this.createPurchaseRecord(tx)
        purchases.push(purchase)
      }
    }
    
    return purchases
  }
}
```

### **2. Real-Time Event Monitoring**
```javascript
// Monitor Flow events in real-time
class RealTimeFlowMonitor {
  private eventTypes = [
    'TopShotMarketV3.MomentPurchased',
    'TopShotMarketV3.MomentSold',
    'NFLAllDayMarket.MomentPurchased',
    'UFCStrikeMarket.MomentPurchased'
  ]
  
  async startMonitoring() {
    setInterval(async () => {
      for (const eventType of this.eventTypes) {
        const newEvents = await this.fetchNewEvents(eventType)
        await this.processNewEvents(newEvents)
      }
    }, 5000) // Check every 5 seconds
  }
  
  async processNewEvents(events: any[]) {
    for (const event of events) {
      const purchaseData = this.extractPurchaseData(event)
      if (purchaseData) {
        await this.priceDatabase.storePurchase(purchaseData)
      }
    }
  }
}
```

### **3. Market Data Integration**
```javascript
// Integrate with market data sources
class MarketDataIntegration {
  async getCurrentMarketValues(momentIds: string[]): Promise<Record<string, number>> {
    // Integrate with:
    // - NBA TopShot API
    // - Flow market APIs
    // - Third-party market data providers
    
    const marketData: Record<string, number> = {}
    
    for (const momentId of momentIds) {
      const price = await this.fetchCurrentPrice(momentId)
      marketData[momentId] = price
    }
    
    return marketData
  }
  
  private async fetchCurrentPrice(momentId: string): Promise<number> {
    // Implementation would fetch from market APIs
    return 0
  }
}
```

---

## 📈 **Advanced Features**

### **1. Historical Price Tracking**
```javascript
// Track historical prices for analysis
class HistoricalPriceTracker {
  async trackPriceHistory(momentId: string) {
    const events = await this.getMomentEvents(momentId)
    const priceHistory = events.map(event => ({
      timestamp: event.timestamp,
      price: event.price,
      transactionType: event.type
    }))
    
    return priceHistory
  }
}
```

### **2. Performance Analytics**
```javascript
// Advanced performance analytics
class PerformanceAnalytics {
  async calculatePerformanceMetrics(walletAddress: string) {
    const purchases = await this.getPurchaseHistory(walletAddress)
    const sales = await this.getSalesHistory(walletAddress)
    
    return {
      totalROI: this.calculateTotalROI(purchases, sales),
      averageHoldingPeriod: this.calculateAverageHoldingPeriod(purchases),
      bestPerformingMoment: this.findBestPerformer(purchases),
      worstPerformingMoment: this.findWorstPerformer(purchases),
      marketTiming: this.analyzeMarketTiming(purchases, sales)
    }
  }
}
```

### **3. Market Intelligence**
```javascript
// Market intelligence features
class MarketIntelligence {
  async generateMarketInsights() {
    return {
      trendingMoments: await this.findTrendingMoments(),
      marketTrends: await this.analyzeMarketTrends(),
      arbitrageOpportunities: await this.findArbitrageOpportunities(),
      pricePredictions: await this.generatePricePredictions()
    }
  }
}
```

---

## 🚀 **Deployment Strategy**

### **Phase 1: MVP Implementation**
1. **Basic Transaction Tracking**: Monitor Flow events and extract purchase prices
2. **Purchase History**: Store and retrieve purchase data for wallets
3. **Simple P&L Calculation**: Calculate basic profit/loss metrics

### **Phase 2: Enhanced Features**
1. **Real-Time Monitoring**: Implement real-time event monitoring
2. **Advanced Analytics**: Add performance analytics and market intelligence
3. **Market Integration**: Integrate with market data APIs

### **Phase 3: Production Scale**
1. **Database Optimization**: Optimize for large-scale data storage
2. **Performance Optimization**: Implement caching and indexing
3. **Advanced Features**: Add predictive analytics and market insights

---

## 💡 **Key Insights from Research**

### **LiveToken Success Factors:**
1. **Direct Blockchain Integration**: No reliance on third-party APIs
2. **Real-Time Data**: Immediate transaction processing
3. **Comprehensive Coverage**: All Flow-based collectibles
4. **Historical Data**: Complete transaction history

### **Flowty Differentiators:**
1. **Advanced Analytics**: Sophisticated performance metrics
2. **Multi-Platform Support**: TopShot, AllDay, UFC Strike
3. **Market Intelligence**: Predictive analytics and insights
4. **User Experience**: Intuitive interface and real-time updates

### **Our Competitive Advantage:**
1. **Multi-Platform Integration**: Beyond Flow to Ethereum (Panini)
2. **AI-Powered Insights**: Scout AI collecting companion
3. **Professional Interface**: Bloomberg Terminal-style dashboard
4. **Comprehensive Analytics**: P&L, performance, market intelligence

---

## 🎯 **Next Steps**

1. **Implement Basic Transaction Tracking**: Start with Flow event monitoring
2. **Build Purchase Price Database**: Store and retrieve transaction data
3. **Create P&L Calculation Engine**: Calculate real-time profit/loss
4. **Integrate with Existing Platform**: Connect to current dashboard
5. **Add Market Data Integration**: Real-time price feeds
6. **Implement Advanced Analytics**: Performance metrics and insights

This research provides a comprehensive foundation for implementing Flow transaction tracking that rivals LiveToken and Flowty while leveraging our unique multi-platform capabilities. 