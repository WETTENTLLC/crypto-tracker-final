'use client';

import { useState, useEffect, useCallback } from 'react';

interface ExitIntentPopupProps {
  onClose?: () => void; // Made optional
  onClaim?: () => void; // Made optional
  discount?: string;
  timeLimit?: string;
}

export default function ExitIntentPopup({
  onClose,
  onClaim,
  discount = "50%",
  timeLimit = "15 minutes"
}: ExitIntentPopupProps) {
  const [visible, setVisible] = useState(false);
  
  // Handle closing the popup
  const handleClose = useCallback(() => {
    setVisible(false);
    // Call the parent onClose after animation completes
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 300);
  }, [onClose]);
  
  // Handle claiming the offer
  const handleClaim = useCallback(() => {
    setVisible(false);
    // Call the parent onClaim after animation completes
    setTimeout(() => {
      if (onClaim) {
        onClaim();
      }
    }, 300);
  }, [onClaim]);
  
  useEffect(() => {
    // Small delay to ensure animation works properly
    const timer = setTimeout(() => {
      setVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Press escape to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [handleClose]);
  
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div 
        className={`bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transition-all duration-300 transform ${visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close popup"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
        </button>
        
        {/* Popup content */}
        <div className="p-6">
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4 text-center">
            <p className="font-bold">Wait! Don&apos;t miss this exclusive offer</p>
          </div>
          
          <h2 className="text-2xl font-bold mb-4 text-center">Special Deal Just For You</h2>
          
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6 text-center">
            <p className="text-lg font-semibold mb-1">Get <span className="text-red-600">{discount} OFF</span> Premium</p>
            <p className="text-sm text-gray-600">This offer expires in {timeLimit}</p>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <p className="text-black">Unlimited price alerts</p>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <p className="text-black">SMS & email notifications</p>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <p className="text-black">Advanced portfolio tracking</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={handleClaim}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition duration-200"
            >
              Yes, I Want This Deal!
            </button>
            <button 
              onClick={handleClose}
              className="w-full bg-transparent hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-200 border border-gray-300"
            >
              No Thanks, I&apos;ll Pass
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
