import { Metadata } from 'next'
import Script from 'next/script'
import AdvancedSEO from '../components/AdvancedSEO'
import { EnhancedFAQDisplay } from '../components/EnhancedFAQManager'

export const metadata: Metadata = {
  title: 'CryptoTracker FAQ - Frequently Asked Questions about Cryptocurrency Tracking',
  description: 'Find answers to common questions about CryptoTracker, cryptocurrency price alerts, portfolio management, and crypto investment strategies.',
  keywords: ['crypto FAQ', 'cryptocurrency questions', 'bitcoin FAQ', 'crypto tracker help', 'price alerts FAQ'],
}

const faqs = [
  {
    question: "What is CryptoTracker and how does it work?",
    answer: "CryptoTracker is a comprehensive cryptocurrency monitoring platform that provides real-time price tracking, custom alerts, and portfolio management tools. It connects to reliable market data sources like CoinGecko to deliver accurate, up-to-date information on over 10,000 cryptocurrencies. Users can set personalized price alerts, track their investments, and receive notifications when their target prices are reached."
  },
  {
    question: "How do I set up price alerts for cryptocurrencies?",
    answer: "Setting up price alerts is simple: 1) Navigate to the Alerts section, 2) Select the cryptocurrency you want to monitor, 3) Set your target price (above or below current price), 4) Choose your notification method (email, SMS, or push notification), 5) Save your alert. You'll receive instant notifications when the price hits your target."
  },
  {
    question: "Which cryptocurrencies does CryptoTracker support?",
    answer: "CryptoTracker supports over 10,000 cryptocurrencies including all major coins like Bitcoin (BTC), Ethereum (ETH), Binance Coin (BNB), Cardano (ADA), Solana (SOL), XRP, Polkadot (DOT), Dogecoin (DOGE), and thousands of altcoins. We continuously add new cryptocurrencies as they become available on major exchanges."
  },
  {
    question: "Is CryptoTracker free to use?",
    answer: "Yes! CryptoTracker offers a free tier that includes basic price tracking, limited alerts, and portfolio monitoring. For advanced features like unlimited alerts, advanced analytics, and premium support, we offer affordable premium plans starting at $9.99/month."
  },
  {
    question: "How accurate is the cryptocurrency price data?",
    answer: "Our price data comes from CoinGecko, one of the most reliable cryptocurrency data providers in the industry. Prices are updated in real-time and aggregated from multiple exchanges to ensure accuracy. However, prices may vary slightly between exchanges due to market dynamics and liquidity differences."
  },
  {
    question: "Can I track my cryptocurrency portfolio?",
    answer: "Absolutely! CryptoTracker includes a comprehensive portfolio management feature where you can add your holdings, track performance, view profit/loss calculations, and analyze your investment distribution. Your portfolio data is securely stored and only accessible to you."
  },
  {
    question: "What notification methods are available for price alerts?",
    answer: "CryptoTracker supports multiple notification methods: email notifications (instant delivery), SMS text messages (premium feature), push notifications through your browser, and in-app notifications. You can customize which method to use for each alert based on your preferences."
  },
  {
    question: "How secure is my data on CryptoTracker?",
    answer: "Security is our top priority. We use industry-standard encryption, secure servers, and never store sensitive information like private keys or exchange credentials. Your portfolio data and personal information are encrypted and protected with enterprise-grade security measures."
  },
  {
    question: "Can I connect my exchange accounts to CryptoTracker?",
    answer: "Currently, CryptoTracker focuses on monitoring and alerts rather than direct exchange integration. You can manually add your holdings to track your portfolio, but we don't require or store your exchange API keys for security reasons. This approach keeps your funds completely safe."
  },
  {
    question: "What's the difference between the free and premium plans?",
    answer: "The free plan includes basic price tracking, up to 5 price alerts, and simple portfolio monitoring. Premium plans offer unlimited alerts, advanced analytics, SMS notifications, priority support, historical data analysis, and advanced portfolio tools like profit/loss tracking and tax reporting features."
  },
  {
    question: "How do I cancel my premium subscription?",
    answer: "You can cancel your premium subscription at any time from your account settings. Go to Account → Subscription → Cancel Subscription. Your premium features will remain active until the end of your current billing period, after which your account will revert to the free plan."
  },
  {
    question: "Does CryptoTracker provide investment advice?",
    answer: "No, CryptoTracker is a data and monitoring tool, not an investment advisory service. We provide information and tracking capabilities, but all investment decisions are your responsibility. Always do your own research and consider consulting with financial advisors for investment guidance."
  },
  {
    question: "Can I use CryptoTracker on mobile devices?",
    answer: "Yes! CryptoTracker is fully responsive and works perfectly on mobile devices through your web browser. We also support progressive web app (PWA) features, allowing you to add CryptoTracker to your home screen for a native app-like experience."
  },
  {
    question: "How often are cryptocurrency prices updated?",
    answer: "Cryptocurrency prices are updated in real-time, typically every few seconds during active market hours. Our system continuously polls multiple data sources to ensure you have the most current pricing information available for making informed decisions."
  },
  {
    question: "What should I do if I'm not receiving alert notifications?",
    answer: "First, check your notification settings and ensure alerts are enabled. Verify your email address is correct and check spam folders. For SMS alerts, confirm your phone number is verified. If issues persist, contact our support team through the help section for personalized assistance."
  }
]

