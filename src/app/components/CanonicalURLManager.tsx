'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'

interface CanonicalURLConfig {
  pattern: string
  canonicalTemplate: string
  parameters?: string[]
  excludeParams?: string[]
  trailingSlash?: boolean
  protocol?: 'https' | 'http'
  domain?: string
}

interface CanonicalIssue {
  type: string
  severity: 'error' | 'warning' | 'info'
  message: string
  page?: string
  canonical?: string
  count?: number
  robots?: string
  error?: string
}

// Configuration for canonical URL rules
const CANONICAL_RULES: CanonicalURLConfig[] = [
  // Homepage variations
  {
    pattern: '^/$',
    canonicalTemplate: '/',
    trailingSlash: false
  },
  
  // Dashboard variations
  {
    pattern: '^/dashboard/?$',
    canonicalTemplate: '/dashboard',
    trailingSlash: false
  },
  
  // Cryptocurrency detail pages
  {
    pattern: '^/coin/([^/]+)/?$',
    canonicalTemplate: '/coin/{coin}',
    parameters: ['coin'],
    excludeParams: ['utm_source', 'utm_medium', 'utm_campaign', 'ref', 'source'],
    trailingSlash: false
  },
  
  // Educational content
  {
    pattern: '^/learn/([^/]+)/?$',
    canonicalTemplate: '/learn/{article}',
    parameters: ['article'],
    excludeParams: ['utm_source', 'utm_medium', 'utm_campaign', 'ref'],
    trailingSlash: false
  },
  
  // Language-specific pages
  {
    pattern: '^/(es-ES|fr-FR|de-DE|ja-JP|ko-KR|zh-CN)/?$',
    canonicalTemplate: '/{language}',
    parameters: ['language'],
    trailingSlash: false
  },
  
  // API documentation (if added)
  {
    pattern: '^/api/docs/?$',
    canonicalTemplate: '/api/docs',
    trailingSlash: false
  },
  
  // Premium pages
  {
    pattern: '^/premium/?$',
    canonicalTemplate: '/premium',
    trailingSlash: false
  },
  
  // Alerts and account pages
  {
    pattern: '^/(alerts|account|settings)/?$',
    canonicalTemplate: '/{page}',
    parameters: ['page'],
    trailingSlash: false
  },
  
  // Admin pages (exclude from indexing)
  {
    pattern: '^/admin/',
    canonicalTemplate: '', // Empty means no canonical (noindex)
    trailingSlash: false
  }
]

const BASE_DOMAIN = 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app'

