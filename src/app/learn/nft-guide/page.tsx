import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NFT Guide for Beginners 2025 - Everything You Need to Know | CryptoTracker',
  description: 'Complete guide to NFTs (Non-Fungible Tokens) - learn what NFTs are, how they work, popular marketplaces, investment strategies, and future outlook for digital collectibles.',
  keywords: [
    'NFT guide',
    'non-fungible tokens',
    'NFT investing',
    'NFT marketplace',
    'digital collectibles',
    'NFT art',
    'blockchain art',
    'crypto collectibles',
    'OpenSea',
    'NFT trading'
  ],
  openGraph: {
    title: 'NFT Guide for Beginners 2025 - Everything You Need to Know',
    description: 'Complete guide to NFTs covering what they are, how they work, marketplaces, and investment strategies.',
    images: ['/og-nft-guide.png'],
  },
  alternates: {
    canonical: '/learn/nft-guide',
  },
}

export default function NFTGuide() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "NFT Guide for Beginners 2025 - Everything You Need to Know",
            "description": "Complete guide to NFTs covering what they are, how they work, popular marketplaces, and investment strategies.",
            "author": {
              "@type": "Organization",
              "name": "CryptoTracker"
            },
            "publisher": {
              "@type": "Organization",
              "name": "CryptoTracker",
              "logo": {
                "@type": "ImageObject",
                "url": "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/logo.svg"
              }
            },
            "datePublished": "2025-05-25",
            "dateModified": "2025-05-25",
            "mainEntityOfPage": "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/learn/nft-guide",
            "image": "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/og-nft-guide.png",
            "articleSection": "Technology",
            "keywords": "NFT, non-fungible tokens, digital collectibles, blockchain art, cryptocurrency"
          })
        }}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumbs */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2">
            <li><a href="/" className="text-blue-600 hover:underline">Home</a></li>
            <li className="text-gray-500">/</li>
            <li><a href="/learn" className="text-blue-600 hover:underline">Learn</a></li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-900">NFT Guide</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            NFT Guide for Beginners 2025
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Everything you need to know about Non-Fungible Tokens (NFTs), from basics to advanced 
            strategies. Learn about digital ownership, popular marketplaces, and investment opportunities.
          </p>
          <div className="mt-6 flex items-center space-x-4 text-sm text-gray-500">
            <span>Last updated: May 25, 2025</span>
            <span>•</span>
            <span>12 min read</span>
          </div>
        </header>

        {/* Market Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">$23B+</div>
            <div className="text-gray-600">NFT Market Volume (2024)</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">10M+</div>
            <div className="text-gray-600">NFT Collections</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">50M+</div>
            <div className="text-gray-600">NFT Holders</div>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What are NFTs?</h2>
            
            <p className="text-gray-600 mb-6">
              Non-Fungible Tokens (NFTs) are unique digital assets that represent ownership of specific 
              items or pieces of content on a blockchain. Unlike cryptocurrencies like Bitcoin or Ethereum, 
              which are fungible (each unit is identical and interchangeable), NFTs are unique and cannot 
              be replicated.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Key Characteristics of NFTs</h3>
              <ul className="text-blue-700 space-y-1">
                <li>• <strong>Unique:</strong> Each NFT has a distinct identifier</li>
                <li>• <strong>Indivisible:</strong> Cannot be broken down into smaller units</li>
                <li>• <strong>Verifiable:</strong> Ownership is recorded on the blockchain</li>
                <li>• <strong>Transferable:</strong> Can be bought, sold, and traded</li>
              </ul>
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Types of NFTs</h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Digital Art</h4>
                <p className="text-gray-600 mb-3">
                  The most popular category, including artwork, illustrations, and generative art.
                </p>
                <p className="text-sm text-purple-600 font-medium">Examples: Bored Ape Yacht Club, CryptoPunks</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Gaming Items</h4>
                <p className="text-gray-600 mb-3">
                  In-game assets, characters, weapons, and virtual land in metaverse games.
                </p>
                <p className="text-sm text-purple-600 font-medium">Examples: Axie Infinity, The Sandbox</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Collectibles</h4>
                <p className="text-gray-600 mb-3">
                  Digital trading cards, sports memorabilia, and other collectible items.
                </p>
                <p className="text-sm text-purple-600 font-medium">Examples: NBA Top Shot, Topps Digital</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Utility NFTs</h4>
                <p className="text-gray-600 mb-3">
                  NFTs that provide access to services, events, or exclusive content.
                </p>
                <p className="text-sm text-purple-600 font-medium">Examples: Membership tokens, Event tickets</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Buy NFTs</h2>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Set Up a Digital Wallet</h4>
                  <p className="text-gray-600">
                    Install MetaMask, Trust Wallet, or another Web3 wallet that supports NFTs.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Fund Your Wallet</h4>
                  <p className="text-gray-600">
                    Purchase Ethereum (ETH) or the native currency of your chosen blockchain.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Choose an NFT Marketplace</h4>
                  <p className="text-gray-600">
                    Connect your wallet to a marketplace like OpenSea, Rarible, or Foundation.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Browse and Purchase</h4>
                  <p className="text-gray-600">
                    Search for NFTs, research the creator and collection, then make your purchase.
                  </p>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Popular NFT Marketplaces</h3>
            
            <div className="space-y-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xl font-semibold text-gray-900">OpenSea</h4>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Largest</span>
                </div>
                <p className="text-gray-600 mb-3">
                  The world's largest NFT marketplace with the widest selection of digital assets.
                </p>
                <div className="text-sm text-gray-500">
                  • Supports multiple blockchains • Low fees • User-friendly interface
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xl font-semibold text-gray-900">Rarible</h4>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Community-Owned</span>
                </div>
                <p className="text-gray-600 mb-3">
                  Community-owned marketplace with governance token (RARI) for users.
                </p>
                <div className="text-sm text-gray-500">
                  • Create and sell NFTs • RARI token rewards • Decentralized governance
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xl font-semibold text-gray-900">Foundation</h4>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Curated</span>
                </div>
                <p className="text-gray-600 mb-3">
                  Invitation-only platform focused on high-quality digital art and creators.
                </p>
                <div className="text-sm text-gray-500">
                  • Curated artists • Auction format • Premium art focus
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">NFT Investment Strategies</h2>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Investment Warning</h3>
              <p className="text-yellow-700">
                NFT investing is highly speculative and risky. The market is volatile, and most NFTs 
                may lose value over time. Only invest what you can afford to lose.
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-lg shadow-md border">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Blue-Chip Collections</h3>
                <p className="text-gray-600 mb-4">
                  Invest in established, high-value collections with strong communities and track records.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Pros:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• More stable value</li>
                      <li>• Strong communities</li>
                      <li>• Brand recognition</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">Cons:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• High entry costs</li>
                      <li>• Limited upside potential</li>
                      <li>• Market saturation</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md border">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Utility-Focused NFTs</h3>
                <p className="text-gray-600 mb-4">
                  Focus on NFTs that provide actual utility, access, or benefits beyond just ownership.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Examples:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Gaming assets</li>
                      <li>• Membership tokens</li>
                      <li>• Access passes</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-2">Benefits:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Real-world value</li>
                      <li>• Ongoing utility</li>
                      <li>• Community benefits</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">NFT Risks and Considerations</h2>
            
            <div className="space-y-6">
              <div className="bg-red-50 border-l-4 border-red-400 p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Major Risks</h3>
                <ul className="text-red-700 space-y-2">
                  <li>• <strong>Market Volatility:</strong> NFT prices can fluctuate dramatically</li>
                  <li>• <strong>Liquidity Issues:</strong> May be difficult to sell when needed</li>
                  <li>• <strong>Copyright Concerns:</strong> Ownership doesn't always mean copyright</li>
                  <li>• <strong>Technical Risks:</strong> Smart contract vulnerabilities</li>
                  <li>• <strong>Platform Dependency:</strong> Reliance on marketplace platforms</li>
                </ul>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Due Diligence Tips</h3>
                <ul className="text-blue-700 space-y-2">
                  <li>• Research the creator and their previous work</li>
                  <li>• Check the collection's roadmap and community</li>
                  <li>• Verify the authenticity and rarity of the NFT</li>
                  <li>• Understand the rights you're purchasing</li>
                  <li>• Consider long-term value and utility</li>
                </ul>
              </div>
            </div>
          </section>
        </article>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-lg mt-12">
          <h3 className="text-2xl font-bold mb-4">Track NFT Floor Prices</h3>
          <p className="text-purple-100 mb-6">
            Monitor NFT collection floor prices, track your NFT portfolio value, and get alerts 
            for price movements with CryptoTracker's NFT tracking features.
          </p>
          <a href="/" className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Tracking NFTs
          </a>
        </div>

        {/* Related Articles */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <a href="/learn/defi-guide" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">DeFi Guide</h4>
              <p className="text-gray-600 text-sm">Learn about decentralized finance and yield farming.</p>
            </a>
            <a href="/learn/cryptocurrency-investing-guide" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Crypto Investing Guide</h4>
              <p className="text-gray-600 text-sm">Complete guide to cryptocurrency investing strategies.</p>
            </a>
            <a href="/learn/what-is-cryptocurrency" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">What is Cryptocurrency?</h4>
              <p className="text-gray-600 text-sm">Learn the basics of digital currencies and blockchain.</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
