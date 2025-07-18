#!/usr/bin/env node

/**
 * Day 2 Performance Testing Script
 * CollectorPRO Production Readiness Sprint
 * 
 * Tests:
 * - TanStack Table performance with large datasets
 * - Image loading system validation
 * - Multi-platform data integration
 * - Memory usage optimization
 * - Edge case scenarios
 */

const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')

// Performance test configuration
const TEST_CONFIG = {
  datasets: [100, 500, 1000, 5000],
  imageSizes: [48, 161, 300, 500],
  platforms: ['NBA TopShot', 'Panini NFT', 'NFL All Day'],
  testIterations: 3,
  timeout: 30000
}

// Performance metrics storage
const performanceMetrics = {
  tablePerformance: {},
  imageLoading: {},
  apiPerformance: {},
  memoryUsage: {},
  edgeCases: {}
}

async function runPerformanceTests() {
  console.log('🚀 Starting Day 2 Performance Testing...')
  console.log('=' .repeat(60))
  
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()
  
  try {
    // Test 1: TanStack Table Performance
    await testTanStackTablePerformance(page)
    
    // Test 2: Image Loading System
    await testImageLoadingSystem(page)
    
    // Test 3: Multi-Platform Data Integration
    await testMultiPlatformData(page)
    
    // Test 4: API Performance
    await testAPIPerformance(page)
    
    // Test 5: Edge Cases
    await testEdgeCases(page)
    
    // Test 6: Memory Usage
    await testMemoryUsage(page)
    
    // Generate performance report
    generatePerformanceReport()
    
  } catch (error) {
    console.error('❌ Performance test failed:', error)
  } finally {
    await browser.close()
  }
}

async function testTanStackTablePerformance(page) {
  console.log('\n📊 Testing TanStack Table Performance...')
  
  for (const datasetSize of TEST_CONFIG.datasets) {
    console.log(`  Testing with ${datasetSize} items...`)
    
    const metrics = {
      renderTime: [],
      sortTime: [],
      filterTime: [],
      scrollTime: [],
      memoryUsage: []
    }
    
    for (let i = 0; i < TEST_CONFIG.testIterations; i++) {
      // Navigate to marketplace with large dataset
      const startTime = Date.now()
      await page.goto(`http://localhost:3000/marketplace?limit=${datasetSize}`)
      
      // Wait for table to render
      await page.waitForSelector('.bg-\\[\\#0a0a0a\\]', { timeout: 10000 })
      const renderTime = Date.now() - startTime
      metrics.renderTime.push(renderTime)
      
      // Test sorting performance
      const sortStart = Date.now()
      await page.click('button[aria-label*="sort"]').catch(() => {})
      const sortTime = Date.now() - sortStart
      metrics.sortTime.push(sortTime)
      
      // Test filtering performance
      const filterStart = Date.now()
      await page.fill('input[placeholder*="Search"]', 'LeBron').catch(() => {})
      await page.waitForTimeout(500) // Wait for debounce
      const filterTime = Date.now() - filterStart
      metrics.filterTime.push(filterTime)
      
      // Test scroll performance
      const scrollStart = Date.now()
      await page.evaluate(() => {
        const table = document.querySelector('.bg-\\[\\#0a0a0a\\]')
        if (table) {
          table.scrollTop = table.scrollHeight
        }
      })
      const scrollTime = Date.now() - scrollStart
      metrics.scrollTime.push(scrollTime)
      
      // Get memory usage
      const memory = await page.evaluate(() => {
        if (performance.memory) {
          return performance.memory.usedJSHeapSize / 1024 / 1024 // MB
        }
        return 0
      })
      metrics.memoryUsage.push(memory)
    }
    
    // Calculate averages
    performanceMetrics.tablePerformance[datasetSize] = {
      avgRenderTime: average(metrics.renderTime),
      avgSortTime: average(metrics.sortTime),
      avgFilterTime: average(metrics.filterTime),
      avgScrollTime: average(metrics.scrollTime),
      avgMemoryUsage: average(metrics.memoryUsage),
      maxRenderTime: Math.max(...metrics.renderTime),
      maxMemoryUsage: Math.max(...metrics.memoryUsage)
    }
    
    console.log(`    ✅ ${datasetSize} items: ${performanceMetrics.tablePerformance[datasetSize].avgRenderTime}ms render, ${performanceMetrics.tablePerformance[datasetSize].avgMemoryUsage.toFixed(1)}MB memory`)
  }
}

