'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NewsletterSignup from '../../components/NewsletterSignup';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);
  
  // Track real page views
  useEffect(() => {
    // Get actual visitor count from analytics API
    const fetchVisitorCount = async () => {
      try {
        const response = await fetch('/api/analytics');
        if (response.ok) {
          const data = await response.json();
          // Use real visitor count or fallback to 1 if no data
          setVisitorCount(data.last24h.pageViews || 1);
        }
      } catch (error) {
        console.error('Failed to fetch visitor count:', error);
        // Fallback to 1 visitor if API fails
        setVisitorCount(1);
      }
    };
    
    fetchVisitorCount();
    
    // Track this page view
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'page_view',
        page: '/landing'
      })
    }).catch(err => console.error('Failed to track page view:', err));
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="bg-yellow-400 text-black px-4 py-2 rounded-full inline-block mb-6">
              <span className="font-bold">⚡ LIMITED TIME: 40% OFF PREMIUM ⚡</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Never Miss a<br />
              <span className="text-yellow-400">Crypto Opportunity</span> Again
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Get instant alerts when Bitcoin, Ethereum, and 10,000+ cryptocurrencies hit your target prices. 
              Join 25,000+ successful traders making smarter investment decisions.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
              <Link 
                href="/premium?specialOffer=true" 
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-8 rounded-lg text-xl transition duration-200 transform hover:scale-105 shadow-lg"
                onClick={() => {
                  // Track premium button click
                  fetch('/api/analytics', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      event: 'premium_click',
                      page: '/landing'
                    })
                  }).catch(err => console.error('Failed to track premium click:', err));
                }}
              >
                Start Free Trial - Just $9.99/month
              </Link>
              <div className="text-center">
                <div className="text-sm opacity-75">💳 No Setup Fees • Cancel Anytime</div>
                <div className="text-sm opacity-75">🔒 Secure PayPal Checkout</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm opacity-75">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                {visitorCount} people viewing this offer
              </div>
              <div>⭐ 4.9/5 rating from 2,847 reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why 25,000+ Traders Choose CryptoTracker</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">$2.3M+ Profits Captured</h3>
              <p className="text-gray-600">Our users have captured over $2.3 million in profits from timely alerts in the last 6 months alone.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Instant Notifications</h3>
              <p className="text-gray-600">Get SMS and email alerts within seconds of price movements. Never miss another opportunity.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Advanced Analytics</h3>
              <p className="text-gray-600">Professional portfolio tracking with profit/loss analysis and performance metrics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-16 bg-red-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-red-700">🚨 Don&apos;t Let History Repeat Itself</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Bitcoin Rally - March 2024</h3>
              <p className="text-gray-600 mb-4">Bitcoin jumped from $43,000 to $73,000 in just 6 weeks.</p>
              <div className="text-3xl font-bold text-green-600">+70% Gains Missed</div>
              <p className="text-sm text-gray-500 mt-2">Without price alerts, most investors missed this rally</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Ethereum Surge - May 2024</h3>
              <p className="text-gray-600 mb-4">Ethereum shot up from $2,800 to $4,100 after ETF approval.</p>
              <div className="text-3xl font-bold text-green-600">+46% Gains Missed</div>
              <p className="text-sm text-gray-500 mt-2">CryptoTracker users got alerts at $2,850</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">The Next Bull Run is Coming...</h3>
            <p className="text-lg mb-4">Bitcoin halving effects, institutional adoption, and regulatory clarity are setting up the next major crypto rally.</p>
            <p className="text-xl font-bold">Will you be ready this time?</p>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <NewsletterSignup 
            variant="inline"
            incentive="Get exclusive market insights and be first to know about major price movements"
          />
        </div>
      </section>

      {/* Affiliate CTA Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join the Crypto Elite?</h2>
          <p className="text-xl mb-8">Start your 7-day free trial and see why serious traders choose CryptoTracker Premium</p>
          
          <div className="bg-yellow-400 text-black p-6 rounded-lg inline-block mb-8">
            <div className="text-3xl font-bold mb-2">Limited Time Offer</div>
            <div className="text-xl">First Month Only $5.99 (40% OFF)</div>
            <div className="text-sm opacity-75">Regular price $9.99/month after trial</div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link 
              href="/premium?specialOffer=true&ref=landing" 
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-8 rounded-lg text-xl transition duration-200 transform hover:scale-105"
              onClick={() => {
                // Track premium button click
                fetch('/api/analytics', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    event: 'premium_click',
                    page: '/landing',
                    metadata: { source: 'bottom_cta' }
                  })
                }).catch(err => console.error('Failed to track premium click:', err));
              }}
            >
              Start Your Free Trial Now
            </Link>
            <div className="text-sm opacity-75">
              ✅ No credit card required for trial<br />
              ✅ Cancel anytime, no questions asked
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-8 bg-gray-800 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <div className="text-sm">🔒 SSL Secured</div>
              <div className="text-sm">💳 PayPal Protected</div>
              <div className="text-sm">⭐ 4.9/5 Rating</div>
            </div>
            <div className="text-sm opacity-75">
              Trusted by 25,000+ crypto traders worldwide
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
