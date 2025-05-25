'use client'

import { useEffect } from 'react'

interface SocialShareProps {
  url?: string
  title?: string
  description?: string
  hashtags?: string[]
}

export default function SocialShareOptimization({ 
  url, 
  title, 
  description, 
  hashtags = [] 
}: SocialShareProps) {
  useEffect(() => {
    // Add social meta tags dynamically if not present
    const addMetaTag = (property: string, content: string) => {
      if (!document.querySelector(`meta[property="${property}"]`)) {
        const meta = document.createElement('meta')
        meta.setAttribute('property', property)
        meta.setAttribute('content', content)
        document.head.appendChild(meta)
      }
    }

    const currentUrl = url || window.location.href
    const currentTitle = title || document.title
    const currentDescription = description || 
      document.querySelector('meta[name="description"]')?.getAttribute('content') || 
      'Track cryptocurrency prices in real-time with CryptoTracker'

    // Open Graph optimization
    addMetaTag('og:url', currentUrl)
    addMetaTag('og:title', currentTitle)
    addMetaTag('og:description', currentDescription)
    addMetaTag('og:type', 'website')
    addMetaTag('og:image', `${window.location.origin}/og-image.png`)
    addMetaTag('og:image:width', '1200')
    addMetaTag('og:image:height', '630')
    addMetaTag('og:image:alt', currentTitle)

    // Twitter Card optimization
    addMetaTag('twitter:card', 'summary_large_image')
    addMetaTag('twitter:url', currentUrl)
    addMetaTag('twitter:title', currentTitle)
    addMetaTag('twitter:description', currentDescription)
    addMetaTag('twitter:image', `${window.location.origin}/twitter-image.png`)
    addMetaTag('twitter:site', '@cryptotracker')
    addMetaTag('twitter:creator', '@cryptotracker')

    // LinkedIn optimization
    addMetaTag('og:site_name', 'CryptoTracker')
    addMetaTag('og:locale', 'en_US')

    // Add structured data for articles if not present
    if (!document.querySelector('script[type="application/ld+json"]')) {
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": currentTitle,
        "description": currentDescription,
        "url": currentUrl,
        "publisher": {
          "@type": "Organization",
          "name": "CryptoTracker",
          "logo": {
            "@type": "ImageObject",
            "url": `${window.location.origin}/logo.svg`
          }
        }
      }

      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(structuredData)
      document.head.appendChild(script)
    }
  }, [url, title, description])

  const shareOnTwitter = () => {
    const text = encodeURIComponent(title || document.title)
    const shareUrl = encodeURIComponent(url || window.location.href)
    const hashtagString = hashtags.length > 0 ? `&hashtags=${hashtags.join(',')}` : ''
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}${hashtagString}`,
      '_blank',
      'width=600,height=400'
    )
  }

  const shareOnLinkedIn = () => {
    const shareUrl = encodeURIComponent(url || window.location.href)
    const shareTitle = encodeURIComponent(title || document.title)
    const shareDescription = encodeURIComponent(description || '')
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}&title=${shareTitle}&summary=${shareDescription}`,
      '_blank',
      'width=600,height=400'
    )
  }

  const shareOnFacebook = () => {
    const shareUrl = encodeURIComponent(url || window.location.href)
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      '_blank',
      'width=600,height=400'
    )
  }

  const shareOnReddit = () => {
    const shareUrl = encodeURIComponent(url || window.location.href)
    const shareTitle = encodeURIComponent(title || document.title)
    window.open(
      `https://reddit.com/submit?url=${shareUrl}&title=${shareTitle}`,
      '_blank',
      'width=600,height=400'
    )
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url || window.location.href)
      // You could add a toast notification here
      alert('Link copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className="bg-white rounded-lg shadow-lg p-4 border">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Share this page</h4>
        <div className="flex space-x-2">
          <button
            onClick={shareOnTwitter}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            title="Share on Twitter"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </button>

          <button
            onClick={shareOnLinkedIn}
            className="p-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors"
            title="Share on LinkedIn"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </button>

          <button
            onClick={shareOnFacebook}
            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            title="Share on Facebook"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>

          <button
            onClick={shareOnReddit}
            className="p-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
            title="Share on Reddit"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
            </svg>
          </button>

          <button
            onClick={copyToClipboard}
            className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            title="Copy link"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
