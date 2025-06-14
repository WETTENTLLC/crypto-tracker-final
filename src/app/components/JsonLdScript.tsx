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
            "url": "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app",
            "description": "Track cryptocurrency prices, set custom price alerts, and manage your crypto portfolio with advanced analytics.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/search?q={search_term_string}",
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
            "url": "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app",
            "logo": "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/logo.png",
            "sameAs": [
              "https://twitter.com/cryptotracker",
              "https://facebook.com/cryptotracker",
              "https://linkedin.com/company/cryptotracker"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "",
              "contactType": "customer service",
              "email": "support@crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app",
              "availableLanguage": "English"
            }
          })
        }}
      />
    </>
  );
}
