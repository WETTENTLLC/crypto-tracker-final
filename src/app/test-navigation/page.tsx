'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NavigationTest from '../components/NavigationTest';
import { navigateTo } from '../utils/NavigationFix';

export default function TestNavigationPage() {
  const [testRunning, setTestRunning] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is an admin
    const checkAdminStatus = () => {
      const adminStatus = localStorage.getItem('isAdmin') === 'true';
      setIsAdmin(adminStatus);
      setLoading(false);
    };
    
    checkAdminStatus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h1>
          
          <div className="mb-8">
            <p className="mb-4">
              You need administrator access to view this page.
            </p>
            
            <Link href="/admin/login" className="bg-blue-600 text-white px-4 py-2 rounded mr-4" onClick={(e) => {
              e.preventDefault();
              navigateTo('/admin/login');
            }}>
              Login as Admin
            </Link>
            
            <Link href="/" className="text-blue-600 hover:underline ml-4" onClick={(e) => {
              e.preventDefault();
              navigateTo('/');
            }}>
              Return Home
            </Link>
          </div>
        </div>
      </main>
    );
  }
    // If admin, show the test page
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                <span className="font-bold">Admin Only:</span> This testing interface is restricted to administrators only.
              </p>
            </div>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Navigation Test Page</h1>
        
        <div className="mb-8">
          <p className="mb-4">
            This page allows you to test if the navigation fixes are working correctly across the application.
          </p>
          
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded mr-4"
            onClick={() => setTestRunning(!testRunning)}
          >
            {testRunning ? 'Hide Navigation Test' : 'Run Navigation Test'}
          </button>
          
          <Link href="/" className="text-blue-600 hover:underline" onClick={(e) => {
            e.preventDefault();
            navigateTo('/');
          }}>
            Return Home
          </Link>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold mb-4">Navigation Links to Test</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-gray-200 p-4 rounded">
              <h3 className="font-medium mb-2">Main Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-blue-600 hover:underline" onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/');
                  }}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/alerts" className="text-blue-600 hover:underline" onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/alerts');
                  }}>
                    Alerts
                  </Link>
                </li>
                <li>
                  <Link href="/premium" className="text-blue-600 hover:underline" onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/premium');
                  }}>
                    Premium
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="text-blue-600 hover:underline" onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/account');
                  }}>
                    Account
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="border border-gray-200 p-4 rounded">
              <h3 className="font-medium mb-2">Crypto Pages</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/coin/bitcoin" className="text-blue-600 hover:underline" onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/coin/bitcoin');
                  }}>
                    Bitcoin
                  </Link>
                </li>
                <li>
                  <Link href="/coin/ethereum" className="text-blue-600 hover:underline" onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/coin/ethereum');
                  }}>
                    Ethereum
                  </Link>
                </li>
                <li>
                  <Link href="/coin/dogecoin" className="text-blue-600 hover:underline" onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/coin/dogecoin');
                  }}>
                    Dogecoin
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="border border-gray-200 p-4 rounded">
              <h3 className="font-medium mb-2">Footer Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-blue-600 hover:underline" onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/about');
                  }}>
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-blue-600 hover:underline" onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/faq');
                  }}>
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-blue-600 hover:underline" onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/privacy');
                  }}>
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-blue-600 hover:underline" onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/terms');
                  }}>
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="border border-gray-200 p-4 rounded">
              <h3 className="font-medium mb-2">Admin Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/admin/login" className="text-blue-600 hover:underline" onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/admin/login');
                  }}>
                    Admin Login
                  </Link>
                </li>
                <li>
                  <Link href="/admin/dashboard" className="text-blue-600 hover:underline" onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/admin/dashboard');
                  }}>
                    Admin Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/admin/seo" className="text-blue-600 hover:underline" onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/admin/seo');
                  }}>
                    SEO Management
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {testRunning && <NavigationTest />}
    </main>
  );
}
