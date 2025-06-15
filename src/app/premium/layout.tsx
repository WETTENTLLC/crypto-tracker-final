import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Premium Cryptocurrency Price Alerts - CryptoTracker Pro | Unlimited Notifications & Portfolio Analytics',
  description: 'Upgrade to CryptoTracker Premium for unlimited cryptocurrency price alerts, instant SMS/email notifications, advanced portfolio tracking, and ad-free experience. Join 25,000+ successful crypto traders. Limited time: 40% OFF - Only $9.99/month.',
  keywords: [
    'premium crypto alerts',
    'unlimited cryptocurrency notifications',
    'crypto portfolio tracker premium',
    'bitcoin price alerts premium',
    'ethereum notifications',
    'crypto trading alerts',
    'cryptocurrency sms alerts',
    'crypto email notifications',
    'advanced crypto charts',
    'crypto portfolio analytics',
    'premium crypto tools',
    'crypto investment tracker',
    'real-time crypto alerts',
    'crypto price monitoring',
    'professional crypto tracker',
    'crypto trading tools premium',
    'cryptocurrency investment platform',
    'crypto market alerts',
    'bitcoin investment alerts',
    'ethereum price tracker',
    'altcoin price alerts',
    'defi portfolio tracker',
    'crypto profit tracking',
    'trading signal alerts',
    'crypto market analysis',
    'cryptocurrency dashboard premium'
  ],
  openGraph: {
    title: 'Premium Cryptocurrency Price Alerts - CryptoTracker Pro | 40% OFF',
    description: 'Get unlimited crypto price alerts, instant notifications, and advanced portfolio tracking. Trusted by 25,000+ traders. Limited time offer: 40% OFF Premium subscription.',
    type: 'website',
    url: 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/premium',
    images: [
      {
        url: '/premium-og-image.png',
        width: 1200,
        height: 630,
        alt: 'CryptoTracker Premium - Advanced Cryptocurrency Price Alerts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Crypto Alerts - CryptoTracker Pro | 40% OFF',
    description: 'Unlimited cryptocurrency price alerts, SMS notifications, portfolio tracking. Join 25,000+ successful traders. Limited time: 40% OFF',
    images: ['/premium-twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/premium',
  },
}

export default function PremiumLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Enhanced Structured Data for Premium Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "CryptoTracker Premium Subscription",
            "description": "Premium cryptocurrency price alerts and portfolio tracking service with unlimited notifications, SMS alerts, and advanced analytics.",
            "brand": {
              "@type": "Brand",
              "name": "CryptoTracker"
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "USD",
              "price": "9.99",
              "priceValidUntil": "2025-06-08",
              "availability": "https://schema.org/InStock",
              "url": "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/premium",
              "seller": {
                "@type": "Organization",
                "name": "CryptoTracker"
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "2847",
              "bestRating": "5",
              "worstRating": "1"
            },
            "features": [
              "Unlimited cryptocurrency price alerts",
              "SMS and email notifications",
              "Advanced portfolio tracking",
              "Real-time market data",
              "Ad-free experience",
              "Priority customer support"
            ]
          })
        }}
      />
      
      {/* Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "CryptoTracker Premium",
            "description": "Professional cryptocurrency tracking and alert service for serious traders and investors.",
            "provider": {
              "@type": "Organization",
              "name": "CryptoTracker",
              "url": "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app"
            },
            "areaServed": "Worldwide",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "CryptoTracker Premium Plans",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Monthly Premium Plan"
                  },
                  "price": "9.99",
                  "priceCurrency": "USD"
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Quarterly Premium Plan"
                  },
                  "price": "24.99",
                  "priceCurrency": "USD"
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Annual Premium Plan"
                  },
                  "price": "89.99",
                  "priceCurrency": "USD"
                }
              ]
            }
          })
        }}
      />
      
      {children}
    </>
  )
}
