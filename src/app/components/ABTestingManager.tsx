'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'

// Extend Window interface for A/B testing
declare global {
  interface Window {
    trackABTestConversion?: (conversionType?: string) => void
  }
}

interface ABTestVariant {
  id: string
  title: string
  description: string
  weight: number // 0-100, percentage of traffic
}

interface ABTest {
  id: string
  name: string
  pagePattern: string // regex pattern for matching pages
  variants: ABTestVariant[]
  isActive: boolean
  startDate: Date
  endDate?: Date
}

interface ABTestMetrics {
  testId: string
  variantId: string
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  conversionRate: number
}

// Pre-configured A/B tests for different page types
const AB_TESTS: ABTest[] = [
  {
    id: 'homepage-title-test',
    name: 'Homepage Title Optimization',
    pagePattern: '^/$',
    isActive: true,
    startDate: new Date('2025-05-25'),
    variants: [
      {
        id: 'control',
        title: 'CryptoTracker - Real-Time Cryptocurrency Price Tracker & Portfolio Manager',
        description: 'Track cryptocurrency prices in real-time with advanced portfolio management, price alerts, and market analysis. Get live crypto data for Bitcoin, Ethereum, and 1000+ coins.',
        weight: 50
      },
      {
        id: 'variant-a',
        title: 'Free Crypto Portfolio Tracker - Live Bitcoin & Ethereum Prices | CryptoTracker',
        description: 'Free cryptocurrency portfolio tracker with real-time prices for Bitcoin, Ethereum & 1000+ coins. Set price alerts, track portfolio performance, and get market insights.',
        weight: 25
      },
      {
        id: 'variant-b',
        title: 'CryptoTracker: #1 Bitcoin Price Tracker & Crypto Portfolio Manager 2025',
        description: 'The ultimate cryptocurrency tracking platform. Monitor Bitcoin, Ethereum, and 1000+ coins with real-time prices, advanced charts, and professional portfolio management tools.',
        weight: 25
      }
    ]
  },
  {
    id: 'dashboard-title-test',
    name: 'Dashboard Meta Description Test',
    pagePattern: '^/dashboard$',
    isActive: true,
    startDate: new Date('2025-05-25'),
    variants: [
      {
        id: 'control',
        title: 'Crypto Dashboard - Portfolio Tracking & Price Alerts | CryptoTracker',
        description: 'Manage your cryptocurrency portfolio with real-time tracking, price alerts, and detailed analytics. Monitor Bitcoin, Ethereum, and your favorite altcoins in one dashboard.',
        weight: 50
      },
      {
        id: 'variant-a',
        title: 'Your Personal Crypto Command Center - Dashboard | CryptoTracker',
        description: 'Take control of your crypto investments with our advanced dashboard. Real-time portfolio tracking, smart price alerts, and professional-grade analytics for serious investors.',
        weight: 50
      }
    ]
  },
  {
    id: 'learn-pages-test',
    name: 'Educational Content Optimization',
    pagePattern: '^/learn/',
    isActive: true,
    startDate: new Date('2025-05-25'),
    variants: [
      {
        id: 'control',
        title: 'Learn Cryptocurrency - Beginner Guides & Investment Tips',
        description: 'Comprehensive cryptocurrency education center with beginner guides, investment strategies, and expert tips for Bitcoin, Ethereum, DeFi, and NFTs.',
        weight: 50
      },
      {
        id: 'variant-a',
        title: 'Free Crypto Education - Master Bitcoin & Blockchain Investment',
        description: 'Start your cryptocurrency journey with our free educational resources. Learn Bitcoin investing, blockchain technology, DeFi protocols, and NFT trading from experts.',
        weight: 50
      }
    ]
  }
]