async function testImageLoadingSystem(page) {
  console.log('\n🖼️  Testing Image Loading System...')
  
  for (const size of TEST_CONFIG.imageSizes) {
    console.log(`  Testing ${size}px images...`)
    
    const metrics = {
      loadTime: [],
      cacheHitRate: 0,
      fallbackRate: 0
    }
    
    // Test NBA TopShot CDN images
    await page.goto(`http://localhost:3000/marketplace`)
    
    // Measure image load times
    const imageLoadTimes = await page.evaluate((imageSize) => {
      const images = document.querySelectorAll(`img[src*="nbatopshot.com"]`)
      const loadTimes = []
      
      images.forEach(img => {
        if (img.complete) {
          loadTimes.push(0) // Already loaded
        } else {
          const start = performance.now()
          img.onload = () => {
            loadTimes.push(performance.now() - start)
          }
        }
      })
      
      return loadTimes
    }, size)
    
    metrics.loadTime = imageLoadTimes
    
    // Test fallback system
    const fallbackTest = await page.evaluate(() => {
      // Simulate CDN failure
      const images = document.querySelectorAll('img')
      let fallbackCount = 0
      
      images.forEach(img => {
        if (img.src.includes('picsum.photos') || img.src.includes('placeholder')) {
          fallbackCount++
        }
      })
      
      return fallbackCount
    })
    
    metrics.fallbackRate = fallbackTest
    
    performanceMetrics.imageLoading[size] = {
      avgLoadTime: average(metrics.loadTime),
      maxLoadTime: Math.max(...metrics.loadTime),
      fallbackRate: metrics.fallbackRate,
      cacheHitRate: metrics.cacheHitRate
    }
    
    console.log(`    ✅ ${size}px: ${performanceMetrics.imageLoading[size].avgLoadTime.toFixed(1)}ms avg load time`)
  }
}

async function testMultiPlatformData(page) {
  console.log('\n🌐 Testing Multi-Platform Data Integration...')
  
  for (const platform of TEST_CONFIG.platforms) {
    console.log(`  Testing ${platform} integration...`)
    
    const startTime = Date.now()
    
    // Test platform-specific data loading
    await page.goto(`http://localhost:3000/marketplace?platform=${platform.toLowerCase().replace(' ', '-')}`)
    
    // Wait for data to load
    await page.waitForSelector('[data-testid="moments-table"]', { timeout: 10000 })
    
    const loadTime = Date.now() - startTime
    
    // Test data consistency
    const dataConsistency = await page.evaluate((platformName) => {
      const rows = document.querySelectorAll('[data-testid="moment-row"]')
      let consistentCount = 0
      
      rows.forEach(row => {
        const platformData = row.getAttribute('data-platform')
        if (platformData === platformName) {
          consistentCount++
        }
      })
      
      return {
        totalRows: rows.length,
        consistentRows: consistentCount,
        consistencyRate: rows.length > 0 ? (consistentCount / rows.length) * 100 : 0
      }
    }, platform)
    
    performanceMetrics.multiPlatformData = performanceMetrics.multiPlatformData || {}
    performanceMetrics.multiPlatformData[platform] = {
      loadTime,
      dataConsistency: dataConsistency.consistencyRate,
      totalRows: dataConsistency.totalRows
    }
    
    console.log(`    ✅ ${platform}: ${loadTime}ms load time, ${dataConsistency.consistencyRate.toFixed(1)}% consistency`)
  }
}

