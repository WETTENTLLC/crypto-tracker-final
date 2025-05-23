import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import MCPUserAcquisitionAutomation from './components/MCPUserAcquisitionAutomation'
import MCPNotificationCenter from './components/MCPNotificationCenter'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CryptoTracker - Real-time Cryptocurrency Price Alerts & Portfolio Tracking',
  description: 'Track cryptocurrency prices, set custom price alerts, and manage your crypto portfolio with advanced analytics. Get instant notifications when prices hit your targets.',
  keywords: 'cryptocurrency, bitcoin, ethereum, crypto alerts, price tracker, portfolio management, crypto investment, blockchain, digital assets, crypto notifications',
  metadataBase: new URL('https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app'),
  openGraph: {
    title: 'CryptoTracker - Real-time Cryptocurrency Price Alerts & Portfolio Tracking',
    description: 'Track cryptocurrency prices, set custom price alerts, and manage your crypto portfolio with advanced analytics. Get instant notifications when prices hit your targets.',
    url: 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app',
    siteName: 'CryptoTracker',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CryptoTracker - Cryptocurrency Price Alerts & Portfolio Tracking',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CryptoTracker - Real-time Cryptocurrency Price Alerts & Portfolio Tracking',
    description: 'Track cryptocurrency prices, set custom price alerts, and manage your crypto portfolio with advanced analytics.',
    images: ['/twitter-image.png'],
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
    canonical: 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app',
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
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
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
        {/* Google AdSense - For Monetization */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>
        <MCPUserAcquisitionAutomation />
        <MCPNotificationCenter />
        {children}
      </body>
    </html>
  )
}
