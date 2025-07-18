import React from 'react'

// Base API client with caching, retries, and error handling
export interface ApiOptions {
  timeout?: number
  retries?: number
  cacheEnabled?: boolean
  cacheTTL?: number
}

export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

export interface SortParams {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface FilterParams {
  [key: string]: any
}

export type ApiParams = PaginationParams & SortParams & FilterParams

export interface ApiResponse<T = any> {
  data: T
  status: number
  message?: string
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

class ApiClient {
  private baseUrl: string
  private defaultOptions: ApiOptions
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map()

  constructor(baseUrl: string = '', options: ApiOptions = {}) {
    this.baseUrl = baseUrl
    this.defaultOptions = {
      timeout: 10000,
      retries: 3,
      cacheEnabled: true,
      cacheTTL: 300000, // 5 minutes
      ...options
    }
  }

  private getCacheKey(url: string, options: RequestInit): string {
    return `${url}_${JSON.stringify(options)}`
  }

  private isValidCacheEntry(entry: { timestamp: number; ttl: number }): boolean {
    return Date.now() - entry.timestamp < entry.ttl
  }

  private async makeRequest<T>(
    url: string, 
    options: RequestInit & ApiOptions
  ): Promise<T> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || this.defaultOptions.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new ApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status
        )
      }

      const data = await response.json()
      return data
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Network request failed', 0)
    }
  }

  private async requestWithRetry<T>(
    url: string,
    options: RequestInit & ApiOptions,
    retries: number = this.defaultOptions.retries || 3
  ): Promise<T> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await this.makeRequest<T>(url, options)
      } catch (error) {
        if (attempt === retries || (error instanceof ApiError && error.status >= 400 && error.status < 500)) {
          throw error
        }
        
        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    throw new ApiError('Max retries exceeded', 0)
  }

  async request<T>(
    endpoint: string,
    options: RequestInit & ApiOptions = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const mergedOptions = { ...this.defaultOptions, ...options }
    
    // Check cache if enabled
    if (mergedOptions.cacheEnabled && options.method !== 'POST' && options.method !== 'PUT' && options.method !== 'DELETE') {
      const cacheKey = this.getCacheKey(url, options)
      const cacheEntry = this.cache.get(cacheKey)
      
      if (cacheEntry && this.isValidCacheEntry(cacheEntry)) {
        return cacheEntry.data
      }
    }

    const data = await this.requestWithRetry<T>(url, mergedOptions)

    // Cache the response if caching is enabled
    if (mergedOptions.cacheEnabled && options.method !== 'POST' && options.method !== 'PUT' && options.method !== 'DELETE') {
      const cacheKey = this.getCacheKey(url, options)
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        ttl: mergedOptions.cacheTTL || this.defaultOptions.cacheTTL || 300000
      })
    }

    return data
  }

  async get<T>(url: string, options: ApiOptions = {}): Promise<T> {
    return this.request<T>(url, { method: 'GET', ...options })
  }

  async post<T>(endpoint: string, data?: any, options: ApiOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })
  }

  async put<T>(endpoint: string, data?: any, options: ApiOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })
  }

  async delete<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', ...options })
  }

  clearCache(): void {
    this.cache.clear()
  }

  getCacheSize(): number {
    return this.cache.size
  }
}

// Platform-specific clients
export class NBATopShotClient extends ApiClient {
  constructor(options?: ApiOptions) {
    super('/api/nba', options)
  }

  async getPortfolio(walletAddress: string, options?: ApiOptions) {
    return this.get(`/portfolio?address=${walletAddress}`, options)
  }

  async getMoments(params?: ApiParams, options?: ApiOptions) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
    }
    const url = searchParams.toString() ? `/moments?${searchParams.toString()}` : '/moments'
    return this.get(url, options)
  }

  async getMomentDetails(momentId: string, options?: ApiOptions) {
    return this.get(`/moments/${momentId}`, options)
  }

  async getMarketData(params?: ApiParams, options?: ApiOptions) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
    }
    const url = searchParams.toString() ? `/market?${searchParams.toString()}` : '/market'
    return this.get(url, options)
  }
}

export class WNBAClient extends ApiClient {
  constructor(options?: ApiOptions) {
    super('/api/wnba', options)
  }

  // WNBA-specific methods will be added here
}

export class NFLClient extends ApiClient {
  constructor(options?: ApiOptions) {
    super('/api/nfl', options)
  }

  // NFL-specific methods will be added here
}

// Multi-platform aggregator
export class MultiPlatformApiClient {
  private clients: Map<string, ApiClient>

  constructor() {
    this.clients = new Map([
      ['nba', new NBATopShotClient()],
      ['wnba', new WNBAClient()],
      ['nfl', new NFLClient()],
    ])
  }

  getClient(platform: string): ApiClient | undefined {
    return this.clients.get(platform)
  }

  async getAggregatedPortfolio(walletAddress: string, platforms?: string[], options?: ApiOptions) {
    const targetPlatforms = platforms || Array.from(this.clients.keys())
    
    const results = await Promise.allSettled(
      targetPlatforms.map(async (platform) => {
        const client = this.clients.get(platform)
        if (!client) return null

        try {
          const result = await (client as NBATopShotClient).getPortfolio(walletAddress, options)
          return {
            platform,
            success: true,
            data: result
          }
        } catch (error) {
          return {
            platform,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }
      })
    )

    return results
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => result.value)
      .filter(Boolean)
  }
}

// React hooks for API calls
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
): { data: T | null; loading: boolean; error: string | null; refetch: () => Promise<void> } {
  const [data, setData] = React.useState<T | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiCall()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, dependencies)

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

// Export instances
export const apiClient = new ApiClient()
export const nbaClient = new NBATopShotClient()
export const multiPlatformClient = new MultiPlatformApiClient()

// Export default
export default apiClient 