export default function FAQ() {
  return (
    <>
      <AdvancedSEO
        title="CryptoTracker FAQ - Frequently Asked Questions"
        description="Find answers to common questions about CryptoTracker, cryptocurrency price alerts, portfolio management, and crypto investment strategies."
        keywords="crypto FAQ, cryptocurrency questions, bitcoin FAQ, crypto tracker help, price alerts FAQ"
        type="article"
        section="Help"
        tags={['FAQ', 'help', 'support', 'cryptocurrency', 'price alerts']}
      />
      
      {/* FAQ Schema */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
      
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Find answers to common questions about CryptoTracker, cryptocurrency price alerts, 
              and portfolio management features.
            </p>
          </header>

          <div className="space-y-6" itemScope itemType="https://schema.org/FAQPage">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                itemScope 
                itemType="https://schema.org/Question"
                className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
              >
                <details className="group">
                  <summary className="cursor-pointer p-6 hover:bg-gray-750 transition-colors">
                    <div className="flex justify-between items-center">
                      <h2 
                        itemProp="name"
                        className="text-lg font-semibold text-blue-400 pr-4"
                      >
                        {faq.question}
                      </h2>
                      <svg 
                        className="w-6 h-6 text-gray-400 transform group-open:rotate-180 transition-transform duration-200 flex-shrink-0"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </summary>
                  <div 
                    itemScope 
                    itemType="https://schema.org/Answer"
                    className="px-6 pb-6"
                  >
                    <div className="border-t border-gray-700 pt-4">
                      <p 
                        itemProp="text"
                        className="text-gray-300 leading-relaxed"
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </details>
              </div>
            ))}
          </div>

          <section className="mt-16 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-8 border border-blue-500/30">
            <h2 className="text-2xl font-bold mb-4 text-center">Still Have Questions?</h2>
            <p className="text-center text-gray-300 mb-6">
              Can't find the answer you're looking for? Our support team is here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold text-center transition-colors"
              >
                Contact Support
              </a>
              <a 
                href="/learn" 
                className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold text-center transition-colors"
              >
                Browse Guides
              </a>
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Popular Topics</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Getting Started</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><a href="/learn/what-is-cryptocurrency" className="hover:text-green-400 transition-colors">What is Cryptocurrency?</a></li>
                  <li><a href="/learn/how-to-buy-bitcoin" className="hover:text-green-400 transition-colors">How to Buy Bitcoin</a></li>
                  <li><a href="/alerts" className="hover:text-green-400 transition-colors">Setting Up Alerts</a></li>
                </ul>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-blue-400 mb-3">Advanced Features</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><a href="/dashboard" className="hover:text-blue-400 transition-colors">Portfolio Tracking</a></li>
                  <li><a href="/premium" className="hover:text-blue-400 transition-colors">Premium Plans</a></li>
                  <li><a href="/api" className="hover:text-blue-400 transition-colors">API Documentation</a></li>
                </ul>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">Security & Safety</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><a href="/security" className="hover:text-purple-400 transition-colors">Security Measures</a></li>
                  <li><a href="/privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</a></li>
                  <li><a href="/terms" className="hover:text-purple-400 transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