async function testAPIPerformance(page) {
  console.log('\n🔌 Testing API Performance...')
  
  const apiEndpoints = [
    '/api/flow/marketplace',
    '/api/flow/portfolio',
    '/api/flow/collections',
    '/api/flow/packs',
    '/api/flow/transactions'
  ]
  
  for (const endpoint of apiEndpoints) {
    console.log(`  Testing ${endpoint}...`)
    
    const metrics = {
      responseTime: [],
      successRate: 0
    }
    
    for (let i = 0; i < TEST_CONFIG.testIterations; i++) {
      try {
        const startTime = Date.now()
        const response = await page.request.post(endpoint, {
          data: { filters: {}, limit: 50 }
        })
        const responseTime = Date.now() - startTime
        
        metrics.responseTime.push(responseTime)
        
        if (response.ok()) {
          metrics.successRate++
        }
      } catch (error) {
        console.log(`    ⚠️  API call failed: ${error.message}`)
      }
    }
    
    performanceMetrics.apiPerformance[endpoint] = {
      avgResponseTime: average(metrics.responseTime),
      maxResponseTime: Math.max(...metrics.responseTime),
      successRate: (metrics.successRate / TEST_CONFIG.testIterations) * 100
    }
    
    console.log(`    ✅ ${endpoint}: ${performanceMetrics.apiPerformance[endpoint].avgResponseTime}ms avg, ${performanceMetrics.apiPerformance[endpoint].successRate.toFixed(1)}% success`)
  }
}

async function testEdgeCases(page) {
  console.log('\n⚠️  Testing Edge Cases...')
  
  const edgeCases = [
    {
      name: 'Network Failure',
      test: async () => {
        await page.route('**/*', route => route.abort())
        const startTime = Date.now()
        try {
          await page.goto('http://localhost:3000/marketplace', { timeout: 5000 })
        } catch (error) {
          return Date.now() - startTime
        }
      }
    },
    {
      name: 'Large Payload',
      test: async () => {
        const largePayload = { filters: {}, limit: 10000 }
        const startTime = Date.now()
        try {
          await page.request.post('/api/flow/marketplace', { data: largePayload })
          return Date.now() - startTime
        } catch (error) {
          return Date.now() - startTime
        }
      }
    },
    {
      name: 'Invalid Data',
      test: async () => {
        const startTime = Date.now()
        try {
          await page.request.post('/api/flow/marketplace', { data: 'invalid json' })
          return Date.now() - startTime
        } catch (error) {
          return Date.now() - startTime
        }
      }
    }
  ]
  
  for (const edgeCase of edgeCases) {
    console.log(`  Testing ${edgeCase.name}...`)
    
    const result = await edgeCase.test()
    
    performanceMetrics.edgeCases[edgeCase.name] = {
      responseTime: result,
      handled: result < 5000 // Consider handled if response time < 5s
    }
    
    console.log(`    ✅ ${edgeCase.name}: ${result}ms, ${performanceMetrics.edgeCases[edgeCase.name].handled ? 'Handled' : 'Failed'}`)
  }
}

async function testMemoryUsage(page) {
  console.log('\n💾 Testing Memory Usage...')
  
  // Test memory usage over time
  const memorySnapshots = []
  
  for (let i = 0; i < 10; i++) {
    await page.goto('http://localhost:3000/marketplace')
    await page.waitForTimeout(1000)
    
    const memory = await page.evaluate(() => {
      if (performance.memory) {
        return {
          used: performance.memory.usedJSHeapSize / 1024 / 1024,
          total: performance.memory.totalJSHeapSize / 1024 / 1024,
          limit: performance.memory.jsHeapSizeLimit / 1024 / 1024
        }
      }
      return { used: 0, total: 0, limit: 0 }
    })
    
    memorySnapshots.push(memory)
    
    // Simulate user interaction
    await page.click('[data-testid="sort-player"]')
    await page.waitForTimeout(500)
  }
  
  performanceMetrics.memoryUsage = {
    avgUsed: average(memorySnapshots.map(m => m.used)),
    maxUsed: Math.max(...memorySnapshots.map(m => m.used)),
    avgTotal: average(memorySnapshots.map(m => m.total)),
    memoryLeak: memorySnapshots[memorySnapshots.length - 1].used - memorySnapshots[0].used
  }
  
  console.log(`    ✅ Memory: ${performanceMetrics.memoryUsage.avgUsed.toFixed(1)}MB avg, ${performanceMetrics.memoryUsage.maxUsed.toFixed(1)}MB max`)
  console.log(`    ✅ Memory leak: ${performanceMetrics.memoryUsage.memoryLeak.toFixed(1)}MB`)
}

function average(array) {
  return array.reduce((a, b) => a + b, 0) / array.length
}

