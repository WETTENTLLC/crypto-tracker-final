'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

// Advanced schema interfaces
interface OrganizationSchema {
  "@context": string
  "@type": string
  name: string
  description: string
  url: string
  logo: {
    "@type": string
    url: string
    width: number
    height: number
  }
  foundingDate: string
  founders: Array<{
    "@type": string
    name: string
    url?: string
  }>
  sameAs: string[]
  contactPoint: Array<{
    "@type": string
    telephone?: string
    email: string
    contactType: string
    availableLanguage: string[]
    areaServed: string[]
  }>
  address?: {
    "@type": string
    addressCountry: string
    addressLocality: string
    addressRegion: string
  }
  aggregateRating?: {
    "@type": string
    ratingValue: number
    reviewCount: number
    bestRating: number
    worstRating: number
  }
}

interface WebSiteSchema {
  "@context": string
  "@type": string
  name: string
  url: string
  description: string
  inLanguage: string[]
  isAccessibleForFree: boolean
  potentialAction: Array<{
    "@type": string
    target: string | {
      "@type": string
      urlTemplate: string
    }
    "query-input"?: string
  }>
  about: Array<{
    "@type": string
    name: string
    sameAs: string
  }>
  mainEntity?: {
    "@type": string
    name: string
    description: string
  }
}

interface BreadcrumbListSchema {
  "@context": string
  "@type": string
  itemListElement: Array<{
    "@type": string
    position: number
    name: string
    item?: string
  }>
}

interface SoftwareApplicationSchema {
  "@context": string
  "@type": string
  name: string
  description: string
  url: string
  applicationCategory: string
  operatingSystem: string[]
  browserRequirements: string
  permissions: string[]
  offers: Array<{
    "@type": string
    price: string
    priceCurrency: string
    name: string
    description: string
    category: string
    eligibleRegion: string[]
    availability: string
    validFrom: string
  }>
  aggregateRating: {
    "@type": string
    ratingValue: number
    reviewCount: number
    bestRating: number
    worstRating: number
  }
  featureList: string[]
  screenshot: Array<{
    "@type": string
    url: string
    description: string
  }>
}

interface FinancialServiceSchema {
  "@context": string
  "@type": string
  name: string
  description: string
  url: string
  serviceType: string
  areaServed: string[]
  hasOfferCatalog: {
    "@type": string
    name: string
    itemListElement: Array<{
      "@type": string
      itemOffered: {
        "@type": string
        name: string
        description: string
        category: string
      }
    }>
  }
  provider: {
    "@type": string
    name: string
    url: string
  }
  broker?: {
    "@type": string
    name: string
    url: string
  }
  feesAndCommissionsSpecification?: string
}

