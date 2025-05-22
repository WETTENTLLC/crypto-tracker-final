'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AccountPage() {
  const [subscription, setSubscription] = useState({
    status: 'active',
    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    plan: 'Premium Monthly',
    price: '$5.99/month'
  });
  
  const [isPremium, setIsPremium] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if user is premium
    const premium = localStorage.getItem('isPremium') === 'true';
    setIsPremium(premium);
    
    // If not premium, redirect to premium page
    if (!premium) {
      window.location.href = '/premium';
    }
  }, []);
  
  const handleCancelSubscription = () => {
    if (confirm('Are you sure you want to cancel your premium subscription? You will lose access to premium features at the end of your current billing period.')) {
      // In a real app, this would call an API to cancel the subscription
      // For demo purposes, we'll just update localStorage
      localStorage.setItem('isPremium', 'false');
      alert('Your subscription has been canceled. You will have access to premium features until the end of your current billing period.');
      window.location.href = '/';
    }
  };
  
  if (!isPremium) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Premium Account</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <svg className="w-8 h-8 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <h2 className="text-xl font-semibold">Premium Subscription Active</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600 mb-1">Subscription Plan</p>
              <p className="font-medium">{subscription.plan}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Price</p>
              <p className="font-medium">{subscription.price}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Status</p>
              <p className="font-medium">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {subscription.status}
                </span>
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Next Billing Date</p>
              <p className="font-medium">{subscription.nextBillingDate}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <button
              onClick={handleCancelSubscription}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Cancel Subscription
            </button>
            <p className="text-sm text-gray-500 mt-1">
              You will continue to have access to premium features until the end of your current billing period.
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Premium Features</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <div>
                <h3 className="font-medium">Unlimited Price Alerts</h3>
                <p className="text-gray-600">Set as many price alerts as you need for any cryptocurrency.</p>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <div>
                <h3 className="font-medium">SMS & Email Notifications</h3>
                <p className="text-gray-600">Receive instant notifications when your price alerts are triggered.</p>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <div>
                <h3 className="font-medium">Portfolio Tracking</h3>
                <p className="text-gray-600">Track your cryptocurrency portfolio performance with detailed analytics.</p>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <div>
                <h3 className="font-medium">Ad-Free Experience</h3>
                <p className="text-gray-600">Enjoy a clean, ad-free interface throughout the entire platform.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
