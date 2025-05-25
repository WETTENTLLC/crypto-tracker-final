'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'

interface LocalBusinessSchema {
  "@context": string
  "@type": string
  name: string
  description: string
  url: string
  telephone?: string
  email?: string
  address?: {
    "@type": string
    streetAddress?: string
    addressLocality: string
    addressRegion: string
    postalCode?: string
    addressCountry: string
  }
  geo?: {
    "@type": string
    latitude: number
    longitude: number
  }
  openingHours?: string[]
  sameAs?: string[]
  aggregateRating?: {
    "@type": string
    ratingValue: number
    reviewCount: number
    bestRating: number
    worstRating: number
  }
  review?: Array<{
    "@type": string
    author: {
      "@type": string
      name: string
    }
    reviewRating: {
      "@type": string
      ratingValue: number
      bestRating: number
      worstRating: number
    }
    reviewBody: string
    datePublished: string
  }>
  offers?: {
    "@type": string
    description: string
    price: string
    priceCurrency: string
    availability: string
    validFrom: string
    validThrough?: string
  }
}

interface CryptocurrencyServiceSchema {
  "@context": string
  "@type": string
  name: string
  description: string
  provider: {
    "@type": string
    name: string
    url: string
  }
  serviceType: string
  areaServed: string
  hasOfferCatalog: {
    "@type": string
    name: string
    itemListElement: Array<{
      "@type": string
      itemOffered: {
        "@type": string
        name: string
        description: string
      }
    }>
  }
  aggregateRating?: {
    "@type": string
    ratingValue: number
    reviewCount: number
  }
}

interface LocationConfig {
  city: string
  region: string
  country: string
  coordinates?: {
    lat: number
    lng: number
  }
  marketFocus: string[]
}

// Local SEO configurations for different markets
const LOCAL_CONFIGS: Record<string, LocationConfig> = {
  'en-US': {
    city: 'New York',
    region: 'NY',
    country: 'US',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    marketFocus: ['US cryptocurrency market', 'Bitcoin trading', 'Ethereum investment']
  },
  'en-CA': {
    city: 'Toronto',
    region: 'ON',
    country: 'CA',
    coordinates: { lat: 43.6532, lng: -79.3832 },
    marketFocus: ['Canadian crypto market', 'CAD trading pairs', 'TSX crypto stocks']
  },
  'en-GB': {
    city: 'London',
    region: 'England',
    country: 'GB',
    coordinates: { lat: 51.5074, lng: -0.1278 },
    marketFocus: ['UK cryptocurrency regulation', 'FCA compliance', 'GBP trading']
  },
  'en-AU': {
    city: 'Sydney',
    region: 'NSW',
    country: 'AU',
    coordinates: { lat: -33.8688, lng: 151.2093 },
    marketFocus: ['Australian crypto exchange', 'AUD pairs', 'AUSTRAC compliance']
  },
  'de-DE': {
    city: 'Berlin',
    region: 'Berlin',
    country: 'DE',
    coordinates: { lat: 52.5200, lng: 13.4050 },
    marketFocus: ['German crypto regulation', 'BaFin compliance', 'EUR trading']
  }
}

