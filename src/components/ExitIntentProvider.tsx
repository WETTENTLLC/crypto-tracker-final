'use client';

import { useState, useEffect } from 'react';
import ExitIntentPopup from './ExitIntentPopup';
import { useRouter } from 'next/navigation';

export default function ExitIntentProvider({ children }: { children: React.ReactNode }) {
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user has already seen the popup or is a premium user
    const popupShown = localStorage.getItem('exitPopupShown');
    const isPremiumUser = localStorage.getItem('isPremiumUser');
    
    if (popupShown === 'true' || isPremiumUser === 'true') {
      setHasShownPopup(true);
      return;
    }

    // Function to detect when mouse leaves the viewport towards the top
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves towards the top of the page
      if (e.clientY <= 5 && !hasShownPopup) {
        setShowExitPopup(true);
        setHasShownPopup(true);
        // Mark that the popup has been shown
        localStorage.setItem('exitPopupShown', 'true');
      }
    };

    // Set a timeout before enabling the exit intent trigger
    // This prevents it from triggering immediately when the page loads
    const timeout = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 3000);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShownPopup]);

  const handleClosePopup = () => {
    setShowExitPopup(false);
  };

  const handleClaimOffer = () => {
    // Set a cookie/localStorage to remember the special offer
    localStorage.setItem('specialOffer', 'true');
    localStorage.setItem('specialOfferDate', new Date().toISOString());
    
    // Redirect to premium page with special offer
    router.push('/premium?specialOffer=true');
    setShowExitPopup(false);
  };

  return (
    <>
      {children}
      
      {showExitPopup && (
        <ExitIntentPopup 
          onClose={handleClosePopup} 
          onClaim={handleClaimOffer}
          discount="40%"
          timeLimit="24 hours" 
        />
      )}
    </>
  );
}
