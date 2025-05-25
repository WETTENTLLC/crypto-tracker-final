import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app'

  // News/blog sitemap for fresh content SEO
  const newsItems = [
    {
      title: 'Bitcoin Price Analysis and Market Trends',
      slug: 'bitcoin-price-analysis-trends',
      publishedTime: '2025-05-24T10:00:00.000Z'
    },
    {
      title: 'Ethereum 2.0 Staking Guide and Rewards Calculator',
      slug: 'ethereum-staking-guide-rewards',
      publishedTime: '2025-05-24T09:00:00.000Z'
    },
    {
      title: 'Top 10 Cryptocurrencies to Watch in 2025',
      slug: 'top-cryptocurrencies-2025',
      publishedTime: '2025-05-23T15:00:00.000Z'
    },
    {
      title: 'DeFi Protocol Security and Risk Assessment',
      slug: 'defi-security-risk-assessment',
      publishedTime: '2025-05-23T12:00:00.000Z'
    },
    {
      title: 'NFT Market Analysis and Investment Strategies',
      slug: 'nft-market-analysis-strategies',
      publishedTime: '2025-05-23T08:00:00.000Z'
    },
    {
      title: 'Cryptocurrency Tax Guide 2025',
      slug: 'crypto-tax-guide-2025',
      publishedTime: '2025-05-22T16:00:00.000Z'
    },
    {
      title: 'Setting Up Your First Crypto Portfolio',
      slug: 'first-crypto-portfolio-setup',
      publishedTime: '2025-05-22T14:00:00.000Z'
    },
    {
      title: 'Layer 2 Solutions Comparison: Polygon vs Arbitrum vs Optimism',
      slug: 'layer-2-solutions-comparison',
      publishedTime: '2025-05-22T11:00:00.000Z'
    }
  ]

  return newsItems.map(item => ({
    url: `${baseUrl}/news/${item.slug}`,
    lastModified: item.publishedTime,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
}
