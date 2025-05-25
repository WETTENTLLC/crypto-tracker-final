'use client'

import { useEffect, useState } from 'react'

interface SEOMetrics {
  pageLoadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  firstInputDelay: number
  seoScore: number
  metaTagsComplete: boolean
  structuredDataPresent: boolean
  internalLinksCount: number
  externalLinksCount: number
  imageOptimization: number
  headingStructure: boolean
}

export default function SEOPerformanceMonitor() {
  const [metrics, setMetrics] = useState<SEOMetrics | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const analyzePageSEO = async () => {
      setIsLoading(true)
      
      // Simulate performance analysis
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Analyze meta tags
      const metaTags = {
        title: !!document.title,
        description: !!document.querySelector('meta[name="description"]'),
        ogTitle: !!document.querySelector('meta[property="og:title"]'),
        ogDescription: !!document.querySelector('meta[property="og:description"]'),
        ogImage: !!document.querySelector('meta[property="og:image"]'),
        canonical: !!document.querySelector('link[rel="canonical"]')
      }
      
      const metaTagsComplete = Object.values(metaTags).every(Boolean)

      // Check for structured data
      const structuredDataPresent = !!document.querySelector('script[type="application/ld+json"]')

      // Count links
      const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="#"]')
      const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])')

      // Check heading structure
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      const h1Count = document.querySelectorAll('h1').length
      const headingStructure = h1Count === 1 && headings.length > 0

      // Check image optimization
      const images = document.querySelectorAll('img')
      const optimizedImages = Array.from(images).filter(img => 
        img.getAttribute('alt') && 
        (img.getAttribute('loading') === 'lazy' || img.getAttribute('loading') === 'eager')
      )
      const imageOptimization = images.length > 0 ? (optimizedImages.length / images.length) * 100 : 100

      // Calculate SEO score
      let score = 0
      if (metaTagsComplete) score += 25
      if (structuredDataPresent) score += 20
      if (headingStructure) score += 15
      if (imageOptimization > 80) score += 15
      if (internalLinks.length > 3) score += 10
      if (document.querySelector('meta[name="robots"]')) score += 10
      if (document.querySelector('link[rel="canonical"]')) score += 5

      setMetrics({
        pageLoadTime: Math.round(performance.now()),
        firstContentfulPaint: 0, // Would be measured with actual performance API
        largestContentfulPaint: 0,
        cumulativeLayoutShift: 0,
        firstInputDelay: 0,
        seoScore: Math.min(score, 100),
        metaTagsComplete,
        structuredDataPresent,
        internalLinksCount: internalLinks.length,
        externalLinksCount: externalLinks.length,
        imageOptimization: Math.round(imageOptimization),
        headingStructure
      })

      setIsLoading(false)
    }

    analyzePageSEO()

    // Listen for keyboard shortcut to toggle visibility
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        setIsVisible(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Needs Work'
    return 'Poor'
  }

  if (!isVisible) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg transition-colors"
          title="SEO Performance Monitor (Ctrl+Shift+S)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-white border shadow-xl rounded-lg max-w-sm w-full">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">SEO Monitor</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Analyzing page SEO...</p>
          </div>
        ) : metrics ? (
          <div className="space-y-4">
            {/* Overall SEO Score */}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`text-3xl font-bold ${getScoreColor(metrics.seoScore)}`}>
                {metrics.seoScore}
              </div>
              <div className="text-sm text-gray-600">
                SEO Score - {getScoreLabel(metrics.seoScore)}
              </div>
            </div>

            {/* SEO Checklist */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">SEO Checklist</h4>
              
              <div className="flex items-center justify-between text-sm">
                <span>Meta Tags Complete</span>
                <span className={metrics.metaTagsComplete ? 'text-green-500' : 'text-red-500'}>
                  {metrics.metaTagsComplete ? '✓' : '✗'}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span>Structured Data</span>
                <span className={metrics.structuredDataPresent ? 'text-green-500' : 'text-red-500'}>
                  {metrics.structuredDataPresent ? '✓' : '✗'}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span>Heading Structure</span>
                <span className={metrics.headingStructure ? 'text-green-500' : 'text-red-500'}>
                  {metrics.headingStructure ? '✓' : '✗'}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span>Image Optimization</span>
                <span className={metrics.imageOptimization > 80 ? 'text-green-500' : 'text-yellow-500'}>
                  {metrics.imageOptimization}%
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span>Internal Links</span>
                <span className="text-blue-600">{metrics.internalLinksCount}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span>External Links</span>
                <span className="text-purple-600">{metrics.externalLinksCount}</span>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Performance</h4>
              <div className="flex items-center justify-between text-sm">
                <span>Page Load Time</span>
                <span className="text-gray-600">{metrics.pageLoadTime}ms</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 border-t">
              <button
                onClick={() => window.open('https://pagespeed.web.dev/', '_blank')}
                className="w-full bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Analyze with PageSpeed
              </button>
            </div>
          </div>
        ) : null}

        <div className="mt-4 pt-2 border-t text-xs text-gray-500">
          Press Ctrl+Shift+S to toggle
        </div>
      </div>
    </div>
  )
}
