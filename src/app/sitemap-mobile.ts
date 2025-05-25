import { MetadataRoute } from 'next'

export default function sitemapMobile(): MetadataRoute.Sitemap {
  const baseUrl = 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app'
  const currentDate = new Date().toISOString()
  
  // Mobile-optimized pages with AMP versions
  const mobilePages = [
    {
      url: `${baseUrl}/mobile`,
      title: 'CryptoTracker Mobile App - Real-time Price Alerts',
      priority: 1.0,
      changeFrequency: 'daily' as const
    },
    {
      url: `${baseUrl}/mobile/dashboard`,
      title: 'Mobile Crypto Dashboard - Portfolio Tracking',
      priority: 0.9,
      changeFrequency: 'hourly' as const
    },
    {
      url: `${baseUrl}/mobile/alerts`,
      title: 'Mobile Price Alerts - Cryptocurrency Notifications',
      priority: 0.9,
      changeFrequency: 'hourly' as const
    },
    {
      url: `${baseUrl}/mobile/portfolio`,
      title: 'Mobile Portfolio Tracker - Crypto Asset Management',
      priority: 0.8,
      changeFrequency: 'daily' as const
    },
    {
      url: `${baseUrl}/mobile/charts`,
      title: 'Mobile Crypto Charts - Price Analysis Tools',
      priority: 0.8,
      changeFrequency: 'hourly' as const
    },
    {
      url: `${baseUrl}/mobile/news`,
      title: 'Mobile Crypto News - Latest Market Updates',
      priority: 0.7,
      changeFrequency: 'hourly' as const
    },
    {
      url: `${baseUrl}/mobile/calculator`,
      title: 'Mobile Crypto Calculator - Conversion Tools',
      priority: 0.7,
      changeFrequency: 'weekly' as const
    },
    {
      url: `${baseUrl}/mobile/watchlist`,
      title: 'Mobile Crypto Watchlist - Track Favorite Coins',
      priority: 0.8,
      changeFrequency: 'daily' as const
    },
    {
      url: `${baseUrl}/mobile/market`,
      title: 'Mobile Crypto Market - Real-time Market Data',
      priority: 0.8,
      changeFrequency: 'hourly' as const
    },
    {
      url: `${baseUrl}/mobile/learn`,
      title: 'Mobile Crypto Education - Learn on the Go',
      priority: 0.6,
      changeFrequency: 'weekly' as const
    }
  ]

  // Top cryptocurrencies optimized for mobile
  const topCryptosMobile = [
    'bitcoin', 'ethereum', 'binancecoin', 'cardano', 'solana', 'xrp', 'polkadot', 
    'dogecoin', 'avalanche-2', 'shiba-inu', 'polygon', 'litecoin', 'chainlink'
  ]

  const cryptoMobilePages = topCryptosMobile.map(crypto => ({
    url: `${baseUrl}/mobile/coin/${crypto}`,
    title: `${crypto.charAt(0).toUpperCase() + crypto.slice(1)} Mobile Tracker - Real-time Price & Alerts`,
    priority: 0.8,
    changeFrequency: 'hourly' as const
  }))

  // Mobile-specific educational content
  const mobileEducationalPages = [
    {
      url: `${baseUrl}/mobile/learn/quick-start`,
      title: 'Quick Start Guide - Mobile Crypto Tracking',
      priority: 0.7,
      changeFrequency: 'monthly' as const
    },
    {
      url: `${baseUrl}/mobile/learn/price-alerts`,
      title: 'Mobile Price Alerts Tutorial - Set Smart Notifications',
      priority: 0.7,
      changeFrequency: 'monthly' as const
    },
    {
      url: `${baseUrl}/mobile/learn/portfolio-setup`,
      title: 'Mobile Portfolio Setup - Track Your Crypto Assets',
      priority: 0.6,
      changeFrequency: 'monthly' as const
    },
    {
      url: `${baseUrl}/mobile/learn/security-tips`,
      title: 'Mobile Crypto Security - Protect Your Investments',
      priority: 0.6,
      changeFrequency: 'monthly' as const
    }
  ]

  const allMobilePages = [...mobilePages, ...cryptoMobilePages, ...mobileEducationalPages]

  return allMobilePages.map(page => ({
    url: page.url,
    lastModified: currentDate,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
    alternates: {
      languages: {
        'en': page.url,
        'es': page.url.replace('/mobile', '/es/mobile'),
        'fr': page.url.replace('/mobile', '/fr/mobile'),
        'de': page.url.replace('/mobile', '/de/mobile'),
        'ja': page.url.replace('/mobile', '/ja/mobile'),
        'ko': page.url.replace('/mobile', '/ko/mobile'),
        'zh': page.url.replace('/mobile', '/zh/mobile')
      }
    }
  }))
}
