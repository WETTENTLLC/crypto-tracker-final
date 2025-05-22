import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CryptoTracker - Real-time Cryptocurrency Price Alerts & Portfolio Tracking',
  description: 'Track cryptocurrency prices, set custom price alerts, and manage your crypto portfolio with advanced analytics. Get instant notifications when prices hit your targets.',
  keywords: 'cryptocurrency, bitcoin, ethereum, crypto alerts, price tracker, portfolio management, crypto investment, blockchain, digital assets, crypto notifications',
  openGraph: {
    title: 'CryptoTracker - Real-time Cryptocurrency Price Alerts & Portfolio Tracking',
    description: 'Track cryptocurrency prices, set custom price alerts, and manage your crypto portfolio with advanced analytics. Get instant notifications when prices hit your targets.',
    url: 'https://cryptotracker.vercel.app',
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
    canonical: 'https://cryptotracker.vercel.app',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
