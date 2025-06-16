import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import WebVitalsMonitor from './components/WebVitalsMonitor'
import NavigationFix from './utils/NavigationFix'
import ClientDynamicComponents from '../components/ClientDynamicComponents'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' }
  ],
  colorScheme: 'dark light'
}

export const metadata: Metadata = {
  title: {
    default: 'CryptoTracker - Real-time Cryptocurrency Price Alerts & Portfolio Tracking',
    template: '%s | CryptoTracker - Crypto Price Alerts & Portfolio Management'
  },
  description: 'Track cryptocurrency prices in real-time, set custom price alerts, and manage your crypto portfolio with advanced analytics. Get instant notifications when prices hit your targets. Supports 10,000+ cryptocurrencies including Bitcoin, Ethereum, and all major altcoins. Free & Premium plans available.',
  keywords: [
    'cryptocurrency tracker',
    'bitcoin price alerts',
    'ethereum tracker', 
    'crypto portfolio',
    'cryptocurrency prices',
    'digital asset management',
    'crypto investment',
    'blockchain tracker',
    'altcoin prices',
    'cryptocurrency dashboard',
    'crypto market analysis',
    'bitcoin alerts',
    'ethereum alerts',
    'DeFi tracking',
    'NFT tracker',
    'crypto news',
    'cryptocurrency analytics',
    'digital currency tracker',
    'crypto price notifications',
    'portfolio tracker',
    'crypto trading tools',
    'real-time crypto data',
    'cryptocurrency API',
    'crypto market cap',
    'trading volume',
    'price charts',
    'technical analysis',
    'crypto signals',
    'cryptocurrency exchange',
    'crypto wallet tracker'
  ],
  authors: [
    { name: 'CryptoTracker Team', url: 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app' }
  ],
  creator: 'CryptoTracker Team',
  publisher: 'CryptoTracker',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'es-ES': '/es-ES',
      'fr-FR': '/fr-FR',
      'de-DE': '/de-DE',
      'ja-JP': '/ja-JP',
      'ko-KR': '/ko-KR',
      'zh-CN': '/zh-CN',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app',
    siteName: 'CryptoTracker',
    title: 'CryptoTracker - Real-time Cryptocurrency Price Alerts & Portfolio Tracking',
    description: 'Track cryptocurrency prices in real-time, set custom price alerts, and manage your crypto portfolio with advanced analytics. Get instant notifications when prices hit your targets.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CryptoTracker - Real-time Cryptocurrency Price Alerts & Portfolio Tracking',
        type: 'image/png',
      },
      {
        url: '/og-image-square.png',
        width: 1200,
        height: 1200,
        alt: 'CryptoTracker - Cryptocurrency Portfolio Management',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@cryptotracker',
    creator: '@cryptotracker',
    title: 'CryptoTracker - Real-time Cryptocurrency Price Alerts & Portfolio Tracking',
    description: 'Track cryptocurrency prices in real-time, set custom price alerts, and manage your crypto portfolio with advanced analytics.',
    images: [
      {
        url: '/twitter-image.png',
        alt: 'CryptoTracker - Cryptocurrency Price Alerts & Portfolio Management',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'icon', url: '/favicon.ico' },
      { rel: 'manifest', url: '/manifest.json' },
    ],
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    yahoo: 'yahoo-verification-code',
    other: {
      'msvalidate.01': 'bing-verification-code',
      'facebook-domain-verification': 'facebook-verification-code',
    },
  },
  category: 'finance',
  classification: 'Finance, Cryptocurrency, Investment Tools',
  referrer: 'origin-when-cross-origin',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect for Performance */}
        <link rel="preconnect" href="https://api.coingecko.com" />
        <link rel="preconnect" href="https://coin-images.coingecko.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
        
        {/* Enhanced Structured Data */}
        <Script
          id="enhanced-structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/#organization",
                  "name": "CryptoTracker",
                  "url": "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/logo.png",
                    "width": 512,
                    "height": 512
                  },
                  "description": "Leading cryptocurrency tracking platform providing real-time price alerts, portfolio management, and advanced analytics for crypto investors worldwide.",
                  "foundingDate": "2025-01-01",
                  "sameAs": [
                    "https://twitter.com/cryptotracker",
                    "https://facebook.com/cryptotracker",
                    "https://linkedin.com/company/cryptotracker"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/#website",
                  "url": "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app",
                  "name": "CryptoTracker - Real-time Cryptocurrency Price Alerts & Portfolio Tracking",
                  "description": "Track cryptocurrency prices in real-time, set custom price alerts, and manage your crypto portfolio with advanced analytics.",
                  "publisher": {
                    "@id": "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/#organization"
                  },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                      "@type": "EntryPoint",
                      "urlTemplate": "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/search?q={search_term_string}"
                    },
                    "query-input": "required name=search_term_string"
                  }
                }
              ]
            })
          }}
        />
        
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX', {
              page_title: document.title,
              page_location: window.location.href,
              custom_map: {
                'dimension1': 'user_type',
                'dimension2': 'subscription_plan'
              }
            });
          `}
        </Script>
        
        {/* Google AdSense - For Monetization */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        
        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "CLARITY_PROJECT_ID");
          `}
        </Script>
        
        {/* Hotjar */}
        <Script id="hotjar" strategy="afterInteractive">
          {`
            (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:HOTJAR_ID,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}
        </Script>
        
        {/* Core Web Vitals */}
        <Script id="web-vitals" strategy="afterInteractive">
          {`
            import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
            
            function sendToAnalytics(metric) {
              if (typeof gtag !== 'undefined') {
                gtag('event', metric.name, {
                  event_category: 'Web Vitals',
                  value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                  event_label: metric.id,
                  non_interaction: true,
                });
              }
            }
            
            getCLS(sendToAnalytics);
            getFID(sendToAnalytics);
            getFCP(sendToAnalytics);
            getLCP(sendToAnalytics);
            getTTFB(sendToAnalytics);
          `}
        </Script>
      </head>
      <body className={inter.className} itemScope itemType="https://schema.org/WebPage">
        <NavigationFix />
        
        {/* Client-side dynamic components wrapper */}
        <ClientDynamicComponents>
          {children}
        </ClientDynamicComponents>
        
        <WebVitalsMonitor />
        
        {/* Service Worker Registration */}
        <Script id="service-worker" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('SW registered: ', registration);
                  })
                  .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
              });
            }
          `}
        </Script>
      </body>
    </html>
  )
}
