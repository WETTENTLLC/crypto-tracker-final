'use client';

import { useState } from 'react';

interface EmailCaptureProps {
  onSubmit?: (email: string) => void; // Made optional
  buttonText?: string;
  placeholderText?: string;
  formName?: string; // Added for analytics or tracking
}

export default function EmailCapture({
  onSubmit,
  buttonText = "Subscribe",
  placeholderText = "Enter your email",
  formName = "default_email_capture"
}: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    
    if (onSubmit) {
      onSubmit(email);
    } else {
      // Default behavior: Call an API endpoint
      try {
        const response = await fetch('/api/mcp/email-capture', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, source: formName }),
        });
        if (!response.ok) {
          throw new Error('Subscription failed');
        }
        // Handle successful API call
      } catch (apiError) {
        console.error("API submission error:", apiError);
        setError('Subscription failed. Please try again.');
        return; // Don't proceed to setSuccess if API call failed
      }
    }
    
    setSuccess(true);
    setEmail('');
    
    // Reset success message after 3 seconds
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholderText}
            className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            aria-label="Email address"
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-200"
        >
          {buttonText}
        </button>
        
        {success && (
          <div className="text-green-600 text-sm font-medium mt-2 text-center">
            Thank you! You&apos;ve been subscribed successfully.
          </div>
        )}
      </form>
    </div>
  );
}
