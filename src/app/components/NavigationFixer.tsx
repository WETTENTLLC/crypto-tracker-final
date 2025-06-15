'use client';

import { useEffect } from 'react';
import { applyGlobalNavigationFix } from '../_helpers';

/**
 * NavigationFixer Component
 * 
 * This component fixes navigation issues across the entire application by
 * applying direct URL navigation to all internal links.
 * 
 * Place this component in the root layout to ensure it runs on all pages.
 */
export default function NavigationFixer() {
  useEffect(() => {
    // Apply the global navigation fix
    applyGlobalNavigationFix();

    // Set up a MutationObserver to watch for dynamically added links
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const observer = new MutationObserver(() => {
        applyGlobalNavigationFix();
      });

      // Start observing the document body for DOM changes
      observer.observe(document.body, { 
        childList: true,
        subtree: true 
      });

      // Clean up on component unmount
      return () => observer.disconnect();
    }
  }, []);

  // This component doesn't render anything
  return null;
}
