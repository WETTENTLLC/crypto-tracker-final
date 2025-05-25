'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface ContentStrategy {
  keywords: string[]
  targetAudience: string
  contentType: 'blog' | 'tutorial' | 'guide' | 'news'
  seoScore: number
}

interface ContentOptimization {
  keywordDensity: { [keyword: string]: number }
  readabilityScore: number
  semanticKeywords: string[]
  contentLength: number
  internalLinks: number
  externalLinks: number
}

export default function ContentMarketingAutomation() {
  const pathname = usePathname()
  const [contentStrategy, setContentStrategy] = useState<ContentStrategy | null>(null)
  const [optimization, setOptimization] = useState<ContentOptimization | null>(null)

  const extractPrimaryKeywords = useCallback((path: string): string[] => {
    const keywordMap: { [key: string]: string[] } = {
      '/': ['cryptocurrency tracker', 'crypto portfolio', 'price alerts', 'bitcoin tracker'],
      '/learn/what-is-cryptocurrency': ['what is cryptocurrency', 'crypto basics', 'blockchain explained', 'digital currency'],
      '/learn/how-to-buy-bitcoin': ['buy bitcoin', 'bitcoin purchase', 'cryptocurrency exchange', 'bitcoin wallet'],
      '/learn/defi-guide': ['decentralized finance', 'DeFi protocols', 'yield farming', 'liquidity mining'],
      '/dashboard': ['crypto dashboard', 'portfolio tracking', 'crypto analytics', 'investment tracker']
    }
    return keywordMap[path] || ['cryptocurrency', 'crypto', 'blockchain']
  }, [])

  const calculateReadabilityScore = useCallback((content: string): number => {
    // Simplified Flesch Reading Ease calculation
    const sentences = content.split(/[.!?]+/).length - 1
    const words = content.split(/\s+/).length
    const syllables = content.split(/[aeiouAEIOU]/).length - 1
    
    if (sentences === 0 || words === 0) return 0
    
    const score = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words))
    return Math.max(0, Math.min(100, score))
  }, [])

  const generateSemanticKeywords = useCallback((primaryKeywords: string[]): string[] => {
    const semanticMap: { [key: string]: string[] } = {
      'cryptocurrency': ['digital asset', 'virtual currency', 'blockchain technology'],
      'bitcoin': ['BTC', 'digital gold', 'peer-to-peer currency'],
      'portfolio': ['investment tracking', 'asset management', 'diversification'],
      'trading': ['market analysis', 'technical analysis', 'price movements']
    }
    
    const semanticKeywords: string[] = []
    primaryKeywords.forEach(keyword => {
      Object.keys(semanticMap).forEach(key => {
        if (keyword.toLowerCase().includes(key)) {
          semanticKeywords.push(...semanticMap[key])
        }
      })
    })
    
    return [...new Set(semanticKeywords)]
  }, [])

  const generateContentStrategy = useCallback(() => {
    const strategies: { [key: string]: ContentStrategy } = {
      '/': {
        keywords: ['cryptocurrency tracker', 'crypto portfolio', 'price alerts', 'bitcoin tracker'],
        targetAudience: 'Cryptocurrency investors and traders',
        contentType: 'guide',
        seoScore: 85
      },
      '/learn/what-is-cryptocurrency': {
        keywords: ['what is cryptocurrency', 'crypto basics', 'blockchain explained', 'digital currency'],
        targetAudience: 'Cryptocurrency beginners',
        contentType: 'tutorial',
        seoScore: 90
      },
      '/learn/how-to-buy-bitcoin': {
        keywords: ['buy bitcoin', 'bitcoin purchase', 'cryptocurrency exchange', 'bitcoin wallet'],
        targetAudience: 'First-time Bitcoin buyers',
        contentType: 'tutorial',
        seoScore: 92
      },
      '/learn/defi-guide': {
        keywords: ['decentralized finance', 'DeFi protocols', 'yield farming', 'liquidity mining'],
        targetAudience: 'Advanced cryptocurrency users',
        contentType: 'guide',
        seoScore: 88
      },
      '/dashboard': {
        keywords: ['crypto dashboard', 'portfolio tracking', 'crypto analytics', 'investment tracker'],
        targetAudience: 'Active cryptocurrency investors',
        contentType: 'guide',
        seoScore: 87
      }
    }

    const defaultStrategy: ContentStrategy = {
      keywords: ['cryptocurrency', 'crypto', 'blockchain'],
      targetAudience: 'General cryptocurrency users',
      contentType: 'blog',
      seoScore: 75
    }

    setContentStrategy(strategies[pathname] || defaultStrategy)
  }, [pathname])

  const optimizePageContent = useCallback(async () => {
    try {
      if (typeof window === 'undefined') return

      const content = document.body.textContent || ''
      const wordCount = content.split(/\s+/).length
      
      // Analyze keyword density
      const keywords = extractPrimaryKeywords(pathname)
      const keywordDensity: { [keyword: string]: number } = {}
      keywords.forEach(keyword => {
        const regex = new RegExp(keyword, 'gi')
        const matches = content.match(regex) || []
        keywordDensity[keyword] = (matches.length / wordCount) * 100
      })

      // Calculate readability score
      const readabilityScore = calculateReadabilityScore(content)

      // Find semantic keywords
      const semanticKeywords = generateSemanticKeywords(keywords)

      // Count links
      const internalLinks = document.querySelectorAll('a[href^="/"]').length
      const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])').length

      setOptimization({
        keywordDensity,
        readabilityScore,
        semanticKeywords,
        contentLength: wordCount,
        internalLinks,
        externalLinks
      })

    } catch (error) {
      console.error('Content optimization failed:', error)
    }
  }, [pathname, extractPrimaryKeywords, calculateReadabilityScore, generateSemanticKeywords])

  const generateContentStructuredData = useCallback(() => {
    if (typeof window === 'undefined') return

    const currentStrategy = contentStrategy
    if (!currentStrategy) return

    let schema: Record<string, unknown> | null = null

    // Generate different schema types based on content type
    switch (currentStrategy.contentType) {
      case 'tutorial':
        schema = {
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": document.title,
          "description": document.querySelector('meta[name="description"]')?.getAttribute('content'),
          "image": {
            "@type": "ImageObject",
            "url": "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/tutorial-image.jpg"
          },
          "totalTime": "PT15M",
          "estimatedCost": {
            "@type": "MonetaryAmount",
            "currency": "USD",
            "value": "0"
          },
          "supply": currentStrategy.keywords.map(keyword => ({
            "@type": "HowToSupply",
            "name": keyword
          })),
          "tool": [
            {
              "@type": "HowToTool",
              "name": "CryptoTracker Platform"
            }
          ],
          "step": [
            {
              "@type": "HowToStep",
              "text": "Access the CryptoTracker dashboard",
              "name": "Step 1"
            }
          ]
        }
        break

      case 'guide':
        schema = {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": document.title,
          "description": document.querySelector('meta[name="description"]')?.getAttribute('content'),
          "author": {
            "@type": "Organization",
            "name": "CryptoTracker"
          },
          "publisher": {
            "@type": "Organization",
            "name": "CryptoTracker",
            "logo": {
              "@type": "ImageObject",
              "url": "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/logo.png"
            }
          },
          "datePublished": new Date().toISOString(),
          "dateModified": new Date().toISOString(),
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": window.location.href
          },
          "articleSection": "Cryptocurrency",
          "keywords": currentStrategy.keywords.join(', ')
        }
        break

      default:
        schema = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": document.title,
          "description": document.querySelector('meta[name="description"]')?.getAttribute('content'),
          "url": window.location.href,
          "mainEntity": {
            "@type": "Thing",
            "name": "Cryptocurrency Tracking",
            "description": "Professional cryptocurrency portfolio tracking and price alert system"
          }
        }
    }

    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"][data-content-marketing]')
    if (existingScript) {
      existingScript.remove()
    }

    // Add new structured data
    if (schema) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-content-marketing', 'true')
      script.textContent = JSON.stringify(schema)
      document.head.appendChild(script)
    }
  }, [contentStrategy])

  const optimizeForFeaturedSnippets = useCallback(() => {
    if (typeof window === 'undefined') return

    // Add FAQ structured data for featured snippets
    const faqItems = [
      {
        question: "How do I track cryptocurrency prices?",
        answer: "Use our real-time cryptocurrency tracking dashboard to monitor prices across 10,000+ digital assets with customizable alerts and portfolio management tools."
      },
      {
        question: "What cryptocurrencies can I track?",
        answer: "Track Bitcoin, Ethereum, and over 10,000 other cryptocurrencies including DeFi tokens, NFTs, and emerging altcoins with real-time price data."
      },
      {
        question: "How do price alerts work?",
        answer: "Set custom price targets for any cryptocurrency and receive instant notifications via email, SMS, or push notifications when your targets are reached."
      }
    ]

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    }

    const existingFAQ = document.querySelector('script[type="application/ld+json"][data-faq]')
    if (existingFAQ) {
      existingFAQ.remove()
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-faq', 'true')
    script.textContent = JSON.stringify(faqSchema)
    document.head.appendChild(script)
  }, [])

  const addRelatedContentSuggestions = useCallback(() => {
    if (typeof window === 'undefined') return

    // Add breadcrumb structured data
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Learn",
          "item": "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/learn"
        }
      ]
    }

    const existingBreadcrumb = document.querySelector('script[type="application/ld+json"][data-breadcrumb]')
    if (existingBreadcrumb) {
      existingBreadcrumb.remove()
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-breadcrumb', 'true')
    script.textContent = JSON.stringify(breadcrumbSchema)
    document.head.appendChild(script)
  }, [])

  const implementContentDistribution = useCallback(async () => {
    try {
      // Add social media meta tags for content distribution
      const socialTags = [
        { property: 'og:type', content: 'article' },
        { property: 'og:site_name', content: 'CryptoTracker' },
        { property: 'article:author', content: 'CryptoTracker Team' }
      ]

      socialTags.forEach(tag => {
        let meta = document.querySelector(`meta[property="${tag.property}"]`)
        if (!meta) {
          meta = document.createElement('meta')
          meta.setAttribute('property', tag.property)
          document.head.appendChild(meta)
        }
        meta.setAttribute('content', tag.content)
      })

    } catch (error) {
      console.error('Content distribution setup failed:', error)
    }
  }, [])

  const logOptimizationResults = useCallback(() => {
    if (optimization && contentStrategy) {
      console.group('Content Marketing Optimization:')
      console.log('Content Length:', optimization.contentLength, 'words')
      console.log('Readability Score:', optimization.readabilityScore)
      console.log('Internal Links:', optimization.internalLinks)
      console.log('External Links:', optimization.externalLinks)
      console.log('SEO Score:', contentStrategy.seoScore)
      console.log('Target Keywords:', contentStrategy.keywords)
      console.groupEnd()
    }
  }, [optimization, contentStrategy])

  // Effect to run content optimization when pathname changes
  useEffect(() => {
    optimizePageContent()
    generateContentStrategy()
    implementContentDistribution()
  }, [pathname, optimizePageContent, generateContentStrategy, implementContentDistribution])

  // Effect to generate structured data when strategy or optimization changes
  useEffect(() => {
    if (contentStrategy) {
      generateContentStructuredData()
      optimizeForFeaturedSnippets()
      addRelatedContentSuggestions()
      logOptimizationResults()
    }
  }, [contentStrategy, optimization, generateContentStructuredData, optimizeForFeaturedSnippets, addRelatedContentSuggestions, logOptimizationResults])

  return null
}