export default function ABTestingManager() {
  const pathname = usePathname()
  const [currentVariant, setCurrentVariant] = useState<ABTestVariant | null>(null)
  const [testId, setTestId] = useState<string | null>(null)

  const trackABTestEvent = useCallback(async (testId: string, variantId: string, eventType: string) => {
    try {
      await fetch('/api/mcp/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventName: 'ab_test_event',
          eventData: {
            testId,
            variantId,
            eventType,
            page: pathname,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer
          }
        })
      })
    } catch (error) {
      console.error('Failed to track A/B test event:', error)
    }
  }, [pathname])

  useEffect(() => {
    // Find matching A/B test for current page
    const matchingTest = AB_TESTS.find(test => {
      if (!test.isActive) return false
      
      const regex = new RegExp(test.pagePattern)
      return regex.test(pathname)
    })

    if (!matchingTest) return

    // Get or assign user to variant
    const storageKey = `ab_test_${matchingTest.id}`
    let assignedVariant = localStorage.getItem(storageKey)

    if (!assignedVariant) {
      // Assign user to variant based on weights
      const random = Math.random() * 100
      let cumulative = 0
      
      for (const variant of matchingTest.variants) {
        cumulative += variant.weight
        if (random <= cumulative) {
          assignedVariant = variant.id
          break
        }
      }
      
      // Store assignment
      if (assignedVariant) {
        localStorage.setItem(storageKey, assignedVariant)
        
        // Track assignment event
        trackABTestEvent(matchingTest.id, assignedVariant, 'assigned')
      }
    }

    if (assignedVariant) {
      const variant = matchingTest.variants.find(v => v.id === assignedVariant)
      if (variant) {
        setCurrentVariant(variant)
        setTestId(matchingTest.id)
        
        // Track impression
        trackABTestEvent(matchingTest.id, assignedVariant, 'impression')
        
        // Update document meta tags
        updateMetaTags(variant)
      }
    }
  }, [pathname, trackABTestEvent])

  const updateMetaTags = (variant: ABTestVariant) => {
    // Update title
    document.title = variant.title
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', variant.description)
    }
  }

    // Expose tracking method globally
    useEffect(() => {
      const trackConversion = (conversionType: string = 'default'): void => {
        if (!testId || !currentVariant) {
          return
        }
        
        trackABTestEvent(testId, currentVariant.id, `conversion_${conversionType}`)
      }
      
      window.trackABTestConversion = trackConversion
    }, [testId, currentVariant, trackABTestEvent])
  
    return null
  }
// Export function for manual conversion tracking
export const trackABTestConversion = (conversionType: string = 'default') => {
  if (typeof window !== 'undefined' && window.trackABTestConversion) {
    window.trackABTestConversion(conversionType)
  }
}

// Analytics dashboard component for viewing A/B test results
export function ABTestDashboard() {
    const [metrics, setMetrics] = useState<ABTestMetrics[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadABTestMetrics()
    }, [])

    const loadABTestMetrics = async () => {
        try {
            const response = await fetch('/api/mcp/analytics?type=ab_test_metrics')
            const data = await response.json()
            
            if (data.success) {
                setMetrics(data.metrics || [])
            }
        } catch (error) {
            console.error('Failed to load A/B test metrics:', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">A/B Test Performance</h3>
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">A/B Test Performance</h3>
            
            {metrics.length === 0 ? (
                <p className="text-gray-600">No A/B test data available yet.</p>
            ) : (
                <div className="space-y-4">
                    {metrics.map((metric) => (
                        <div key={`${metric.testId}-${metric.variantId}`} className="border rounded p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-medium">{metric.testId}</h4>
                                    <p className="text-sm text-gray-600">Variant: {metric.variantId}</p>
                                </div>
                                <div className="text-right text-sm">
                                    <div>CTR: <span className="font-medium">{metric.ctr.toFixed(2)}%</span></div>
                                    <div>CVR: <span className="font-medium">{metric.conversionRate.toFixed(2)}%</span></div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Impressions:</span>
                                    <div className="font-medium">{metric.impressions.toLocaleString()}</div>
                                </div>
                                <div>
                                    <span className="text-gray-600">Clicks:</span>
                                    <div className="font-medium">{metric.clicks.toLocaleString()}</div>
                                </div>
                                <div>
                                    <span className="text-gray-600">Conversions:</span>
                                    <div className="font-medium">{metric.conversions.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <button
                onClick={loadABTestMetrics}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
                Refresh Data
            </button>
        </div>
    )
}

