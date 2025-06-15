'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import PageLayout from '../components/PageLayout';
import SocialProofSection from '../../components/SocialProofSection';

// Dynamically import PayPal components to avoid SSR issues
const PayPalScriptProvider = dynamic(
  () => import('@paypal/react-paypal-js').then(mod => mod.PayPalScriptProvider),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-gray-100 p-4 rounded-lg text-center">
        <p className="text-gray-600">Loading PayPal payment options...</p>
      </div>
    )
  }
);

const PayPalButtons = dynamic(
  () => import('@paypal/react-paypal-js').then(mod => mod.PayPalButtons),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-gray-100 p-2 rounded text-center">
        <p className="text-sm text-gray-600">Loading payment buttons...</p>
      </div>
    )
  }
);

// Import PayPal types for better type safety
import type { CreateSubscriptionActions, OnApproveActions } from '@paypal/paypal-js';

export default function PremiumPage() {
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [paypalError, setPaypalError] = useState<boolean>(false);
  const [hasSpecialOffer, setHasSpecialOffer] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(24 * 60 * 60); // 24 hours in seconds
  const [selectedPlan, /* setSelectedPlan */] = useState<'monthly' | 'quarterly' | 'annual'>('monthly'); // setSelectedPlan commented out
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const premium = localStorage.getItem('isPremium') === 'true';
    setIsPremium(premium);
    setIsLoading(false);
    setIsClient(true);
    
    const urlSpecialOffer = searchParams?.get('specialOffer') === 'true';
    const storageSpecialOffer = localStorage.getItem('specialOffer') === 'true';
    
    if (urlSpecialOffer || storageSpecialOffer) {
      setHasSpecialOffer(true);
      const offerDateStr = localStorage.getItem('specialOfferDate');
      if (offerDateStr) {
        const offerDate = new Date(offerDateStr);
        const now = new Date();
        const hoursPassed = (now.getTime() - offerDate.getTime()) / (1000 * 60 * 60);
        if (hoursPassed < 24) {
          const remainingSeconds = Math.max(0, (24 * 60 * 60) - (hoursPassed * 60 * 60));
          setTimeLeft(remainingSeconds);
        } else {
          setHasSpecialOffer(false);
          localStorage.removeItem('specialOffer');
          localStorage.removeItem('specialOfferDate');
        }
      }
    }
    
    console.log("Premium page loaded, checking PayPal...");
    setTimeout(() => {
      const hasPaypalButton = document.querySelector('[data-paypal-button]');
      if (!hasPaypalButton) {
        console.warn("PayPal button not found, setting fallback");
        setPaypalError(true);
      }
    }, 5000);
  }, [searchParams]);
  
  useEffect(() => {
    if (!hasSpecialOffer || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          setHasSpecialOffer(false);
          localStorage.removeItem('specialOffer');
          localStorage.removeItem('specialOfferDate');
          clearInterval(timer); // Clear interval when time is up
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [hasSpecialOffer, timeLeft]);

  const planPricing = {
    monthly: { price: '9.99', description: 'CryptoTracker Premium - Monthly Plan' },
    quarterly: { price: '24.99', description: 'CryptoTracker Premium - Quarterly Plan (17% OFF)' },
    annual: { price: '89.99', description: 'CryptoTracker Premium - Annual Plan (25% OFF)' }
  };

  const getCurrentPlanPrice = () => {
    if (hasSpecialOffer && selectedPlan === 'monthly') {
      return { price: '4.99', description: 'CryptoTracker Premium - Special Offer (50% OFF)' };
    }
    return planPricing[selectedPlan];
  };
  
  const handlePaymentSuccess = () => {
    localStorage.setItem('isPremium', 'true');
    setIsPremium(true);
    setPaymentSuccess(true);
  };

  const handlePaymentError = (err: Error | Record<string, unknown>) => { // Accept Error or PayPal error object
    console.error("PayPal Error:", err);
    setPaypalError(true);
  };

  if (isLoading) {
    return (
      <PageLayout title="Premium Subscription">
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">Loading premium status...</p>
        </div>
      </PageLayout>
    );
  }

  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "YOUR_FALLBACK_CLIENT_ID";
  const PAYPAL_PLAN_ID = process.env.NEXT_PUBLIC_PAYPAL_MONTHLY_PLAN_ID || "YOUR_FALLBACK_PLAN_ID"; // Adjust if plan ID changes based on selectedPlan

  return (
    <PageLayout title="CryptoTracker Premium">
      {isClient && isPremium ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">You are a Premium Member!</h2>
          <p className="text-gray-600 mb-6">Enjoy unlimited access to all features, including advanced portfolio tracking, unlimited price alerts, and priority support.</p>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 font-medium">
            Go to Dashboard
          </Link>
        </div>
      ) : paymentSuccess ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">Welcome to CryptoTracker Premium! You now have access to all premium features.</p>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 font-medium">
            Start Exploring Your Premium Benefits
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
              Unlock the Full Power of CryptoTracker
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Upgrade to Premium for advanced features, unlimited alerts, and in-depth portfolio analysis. Take your crypto tracking to the next level.
            </p>
            <ul className="space-y-4 text-gray-600 mb-8">
              <li className="flex items-center">
                <svg className="w-6 h-6 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Advanced Portfolio Analytics & Reporting
              </li>
              <li className="flex items-center">
                <svg className="w-6 h-6 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unlimited Real-Time Price Alerts
              </li>
              <li className="flex items-center">
                <svg className="w-6 h-6 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Priority Customer Support
              </li>
              <li className="flex items-center">
                <svg className="w-6 h-6 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Ad-Free Experience
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Premium Subscription</h3>
            {hasSpecialOffer && selectedPlan === 'monthly' ? (
                <>
                    <p className="text-4xl font-extrabold text-gray-900 text-center mb-1">
                        ${getCurrentPlanPrice().price} <span className="text-base font-medium text-gray-500">/ month</span>
                    </p>
                    <p className="text-sm text-green-600 text-center mb-1 line-through">Original: $9.99/month</p>
                    <p className="text-gray-600 text-center mb-4">Special Offer! Billed monthly. Cancel anytime.</p>
                    {timeLeft > 0 && (
                        <p className="text-red-500 text-center font-semibold mb-4">
                            Offer ends in: {Math.floor(timeLeft / 3600).toString().padStart(2, '0')}: 
                            {Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0')}: 
                            {(timeLeft % 60).toString().padStart(2, '0')}
                        </p>
                    )}
                </>
            ) : (
                <>
                    <p className="text-4xl font-extrabold text-gray-900 text-center mb-2">
                        ${planPricing[selectedPlan].price} <span className="text-base font-medium text-gray-500">/ month</span>
                    </p>
                    <p className="text-gray-600 text-center mb-6">{planPricing[selectedPlan].description}. Cancel anytime.</p>
                </>
            )}
            
            {paypalError && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                <p className="font-bold">Payment Error</p>
                <p>There was an issue processing your payment. Please try again or contact support.</p>
              </div>
            )}

            {isClient && PAYPAL_CLIENT_ID !== "YOUR_FALLBACK_CLIENT_ID" && (
              <PayPalScriptProvider options={{ 
                "clientId": PAYPAL_CLIENT_ID, 
                currency: "USD",
                vault: true,
                intent: "subscription"
              }}>
                <PayPalButtons
                  style={{ layout: "vertical", color: "blue", shape: "rect", label: "subscribe" }}
                  createSubscription={(_data: Record<string, unknown>, actions: CreateSubscriptionActions) => {
                    console.log("Creating subscription with plan:", PAYPAL_PLAN_ID, "selected plan type:", selectedPlan);
                    return actions.subscription.create({
                      plan_id: PAYPAL_PLAN_ID, 
                      custom_id: `user_xyz_${selectedPlan}_${Date.now()}`,
                      auto_renewal: true,
                    });
                  }}
                  onApprove={(_data: Record<string, unknown>, actions: OnApproveActions) => {
                    console.log("Subscription approved by PayPal");
                    if (actions.subscription) {
                      return actions.subscription.get().then((details) => {
                        console.log("Subscription details:", details);
                        handlePaymentSuccess();
                      }).catch((err: Error | Record<string, unknown>) => {
                          handlePaymentError(err);
                      });
                    } else {
                      console.error("No subscription actions available");
                      handlePaymentError(new Error("No subscription actions available"));
                      return Promise.resolve();
                    }
                  }}
                  onError={handlePaymentError}
                  onCancel={() => {
                    console.log("Payment cancelled by user.");
                  }}
                />
              </PayPalScriptProvider>
            )}
            {isClient && PAYPAL_CLIENT_ID === "YOUR_FALLBACK_CLIENT_ID" && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
                    <p className="font-bold">PayPal Configuration Missing</p>
                    <p>PayPal client ID is not configured. Please set NEXT_PUBLIC_PAYPAL_CLIENT_ID in your environment variables.</p>
                </div>
            )}
            <p className="text-xs text-gray-500 text-center mt-4">
              By subscribing, you agree to our <Link href="/terms" className="underline hover:text-gray-700">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-gray-700">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      )}
      
      <SocialProofSection />
    </PageLayout>
  );
}
