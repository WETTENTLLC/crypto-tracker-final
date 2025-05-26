import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Complete Guide to DeFi (Decentralized Finance) 2025 | CryptoTracker',
  description: 'Learn everything about DeFi - decentralized finance protocols, yield farming, liquidity mining, DeFi tokens, risks, and opportunities in the DeFi ecosystem.',
  keywords: [
    'DeFi guide',
    'decentralized finance',
    'yield farming',
    'liquidity mining',
    'DeFi protocols',
    'DeFi tokens',
    'DeFi investing',
    'smart contracts',
    'decentralized exchanges',
    'DeFi risks'
  ],
  openGraph: {
    title: 'Complete Guide to DeFi (Decentralized Finance) 2025',
    description: 'Learn everything about DeFi - protocols, yield farming, liquidity mining, and opportunities in decentralized finance.',
    images: ['/og-defi-guide.png'],
  },
  alternates: {
    canonical: '/learn/defi-guide',
  },
}

export default function DeFiGuide() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["Article", "HowTo"],
            "headline": "Complete Guide to DeFi (Decentralized Finance) 2025",
            "description": "Learn everything about DeFi - decentralized finance protocols, yield farming, liquidity mining, and investment opportunities.",
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
            "mainEntityOfPage": "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/learn/defi-guide",
            "image": "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/og-defi-guide.png",
            "step": [
              {
                "@type": "HowToStep",
                "name": "Understanding DeFi Basics",
                "text": "Learn what decentralized finance is and how it differs from traditional finance."
              },
              {
                "@type": "HowToStep",
                "name": "Choose DeFi Protocols",
                "text": "Research and select reputable DeFi protocols based on your risk tolerance."
              },
              {
                "@type": "HowToStep",
                "name": "Start with Simple Strategies",
                "text": "Begin with basic lending and borrowing before moving to advanced strategies."
              }
            ]
          })
        }}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Complete Guide to DeFi (Decentralized Finance) 2025
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Discover the revolutionary world of decentralized finance (DeFi). Learn about protocols, 
            yield farming, liquidity mining, and how to safely participate in the DeFi ecosystem.
          </p>
        </header>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">$200B+</div>
            <div className="text-gray-600">Total Value Locked in DeFi</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">3000+</div>
            <div className="text-gray-600">DeFi Protocols</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
            <div className="text-gray-600">Always Accessible</div>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What is DeFi?</h2>
            
            <p className="text-gray-600 mb-6">
              Decentralized Finance (DeFi) refers to a blockchain-based form of finance that does not 
              rely on central financial intermediaries such as brokerages, exchanges, or banks. 
              Instead, it utilizes smart contracts on blockchains, primarily Ethereum.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Key Benefits of DeFi</h3>
              <ul className="text-blue-700 space-y-1">
                <li>• Permissionless access - anyone can participate</li>
                <li>• Transparency - all transactions are on-chain</li>
                <li>• Composability - protocols can interact with each other</li>
                <li>• Global accessibility - no geographic restrictions</li>
              </ul>
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Core DeFi Services</h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Lending & Borrowing</h4>
                <p className="text-gray-600 mb-3">
                  Earn interest by lending your crypto or borrow against your holdings.
                </p>
                <p className="text-sm text-blue-600 font-medium">Popular: Aave, Compound, MakerDAO</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Decentralized Exchanges</h4>
                <p className="text-gray-600 mb-3">
                  Trade cryptocurrencies without intermediaries using automated market makers.
                </p>
                <p className="text-sm text-blue-600 font-medium">Popular: Uniswap, SushiSwap, PancakeSwap</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Yield Farming</h4>
                <p className="text-gray-600 mb-3">
                  Earn rewards by providing liquidity to DeFi protocols.
                </p>
                <p className="text-sm text-blue-600 font-medium">Popular: Curve, Yearn Finance, Convex</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Synthetic Assets</h4>
                <p className="text-gray-600 mb-3">
                  Trade synthetic versions of real-world assets on-chain.
                </p>
                <p className="text-sm text-blue-600 font-medium">Popular: Synthetix, Mirror Protocol</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Getting Started with DeFi</h2>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Before You Start</h3>
              <p className="text-yellow-700">
                DeFi involves significant risks including smart contract vulnerabilities, 
                impermanent loss, and high gas fees. Only invest what you can afford to lose.
              </p>
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Step-by-Step Guide</h3>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Set Up a Web3 Wallet</h4>
                  <p className="text-gray-600">
                    Download MetaMask, Trust Wallet, or another Web3 wallet. Secure your seed phrase safely.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Fund Your Wallet</h4>
                  <p className="text-gray-600">
                    Transfer ETH and other tokens to your wallet. Keep ETH for gas fees.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Research Protocols</h4>
                  <p className="text-gray-600">
                    Study different DeFi protocols, their security audits, and track records.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Start Small</h4>
                  <p className="text-gray-600">
                    Begin with small amounts and simple strategies like lending on established platforms.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Popular DeFi Strategies</h2>
            
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-lg shadow-md border">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Liquidity Provision</h3>
                <p className="text-gray-600 mb-4">
                  Provide liquidity to decentralized exchanges and earn fees from trades.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Pros:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Earn trading fees</li>
                      <li>• Often receive additional token rewards</li>
                      <li>• Relatively passive income</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">Cons:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Impermanent loss risk</li>
                      <li>• Smart contract risk</li>
                      <li>• Gas fees for transactions</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md border">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Yield Farming</h3>
                <p className="text-gray-600 mb-4">
                  Move funds between protocols to maximize yield through token rewards.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Pros:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Potentially high returns</li>
                      <li>• Early access to new tokens</li>
                      <li>• Compound growth opportunities</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">Cons:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• High gas fees</li>
                      <li>• Complex strategies</li>
                      <li>• Rug pull risks</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md border">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Staking</h3>
                <p className="text-gray-600 mb-4">
                  Lock up tokens to secure networks and earn staking rewards.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Pros:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Predictable returns</li>
                      <li>• Lower risk than yield farming</li>
                      <li>• Support network security</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">Cons:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Lock-up periods</li>
                      <li>• Slashing risks</li>
                      <li>• Lower yields than farming</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">DeFi Risks and Safety</h2>
            
            <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Major Risks</h3>
              <ul className="text-red-700 space-y-2">
                <li>• <strong>Smart Contract Risk:</strong> Bugs or exploits in protocol code</li>
                <li>• <strong>Impermanent Loss:</strong> Loss from providing liquidity to volatile pairs</li>
                <li>• <strong>Rug Pulls:</strong> Developers abandoning projects with user funds</li>
                <li>• <strong>Regulatory Risk:</strong> Changing government regulations</li>
              </ul>
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Safety Best Practices</h3>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
              <li>Only use audited protocols with good track records</li>
              <li>Start with small amounts to test strategies</li>
              <li>Diversify across multiple protocols and chains</li>
              <li>Keep emergency funds in stable assets</li>
              <li>Stay updated on protocol developments and risks</li>
              <li>Use hardware wallets for large amounts</li>
            </ul>
          </section>
        </article>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-lg mt-12">
          <h3 className="text-2xl font-bold mb-4">Track Your DeFi Portfolio</h3>
          <p className="text-purple-100 mb-6">
            Monitor your DeFi investments, track yields, and get alerts for protocol updates with CryptoTracker.
          </p>
          <Link href="/" className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Tracking DeFi
          </Link>
        </div>
      </div>
    </div>
  )
}