export default function CanonicalURLManager() {
  const pathname = usePathname()
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const [canonicalIssues, setCanonicalIssues] = useState<CanonicalIssue[]>([])

  useEffect(() => {
    const canonical = generateCanonicalURL()
    if (canonical) {
      updateCanonicalTag(canonical)      // Generate common URL variations for monitoring
      generateURLVariations(canonical)
    }
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps
  const generateCanonicalURL = useCallback((): string => {
    const path = pathname
    
    // Find matching rule
    const rule = CANONICAL_RULES.find(r => new RegExp(r.pattern).test(path))
    
    if (!rule) {
      // Default fallback - current path without query params
      return `${BASE_DOMAIN}${path.endsWith('/') ? path.slice(0, -1) : path}`
    }
    
    // Handle admin pages (no canonical)
    if (rule.canonicalTemplate === '') {
      return ''
    }
    
    let canonical = rule.canonicalTemplate
    
    // Replace parameters in template
    if (rule.parameters) {
      const matches = path.match(new RegExp(rule.pattern))
      if (matches) {
        rule.parameters.forEach((param, index) => {
          canonical = canonical.replace(`{${param}}`, matches[index + 1] || '')
        })
      }
    }
    
    // Handle trailing slash
    if (rule.trailingSlash === false && canonical.endsWith('/') && canonical !== '/') {
      canonical = canonical.slice(0, -1)
    } else if (rule.trailingSlash === true && !canonical.endsWith('/')) {
      canonical += '/'
    }
    
    // Build final URL with domain
    const domain = rule.domain || BASE_DOMAIN
    const protocol = rule.protocol || 'https'
      return `${protocol}://${domain.replace(/^https?:\/\//, '')}${canonical}`
  }, [pathname])

  const updateCanonicalTag = useCallback((canonicalURL: string) => {
    // Remove existing canonical tag
    const existingCanonical = document.querySelector('link[rel="canonical"]')
    if (existingCanonical) {
      existingCanonical.remove()
    }
    
    // Add new canonical tag if URL is provided
    if (canonicalURL) {
      const link = document.createElement('link')
      link.rel = 'canonical'
      link.href = canonicalURL
      document.head.appendChild(link)
    }
    
    // Add robots meta tag for admin pages
    if (!canonicalURL && pathname.startsWith('/admin')) {
      const existingRobots = document.querySelector('meta[name="robots"]')
      if (!existingRobots) {
        const meta = document.createElement('meta')
        meta.name = 'robots'
        meta.content = 'noindex, nofollow'
        document.head.appendChild(meta)
      }
    }
  }, [pathname])

  const generateURLVariations = (canonical: string) => {
    // Implementation for URL variations
    console.log('Generating URL variations for:', canonical)
  }

  const analyzeCanonicalIssues = async () => {
    setIsAnalyzing(true)
    const issues: CanonicalIssue[] = []
    
    try {
      // Check current page canonical
      const canonical = document.querySelector('link[rel="canonical"]')
      const currentURL = window.location.href
      
      if (!canonical) {
        issues.push({
          type: 'missing_canonical',
          severity: 'warning',
          message: 'No canonical URL specified for this page',
          page: currentURL
        })
      } else {
        const canonicalURL = canonical.getAttribute('href')
        
        // Check if canonical URL is valid
        try {
          new URL(canonicalURL!)
        } catch {          issues.push({
            type: 'invalid_canonical',
            severity: 'error',
            message: 'Canonical URL is not a valid URL',
            page: currentURL,
            canonical: canonicalURL || undefined
          })
        }
        
        // Check if canonical points to same domain
        if (canonicalURL && !canonicalURL.includes(window.location.hostname)) {          issues.push({
            type: 'external_canonical',
            severity: 'warning',
            message: 'Canonical URL points to external domain',
            page: currentURL,
            canonical: canonicalURL || undefined
          })
        }
        
        // Check for self-referencing canonical
        if (canonicalURL === currentURL) {
          issues.push({
            type: 'self_referencing',
            severity: 'info',
            message: 'Canonical URL is self-referencing (this is good)',
            page: currentURL
          })
        }
      }
      
      // Check for multiple canonical tags
      const canonicalTags = document.querySelectorAll('link[rel="canonical"]')
      if (canonicalTags.length > 1) {
        issues.push({
          type: 'multiple_canonicals',
          severity: 'error',
          message: 'Multiple canonical tags found on page',
          page: currentURL,
          count: canonicalTags.length
        })
      }
      
      // Check for conflicting meta robots
      const robotsMeta = document.querySelector('meta[name="robots"]')
      if (robotsMeta && canonical) {
        const robotsContent = robotsMeta.getAttribute('content') || ''
        if (robotsContent.includes('noindex')) {
          issues.push({
            type: 'canonical_with_noindex',
            severity: 'warning',
            message: 'Page has canonical URL but is marked as noindex',
            page: currentURL,
            robots: robotsContent
          })
        }
      }
      
    } catch (error) {
      issues.push({
        type: 'analysis_error',
        severity: 'error',
        message: 'Error analyzing canonical URL configuration',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
    
    setCanonicalIssues(issues)
    setIsAnalyzing(false)
  }

  useEffect(() => {
    analyzeCanonicalIssues()
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'text-red-600 bg-red-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      case 'info': return 'text-blue-600 bg-blue-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Canonical URL Analysis</h3>
        <button
          onClick={analyzeCanonicalIssues}
          disabled={isAnalyzing}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
        </button>
      </div>
      
      {canonicalIssues.length === 0 ? (
        <div className="text-green-600 bg-green-50 p-4 rounded">
          ✓ No canonical URL issues detected
        </div>
      ) : (
        <div className="space-y-3">
          {canonicalIssues.map((issue, index) => (
            <div key={index} className={`p-4 rounded border-l-4 ${getSeverityColor(issue.severity)}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium capitalize">
                    {issue.type.replace(/_/g, ' ')}
                  </h4>
                  <p className="text-sm mt-1">{issue.message}</p>
                  {issue.canonical && (
                    <p className="text-xs mt-2 font-mono bg-gray-100 p-2 rounded">
                      Canonical: {issue.canonical}
                    </p>
                  )}
                </div>
                <span className="text-xs uppercase font-medium px-2 py-1 rounded">
                  {issue.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
        <div className="mt-6 p-4 bg-gray-50 rounded">
        <h4 className="font-medium mb-2">Current Page Info</h4>
        <div className="text-sm space-y-1">
          <div>
            <span className="text-gray-600">Current URL:</span>
            <span className="ml-2 font-mono text-xs">{window.location.href}</span>
          </div>
          <div>
            <span className="text-gray-600">Canonical URL:</span>
            <span className="ml-2 font-mono text-xs">
              {document.querySelector('link[rel="canonical"]')?.getAttribute('href') || 'Not set'}
            </span>
          </div>        </div>
      </div>
    </div>  )
}
