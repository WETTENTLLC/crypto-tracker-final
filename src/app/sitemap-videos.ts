import { MetadataRoute } from 'next'

export default function sitemapVideos(): MetadataRoute.Sitemap {
  const baseUrl = 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app'
  
  // Educational video content for SEO
  const videoContent = [
    {
      slug: 'bitcoin-price-prediction-tutorial',
      title: 'How to Use Bitcoin Price Prediction Tools',
      description: 'Learn how to analyze Bitcoin price trends and set effective price alerts using our crypto tracking platform.',
      duration: '180', // 3 minutes
      uploadDate: '2025-01-15T10:00:00Z',
      thumbnailUrl: `${baseUrl}/videos/thumbnails/bitcoin-prediction-tutorial.jpg`,
      videoUrl: `${baseUrl}/videos/bitcoin-prediction-tutorial.mp4`,
      category: 'Education'
    },
    {
      slug: 'portfolio-management-masterclass',
      title: 'Cryptocurrency Portfolio Management Masterclass',
      description: 'Complete guide to managing your cryptocurrency portfolio effectively with advanced tracking tools.',
      duration: '600', // 10 minutes
      uploadDate: '2025-01-20T14:00:00Z',
      thumbnailUrl: `${baseUrl}/videos/thumbnails/portfolio-masterclass.jpg`,
      videoUrl: `${baseUrl}/videos/portfolio-masterclass.mp4`,
      category: 'Tutorial'
    },
    {
      slug: 'defi-tracking-guide',
      title: 'How to Track DeFi Investments and Yields',
      description: 'Step-by-step guide to tracking your DeFi investments, yield farming, and liquidity pool returns.',
      duration: '420', // 7 minutes
      uploadDate: '2025-01-25T16:00:00Z',
      thumbnailUrl: `${baseUrl}/videos/thumbnails/defi-tracking.jpg`,
      videoUrl: `${baseUrl}/videos/defi-tracking.mp4`,
      category: 'DeFi'
    },
    {
      slug: 'price-alert-automation',
      title: 'Automate Your Crypto Price Alerts Like a Pro',
      description: 'Advanced techniques for setting up automated price alerts that actually work for cryptocurrency trading.',
      duration: '300', // 5 minutes
      uploadDate: '2025-02-01T12:00:00Z',
      thumbnailUrl: `${baseUrl}/videos/thumbnails/price-alerts.jpg`,
      videoUrl: `${baseUrl}/videos/price-alerts.mp4`,
      category: 'Trading'
    },
    {
      slug: 'nft-portfolio-tracking',
      title: 'Complete NFT Portfolio Tracking Tutorial',
      description: 'Learn how to track your NFT investments, floor prices, and collection performance in one dashboard.',
      duration: '480', // 8 minutes
      uploadDate: '2025-02-05T15:00:00Z',
      thumbnailUrl: `${baseUrl}/videos/thumbnails/nft-tracking.jpg`,
      videoUrl: `${baseUrl}/videos/nft-tracking.mp4`,
      category: 'NFT'
    }
  ]

  return videoContent.map(video => ({
    url: `${baseUrl}/videos/${video.slug}`,
    lastModified: video.uploadDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,    images: [video.thumbnailUrl],
    videos: [
      {
        title: video.title,
        description: video.description,
        thumbnail_loc: video.thumbnailUrl,
        duration: parseInt(video.duration),
        publicationDate: video.uploadDate,        familyFriendly: 'yes',
        live: 'no',
        requiresSubscription: 'no',
        uploader: {
          name: 'CryptoTracker',
          info: `${baseUrl}/about`
        },
        platform: {
          relationship: 'allow',
          content: 'web mobile'
        },
        restriction: {
          relationship: 'allow',
          content: 'US CA GB AU DE FR ES IT NL JP KR'
        },
        tag: `${video.category},cryptocurrency,tutorial,education,blockchain`,
        category: video.category,
        rating: 4.8,
        viewCount: Math.floor(Math.random() * 50000) + 10000, // Simulated view count
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
      }
    ]
  }))
}
