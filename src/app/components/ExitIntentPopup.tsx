'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if popup has been shown before
    const hasSeenPopup = localStorage.getItem('hasSeenExitPopup') === 'true';
    
    if (!hasSeenPopup) {
      // Add exit intent detection
      const handleMouseLeave = (e: MouseEvent) => {
        // Only trigger when mouse leaves through the top of the page
        if (e.clientY <= 0) {
          setIsVisible(true);
          // Remove event listener after showing once
          document.removeEventListener('mouseleave', handleMouseLeave);
          // Set localStorage to remember this visitor has seen the popup
          localStorage.setItem('hasSeenExitPopup', 'true');
        }
      };
      
      // Set a timeout before enabling the exit intent
      // This prevents it from triggering immediately when the page loads
      setTimeout(() => {
        document.addEventListener('mouseleave', handleMouseLeave);
      }, 3000);

      // Cleanup event listener
      return () => {
        document.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Send email to the API
      const response = await fetch('/api/mcp/email-capture/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          source: 'exit_popup',
          offerId: 'CRYPTO50'
        }),
      });
      
      if (response.ok) {
        setIsSubmitted(true);
        // Store coupon code in localStorage
        localStorage.setItem('specialOffer', 'CRYPTO50');
      } else {
        throw new Error('Failed to submit email');
      }
    } catch (apiError) { // Changed variable name from err to apiError to avoid conflict with error state
      console.error('Email submission error:', apiError); // Log the actual error
      setError('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close popup"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Blue header */}
        <div className="bg-blue-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Wait! Don&apos;t Miss This Offer</h2>
          <p className="mt-2">Get 50% off your first month of Premium</p>
        </div>
        
        <div className="p-6">
          {!isSubmitted ? (
            <>
              <p className="text-gray-700 mb-4">
                Subscribe to our newsletter and receive a <span className="font-bold">50% discount code</span> for your first month of CryptoTracker Premium.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="you@example.com"
                    required
                  />
                  {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Submitting...' : 'Get My 50% Discount'}
                </button>
              </form>
              
              <p className="mt-4 text-xs text-gray-500">
                By subscribing, you agree to receive marketing emails from us. You can unsubscribe at any time. We&apos;ll never share your email with anyone else.
              </p>
            </>
          ) : (
            <div className="text-center py-4">
              <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
              <p className="text-gray-700 mb-4">
                Your discount code <span className="font-mono font-bold bg-gray-100 p-1 rounded">CRYPTO50</span> has been applied.
              </p>
              
              <Link
                href="/premium"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
              >
                Claim Premium Discount Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
