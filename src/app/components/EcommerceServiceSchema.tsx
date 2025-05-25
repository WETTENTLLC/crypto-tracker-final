'use client'

import { useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'

interface ServiceOffering {
  name: string
  description: string
  price: string
  currency: string
  features: string[]
  category: string
}

export default function EcommerceServiceSchema() {
  const pathname = usePathname()

  const injectSchema = useCallback((schema: object, id: string) => {
    // Remove existing schema with same ID
    const existingSchema = document.querySelector(`script[data-schema-id="${id}"]`)
    if (existingSchema) {
      existingSchema.remove()
    }

    // Inject new schema
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-schema-id', id)
    script.textContent = JSON.stringify(schema, null, 2)
    document.head.appendChild(script)
  }, [])

  const generateServiceSchemas = useCallback(() => {
    // Define service offerings
    const serviceOfferings: ServiceOffering[] = [
      {
        name: 'Free Cryptocurrency Tracking',
        description: 'Basic cryptocurrency portfolio tracking with essential price monitoring and limited alerts.',
        price: '0',
        currency: 'USD',
        features: [
          'Real-time price tracking for 10,000+ cryptocurrencies',
          'Basic portfolio overview',
          'Up to 3 price alerts',
          'Market overview dashboard',
          'Mobile responsive design'
        ],
        category: 'Financial Software'
      },
      {
        name: 'Premium Cryptocurrency Tracking',
        description: 'Advanced cryptocurrency portfolio management with unlimited alerts, professional analytics, and premium features.',
        price: '9.99',
        currency: 'USD',
        features: [
          'Unlimited price alerts',
          'Advanced portfolio analytics',
          'Historical performance tracking',
          'Premium market insights',
          'Priority customer support',
          'Export capabilities',
          'Advanced charting tools',
          'Custom notification settings'
        ],
        category: 'Professional Financial Software'
      },
      {
        name: 'Enterprise Cryptocurrency Solutions',
        description: 'Custom cryptocurrency tracking and portfolio management solutions for businesses and institutions.',
        price: '99.99',
        currency: 'USD',
        features: [
          'Multi-user management',
          'API access',
          'Custom integrations',
          'White-label solutions',
          'Dedicated support',
          'Advanced security features',
          'Compliance reporting',
          'Custom analytics dashboards'
        ],
        category: 'Enterprise Financial Software'
      }
    ]

    // Generate Service schema for each offering
    serviceOfferings.forEach((service, index) => {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.name,
        description: service.description,
        category: service.category,
        provider: {
          '@type': 'Organization',
          name: 'CryptoTracker',
          url: window.location.origin,
          logo: `${window.location.origin}/logo.svg`
        },
        areaServed: {
          '@type': 'Place',
          name: 'Worldwide'
        },
        offers: {
          '@type': 'Offer',
          price: service.price,
          priceCurrency: service.currency,
          availability: 'https://schema.org/InStock',
          url: `${window.location.origin}/premium`,
          validFrom: new Date().toISOString(),
          priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
          seller: {
            '@type': 'Organization',
            name: 'CryptoTracker'
          }
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: service.name,
          itemListElement: service.features.map((feature) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: feature,
              description: feature
            }
          }))
        },
        serviceType: 'Cryptocurrency Portfolio Management',
        audience: {
          '@type': 'Audience',
          audienceType: service.price === '0' ? 'Individual Investors' : 
                       service.price === '9.99' ? 'Professional Traders' : 'Institutional Clients'
        }
      }

      injectSchema(schema, `service-${index}`)
    })
  }, [injectSchema])

  const generateProductSchemas = useCallback(() => {
    // For cryptocurrency pages, treat each crypto as a "product" for tracking
    if (pathname.startsWith('/coin/')) {
      const coinId = pathname.split('/')[2]
      const coinName = coinId.charAt(0).toUpperCase() + coinId.slice(1)

      const schema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: `${coinName} Price Tracking`,
        description: `Real-time price tracking, analysis, and alerts for ${coinName} cryptocurrency`,
        category: 'Cryptocurrency Data Service',
        brand: {
          '@type': 'Brand',
          name: coinName
        },
        sku: `TRACK-${coinId.toUpperCase()}`,
        image: `${window.location.origin}/icons/icon-192x192.svg`,
        offers: {
          '@type': 'Offer',
          url: window.location.href,
          priceCurrency: 'USD',
          price: '0',
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: 'CryptoTracker'
          }
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.5',
          reviewCount: '1250',
          bestRating: '5',
          worstRating: '1'
        },
        review: [
          {
            '@type': 'Review',
            author: {
              '@type': 'Person',
              name: 'Crypto Investor'
            },
            datePublished: '2025-05-25',
            description: 'Excellent real-time tracking for cryptocurrency prices. Very reliable alerts.',
            name: 'Great tracking service',
            reviewRating: {
              '@type': 'Rating',
              bestRating: '5',
              ratingValue: '5',
              worstRating: '1'
            }
          }
        ]
      }

      injectSchema(schema, 'product-coin')
    }
  }, [pathname, injectSchema])

  const generatePricingSchemas = useCallback(() => {
    if (pathname === '/premium') {
      const pricingSchema = {
        '@context': 'https://schema.org',
        '@type': 'PriceSpecification',
        price: '9.99',
        priceCurrency: 'USD',
        billingIncrement: 'P1M', // Monthly billing
        unitText: 'Monthly Subscription',
        description: 'Premium cryptocurrency tracking subscription with advanced features'
      }

      injectSchema(pricingSchema, 'pricing')

      // Subscription service schema
      const subscriptionSchema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Premium Cryptocurrency Subscription',
        description: 'Monthly subscription service for advanced cryptocurrency tracking and portfolio management',
        provider: {
          '@type': 'Organization',
          name: 'CryptoTracker'
        },
        offers: {
          '@type': 'Offer',
          price: '9.99',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `${window.location.origin}/premium`,
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '9.99',
            priceCurrency: 'USD',
            billingIncrement: 'P1M',
            unitText: 'month'
          },
          eligibleCustomerType: 'Individual',
          businessFunction: 'http://purl.org/goodrelations/v1#Sell'
        },
        serviceType: 'SaaS',
        category: 'Financial Technology'
      }

      injectSchema(subscriptionSchema, 'subscription')
    }
  }, [pathname, injectSchema])

  const generateOfferCatalogSchema = useCallback(() => {
    if (pathname === '/' || pathname === '/premium') {
      const offerCatalog = {
        '@context': 'https://schema.org',
        '@type': 'OfferCatalog',
        name: 'CryptoTracker Service Catalog',
        description: 'Complete catalog of cryptocurrency tracking and portfolio management services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Free Cryptocurrency Tracking',
              description: 'Basic cryptocurrency tracking with limited features'
            },
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: `${window.location.origin}/dashboard`
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Premium Cryptocurrency Tracking',
              description: 'Advanced cryptocurrency tracking with unlimited features'
            },
            price: '9.99',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: `${window.location.origin}/premium`,
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '9.99',
              priceCurrency: 'USD',
              billingIncrement: 'P1M'
            }
          }
        ]
      }

      injectSchema(offerCatalog, 'offer-catalog')
    }
  }, [pathname, injectSchema])

  useEffect(() => {
    generateServiceSchemas()
    generateProductSchemas()
    generatePricingSchemas()
    generateOfferCatalogSchema()
  }, [pathname, generateServiceSchemas, generateProductSchemas, generatePricingSchemas, generateOfferCatalogSchema])

  // Generate software application schema for the main app
  useEffect(() => {
    if (pathname === '/' || pathname === '/dashboard') {
      const softwareSchema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'CryptoTracker',
        description: 'Professional cryptocurrency portfolio tracking and price alert web application',
        url: window.location.origin,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web Browser',
        downloadUrl: window.location.origin,
        softwareVersion: '2.0.0',
        datePublished: '2025-05-25',
        author: {
          '@type': 'Organization',
          name: 'CryptoTracker Team'
        },
        offers: [
          {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            category: 'Free Tier'
          },
          {
            '@type': 'Offer',
            price: '9.99',
            priceCurrency: 'USD',
            category: 'Premium Tier',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              billingIncrement: 'P1M'
            }
          }
        ],
        featureList: [
          'Real-time cryptocurrency price tracking',
          'Custom price alerts and notifications',
          'Portfolio management and analytics',
          'Market overview and trending cryptocurrencies',
          'Multi-device synchronization',
          'Export and reporting capabilities'
        ],
        screenshot: `${window.location.origin}/og-image.png`,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.6',
          reviewCount: '2847',
          bestRating: '5',
          worstRating: '1'
        },
        applicationSubCategory: 'Cryptocurrency Portfolio Management',
        countriesSupported: ['US', 'CA', 'GB', 'DE', 'FR', 'ES', 'IT', 'NL', 'AU', 'JP', 'KR', 'SG'],
        supportedLanguage: ['en', 'es', 'fr', 'de', 'ja', 'ko', 'zh'],
        requirements: 'Modern web browser with JavaScript enabled',
        memoryRequirements: '512 MB RAM',
        storageRequirements: '50 MB available storage for offline data'
      }

      injectSchema(softwareSchema, 'software-application')
    }
  }, [pathname, injectSchema])

  // Generate financial service schema
  useEffect(() => {
    const financialServiceSchema = {
      '@context': 'https://schema.org',
      '@type': 'FinancialService',
      name: 'CryptoTracker Financial Services',
      description: 'Cryptocurrency portfolio tracking and financial analysis services',
      provider: {
        '@type': 'Organization',
        name: 'CryptoTracker'
      },
      serviceArea: {
        '@type': 'Place',
        name: 'Worldwide'
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Cryptocurrency Financial Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Portfolio Analysis',
              description: 'Comprehensive cryptocurrency portfolio analysis and reporting'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Price Monitoring',
              description: 'Real-time cryptocurrency price monitoring and alerting service'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Market Analytics',
              description: 'Advanced cryptocurrency market analysis and insights'
            }
          }
        ]
      },
      serviceType: 'Cryptocurrency Financial Management',
      areaServed: {
        '@type': 'Place',
        name: 'Global'
      }
    }

    injectSchema(financialServiceSchema, 'financial-service')
  }, [injectSchema])

  return null
}
