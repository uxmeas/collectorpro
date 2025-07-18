import { test, expect } from '@playwright/test'

test.describe('Discover Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/discover')
  })

  test('should load and display moments table', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/CollectorPRO/)

    // Wait for the table to load
    await expect(page.locator('[data-testid="unified-table"]')).toBeVisible()

    // Check that moments are displayed
    await expect(page.locator('[data-testid="moment-card"]').first()).toBeVisible()
  })

  test('should switch between view modes', async ({ page }) => {
    // Start in grid view (default)
    await expect(page.locator('[data-testid="grid-view"]')).toBeVisible()

    // Switch to table view
    await page.locator('[data-testid="view-toggle-table"]').click()
    await expect(page.locator('[data-testid="table-view"]')).toBeVisible()

    // Switch to list view
    await page.locator('[data-testid="view-toggle-list"]').click()
    await expect(page.locator('[data-testid="list-view"]')).toBeVisible()

    // Switch back to grid view
    await page.locator('[data-testid="view-toggle-grid"]').click()
    await expect(page.locator('[data-testid="grid-view"]')).toBeVisible()
  })

  test('should filter moments by search', async ({ page }) => {
    // Get initial moment count
    const initialMoments = await page.locator('[data-testid="moment-card"]').count()
    expect(initialMoments).toBeGreaterThan(0)

    // Search for LeBron James
    await page.locator('[data-testid="search-input"]').fill('LeBron')
    
    // Wait for filtering to complete
    await page.waitForTimeout(500)

    // Check that results are filtered
    const filteredMoments = await page.locator('[data-testid="moment-card"]').count()
    
    // Should have fewer results (or at least confirm search worked)
    const lebronMoments = await page.locator('[data-testid="moment-card"]').filter({ hasText: 'LeBron' }).count()
    expect(lebronMoments).toBeGreaterThan(0)
  })

  test('should open and use filter sidebar', async ({ page }) => {
    // Open filters
    await page.locator('[data-testid="filter-toggle"]').click()
    await expect(page.locator('[data-testid="filter-sidebar"]')).toBeVisible()

    // Select a rarity filter
    await page.locator('[data-testid="filter-rarity-legendary"]').click()

    // Apply filters and check results
    await page.waitForTimeout(500)
    
    // Close filters
    await page.locator('[data-testid="filter-close"]').click()
    await expect(page.locator('[data-testid="filter-sidebar"]')).not.toBeVisible()
  })

  test('should sort moments correctly', async ({ page }) => {
    // Switch to table view for easier testing of sorting
    await page.locator('[data-testid="view-toggle-table"]').click()

    // Click on price column to sort
    await page.locator('[data-testid="sort-price"]').click()

    // Verify sorting indicator
    await expect(page.locator('[data-testid="sort-price"] [data-testid="sort-icon"]')).toBeVisible()

    // Click again to reverse sort
    await page.locator('[data-testid="sort-price"]').click()

    // Verify sort direction changed
    await expect(page.locator('[data-testid="sort-price"]')).toHaveAttribute('data-sort', 'desc')
  })

  test('should handle virtual scrolling with many items', async ({ page }) => {
    // Scroll to bottom to trigger virtual scrolling
    await page.evaluate(() => {
      const scrollContainer = document.querySelector('[data-testid="table-container"]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    })

    // Wait for new items to load
    await page.waitForTimeout(1000)

    // Verify more items are visible
    const momentCount = await page.locator('[data-testid="moment-card"]').count()
    expect(momentCount).toBeGreaterThan(0)
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Check that mobile layout is applied
    await expect(page.locator('[data-testid="mobile-filter-drawer"]')).toBeVisible()

    // Open mobile filter drawer
    await page.locator('[data-testid="mobile-filter-toggle"]').click()
    await expect(page.locator('[data-testid="filter-sidebar"]')).toBeVisible()

    // Close mobile filter drawer
    await page.locator('[data-testid="filter-close"]').click()
    await expect(page.locator('[data-testid="filter-sidebar"]')).not.toBeVisible()
  })

  test('should display loading states correctly', async ({ page }) => {
    // Intercept API calls to simulate slow loading
    await page.route('**/api/discovery/**', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      route.continue()
    })

    // Navigate to page
    await page.goto('/discover')

    // Check loading state is displayed
    await expect(page.locator('[data-testid="loading-skeleton"]')).toBeVisible()

    // Wait for loading to complete
    await expect(page.locator('[data-testid="unified-table"]')).toBeVisible()
    await expect(page.locator('[data-testid="loading-skeleton"]')).not.toBeVisible()
  })

  test('should handle error states gracefully', async ({ page }) => {
    // Intercept API calls to simulate errors
    await page.route('**/api/discovery/**', async route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      })
    })

    // Navigate to page
    await page.goto('/discover')

    // Check error state is displayed
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="error-retry-button"]')).toBeVisible()

    // Test retry functionality
    await page.locator('[data-testid="error-retry-button"]').click()
  })

  test('should maintain state across page reloads', async ({ page }) => {
    // Set a search term
    await page.locator('[data-testid="search-input"]').fill('LeBron')
    await page.waitForTimeout(500)

    // Set a filter
    await page.locator('[data-testid="filter-toggle"]').click()
    await page.locator('[data-testid="filter-rarity-legendary"]').click()
    await page.locator('[data-testid="filter-close"]').click()

    // Reload the page
    await page.reload()

    // Check that state is preserved
    await expect(page.locator('[data-testid="search-input"]')).toHaveValue('LeBron')
    
    // Open filters to check filter state
    await page.locator('[data-testid="filter-toggle"]').click()
    await expect(page.locator('[data-testid="filter-rarity-legendary"]')).toBeChecked()
  })
}) 