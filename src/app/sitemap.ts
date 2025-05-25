import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app'
  const currentDate = new Date().toISOString()
  
  // Top cryptocurrencies to include in sitemap
  const topCryptos = [
    'bitcoin', 'ethereum', 'binancecoin', 'cardano', 'solana', 'xrp', 'polkadot', 
    'dogecoin', 'avalanche-2', 'shiba-inu', 'polygon', 'litecoin', 'chainlink', 
    'bitcoin-cash', 'algorand', 'stellar', 'vechain', 'filecoin', 'tron', 'monero',
    'ethereum-classic', 'decentraland', 'sandbox', 'axie-infinity', 'pancakeswap-token',
    'uniswap', 'aave', 'compound-coin', 'maker', 'sushiswap', 'yearn-finance',
    'curve-dao-token', 'balancer', '1inch', 'kyber-network-crystal', 'synthetix-network-token',
    'matic-network', 'the-graph', 'basic-attention-token', 'enjincoin', 'chiliz'
  ]

  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'hourly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/alerts`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/premium`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/account`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }
  ]

  // Generate cryptocurrency pages
  const cryptoPages = topCryptos.map(crypto => ({
    url: `${baseUrl}/coin/${crypto}`,
    lastModified: currentDate,
    changeFrequency: 'hourly' as const,
    priority: 0.8,
  }))

  // Generate blog/educational pages (future expansion)
  const educationalPages = [
    'what-is-cryptocurrency',
    'how-to-buy-bitcoin',
    'ethereum-explained',
    'crypto-trading-guide',
    'defi-guide',
    'nft-guide',
    'crypto-security-tips',
    'portfolio-management-guide',
    'technical-analysis-guide',
    'crypto-tax-guide'
  ].map(slug => ({
    url: `${baseUrl}/learn/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Generate market category pages
  const categoryPages = [
    'defi',
    'nft',
    'gaming',
    'metaverse',
    'layer-1',
    'layer-2',
    'meme-coins',
    'stablecoins',
    'exchange-tokens',
    'privacy-coins'
  ].map(category => ({
    url: `${baseUrl}/category/${category}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  return [
    ...staticPages,
    ...cryptoPages,
    ...educationalPages,
    ...categoryPages
  ]
}
