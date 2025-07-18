import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime'
import { NextRouter } from 'next/router'

// Mock router for testing
const mockRouter: Partial<NextRouter> = {
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  prefetch: jest.fn(),
  beforePopState: jest.fn(),
  route: '/',
  pathname: '/',
  query: {},
  asPath: '/',
  basePath: '',
  isLocaleDomain: true,
  isReady: true,
  isPreview: false,
}

// Test providers wrapper
interface TestProvidersProps {
  children: React.ReactNode
  router?: Partial<NextRouter>
}

const TestProviders: React.FC<TestProvidersProps> = ({ 
  children, 
  router = mockRouter 
}) => {
  return (
    <RouterContext.Provider value={router as NextRouter}>
      {children}
    </RouterContext.Provider>
  )
}

// Custom render function
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  router?: Partial<NextRouter>
}

const customRender = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { router, ...renderOptions } = options

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <TestProviders router={router}>{children}</TestProviders>
  )

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }
export { mockRouter }

// Test data generators
export const generateMockMoment = (overrides = {}) => ({
  id: 'moment-1',
  player: 'LeBron James',
  playCategory: 'Dunk',
  team: 'Los Angeles Lakers',
  series: 'Series 4',
  set: 'Base Set',
  rarity: 'Common',
  serialNumber: 1234,
  circulationCount: 10000,
  currentPrice: 50.0,
  floorPrice: 45.0,
  marketCap: 500000,
  volume24h: 25000,
  priceChange24h: 5.5,
  topShotScore: 75,
  imageUrl: '/images/lebron-dunk.jpg',
  videoUrl: '/videos/lebron-dunk.mp4',
  momentDate: '2023-12-01',
  ...overrides,
})

export const generateMockMoments = (count: number = 5) => {
  return Array.from({ length: count }, (_, index) =>
    generateMockMoment({
      id: `moment-${index + 1}`,
      serialNumber: 1000 + index,
      currentPrice: 50 + (index * 10),
    })
  )
}

// Async testing helpers
export const waitForLoadingToFinish = () =>
  new Promise((resolve) => setTimeout(resolve, 100))

// Mock fetch for API testing
export const mockFetch = (data: any, ok: boolean = true) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok,
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(JSON.stringify(data)),
    })
  ) as jest.Mock
} 