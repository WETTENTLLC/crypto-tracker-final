import { useEffect } from 'react';
import Script from 'next/script';

export default function JsonLdScript() {
  return (
    <>
      <Script
        id="schema-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "CryptoTracker",
            "url": "https://cryptotracker.vercel.app",
            "description": "Track cryptocurrency prices, set custom price alerts, and manage your crypto portfolio with advanced analytics.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://cryptotracker.vercel.app/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      <Script
        id="schema-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "CryptoTracker",
            "url": "https://cryptotracker.vercel.app",
            "logo": "https://cryptotracker.vercel.app/logo.png",
            "sameAs": [
              "https://twitter.com/cryptotracker",
              "https://facebook.com/cryptotracker",
              "https://linkedin.com/company/cryptotracker"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "",
              "contactType": "customer service",
              "email": "support@cryptotracker.vercel.app",
              "availableLanguage": "English"
            }
          })
        }}
      />
    </>
  );
}
