'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CoinList from './components/CoinList';
import SocialShareOptimization from './components/SocialShareOptimization';
import InternalLinkingStrategy, { SmartInternalLinks } from './components/InternalLinkingStrategy';
import SEOPerformanceMonitor from './components/SEOPerformanceMonitor';

export default function Home() {
  const [isPremium, setIsPremium] = useState<boolean>(false);
  
  // Check if user is premium (would connect to auth system in production)
  useEffect(() => {
    const checkPremiumStatus = () => {
      // In a real app, this would check against a database
      // For demo purposes, we'll use localStorage
      const premium = localStorage.getItem('isPremium') === 'true';
      setIsPremium(premium);
    };
    
    checkPremiumStatus();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <svg className="w-8 h-8 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"></path>
              </svg>
              <h1 className="text-2xl font-bold text-gray-900">CryptoTracker</h1>
            </div>
            
            <div className="flex space-x-4">
              <Link href="/alerts" className="text-gray-600 hover:text-gray-900">
                My Alerts
              </Link>
              {isPremium ? (
                <Link href="/account" className="text-gray-600 hover:text-gray-900">
                  Premium Account
                </Link>
              ) : (
                <Link href="/premium" className="text-blue-600 hover:text-blue-800 font-medium">
                  Upgrade to Premium
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-blue-600 text-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">Track Cryptocurrency Prices in Real-Time</h2>
              <p className="text-blue-100">Set price alerts, monitor your portfolio, and stay updated with market trends.</p>
            </div>
            {!isPremium && (
              <Link 
                href="/premium" 
                className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-2 px-6 rounded-md transition duration-200"
              >
                Try Premium Free for 7 Days
              </Link>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Top Cryptocurrencies</h2>
          </div>
          <CoinList />
        </div>

        {!isPremium && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-6 md:mb-0 md:mr-8 flex-1">
                <h2 className="text-xl font-semibold mb-3">Upgrade to Premium</h2>
                <p className="text-gray-600 mb-4">Get unlimited price alerts, SMS notifications, portfolio tracking, and more for just $5.99/month.</p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    Unlimited price alerts
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    SMS & email notifications
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    Portfolio tracking
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    Ad-free experience
                  </li>
                </ul>
                <Link 
                  href="/premium" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200 inline-block"
                >
                  Upgrade Now
                </Link>
              </div>
              <div className="flex-1">
                <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                  <h3 className="text-lg font-medium text-blue-800 mb-3">Free vs Premium</h3>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="font-medium">Feature</div>
                    <div className="font-medium">Free</div>
                    <div className="font-medium">Premium</div>
                    
                    <div>Price Alerts</div>
                    <div>3 max</div>
                    <div>Unlimited</div>
                    
                    <div>Notifications</div>
                    <div>Browser only</div>
                    <div>SMS & Email</div>
                    
                    <div>Portfolio Tracking</div>
                    <div>Basic</div>
                    <div>Advanced</div>
                    
                    <div>Price Charts</div>
                    <div>Basic</div>
                    <div>Advanced</div>
                    
                    <div>Ads</div>
                    <div>Yes</div>
                    <div>No</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
              </svg>
              <h3 className="text-lg font-semibold">Real-Time Alerts</h3>
            </div>
            <p className="text-gray-600">Set price alerts for your favorite cryptocurrencies and get notified when they reach your target price.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <h3 className="text-lg font-semibold">Market Trends</h3>
            </div>
            <p className="text-gray-600">Track market trends with interactive charts and historical data to make informed investment decisions.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
              <h3 className="text-lg font-semibold">Portfolio Tracking</h3>
            </div>
            <p className="text-gray-600">Monitor your cryptocurrency portfolio performance and track your gains and losses over time.</p>
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"></path>
                </svg>
                <span className="text-xl font-bold">CryptoTracker</span>
              </div>
              <p className="text-gray-400 mt-2">Real-time cryptocurrency tracking and alerts</p>
            </div>
            
            <div className="flex space-x-6">
              <Link href="/about" className="text-gray-300 hover:text-white">
                About
              </Link>
              <Link href="/faq" className="text-gray-300 hover:text-white">
                FAQ
              </Link>
              <Link href="/privacy" className="text-gray-300 hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-white">
                Terms
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} CryptoTracker. All rights reserved.</p>
            <p className="mt-2">Powered by CoinGecko API. Not financial advice.</p>
          </div>
        </div>
      </footer>

      {/* SEO Enhancement Components */}
      <SocialShareOptimization 
        title="CryptoTracker - Real-time Cryptocurrency Price Alerts & Portfolio Tracking"
        description="Track cryptocurrency prices in real-time, set custom price alerts, and manage your crypto portfolio with advanced analytics."
        hashtags={['crypto', 'bitcoin', 'ethereum', 'cryptocurrency', 'portfolio']}
      />
      
      <InternalLinkingStrategy 
        currentPath="/"
        category="tools"
      />
      
      <SmartInternalLinks />
      
      <SEOPerformanceMonitor />
    </main>
  );
}