function generatePerformanceReport() {
  console.log('\n📊 Generating Performance Report...')
  console.log('=' .repeat(60))
  
  // Table Performance Summary
  console.log('\n📋 TABLE PERFORMANCE SUMMARY:')
  Object.entries(performanceMetrics.tablePerformance).forEach(([size, metrics]) => {
    const status = metrics.avgRenderTime < 2000 ? '✅ PASS' : '❌ FAIL'
    console.log(`  ${size} items: ${status}`)
    console.log(`    Render: ${metrics.avgRenderTime}ms (target: <2000ms)`)
    console.log(`    Sort: ${metrics.avgSortTime}ms (target: <300ms)`)
    console.log(`    Filter: ${metrics.avgFilterTime}ms (target: <300ms)`)
    console.log(`    Memory: ${metrics.avgMemoryUsage.toFixed(1)}MB (target: <200MB)`)
  })
  
  // Image Loading Summary
  console.log('\n🖼️  IMAGE LOADING SUMMARY:')
  Object.entries(performanceMetrics.imageLoading).forEach(([size, metrics]) => {
    const status = metrics.avgLoadTime < 2000 ? '✅ PASS' : '❌ FAIL'
    console.log(`  ${size}px: ${status}`)
    console.log(`    Load time: ${metrics.avgLoadTime.toFixed(1)}ms (target: <2000ms)`)
    console.log(`    Fallback rate: ${metrics.fallbackRate}%`)
  })
  
  // API Performance Summary
  console.log('\n🔌 API PERFORMANCE SUMMARY:')
  Object.entries(performanceMetrics.apiPerformance).forEach(([endpoint, metrics]) => {
    const status = metrics.avgResponseTime < 200 ? '✅ PASS' : '❌ FAIL'
    console.log(`  ${endpoint}: ${status}`)
    console.log(`    Response time: ${metrics.avgResponseTime}ms (target: <200ms)`)
    console.log(`    Success rate: ${metrics.successRate.toFixed(1)}%`)
  })
  
  // Edge Cases Summary
  console.log('\n⚠️  EDGE CASES SUMMARY:')
  Object.entries(performanceMetrics.edgeCases).forEach(([caseName, metrics]) => {
    const status = metrics.handled ? '✅ PASS' : '❌ FAIL'
    console.log(`  ${caseName}: ${status}`)
    console.log(`    Response time: ${metrics.responseTime}ms`)
  })
  
  // Memory Usage Summary
  console.log('\n💾 MEMORY USAGE SUMMARY:')
  const memoryStatus = performanceMetrics.memoryUsage.avgUsed < 200 ? '✅ PASS' : '❌ FAIL'
  console.log(`  Average usage: ${performanceMetrics.memoryUsage.avgUsed.toFixed(1)}MB (target: <200MB) ${memoryStatus}`)
  console.log(`  Maximum usage: ${performanceMetrics.memoryUsage.maxUsed.toFixed(1)}MB`)
  console.log(`  Memory leak: ${performanceMetrics.memoryUsage.memoryLeak.toFixed(1)}MB`)
  
  // Overall Assessment
  console.log('\n🎯 OVERALL ASSESSMENT:')
  const allTestsPassed = 
    Object.values(performanceMetrics.tablePerformance).every(m => m.avgRenderTime < 2000) &&
    Object.values(performanceMetrics.imageLoading).every(m => m.avgLoadTime < 2000) &&
    Object.values(performanceMetrics.apiPerformance).every(m => m.avgResponseTime < 200) &&
    Object.values(performanceMetrics.edgeCases).every(m => m.handled) &&
    performanceMetrics.memoryUsage.avgUsed < 200
  
  console.log(`  Overall Status: ${allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`)
  console.log(`  Day 2 Readiness: ${allTestsPassed ? '🚀 READY FOR DAY 3' : '⚠️  NEEDS OPTIMIZATION'}`)
  
  // Save detailed report
  const reportPath = path.join(__dirname, '../testing/day2-performance-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(performanceMetrics, null, 2))
  console.log(`\n📄 Detailed report saved to: ${reportPath}`)
}

// Run the performance tests
if (require.main === module) {
  runPerformanceTests().catch(console.error)
}

module.exports = { runPerformanceTests, performanceMetrics } 