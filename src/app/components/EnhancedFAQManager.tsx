'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'

interface FAQItem {
  question: string
  answer: string
  category: string
  keywords: string[]
  lastUpdated: string
}

interface EnhancedFAQSchema {
  "@context": string
  "@type": string
  mainEntity: Array<{
    "@type": string
    name: string
    acceptedAnswer: {
      "@type": string
      text: string
    }
    author?: {
      "@type": string
      name: string
    }
    dateCreated: string
    dateModified: string
    inLanguage: string
    isPartOf?: {
      "@type": string
      name: string
    }
  }>
  author: {
    "@type": string
    name: string
    url: string
  }
  publisher: {
    "@type": string
    name: string
    url: string
    logo: {
      "@type": string
      url: string
      width: number
      height: number
    }
  }
  datePublished: string
  dateModified: string
  inLanguage: string
}

interface HowToSchema {
  "@context": string
  "@type": string
  name: string
  description: string
  image?: string
  totalTime?: string
  estimatedCost?: {
    "@type": string
    currency: string
    value: string
  }
  supply?: Array<{
    "@type": string
    name: string
  }>
  tool?: Array<{
    "@type": string
    name: string
  }>
  step: Array<{
    "@type": string
    name: string
    text: string
    image?: string
    url?: string
  }>
  author: {
    "@type": string
    name: string
  }
  datePublished: string
  dateModified: string
}

// Comprehensive FAQ database
const CRYPTO_FAQS: FAQItem[] = [
  {
    question: "How do I set up price alerts for Bitcoin?",
    answer: "To set up Bitcoin price alerts: 1) Navigate to the Bitcoin page, 2) Click 'Set Alert', 3) Choose your target price and notification method (email, SMS, or browser), 4) Confirm your alert. You'll receive instant notifications when Bitcoin reaches your target price.",
    category: "alerts",
    keywords: ["bitcoin", "price alerts", "notifications", "setup"],
    lastUpdated: "2024-12-25"
  },
  {
    question: "Is CryptoTracker free to use?",
    answer: "Yes! CryptoTracker offers a free plan with basic features including price tracking for 100+ cryptocurrencies and up to 3 price alerts. Our Premium plan ($5.99/month) includes unlimited alerts, SMS notifications, advanced portfolio analytics, and ad-free experience.",
    category: "pricing",
    keywords: ["free", "premium", "pricing", "subscription"],
    lastUpdated: "2024-12-25"
  },
  {
    question: "How accurate are the cryptocurrency prices?",
    answer: "Our prices are sourced from leading exchanges and updated in real-time every 30 seconds. We aggregate data from multiple exchanges including Binance, Coinbase, Kraken, and others to provide the most accurate market prices. Historical data is preserved for technical analysis.",
    category: "data",
    keywords: ["accuracy", "real-time", "exchanges", "data sources"],
    lastUpdated: "2024-12-25"
  },
  {
    question: "Can I track my crypto portfolio automatically?",
    answer: "Yes, with our Premium plan you can connect your exchange accounts via secure API keys (read-only) to automatically sync your portfolio. We support 50+ major exchanges. Alternatively, you can manually add your holdings for basic portfolio tracking.",
    category: "portfolio",
    keywords: ["portfolio", "automatic", "API", "sync", "exchanges"],
    lastUpdated: "2024-12-25"
  },
  {
    question: "Do you support DeFi and NFT tracking?",
    answer: "Absolutely! We track 500+ DeFi tokens, yield farming opportunities, and NFT collections. Our DeFi dashboard shows liquidity pool performance, staking rewards, and governance token prices. NFT floor prices and volume data are updated hourly.",
    category: "defi",
    keywords: ["DeFi", "NFT", "yield farming", "staking", "governance"],
    lastUpdated: "2024-12-25"
  },
  {
    question: "How secure is my data with CryptoTracker?",
    answer: "Security is our top priority. We use bank-grade encryption (AES-256), never store private keys or passwords, and all API connections are read-only. Your portfolio data is encrypted and stored securely. We're SOC 2 Type II compliant and undergo regular security audits.",
    category: "security",
    keywords: ["security", "encryption", "privacy", "SOC 2", "API safety"],
    lastUpdated: "2024-12-25"
  },
  {
    question: "What makes CryptoTracker different from other crypto trackers?",
    answer: "CryptoTracker combines real-time price tracking, advanced portfolio analytics, and intelligent price alerts in one platform. Our unique features include: AI-powered market insights, social sentiment analysis, regulatory news alerts, and multi-exchange portfolio aggregation with tax reporting.",
    category: "features",
    keywords: ["unique features", "AI insights", "sentiment analysis", "tax reporting"],
    lastUpdated: "2024-12-25"
  },
  {
    question: "Can I export my portfolio data for tax purposes?",
    answer: "Yes, Premium users can export comprehensive tax reports in CSV format compatible with popular tax software like TurboTax, TaxAct, and CoinTracker. Reports include realized gains/losses, transaction history, and cost basis calculations following FIFO/LIFO methods.",
    category: "taxes",
    keywords: ["tax export", "CSV", "gains", "losses", "FIFO", "LIFO"],
    lastUpdated: "2024-12-25"
  },
  {
    question: "How do I cancel my Premium subscription?",
    answer: "You can cancel your Premium subscription anytime from your account settings. Go to Account > Subscription > Cancel Subscription. Your Premium features will remain active until the end of your current billing period. No cancellation fees apply.",
    category: "billing",
    keywords: ["cancel", "subscription", "billing", "refund"],
    lastUpdated: "2024-12-25"
  },
  {
    question: "Do you offer API access for developers?",
    answer: "Yes! We provide RESTful API access for developers with both free and premium tiers. Free tier includes 100 requests/hour for basic price data. Premium API offers unlimited requests, historical data, portfolio endpoints, and real-time WebSocket feeds.",
    category: "api",
    keywords: ["API", "developers", "endpoints", "WebSocket", "real-time"],
    lastUpdated: "2024-12-25"
  }
]

