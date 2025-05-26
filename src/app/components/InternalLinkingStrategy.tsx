'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'

interface InternalLink {
  href: string
  title: string
  description: string
  category: 'learn' | 'tools' | 'guides' | 'faq'
}

interface InternalLinkingProps {
  currentPath: string
  category?: string
  excludePaths?: string[]
}

export default function InternalLinkingStrategy({ 
  currentPath, 
  category,
  excludePaths = [] 
}: InternalLinkingProps) {
  const [suggestedLinks, setSuggestedLinks] = useState<InternalLink[]>([])

  const allLinks: InternalLink[] = useMemo(() => [
    // Learn section
    {
      href: '/learn/what-is-cryptocurrency',
      title: 'What is Cryptocurrency?',
      description: 'Learn the basics of digital currencies and blockchain technology',
      category: 'learn'
    },
    {
      href: '/learn/how-to-buy-bitcoin',
      title: 'How to Buy Bitcoin',
      description: 'Step-by-step guide to purchasing your first Bitcoin safely',
      category: 'learn'
    },
    {
      href: '/learn/cryptocurrency-investing-guide',
      title: 'Cryptocurrency Investing Guide',
      description: 'Complete guide to investing in crypto for beginners',
      category: 'learn'
    },
    {
      href: '/learn/defi-guide',
      title: 'DeFi Guide',
      description: 'Everything about decentralized finance and yield farming',
      category: 'learn'
    },
    
    // Tools section
    {
      href: '/dashboard',
      title: 'Portfolio Dashboard',
      description: 'Track your cryptocurrency portfolio performance',
      category: 'tools'
    },
    {
      href: '/alerts',
      title: 'Price Alerts',
      description: 'Set up custom price alerts for your favorite cryptocurrencies',
      category: 'tools'
    },
    {
      href: '/coin/bitcoin',
      title: 'Bitcoin Price Tracker',
      description: 'Real-time Bitcoin price data and analysis',
      category: 'tools'
    },
    {
      href: '/coin/ethereum',
      title: 'Ethereum Price Tracker',
      description: 'Live Ethereum price tracking and market data',
      category: 'tools'
    },
    
    // Guides section
    {
      href: '/guides/trading-strategies',
      title: 'Crypto Trading Strategies',
      description: 'Learn proven cryptocurrency trading strategies',
      category: 'guides'
    },
    {
      href: '/guides/wallet-security',
      title: 'Wallet Security Guide',
      description: 'Best practices for securing your crypto wallets',
      category: 'guides'
    },
    
    // FAQ
    {
      href: '/faq',
      title: 'Frequently Asked Questions',
      description: 'Common questions about cryptocurrency and CryptoTracker',
      category: 'faq'
    }
  ], [])

  useEffect(() => {
    // Filter out current page and excluded paths
    let filteredLinks = allLinks.filter(link => 
      link.href !== currentPath && !excludePaths.includes(link.href)
    )

    // If category is specified, prioritize same category links
    if (category) {
      const sameCategory = filteredLinks.filter(link => link.category === category)
      const otherCategory = filteredLinks.filter(link => link.category !== category)
      filteredLinks = [...sameCategory, ...otherCategory]
    }

    // Limit to 3-4 suggestions
    setSuggestedLinks(filteredLinks.slice(0, 4))
  }, [currentPath, category, allLinks, excludePaths])

  if (suggestedLinks.length === 0) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mt-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Related Resources</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {suggestedLinks.map((link) => (
          <Link 
            key={link.href}
            href={link.href}
            className="group bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
              {link.title}
            </h4>
            <p className="text-sm text-gray-600">
              {link.description}
            </p>
            <div className="mt-2 text-xs text-blue-600 font-medium">
              Learn more →
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// Smart internal linking component for automatic contextual links
export function SmartInternalLinks() {
  // This would process content and automatically add internal links
  // For now, it's a placeholder for future enhancement
  return (
    <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg mt-4">
      <p className="font-medium mb-2">Quick Links:</p>
      <div className="flex flex-wrap gap-2">
        <Link href="/dashboard" className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors">
          Portfolio Dashboard
        </Link>
        <Link href="/alerts" className="bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition-colors">
          Price Alerts
        </Link>
        <Link href="/learn" className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors">
          Learn Crypto
        </Link>
        <Link href="/faq" className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full hover:bg-orange-200 transition-colors">
          FAQ
        </Link>
      </div>
    </div>
  )
}
