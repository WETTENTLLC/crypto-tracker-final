'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { navigateTo } from '../utils/NavigationFix';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBanner?: boolean;
}

export default function PageLayout({ children, title, showBanner = false }: PageLayoutProps) {
  const [isPremium, setIsPremium] = useState<boolean>(false);
  
  useEffect(() => {
    const checkPremiumStatus = () => {
      const premium = localStorage.getItem('isPremium') === 'true';
      setIsPremium(premium);
    };
    
    checkPremiumStatus();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <svg className="w-8 h-8 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"></path>
              </svg>
              <Link href="/" onClick={(e) => {
                e.preventDefault();
                navigateTo('/');
              }}>
                <h1 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                  CryptoTracker
                </h1>
              </Link>
            </div>
            
            <div className="flex space-x-4">
              <Link href="/alerts" className="text-black hover:text-gray-700 transition-colors" onClick={(e) => {
                e.preventDefault();
                navigateTo('/alerts');
              }}>
                My Alerts
              </Link>
              <Link href="/dashboard" className="text-black hover:text-gray-700 transition-colors" onClick={(e) => {
                e.preventDefault();
                navigateTo('/dashboard');
              }}>
                Dashboard
              </Link>
              {isPremium ? (
                <Link href="/account" className="text-black hover:text-gray-700 transition-colors" onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/account');
                }}>
                  Premium Account
                </Link>
              ) : (
                <Link href="/premium" className="text-blue-600 hover:text-blue-800 font-medium transition-colors" onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/premium');
                }}>
                  Upgrade to Premium
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Admin Help Banner - Only shown on initial visit */}
      {showBanner && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
            <div className="flex">
              <div className="py-1">
                <svg className="h-6 w-6 text-blue-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-bold">Navigation Guide</p>
                <p className="text-sm">
                  Having trouble navigating? Try clicking links twice, or use direct URLs. 
                  For admin access, use the &quot;Admin Access&quot; link in the footer with credentials: admin@example.com / password.
                  <button 
                    onClick={() => {
                      if (typeof document !== 'undefined') {
                        const banner = document.querySelector('.bg-blue-100') as HTMLElement;
                        if (banner) banner.style.display = 'none';
                        localStorage.setItem('hideBanner', 'true');
                      }
                    }}
                    className="ml-4 text-xs underline"
                  >
                    Dismiss
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page Content */}
      <div className="container mx-auto px-4 py-8">
        {title && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          </div>
        )}
        {children}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
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
              <p className="text-gray-300 mt-2">Real-time cryptocurrency tracking and alerts</p>
            </div>
            
            <div className="flex space-x-6">
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors" onClick={(e) => {
                e.preventDefault();
                navigateTo('/about');
              }}>
                About
              </Link>
              <Link href="/faq" className="text-gray-300 hover:text-white transition-colors" onClick={(e) => {
                e.preventDefault();
                navigateTo('/faq');
              }}>
                FAQ
              </Link>
              <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors" onClick={(e) => {
                e.preventDefault();
                navigateTo('/privacy');
              }}>
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-white transition-colors" onClick={(e) => {
                e.preventDefault();
                navigateTo('/terms');
              }}>
                Terms
              </Link>
              <Link href="/admin/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors" onClick={(e) => {
                e.preventDefault();
                navigateTo('/admin/login');
              }}>
                Admin Access
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-300 text-sm">
            <p>© {new Date().getFullYear()} CryptoTracker. All rights reserved.</p>
            <p className="mt-2">Powered by CoinGecko API. Not financial advice.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
