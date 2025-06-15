'use client';

import { useState } from 'react';
import EmailCapture from './EmailCapture';

interface NewsletterSignupProps {
  variant?: 'popup' | 'inline' | 'sidebar';
  incentive?: string;
  onSuccess?: () => void;
}

export default function NewsletterSignup({
  variant = 'inline',
  incentive = "Get exclusive crypto alerts and market insights",
  onSuccess
}: NewsletterSignupProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [subscribers] = useState(Math.floor(Math.random() * 1000) + 15432); // Simulated subscriber count

  const handleEmailSubmit = async (email: string) => {
    try {
      // Simulate API call to newsletter service
      console.log('Newsletter signup:', email);
      
      // Store in localStorage for demo purposes
      const existingEmails = JSON.parse(localStorage.getItem('newsletter_emails') || '[]');
      existingEmails.push({
        email,
        timestamp: new Date().toISOString(),
        source: variant
      });
      localStorage.setItem('newsletter_emails', JSON.stringify(existingEmails));
      
      // Track signup event for analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'newsletter_signup', {
          event_category: 'engagement',
          event_label: variant,
          value: 1
        });
      }
      
      onSuccess?.();
    } catch (error) {
      console.error('Newsletter signup error:', error);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const baseClasses = "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg";
  
  const variantClasses = {
    popup: "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 max-w-md w-full mx-4",
    inline: "w-full max-w-2xl mx-auto",
    sidebar: "max-w-sm"
  };

  return (
    <>
      {variant === 'popup' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleClose} />
      )}
      
      <div className={`${baseClasses} ${variantClasses[variant]} p-6 relative`}>
        {variant === 'popup' && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}

        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2">🚀 Join the Crypto Elite</h3>
          <p className="text-lg opacity-90 mb-4">{incentive}</p>
          
          <div className="flex items-center justify-center space-x-4 text-sm opacity-75">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
              {subscribers.toLocaleString()}+ subscribers
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No spam, unsubscribe anytime
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <EmailCapture
            onSubmit={handleEmailSubmit}
            buttonText="Get Free Crypto Insights"
            placeholderText="Enter your email for exclusive alerts"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>Market Analysis</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <span>Price Alerts</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              </svg>
              <span>Trading Tips</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