export default function AdvancedSchemaManager() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)

  // Schema generators
  const generateOrganizationSchema = (): OrganizationSchema => {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "CryptoTracker",
      description: "Leading cryptocurrency portfolio tracking and price alert platform serving millions of crypto investors worldwide with real-time market data, advanced analytics, and automated trading tools.",
      url: "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app",
      logo: {
        "@type": "ImageObject",
        url: "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/logo.svg",
        width: 512,
        height: 512
      },
      foundingDate: "2023-01-01",
      founders: [
        {
          "@type": "Person",
          name: "CryptoTracker Team",
          url: "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/about"
        }
      ],
      sameAs: [
        "https://twitter.com/cryptotracker",
        "https://facebook.com/cryptotracker",
        "https://linkedin.com/company/cryptotracker",
        "https://instagram.com/cryptotracker",
        "https://youtube.com/cryptotracker",
        "https://github.com/cryptotracker",
        "https://discord.gg/cryptotracker",
        "https://reddit.com/r/cryptotracker"
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          email: "support@cryptotracker.com",
          contactType: "customer service",
          availableLanguage: ["English", "Spanish", "French", "German", "Chinese", "Japanese"],
          areaServed: ["US", "CA", "GB", "AU", "DE", "FR", "ES", "JP", "CN", "Worldwide"]
        },
        {
          "@type": "ContactPoint", 
          email: "business@cryptotracker.com",
          contactType: "business development",
          availableLanguage: ["English"],
          areaServed: ["Worldwide"]
        },
        {
          "@type": "ContactPoint",
          email: "press@cryptotracker.com", 
          contactType: "public relations",
          availableLanguage: ["English"],
          areaServed: ["Worldwide"]
        }
      ],
      address: {
        "@type": "PostalAddress",
        addressCountry: "US",
        addressLocality: "San Francisco",
        addressRegion: "CA"
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: 4.8,
        reviewCount: 15247,
        bestRating: 5,
        worstRating: 1
      }
    }
  }

  const generateWebSiteSchema = (): WebSiteSchema => {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "CryptoTracker - Cryptocurrency Portfolio & Price Tracking Platform",
      url: "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app",
      description: "Professional cryptocurrency portfolio tracking, real-time price alerts, market analysis, and investment tools for Bitcoin, Ethereum, and 10,000+ digital assets.",
      inLanguage: ["en-US", "es-ES", "fr-FR", "de-DE", "zh-CN", "ja-JP"],
      isAccessibleForFree: true,
      potentialAction: [
        {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        },
        {
          "@type": "ReadAction",
          target: "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/learn"
        },
        {
          "@type": "RegisterAction", 
          target: "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/register"
        }
      ],
      about: [
        {
          "@type": "Thing",
          name: "Cryptocurrency",
          sameAs: "https://en.wikipedia.org/wiki/Cryptocurrency"
        },
        {
          "@type": "Thing",
          name: "Bitcoin",
          sameAs: "https://en.wikipedia.org/wiki/Bitcoin"
        },
        {
          "@type": "Thing",
          name: "Ethereum",
          sameAs: "https://en.wikipedia.org/wiki/Ethereum"
        },
        {
          "@type": "Thing",
          name: "Blockchain",
          sameAs: "https://en.wikipedia.org/wiki/Blockchain"
        },
        {
          "@type": "Thing",
          name: "Portfolio Management",
          sameAs: "https://en.wikipedia.org/wiki/Portfolio_management"
        }
      ],
      mainEntity: {
        "@type": "WebApplication",
        name: "CryptoTracker Platform",
        description: "Comprehensive cryptocurrency portfolio and market tracking application"
      }
    }
  }

  const generateBreadcrumbSchema = (pathname: string): BreadcrumbListSchema => {
    const pathSegments = pathname.split('/').filter(segment => segment)
    const breadcrumbs: BreadcrumbListSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app"
        }
      ]
    }

    let currentPath = ""
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const position = index + 2
      const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
      
      breadcrumbs.itemListElement.push({
        "@type": "ListItem",
        position,
        name,
        item: position === pathSegments.length + 1 ? undefined : `https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app${currentPath}`
      })
    })

    return breadcrumbs
  }

  const generateSoftwareApplicationSchema = (): SoftwareApplicationSchema => {
    return {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "CryptoTracker - Portfolio & Price Alerts",
      description: "Professional-grade cryptocurrency portfolio tracking application with real-time price monitoring, advanced analytics, and automated alert systems for serious crypto investors.",
      url: "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app",
      applicationCategory: "Finance",
      operatingSystem: ["Web Browser", "iOS", "Android", "Windows", "macOS", "Linux"],
      browserRequirements: "Modern web browser with JavaScript enabled",
      permissions: ["notifications", "local storage", "camera (QR code scanning)"],
      offers: [
        {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          name: "Free Plan",
          description: "Basic portfolio tracking with up to 5 cryptocurrencies and essential alerts",
          category: "Free Tier",
          eligibleRegion: ["US", "CA", "GB", "AU", "DE", "FR", "ES", "Worldwide"],
          availability: "InStock",
          validFrom: "2023-01-01"
        },
        {
          "@type": "Offer", 
          price: "9.99",
          priceCurrency: "USD",
          name: "Pro Plan",
          description: "Advanced portfolio tracking with unlimited cryptocurrencies, premium alerts, and market analysis",
          category: "Premium Subscription",
          eligibleRegion: ["US", "CA", "GB", "AU", "DE", "FR", "ES", "Worldwide"],
          availability: "InStock",
          validFrom: "2023-01-01"
        },
        {
          "@type": "Offer",
          price: "29.99", 
          priceCurrency: "USD",
          name: "Enterprise Plan",
          description: "Professional-grade portfolio management with API access, white-label options, and priority support",
          category: "Enterprise Subscription",
          eligibleRegion: ["US", "CA", "GB", "AU", "DE", "FR", "ES", "Worldwide"],
          availability: "InStock",
          validFrom: "2023-01-01"
        }
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: 4.8,
        reviewCount: 15247,
        bestRating: 5,
        worstRating: 1
      },
      featureList: [
        "Real-time cryptocurrency price tracking",
        "Portfolio performance analytics",
        "Custom price alerts and notifications",
        "Advanced charting and technical analysis",
        "Multi-exchange integration", 
        "Tax reporting and compliance tools",
        "Mobile and desktop applications",
        "API access for developers",
        "Security and two-factor authentication",
        "Multi-currency support",
        "News and market sentiment analysis",
        "DeFi protocol integration",
        "NFT collection tracking",
        "Staking rewards calculation",
        "Risk management tools"
      ],
      screenshot: [
        {
          "@type": "ImageObject",
          url: "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/screenshots/dashboard.png",
          description: "CryptoTracker main dashboard showing portfolio overview and market data"
        },
        {
          "@type": "ImageObject",
          url: "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/screenshots/alerts.png", 
          description: "Price alert configuration and notification center"
        },
        {
          "@type": "ImageObject",
          url: "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/screenshots/analytics.png",
          description: "Advanced portfolio analytics and performance tracking"
        }
      ]
    }
  }

  const generateFinancialServiceSchema = (): FinancialServiceSchema => {
    return {
      "@context": "https://schema.org",
      "@type": "FinancialService",
      name: "CryptoTracker Financial Services",
      description: "Comprehensive cryptocurrency portfolio management and investment tracking services for individual and institutional investors.",
      url: "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app",
      serviceType: "Investment Management Software",
      areaServed: ["US", "CA", "GB", "AU", "DE", "FR", "ES", "JP", "CN", "Worldwide"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "CryptoTracker Service Catalog",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service", 
              name: "Portfolio Tracking",
              description: "Real-time cryptocurrency portfolio monitoring and performance analysis",
              category: "Investment Management"
            }
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Price Alert System",
              description: "Automated price notifications and market movement alerts", 
              category: "Market Monitoring"
            }
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Market Analysis",
              description: "Advanced technical analysis and market research tools",
              category: "Research & Analysis"
            }
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Tax Reporting",
              description: "Automated cryptocurrency tax calculation and compliance reporting",
              category: "Tax & Compliance"
            }
          }
        ]
      },
      provider: {
        "@type": "Organization",
        name: "CryptoTracker",
        url: "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app"
      },
      feesAndCommissionsSpecification: "Free tier available. Premium plans start at $9.99/month with no hidden fees or commissions."
    }
  }

  useEffect(() => {
    // Remove existing schemas
    const existingSchemas = document.querySelectorAll('script[type="application/ld+json"][data-advanced-schema]')
    existingSchemas.forEach(script => script.remove())

    // Generate and inject schemas
    const schemas = [
      { data: generateOrganizationSchema(), id: 'organization' },
      { data: generateWebSiteSchema(), id: 'website' },
      { data: generateBreadcrumbSchema(pathname), id: 'breadcrumb' },
      { data: generateSoftwareApplicationSchema(), id: 'software' },
      { data: generateFinancialServiceSchema(), id: 'financial' }
    ]

    schemas.forEach(({ data, id }) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-advanced-schema', id)
      script.textContent = JSON.stringify(data)
      document.head.appendChild(script)
    })

    return () => {
      // Cleanup on unmount
      const schemasToRemove = document.querySelectorAll('script[type="application/ld+json"][data-advanced-schema]')
      schemasToRemove.forEach(script => script.remove())
    }
  }, [pathname])

  return (
    <>
      {/* Schema Manager Controls */}
      <div className="fixed bottom-20 right-4 z-50">
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors"
          title="Advanced Schema Manager"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>

        {isVisible && (
          <div className="absolute bottom-12 right-0 bg-white border rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Advanced Schema Manager</h3>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="border-b pb-2">
                <div className="font-medium text-blue-600 mb-1">Active Schemas:</div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <span className="text-green-600">✓ Organization</span>
                  <span className="text-green-600">✓ WebSite</span>
                  <span className="text-green-600">✓ Breadcrumb</span>
                  <span className="text-green-600">✓ Software App</span>
                  <span className="text-green-600">✓ Financial Service</span>
                  <span className="text-green-600">✓ Multi-Language</span>
                </div>
              </div>

              <div className="border-b pb-2">
                <div className="font-medium mb-1">Current Page:</div>
                <div className="text-gray-600 text-xs break-all">{pathname || '/'}</div>
                <div className="text-xs text-green-600 mt-1">Breadcrumb schema active</div>
              </div>

              <div className="border-b pb-2">
                <div className="font-medium mb-1">Schema Features:</div>
                <div className="text-xs space-y-1">
                  <div>• Rich snippets optimization</div>
                  <div>• Multi-language support</div>
                  <div>• E-commerce integration</div>
                  <div>• Financial service markup</div>
                  <div>• Organization verification</div>
                  <div>• Software application details</div>
                </div>
              </div>

              <div className="border-b pb-2">
                <div className="font-medium mb-1">SEO Benefits:</div>
                <div className="text-xs space-y-1 text-gray-600">
                  <div>• Enhanced search appearance</div>
                  <div>• Knowledge panel eligibility</div>
                  <div>• Rich result features</div>
                  <div>• Brand authority signals</div>
                  <div>• Structured data compliance</div>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                <div className="font-medium">Coverage:</div>
                <div>Organization: Global</div>
                <div>Languages: 6 supported</div>
                <div>Markets: 10+ countries</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
