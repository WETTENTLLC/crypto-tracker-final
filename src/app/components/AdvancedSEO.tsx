'use client';

import Head from 'next/head';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  author?: string;
  price?: string;
  currency?: string;
  availability?: string;
}

export default function AdvancedSEO({
  title,
  description,
  keywords,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  author,
  price,
  currency = 'USD',
  availability = 'InStock'
}: SEOProps) {
  const pathname = usePathname();
  const [canonicalUrl, setCanonicalUrl] = useState('');
  
  useEffect(() => {
    const baseUrl = 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app';
    setCanonicalUrl(`${baseUrl}${pathname}`);
  }, [pathname]);

  // Generate dynamic title and description based on page
  const generatePageSpecificContent = () => {
    const baseTitle = 'CryptoTracker';
    const baseDescription = 'Track cryptocurrency prices, set custom price alerts, and manage your crypto portfolio with advanced analytics.';
    
    let pageTitle = title || baseTitle;
    let pageDescription = description || baseDescription;
    let pageKeywords = keywords || 'cryptocurrency, bitcoin, ethereum, crypto alerts, price tracker, portfolio management';

    // Enhance based on current path
    if (pathname === '/') {
      pageTitle = `${baseTitle} - Real-time Cryptocurrency Price Alerts & Portfolio Tracking`;
      pageDescription = 'Track live cryptocurrency prices, set custom price alerts, and manage your crypto portfolio with advanced analytics. Get instant notifications when prices hit your targets. Free & Premium plans available.';
      pageKeywords = 'cryptocurrency tracker, bitcoin price alerts, ethereum tracker, crypto portfolio, cryptocurrency prices, digital asset management, crypto investment, blockchain tracker, altcoin prices, cryptocurrency dashboard, crypto market analysis, bitcoin alerts, ethereum alerts, DeFi tracking, NFT tracker, crypto news, cryptocurrency analytics, digital currency tracker, crypto price notifications, portfolio tracker, crypto trading tools';
    } else if (pathname.startsWith('/coin/')) {
      const coinId = pathname.split('/')[2];
      pageTitle = `${coinId.charAt(0).toUpperCase() + coinId.slice(1)} Price, Charts & Market Data | ${baseTitle}`;
      pageDescription = `Live ${coinId} price, historical charts, market cap, trading volume, and technical analysis. Set price alerts for ${coinId} and track your investment performance.`;
      pageKeywords = `${coinId} price, ${coinId} chart, ${coinId} market cap, ${coinId} trading volume, ${coinId} analysis, ${coinId} investment, ${coinId} alerts, ${coinId} tracker, cryptocurrency, blockchain`;
    } else if (pathname === '/dashboard') {
      pageTitle = `Crypto Portfolio Dashboard | ${baseTitle}`;
      pageDescription = 'Manage your cryptocurrency portfolio with advanced analytics, performance tracking, and real-time updates. Monitor your investments across multiple exchanges and wallets.';
      pageKeywords = 'crypto portfolio, cryptocurrency dashboard, portfolio tracker, crypto analytics, investment tracking, crypto performance, portfolio management, digital asset portfolio';
    } else if (pathname === '/premium') {
      pageTitle = `Premium Crypto Tracking Plans | ${baseTitle}`;
      pageDescription = 'Upgrade to premium for unlimited price alerts, advanced portfolio analytics, priority support, and exclusive features. Plans starting at $9.99/month.';
      pageKeywords = 'premium crypto tracker, unlimited alerts, advanced analytics, crypto subscription, premium features, professional crypto tools';
    } else if (pathname === '/alerts') {
      pageTitle = `Cryptocurrency Price Alerts | ${baseTitle}`;
      pageDescription = 'Set custom price alerts for any cryptocurrency. Get instant notifications via email, SMS, or push notifications when prices hit your targets.';
      pageKeywords = 'crypto price alerts, cryptocurrency notifications, bitcoin alerts, ethereum alerts, price notifications, crypto alarm, digital asset alerts';
    }

    return { pageTitle, pageDescription, pageKeywords };
  };

  const { pageTitle, pageDescription, pageKeywords } = generatePageSpecificContent();

  // Generate structured data for current page
  const generateStructuredData = () => {
    const baseStructuredData = {
      '@context': 'https://schema.org',
      '@type': type === 'article' ? 'Article' : 'WebPage',
      '@id': canonicalUrl,
      'url': canonicalUrl,
      'name': pageTitle,
      'description': pageDescription,
      'publisher': {
        '@type': 'Organization',
        '@id': 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/#organization'
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': canonicalUrl
      },
      'inLanguage': 'en-US',
      'dateModified': modifiedTime || new Date().toISOString(),
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': generateBreadcrumbs()
      }
    };

    if (type === 'article' && publishedTime) {
      Object.assign(baseStructuredData, {
        'datePublished': publishedTime,
        'author': {
          '@type': 'Organization',
          'name': author || 'CryptoTracker Team'
        },
        'articleSection': section || 'Cryptocurrency',
        'keywords': tags.join(', ')
      });
    }

    if (price) {
      Object.assign(baseStructuredData, {
        '@type': 'Product',
        'offers': {
          '@type': 'Offer',
          'price': price,
          'priceCurrency': currency,
          'availability': `https://schema.org/${availability}`,
          'seller': {
            '@type': 'Organization',
            '@id': 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/#organization'
          }
        }
      });
    }

    return baseStructuredData;
  };

  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(segment => segment);
    const breadcrumbs = [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app'
      }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      breadcrumbs.push({
        '@type': 'ListItem',
        'position': index + 2,
        'name': segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' '),
        'item': `https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app${currentPath}`
      });
    });

    return breadcrumbs;
  };

  return (
    <>
      <Head>
        {/* Enhanced Meta Tags */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        <meta name="author" content={author || 'CryptoTracker Team'} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content={type} />
        <meta property="og:image" content={image || 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/og-image.png'} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="CryptoTracker" />
        <meta property="og:locale" content="en_US" />
        
        {type === 'article' && publishedTime && (
          <>
            <meta property="article:published_time" content={publishedTime} />
            <meta property="article:modified_time" content={modifiedTime || new Date().toISOString()} />
            <meta property="article:section" content={section || 'Cryptocurrency'} />
            <meta property="article:author" content={author || 'CryptoTracker Team'} />
            {tags.map((tag, index) => (
              <meta key={index} property="article:tag" content={tag} />
            ))}
          </>
        )}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={image || 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/twitter-image.png'} />
        <meta name="twitter:site" content="@cryptotracker" />
        <meta name="twitter:creator" content="@cryptotracker" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#1f2937" />
        <meta name="msapplication-TileColor" content="#1f2937" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CryptoTracker" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Geographic Tags */}
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="Global" />
        <meta name="ICBM" content="0.0, 0.0" />
        
        {/* Language and Content Tags */}
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="language" content="English" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="1 days" />
        
        {/* Preconnect for Performance */}
        <link rel="preconnect" href="https://api.coingecko.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Prefetch DNS for External Resources */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//coin-images.coingecko.com" />
      </Head>

      {/* Enhanced Structured Data */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData())
        }}
      />

      {/* FAQ Schema for relevant pages */}
      {pathname === '/' && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              'mainEntity': [
                {
                  '@type': 'Question',
                  'name': 'What is CryptoTracker?',
                  'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'CryptoTracker is a comprehensive cryptocurrency tracking platform that provides real-time price alerts, portfolio management, and advanced analytics for crypto investors.'
                  }
                },
                {
                  '@type': 'Question',
                  'name': 'How do I set up price alerts?',
                  'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'You can set up price alerts by selecting any cryptocurrency, clicking the alert icon, and setting your target price. You\'ll receive notifications via email, SMS, or push notifications when the price is reached.'
                  }
                },
                {
                  '@type': 'Question',
                  'name': 'Is CryptoTracker free to use?',
                  'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'CryptoTracker offers both free and premium plans. The free plan includes basic tracking and limited alerts, while premium plans offer unlimited alerts, advanced analytics, and additional features starting at $9.99/month.'
                  }
                },
                {
                  '@type': 'Question',
                  'name': 'Which cryptocurrencies are supported?',
                  'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'CryptoTracker supports over 10,000 cryptocurrencies including Bitcoin, Ethereum, and all major altcoins. We get our data from CoinGecko API for the most accurate and up-to-date information.'
                  }
                }
              ]
            })
          }}
        />
      )}

      {/* HowTo Schema for tutorial pages */}
      {pathname === '/alerts' && (
        <Script
          id="howto-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'HowTo',
              'name': 'How to Set Up Cryptocurrency Price Alerts',
              'description': 'Learn how to set up custom price alerts for any cryptocurrency using CryptoTracker',
              'step': [
                {
                  '@type': 'HowToStep',
                  'name': 'Select Cryptocurrency',
                  'text': 'Choose the cryptocurrency you want to track from our list of 10,000+ supported coins.'
                },
                {
                  '@type': 'HowToStep',
                  'name': 'Set Target Price',
                  'text': 'Enter your target price and choose whether you want to be alerted when the price goes above or below this level.'
                },
                {
                  '@type': 'HowToStep',
                  'name': 'Choose Notification Method',
                  'text': 'Select how you want to be notified: email, SMS, or push notification.'
                },
                {
                  '@type': 'HowToStep',
                  'name': 'Activate Alert',
                  'text': 'Save your alert and we\'ll monitor the price 24/7 and notify you when your target is reached.'
                }
              ]
            })
          }}
        />
      )}
    </>
  );
}
