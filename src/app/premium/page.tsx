'use client';

import { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Link from 'next/link';

export default function PremiumPage() {
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if user is already premium
    const premium = localStorage.getItem('isPremium') === 'true';
    setIsPremium(premium);
    setIsLoading(false);
  }, []);
  
  const handlePaymentSuccess = () => {
    // In a real app, this would update the user's status in a database
    localStorage.setItem('isPremium', 'true');
    setIsPremium(true);
    setPaymentSuccess(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {isPremium && !paymentSuccess ? (
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-6">
            <svg className="w-12 h-12 text-green-500 mr-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <h1 className="text-2xl font-bold">You're already a Premium member!</h1>
          </div>
          <p className="text-gray-600 mb-6">
            You already have access to all premium features, including unlimited price alerts, SMS notifications, portfolio tracking, and an ad-free experience.
          </p>
          <div className="flex space-x-4">
            <Link 
              href="/dashboard" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
            >
              Go to Dashboard
            </Link>
            <Link 
              href="/account" 
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-6 rounded-md transition duration-200"
            >
              Manage Subscription
            </Link>
          </div>
        </div>
      ) : paymentSuccess ? (
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
          <h1 className="text-2xl font-bold mb-4">Thank You for Your Purchase!</h1>
          <p className="text-gray-600 mb-6">
            Your premium subscription has been activated successfully. You now have access to all premium features.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/dashboard" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
            >
              Go to Dashboard
            </Link>
            <Link 
              href="/account" 
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-6 rounded-md transition duration-200"
            >
              Manage Subscription
            </Link>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Upgrade to Premium</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-100 px-6 py-4">
                <h2 className="text-xl font-semibold">Free Plan</h2>
                <p className="text-gray-600">Basic features for casual users</p>
              </div>
              <div className="p-6">
                <p className="text-3xl font-bold mb-6">$0 <span className="text-gray-500 text-lg font-normal">/month</span></p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    Real-time cryptocurrency prices
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    Basic price charts
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    Limited to 3 price alerts
                  </li>
                  <li className="flex items-center text-gray-400">
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                    </svg>
                    No SMS or email notifications
                  </li>
                  <li className="flex items-center text-gray-400">
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                    </svg>
                    No portfolio tracking
                  </li>
                  <li className="flex items-center text-gray-400">
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                    </svg>
                    Includes advertisements
                  </li>
                </ul>
                <Link 
                  href="/" 
                  className="block w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-200"
                >
                  Current Plan
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-blue-500 relative">
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-sm font-semibold">
                RECOMMENDED
              </div>
              <div className="bg-blue-50 px-6 py-4">
                <h2 className="text-xl font-semibold">Premium Plan</h2>
                <p className="text-blue-600">Advanced features for serious traders</p>
              </div>
              <div className="p-6">
                <p className="text-3xl font-bold mb-6">$5.99 <span className="text-gray-500 text-lg font-normal">/month</span></p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    Real-time cryptocurrency prices
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    Advanced price charts with indicators
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <strong>Unlimited</strong> price alerts
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    SMS & email notifications
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    Portfolio tracking & analytics
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    Ad-free experience
                  </li>
                </ul>
                
                <div className="mb-4">
                  <PayPalScriptProvider options={{ 
                    clientId: "AX_UCD0FG6LaVhl1smF44PQuxkRzoCNE_GreJfYg1DHycaE_IDKHrCJEhfcDWlK5sdVX44E8yBWnFns5",
                    components: "buttons",
                    currency: "USD"
                  }}>
                    <PayPalButtons 
                      style={{ layout: "vertical" }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          intent: "CAPTURE",
                          purchase_units: [
                            {
                              amount: {
                                value: "5.99",
                                currency_code: "USD"
                              },
                              description: "CryptoTracker Premium Subscription - Monthly"
                            },
                          ],
                          application_context: {
                            shipping_preference: "NO_SHIPPING"
                          }
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order?.capture?.() 
                          ? actions.order.capture().then((details) => {
                              handlePaymentSuccess();
                            })
                          : Promise.resolve();
                      }}
                    />
                  </PayPalScriptProvider>
                </div>
                
                <p className="text-xs text-gray-500 text-center">
                  Secure payment processing by PayPal. Cancel anytime.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6">Premium Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 rounded-full p-4 mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Unlimited Price Alerts</h3>
                <p className="text-gray-600">
                  Set as many price alerts as you need for any cryptocurrency. Never miss an important price movement again.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 rounded-full p-4 mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path>
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">SMS & Email Notifications</h3>
                <p className="text-gray-600">
                  Receive instant notifications when your price alerts are triggered, even when you're away from your computer.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 rounded-full p-4 mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Portfolio Tracking</h3>
                <p className="text-gray-600">
                  Track your cryptocurrency portfolio performance with detailed analytics and visualization tools.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 rounded-full p-4 mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Advanced Charts</h3>
                <p className="text-gray-600">
                  Access advanced charting tools with technical indicators to make better trading decisions.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 rounded-full p-4 mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Ad-Free Experience</h3>
                <p className="text-gray-600">
                  Enjoy a clean, ad-free interface throughout the entire platform for a distraction-free experience.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 rounded-full p-4 mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Priority Support</h3>
                <p className="text-gray-600">
                  Get priority customer support with faster response times to help you resolve any issues quickly.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">How does the subscription work?</h3>
                <p className="text-gray-600">
                  Your premium subscription is billed monthly at $5.99. You can cancel anytime from your account page, and you'll continue to have access until the end of your current billing period.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I cancel my subscription?</h3>
                <p className="text-gray-600">
                  Yes, you can cancel your subscription at any time. After cancellation, you'll continue to have premium access until the end of your current billing period.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">How do SMS notifications work?</h3>
                <p className="text-gray-600">
                  After upgrading to premium, you can add your phone number in the account settings. You'll receive SMS notifications whenever your price alerts are triggered.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Is my payment information secure?</h3>
                <p className="text-gray-600">
                  Yes, all payments are processed securely through PayPal. We never store your payment information on our servers.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
