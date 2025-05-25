'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

interface RedirectRule {
  from: string
  to: string
  type: 'permanent' | 'temporary'
  condition?: string
}

interface SEOIssue {
  type: 'warning' | 'error'
  message: string
  url: string
  fix?: () => void
}

export default function TechnicalSEOAutomation() {
  const pathname = usePathname()
  const router = useRouter()
  const [seoIssues, setSeoIssues] = useState<SEOIssue[]>([])
  const [, setIsAnalyzing] = useState(false)

  // Redirect rules for URL optimization
  const redirectRules: RedirectRule[] = [
    { from: '/coin/:id/details', to: '/coin/:id', type: 'permanent' },
    { from: '/cryptocurrency/:id', to: '/coin/:id', type: 'permanent' },
    { from: '/portfolio/dashboard', to: '/dashboard', type: 'permanent' },
    { from: '/alerts/price', to: '/alerts', type: 'permanent' },
    { from: '/learn/guides/:slug', to: '/learn/:slug', type: 'permanent' },
    { from: '/blog/:slug', to: '/learn/:slug', type: 'permanent' },
    { from: '/help', to: '/faq', type: 'permanent' },
    { from: '/support', to: '/faq', type: 'permanent' },
    { from: '/pricing', to: '/premium', type: 'permanent' },
  ]

  useEffect(() => {
    // Automated technical SEO analysis
    analyzeTechnicalSEO()
    
    // URL optimization
    handleRedirects()
    
    // Canonical URL management
    manageCanonicalUrls()
    
    // Meta robots optimization
    optimizeMetaRobots()    // Internal linking optimization
    optimizeInternalLinking()

  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  const analyzeTechnicalSEO = async () => {
    setIsAnalyzing(true)
    const issues: SEOIssue[] = []

    try {
      // Check for duplicate content
      const duplicateContent = await checkDuplicateContent()
      if (duplicateContent.length > 0) {
        issues.push({
          type: 'warning',
          message: `Potential duplicate content detected on ${duplicateContent.length} pages`,
          url: pathname,
          fix: () => addCanonicalTags()
        })
      }

      // Check for missing meta descriptions
      const metaDescription = document.querySelector('meta[name="description"]')
      if (!metaDescription || !metaDescription.getAttribute('content')) {
        issues.push({
          type: 'error',
          message: 'Missing meta description',
          url: pathname,
          fix: () => addMetaDescription()
        })
      }

      // Check for missing alt tags
      const images = document.querySelectorAll('img:not([alt])')
      if (images.length > 0) {
        issues.push({
          type: 'warning',
          message: `${images.length} images missing alt attributes`,
          url: pathname,
          fix: () => addAltTags()
        })
      }

      // Check for broken internal links
      const brokenLinks = await checkBrokenLinks()
      if (brokenLinks.length > 0) {
        issues.push({
          type: 'error',
          message: `${brokenLinks.length} broken internal links detected`,
          url: pathname,
          fix: () => fixBrokenLinks(brokenLinks)
        })
      }

      // Check page speed issues
      const speedIssues = await checkPageSpeed()
      if (speedIssues.length > 0) {
        speedIssues.forEach(issue => {
          issues.push({
            type: 'warning',
            message: issue,
            url: pathname
          })
        })
      }

      // Check for multiple H1 tags
      const h1Tags = document.querySelectorAll('h1')
      if (h1Tags.length > 1) {
        issues.push({
          type: 'warning',
          message: `Multiple H1 tags detected (${h1Tags.length})`,
          url: pathname,
          fix: () => fixHeadingStructure()
        })
      }

      // Check for missing Open Graph tags
      const ogTags = ['og:title', 'og:description', 'og:image', 'og:url']
      const missingOgTags = ogTags.filter(tag => 
        !document.querySelector(`meta[property="${tag}"]`)
      )
      if (missingOgTags.length > 0) {
        issues.push({
          type: 'warning',
          message: `Missing Open Graph tags: ${missingOgTags.join(', ')}`,
          url: pathname,
          fix: () => addOpenGraphTags()
        })
      }

      setSeoIssues(issues)
    } catch (error) {
      console.error('Technical SEO analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleRedirects = () => {
    const currentPath = pathname
    
    // Check if current URL matches any redirect rule
    const matchingRule = redirectRules.find(rule => {
      const pattern = rule.from.replace(':id', '[^/]+').replace(':slug', '[^/]+')
      const regex = new RegExp(`^${pattern}$`)
      return regex.test(currentPath)
    })

    if (matchingRule) {
      const newPath = matchingRule.to
        .replace(':id', currentPath.split('/')[2] || '')
        .replace(':slug', currentPath.split('/').pop() || '')
      
      if (matchingRule.type === 'permanent') {
        // Use replace to avoid adding to history
        router.replace(newPath)
      } else {
        router.push(newPath)
      }
    }
  }

  const manageCanonicalUrls = () => {
    // Remove existing canonical tags
    const existingCanonical = document.querySelector('link[rel="canonical"]')
    if (existingCanonical) {
      existingCanonical.remove()
    }

    // Add correct canonical URL
    const canonical = document.createElement('link')
    canonical.rel = 'canonical'
    
    // Handle special cases for canonical URLs
    let canonicalUrl = `${window.location.origin}${pathname}`
    
    // Remove trailing slashes
    canonicalUrl = canonicalUrl.replace(/\/$/, '') || window.location.origin
    
    // Handle query parameters (remove tracking params)
    const url = new URL(window.location.href)
    const allowedParams = ['page', 'sort', 'filter', 'currency']
    const cleanParams = new URLSearchParams()
    
    allowedParams.forEach(param => {
      if (url.searchParams.has(param)) {
        cleanParams.set(param, url.searchParams.get(param)!)
      }
    })
    
    if (cleanParams.toString()) {
      canonicalUrl += `?${cleanParams.toString()}`
    }
    
    canonical.href = canonicalUrl
    document.head.appendChild(canonical)
  }

  const optimizeMetaRobots = () => {
    // Remove existing robots meta tag
    const existingRobots = document.querySelector('meta[name="robots"]')
    if (existingRobots) {
      existingRobots.remove()
    }

    // Determine appropriate robots directive
    let robotsContent = 'index, follow'
    
    // Special handling for different page types
    if (pathname.includes('/admin')) {
      robotsContent = 'noindex, nofollow'
    } else if (pathname.includes('/api')) {
      robotsContent = 'noindex, nofollow'
    } else if (pathname.includes('/search') && new URLSearchParams(window.location.search).get('q')) {
      robotsContent = 'noindex, follow'
    } else if (pathname.includes('/tag/') || pathname.includes('/category/')) {
      robotsContent = 'index, follow, max-snippet:150'
    } else if (pathname.startsWith('/coin/')) {
      robotsContent = 'index, follow, max-image-preview:large'
    }

    // Add optimized robots meta tag
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = robotsContent
    document.head.appendChild(robots)
  }

  const optimizeInternalLinking = () => {
    // Find all internal links
    const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="#"]')
    
    internalLinks.forEach(link => {
      const href = link.getAttribute('href')
      if (!href) return

      // Add appropriate attributes for SEO
      if (href.startsWith('/admin') || href.startsWith('/api')) {
        link.setAttribute('rel', 'nofollow')
      }

      // Add title attributes for better accessibility and SEO
      if (!link.getAttribute('title') && link.textContent) {
        link.setAttribute('title', link.textContent.trim())
      }

      // Optimize anchor text for cryptocurrency pages
      if (href.startsWith('/coin/') && !link.textContent?.toLowerCase().includes('price')) {
        const coinName = href.split('/')[2]
        if (coinName && link.textContent?.toLowerCase() === coinName) {
          link.textContent = `${coinName.charAt(0).toUpperCase() + coinName.slice(1)} Price`
        }
      }
    })
  }

  // Helper functions for SEO analysis
  const checkDuplicateContent = async (): Promise<string[]> => {
    // Simulate duplicate content check
    return []
  }

  const checkBrokenLinks = async (): Promise<string[]> => {
    const links = Array.from(document.querySelectorAll('a[href^="/"]'))
    const brokenLinks: string[] = []
    
    // Check each internal link (simplified check)
    for (const link of links.slice(0, 10)) { // Limit to avoid too many requests
      const href = link.getAttribute('href')
      if (href) {
        try {
          const response = await fetch(href, { method: 'HEAD' })
          if (!response.ok) {
            brokenLinks.push(href)
          }
        } catch {
          brokenLinks.push(href)
        }
      }
    }
    
    return brokenLinks
  }

  const checkPageSpeed = async (): Promise<string[]> => {
    const issues: string[] = []
    
    // Check for performance issues
    if (document.querySelectorAll('img:not([loading])').length > 0) {
      issues.push('Images without lazy loading detected')
    }
    
    if (document.querySelectorAll('script:not([async]):not([defer])').length > 3) {
      issues.push('Blocking scripts detected')
    }
    
    if (document.querySelector('style')?.textContent && document.querySelector('style')!.textContent!.length > 50000) {
      issues.push('Large inline CSS detected')
    }
    
    return issues
  }

  // Auto-fix functions
  const addCanonicalTags = () => {
    manageCanonicalUrls()
  }

  const addMetaDescription = () => {
    if (!document.querySelector('meta[name="description"]')) {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = generateMetaDescription(pathname)
      document.head.appendChild(meta)
    }
  }

  const addAltTags = () => {
    const images = document.querySelectorAll('img:not([alt])')
    images.forEach((img, index) => {
      const altText = generateAltText(img as HTMLImageElement, index)
      img.setAttribute('alt', altText)
    })
  }

  const fixBrokenLinks = (brokenLinks: string[]) => {
    brokenLinks.forEach(href => {
      const links = document.querySelectorAll(`a[href="${href}"]`)
      links.forEach(link => {
        // Add a warning class or disable the link
        link.classList.add('broken-link')
        link.setAttribute('data-broken', 'true')
      })
    })
  }

  const fixHeadingStructure = () => {
    const h1Tags = document.querySelectorAll('h1')
    if (h1Tags.length > 1) {
      // Convert extra H1s to H2s
      Array.from(h1Tags).slice(1).forEach(h1 => {
        const h2 = document.createElement('h2')
        h2.innerHTML = h1.innerHTML
        h2.className = h1.className
        h1.parentNode?.replaceChild(h2, h1)
      })
    }
  }

  const addOpenGraphTags = () => {
    const ogTags = [
      { property: 'og:title', content: document.title },
      { property: 'og:description', content: generateMetaDescription(pathname) },
      { property: 'og:url', content: window.location.href },
      { property: 'og:image', content: `${window.location.origin}/og-image.png` }
    ]

    ogTags.forEach(tag => {
      if (!document.querySelector(`meta[property="${tag.property}"]`)) {
        const meta = document.createElement('meta')
        meta.setAttribute('property', tag.property)
        meta.content = tag.content
        document.head.appendChild(meta)
      }
    })
  }

  const generateMetaDescription = (path: string): string => {
    const descriptions: { [key: string]: string } = {
      '/': 'Track cryptocurrency prices in real-time, set custom price alerts, and manage your crypto portfolio with advanced analytics.',
      '/dashboard': 'Your personal cryptocurrency dashboard with portfolio tracking, price alerts, and market analysis.',
      '/alerts': 'Create and manage custom price alerts for all your favorite cryptocurrencies.',
      '/premium': 'Unlock premium features with unlimited price alerts, advanced analytics, and professional portfolio tools.',
      '/faq': 'Frequently asked questions about CryptoTracker - cryptocurrency price alerts and portfolio management.',
      '/learn': 'Learn about cryptocurrency, blockchain technology, and digital asset investment strategies.'
    }

    return descriptions[path] || `${path.split('/').pop()?.replace(/-/g, ' ')} - CryptoTracker cryptocurrency information and price tracking.`
  }

  const generateAltText = (img: HTMLImageElement, index: number): string => {
    const src = img.src
    const filename = src.split('/').pop()?.split('.')[0] || ''
    
    if (src.includes('logo')) return 'CryptoTracker Logo'
    if (src.includes('icon')) return 'Cryptocurrency Icon'
    if (src.includes('chart')) return 'Price Chart'
    if (filename.includes('bitcoin')) return 'Bitcoin Logo'
    if (filename.includes('ethereum')) return 'Ethereum Logo'
    
    return `Cryptocurrency Image ${index + 1}`
  }

  // Show SEO issues in development only
  if (process.env.NODE_ENV === 'development' && seoIssues.length > 0) {
    console.group('Technical SEO Issues:')
    seoIssues.forEach(issue => {
      console.log(`${issue.type.toUpperCase()}: ${issue.message}`)
    })
    console.groupEnd()
  }

  return null
}
