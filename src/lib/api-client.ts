// Enhanced API client with caching, retry logic, and better error handling

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp?: string
}

interface ApiConfig {
  baseURL?: string
  timeout?: number
  retries?: number
  retryDelay?: number
  cacheTime?: number
}

class ApiClient {
  private baseURL: string
  private timeout: number
  private retries: number
  private retryDelay: number
  private cacheTime: number
  private cache: Map<string, { data: any; timestamp: number }>

  constructor(config: ApiConfig = {}) {
    this.baseURL = config.baseURL || ''
    this.timeout = config.timeout || 10000
    this.retries = config.retries || 3
    this.retryDelay = config.retryDelay || 1000
    this.cacheTime = config.cacheTime || 5 * 60 * 1000 // 5 minutes
    this.cache = new Map()
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    useCache = true
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const cacheKey = `${options.method || 'GET'}:${url}:${JSON.stringify(options.body || '')}`

    // Check cache first
    if (useCache && options.method !== 'POST' && options.method !== 'PUT' && options.method !== 'DELETE') {
      const cached = this.cache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < this.cacheTime) {
        return { success: true, data: cached.data, timestamp: new Date().toISOString() }
      }
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
    }

    let lastError: Error | null = null

    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        const response = await fetch(url, { ...defaultOptions, ...options })
        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        // Cache successful responses
        if (useCache && response.ok && options.method !== 'POST' && options.method !== 'PUT' && options.method !== 'DELETE') {
          this.cache.set(cacheKey, { data, timestamp: Date.now() })
        }

        return {
          success: true,
          data,
          timestamp: new Date().toISOString(),
        }
      } catch (error) {
        lastError = error as Error
        
        // Don't retry on certain errors
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new Error('Request timeout')
          }
          if (error.message.includes('404')) {
            throw new Error('Resource not found')
          }
          if (error.message.includes('401')) {
            throw new Error('Unauthorized')
          }
          if (error.message.includes('403')) {
            throw new Error('Forbidden')
          }
        }

        // Wait before retrying (except on last attempt)
        if (attempt < this.retries) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * (attempt + 1)))
        }
      }
    }

    throw lastError || new Error('Request failed')
  }

  async get<T>(endpoint: string, useCache = true): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' }, useCache)
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }, false)
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }, false)
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' }, false)
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear()
  }

  // Clear expired cache entries
  clearExpiredCache(): void {
    const now = Date.now()
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheTime) {
        this.cache.delete(key)
      }
    }
  }

  // Get cache stats
  getCacheStats(): { size: number; entries: number } {
    return {
      size: this.cache.size,
      entries: this.cache.size,
    }
  }
}

// NBA TopShot specific API client
export class NBATopShotApiClient extends ApiClient {
  constructor() {
    super({
      baseURL: '/api/flow',
      timeout: 15000,
      retries: 3,
      retryDelay: 1000,
      cacheTime: 2 * 60 * 1000, // 2 minutes for market data
    })
  }

  // Marketplace data
  async getMarketplace(filters: any = {}, limit = 50, offset = 0) {
    return this.post('/marketplace', { filters, limit, offset })
  }

  // Pack activity
  async getPackActivity(filters: any = {}, limit = 20) {
    return this.post('/packs', { filters, limit })
  }

  // Portfolio data
  async getPortfolio(address: string) {
    return this.get(`/comprehensive-portfolio?address=${address}`)
  }

  // Real-time data
  async getRealTimeData() {
    return this.get('/real-time-data', false) // Don't cache real-time data
  }

  // Market data
  async getMarketData() {
    return this.get('/market-data')
  }

  // Collections
  async getCollections() {
    return this.get('/collections')
  }

  // Transactions
  async getTransactions(address: string, limit = 50) {
    return this.get(`/transactions?address=${address}&limit=${limit}`)
  }
}

// Create singleton instance
export const apiClient = new NBATopShotApiClient()

// Utility functions for common API patterns
export const apiUtils = {
  // Handle API errors consistently
  handleError: (error: any): string => {
    if (error instanceof Error) {
      return error.message
    }
    if (typeof error === 'string') {
      return error
    }
    return 'An unexpected error occurred'
  },

  // Debounce API calls
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  },

  // Throttle API calls
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  },

  // Retry with exponential backoff
  retryWithBackoff: async <T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    baseDelay = 1000
  ): Promise<T> => {
    let lastError: Error
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error as Error
        
        if (i === maxRetries) {
          throw lastError
        }
        
        const delay = baseDelay * Math.pow(2, i)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    
    throw lastError!
  }
} 