// Step-by-step guides for HowTo schema
const HOW_TO_GUIDES = {
  "setup-price-alerts": {
    name: "How to Set Up Cryptocurrency Price Alerts",
    description: "Complete guide to setting up automated price alerts for Bitcoin, Ethereum, and other cryptocurrencies",
    totalTime: "PT5M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: "0"
    },
    supply: [
      { "@type": "Thing", name: "CryptoTracker account" },
      { "@type": "Thing", name: "Email or phone number" }
    ],
    tool: [
      { "@type": "Thing", name: "Web browser or mobile app" },
      { "@type": "Thing", name: "Internet connection" }
    ],
    steps: [
      {
        name: "Sign up for CryptoTracker",
        text: "Create a free account at CryptoTracker by providing your email address and creating a secure password.",
        url: "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/signup"
      },
      {
        name: "Navigate to cryptocurrency page",
        text: "Search for your desired cryptocurrency (e.g., Bitcoin, Ethereum) using the search bar or browse the top cryptocurrencies list.",
        url: "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/coins"
      },
      {
        name: "Click Set Alert button",
        text: "On the cryptocurrency detail page, locate and click the 'Set Price Alert' button prominently displayed near the current price.",
      },
      {
        name: "Configure alert parameters",
        text: "Set your target price (above or below current price), choose notification method (email, SMS, browser push), and select alert frequency.",
      },
      {
        name: "Confirm and activate alert",
        text: "Review your alert settings and click 'Create Alert'. You'll receive a confirmation message and the alert will become active immediately.",
      }
    ]
  },
  "setup-portfolio": {
    name: "How to Set Up Cryptocurrency Portfolio Tracking",
    description: "Step-by-step guide to track your crypto investments with automatic portfolio sync and manual entry options",
    totalTime: "PT10M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: "5.99"
    },
    supply: [
      { "@type": "Thing", name: "CryptoTracker Premium account" },
      { "@type": "Thing", name: "Exchange API keys (optional)" }
    ],
    tool: [
      { "@type": "Thing", name: "Supported cryptocurrency exchange" },
      { "@type": "Thing", name: "Portfolio tracking spreadsheet (optional)" }
    ],
    steps: [
      {
        name: "Upgrade to Premium",
        text: "Subscribe to CryptoTracker Premium to access advanced portfolio tracking features and unlimited holdings management.",
        url: "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/premium"
      },
      {
        name: "Connect exchange accounts",
        text: "Link your exchange accounts using secure read-only API keys. We support Binance, Coinbase, Kraken, and 50+ other exchanges.",
        url: "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/portfolio/connect"
      },
      {
        name: "Add manual holdings",
        text: "For exchanges without API support or hardware wallet holdings, manually add your cryptocurrencies with purchase price and quantity.",
      },
      {
        name: "Configure tracking preferences",
        text: "Set your base currency (USD, EUR, BTC), enable profit/loss calculations, and configure portfolio notifications and reporting frequency.",
      },
      {
        name: "Review portfolio dashboard",
        text: "Access your comprehensive portfolio dashboard showing total value, allocation breakdown, performance metrics, and detailed analytics.",
        url: "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/portfolio"
      }
    ]
  }
}