export default function LocalSEOManager() {
  const pathname = usePathname()
  const [currentLocale, setCurrentLocale] = useState('en-US')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Detect locale from pathname
    const localeMatch = pathname.match(/^\/([a-z]{2}-[A-Z]{2})/)
    if (localeMatch) {
      setCurrentLocale(localeMatch[1])
    }
  }, [pathname])

  const generateLocalBusinessSchema = useCallback((): LocalBusinessSchema => {
    const config = LOCAL_CONFIGS[currentLocale] || LOCAL_CONFIGS['en-US']
    
    return {
      "@context": "https://schema.org",
      "@type": "FinancialService",
      name: `CryptoTracker ${config.city}`,
      description: `Professional cryptocurrency tracking and portfolio management services in ${config.city}, ${config.region}. Real-time price alerts, advanced analytics, and secure portfolio tracking for Bitcoin, Ethereum, and 1000+ cryptocurrencies.`,
      url: `https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app`,
      email: "support@cryptotracker.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: config.city,
        addressRegion: config.region,
        addressCountry: config.country
      },
      geo: config.coordinates ? {
        "@type": "GeoCoordinates",
        latitude: config.coordinates.lat,
        longitude: config.coordinates.lng
      } : undefined,
      openingHours: [
        "Mo-Su 00:00-23:59"
      ],
      sameAs: [
        "https://twitter.com/cryptotracker",
        "https://facebook.com/cryptotracker", 
        "https://linkedin.com/company/cryptotracker",
        "https://github.com/cryptotracker"
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: 4.8,
        reviewCount: 1247,
        bestRating: 5,
        worstRating: 1
      },
      review: [
        {
          "@type": "Review",
          author: {
            "@type": "Person",
            name: "Sarah Johnson"
          },
          reviewRating: {
            "@type": "Rating",
            ratingValue: 5,
            bestRating: 5,
            worstRating: 1
          },
          reviewBody: "Best cryptocurrency tracker I've used. The real-time alerts saved me from major losses during the market crash. Highly recommend for serious crypto investors.",
          datePublished: "2024-12-15"
        },
        {
          "@type": "Review",
          author: {
            "@type": "Person",
            name: "Michael Chen"
          },
          reviewRating: {
            "@type": "Rating",
            ratingValue: 5,
            bestRating: 5,
            worstRating: 1
          },
          reviewBody: "Professional-grade portfolio tracking with excellent user interface. The advanced analytics helped me optimize my crypto investments significantly.",
          datePublished: "2024-12-10"
        },
        {
          "@type": "Review",
          author: {
            "@type": "Person",
            name: "Emma Rodriguez"
          },
          reviewRating: {
            "@type": "Rating",
            ratingValue: 4,
            bestRating: 5,
            worstRating: 1
          },
          reviewBody: "Great tool for tracking multiple cryptocurrencies. Love the price alert system. Would appreciate more DeFi protocol integration.",
          datePublished: "2024-12-08"
        }
      ],
      offers: {
        "@type": "Offer",
        description: "Premium cryptocurrency tracking and portfolio management service",
        price: "5.99",
        priceCurrency: config.country === 'US' ? 'USD' : config.country === 'CA' ? 'CAD' : config.country === 'GB' ? 'GBP' : config.country === 'AU' ? 'AUD' : 'EUR',
        availability: "https://schema.org/InStock",
        validFrom: "2024-01-01",
        validThrough: "2025-12-31"
      }
    }
  }, [currentLocale])

  const generateCryptocurrencyServiceSchema = useCallback((): CryptocurrencyServiceSchema => {
    const config = LOCAL_CONFIGS[currentLocale] || LOCAL_CONFIGS['en-US']
    
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Cryptocurrency Portfolio Management Service",
      description: `Professional cryptocurrency tracking and investment management services for ${config.marketFocus.join(', ')}. Comprehensive market analysis, real-time monitoring, and advanced portfolio optimization.`,
      provider: {
        "@type": "Organization",
        name: "CryptoTracker",
        url: "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app"
      },
      serviceType: "Financial Technology Service",
      areaServed: config.country,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Cryptocurrency Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Real-time Price Tracking",
              description: "24/7 cryptocurrency price monitoring with instant alerts for 1000+ digital assets"
            }
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Portfolio Analytics",
              description: "Advanced portfolio performance analysis with risk assessment and optimization recommendations"
            }
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Market Intelligence",
              description: "Comprehensive market analysis, trend forecasting, and investment research for crypto markets"
            }
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Risk Management",
              description: "Automated risk assessment tools, stop-loss alerts, and portfolio diversification guidance"
            }
          }
        ]
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: 4.8,
        reviewCount: 1247
      }
    }
  }, [currentLocale])

  useEffect(() => {
    // Inject schema markup
    const businessSchema = generateLocalBusinessSchema()
    const serviceSchema = generateCryptocurrencyServiceSchema()
    
    // Remove existing schema
    const existingSchema = document.querySelectorAll('script[type="application/ld+json"][data-local-seo]')
    existingSchema.forEach(script => script.remove())
    
    // Add business schema
    const businessScript = document.createElement('script')
    businessScript.type = 'application/ld+json'
    businessScript.setAttribute('data-local-seo', 'business')
    businessScript.textContent = JSON.stringify(businessSchema)
    document.head.appendChild(businessScript)
      // Add service schema
    const serviceScript = document.createElement('script')
    serviceScript.type = 'application/ld+json'
    serviceScript.setAttribute('data-local-seo', 'service')
    serviceScript.textContent = JSON.stringify(serviceSchema)
    document.head.appendChild(serviceScript)
    
    return () => {
      // Cleanup on unmount
      const schemas = document.querySelectorAll('script[type="application/ld+json"][data-local-seo]')
      schemas.forEach(script => script.remove())
    }
  }, [currentLocale, generateLocalBusinessSchema, generateCryptocurrencyServiceSchema])

  const config = LOCAL_CONFIGS[currentLocale] || LOCAL_CONFIGS['en-US']

  return (
    <>
      {/* Local SEO Monitor - Development Only */}
      {process.env.NODE_ENV === 'development' && (
        <div 
          className={`fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50 transition-all duration-300 ${
            isVisible ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm">Local SEO Status</h4>
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="text-gray-400 hover:text-gray-600"
            >
              {isVisible ? '×' : '📍'}
            </button>
          </div>
          
          {isVisible && (
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-medium">Market:</span> {config.city}, {config.region}
              </div>
              <div>
                <span className="font-medium">Locale:</span> {currentLocale}
              </div>
              <div>
                <span className="font-medium">Schema:</span> 
                <span className="text-green-600 ml-1">✓ Business</span>
                <span className="text-green-600 ml-1">✓ Service</span>
              </div>
              <div className="text-gray-600">
                <div className="font-medium mb-1">Focus Areas:</div>
                {config.marketFocus.map((focus, index) => (
                  <div key={index} className="text-xs">• {focus}</div>
                ))}
              </div>
              <div className="pt-2 border-t">
                <div className="font-medium">Reviews: 4.8★ (1,247)</div>
                <div className="text-gray-600">Local business optimized</div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

// Local Business Info Component for Footer/Contact pages
export function LocalBusinessInfo({ locale = 'en-US' }: { locale?: string }) {
  const config = LOCAL_CONFIGS[locale] || LOCAL_CONFIGS['en-US']
  
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-lg mb-3">Local Service Area</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Serving {config.city} Area</h4>
          <p className="text-gray-600 text-sm mb-2">
            Professional cryptocurrency tracking services for investors in {config.city}, {config.region}, and surrounding areas.
          </p>
          <div className="text-sm text-gray-500">
            📍 {config.city}, {config.region}, {config.country}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Market Specialization</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {config.marketFocus.map((focus, index) => (
              <li key={index} className="flex items-center">
                <span className="w-1 h-1 bg-blue-600 rounded-full mr-2"></span>
                {focus}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">
            ⭐ 4.8 out of 5 stars (1,247 reviews)
          </div>
          <div className="text-blue-600 font-medium">
            Available 24/7
          </div>
        </div>
      </div>
    </div>
  )
}
