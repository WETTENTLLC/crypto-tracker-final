'use client'

import { useEffect, useState } from 'react'

interface WebVitalsMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
}

interface WebVitalsData {
  CLS: WebVitalsMetric | null
  INP: WebVitalsMetric | null
  FCP: WebVitalsMetric | null
  LCP: WebVitalsMetric | null
  TTFB: WebVitalsMetric | null
}

export default function WebVitalsMonitor() {  const [vitals, setVitals] = useState<WebVitalsData>({
    CLS: null,
    INP: null,
    FCP: null,
    LCP: null,
    TTFB: null
  })

  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    // Import web-vitals dynamically
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      const updateMetric = (metric: { name: string; value: number; delta: number; id: string; rating: string }) => {
        const rating = getRating(metric.name, metric.value)
        const vitalsMetric: WebVitalsMetric = {
          name: metric.name,
          value: metric.value,
          rating,
          timestamp: Date.now()
        }

        setVitals(prev => ({
          ...prev,
          [metric.name]: vitalsMetric
        }))

        // Send to analytics (optional)
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', metric.name, {
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            event_category: 'Web Vitals',
            event_label: metric.id,
            non_interaction: true,
          })        }
      }

      onCLS(updateMetric)
      onINP(updateMetric)
      onFCP(updateMetric)
      onLCP(updateMetric)
      onTTFB(updateMetric)
    }).catch(() => {
      // web-vitals not available, fail silently
    })

    // Show toggle for development/debugging
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'V') {
        setIsVisible(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const getRating = (name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
    switch (name) {      case 'CLS':
        if (value <= 0.1) return 'good'
        if (value <= 0.25) return 'needs-improvement'
        return 'poor'
      case 'INP':
        if (value <= 200) return 'good'
        if (value <= 500) return 'needs-improvement'
        return 'poor'
      case 'FCP':
        if (value <= 1800) return 'good'
        if (value <= 3000) return 'needs-improvement'
        return 'poor'
      case 'LCP':
        if (value <= 2500) return 'good'
        if (value <= 4000) return 'needs-improvement'
        return 'poor'
      case 'TTFB':
        if (value <= 800) return 'good'
        if (value <= 1800) return 'needs-improvement'
        return 'poor'
      default:
        return 'good'
    }
  }

  const formatValue = (name: string, value: number) => {
    if (name === 'CLS') {
      return (value * 1000).toFixed(3)
    }
    return Math.round(value).toString()
  }

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-500'
      case 'needs-improvement': return 'text-yellow-500'
      case 'poor': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors"
          title="Show Web Vitals (Ctrl+Shift+V)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white p-4 rounded-lg shadow-xl max-w-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold">Core Web Vitals</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        {Object.entries(vitals).map(([key, metric]) => (
          <div key={key} className="flex justify-between items-center">
            <span className="font-medium">{key}:</span>
            {metric ? (
              <span className={getRatingColor(metric.rating)}>
                {formatValue(key, metric.value)}
                {key === 'CLS' ? '' : 'ms'} ({metric.rating})
              </span>
            ) : (
              <span className="text-gray-500">Measuring...</span>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-700 text-xs text-gray-400">
        Press Ctrl+Shift+V to toggle
      </div>
    </div>
  )
}