export default function EnhancedFAQManager() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)

  const categories = ['all', ...Array.from(new Set(CRYPTO_FAQS.map(faq => faq.category)))]
  
  const filteredFAQs = CRYPTO_FAQS

  const generateEnhancedFAQSchema = useCallback((): EnhancedFAQSchema => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: filteredFAQs.map(faq => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer
        },
        author: {
          "@type": "Organization",
          name: "CryptoTracker"
        },
        dateCreated: faq.lastUpdated,
        dateModified: faq.lastUpdated,
        inLanguage: "en-US",
        isPartOf: {
          "@type": "WebPage",
          name: "CryptoTracker FAQ"
        }
      })),
      author: {
        "@type": "Organization",
        name: "CryptoTracker",
        url: "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app"
      },
      publisher: {
        "@type": "Organization",
        name: "CryptoTracker",
        url: "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app",
        logo: {
          "@type": "ImageObject",
          url: "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/logo.png",
          width: 300,
          height: 300
        }
      },
      datePublished: "2024-01-01",
      dateModified: "2024-12-25",
      inLanguage: "en-US"
    }
  }, [filteredFAQs])

  const generateHowToSchema = (guideKey: string): HowToSchema => {
    const guide = HOW_TO_GUIDES[guideKey as keyof typeof HOW_TO_GUIDES]
    
    return {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: guide.name,
      description: guide.description,
      totalTime: guide.totalTime,
      estimatedCost: guide.estimatedCost,
      supply: guide.supply,
      tool: guide.tool,      step: guide.steps.map((step) => ({
        "@type": "HowToStep",
        name: step.name,
        text: step.text,
        image: step.url ? `${step.url}/screenshot.png` : undefined,
        url: step.url
      })),
      author: {
        "@type": "Organization",
        name: "CryptoTracker"
      },
      datePublished: "2024-01-01",
      dateModified: "2024-12-25"
    }
  }

  useEffect(() => {
    // Inject FAQ schema markup
    const faqSchema = generateEnhancedFAQSchema()
    
    // Remove existing FAQ schema
    const existingFAQSchema = document.querySelectorAll('script[type="application/ld+json"][data-faq-enhanced]')
    existingFAQSchema.forEach(script => script.remove())
    
    // Add enhanced FAQ schema
    const faqScript = document.createElement('script')
    faqScript.type = 'application/ld+json'
    faqScript.setAttribute('data-faq-enhanced', 'true')
    faqScript.textContent = JSON.stringify(faqSchema)
    document.head.appendChild(faqScript)
    
    // Add HowTo schemas for relevant pages
    if (pathname.includes('/learn/') || pathname.includes('/guide/')) {
      Object.keys(HOW_TO_GUIDES).forEach(guideKey => {
        const howToSchema = generateHowToSchema(guideKey)
        const howToScript = document.createElement('script')
        howToScript.type = 'application/ld+json'
        howToScript.setAttribute('data-howto-enhanced', guideKey)
        howToScript.textContent = JSON.stringify(howToSchema)
        document.head.appendChild(howToScript)
      })
    }
      return () => {
      // Cleanup on unmount
      const schemas = document.querySelectorAll('script[type="application/ld+json"][data-faq-enhanced], script[type="application/ld+json"][data-howto-enhanced]')
      schemas.forEach(script => script.remove())
    }
  }, [pathname, generateEnhancedFAQSchema])

  return (
    <>
      {/* FAQ Schema Monitor - Development Only */}
      {process.env.NODE_ENV === 'development' && (
        <div 
          className={`fixed bottom-20 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-40 transition-all duration-300 ${
            isVisible ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm">FAQ Schema Status</h4>
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="text-gray-400 hover:text-gray-600"
            >
              {isVisible ? '×' : '❓'}
            </button>
          </div>
          
          {isVisible && (
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-medium">Active FAQs:</span> {filteredFAQs.length}
              </div>
              <div>
                <span className="font-medium">Categories:</span> {categories.length - 1}
              </div>
              <div>
                <span className="font-medium">Schema Types:</span>
                <div className="ml-2">
                  <span className="text-green-600">✓ FAQ Page</span><br/>
                  <span className="text-green-600">✓ HowTo Guides</span><br/>
                  <span className="text-green-600">✓ Q&A Format</span>
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="font-medium mb-1">Active Categories:</div>
                {categories.slice(1).map((category, index) => (
                  <div key={index} className="text-xs capitalize">• {category}</div>
                ))}
              </div>
              <div className="pt-2 border-t text-gray-600">
                <div>Rich snippets optimized</div>
                <div>Search feature enhanced</div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

// Enhanced FAQ Display Component
export function EnhancedFAQDisplay() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const categories = ['all', ...Array.from(new Set(CRYPTO_FAQS.map(faq => faq.category)))]
  
  const filteredFAQs = CRYPTO_FAQS.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  const toggleExpanded = (index: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedItems(newExpanded)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* FAQ Search and Filter */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search frequently asked questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'All Questions' : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFAQs.map((faq, index) => {
          const itemKey = `${faq.category}-${index}`
          const isExpanded = expandedItems.has(itemKey)
          
          return (
            <div
              key={itemKey}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              itemScope
              itemType="https://schema.org/Question"
            >
              <button
                onClick={() => toggleExpanded(itemKey)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              >
                <h3 className="font-semibold text-gray-900" itemProp="name">
                  {faq.question}
                </h3>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isExpanded && (
                <div className="px-6 pb-4 border-t border-gray-100" itemScope itemType="https://schema.org/Answer">
                  <div className="pt-4 text-gray-700 leading-relaxed" itemProp="text">
                    {faq.answer}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {faq.category}
                      </span>
                      <span>Updated: {faq.lastUpdated}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {faq.keywords.slice(0, 3).map((keyword, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filteredFAQs.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No questions found</h3>
          <p className="mt-2 text-gray-500">Try adjusting your search or category filter.</p>
        </div>
      )}
    </div>
  )
}
