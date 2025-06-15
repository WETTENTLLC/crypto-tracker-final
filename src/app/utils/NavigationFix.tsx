'use client';

/**
 * NavigationFix.tsx
 * Utility to fix navigation issues in the CryptoTracker application
 * 
 * The issue: Next.js client-side navigation not working properly in deployment
 * Solution: Force direct page navigation while maintaining Link component benefits
 */

import { useEffect } from 'react';

/**
 * Initializes navigation fix for the entire application
 * Call this in a top-level component that wraps the application
 */
export function useInitializeNavigationFix() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Fix all navigation links
      const fixNavigationLinks = () => {
        // Select all Link components or anchor tags with href attributes
        const links = document.querySelectorAll('a[href]');
        
        links.forEach(link => {
          // Only process links that don't already have our custom click handler
          if (!link.getAttribute('data-nav-fixed')) {
            link.setAttribute('data-nav-fixed', 'true');
            
            // Add click handler to manually handle navigation
            link.addEventListener('click', (e) => {
              e.preventDefault();
              const href = link.getAttribute('href');
              
              if (href && !href.startsWith('http') && !href.startsWith('#')) {
                // Internal navigation - use direct URL navigation
                window.location.href = href;
              } else if (href && (href.startsWith('http') || href.startsWith('#'))) {
                // External links or hash links - let them behave normally
                window.location.href = href;
              }
            });
          }
        });
      };

      // Run the fix initially
      fixNavigationLinks();
      
      // Also run after any DOM changes using MutationObserver
      const observer = new MutationObserver((mutations) => {
        let shouldFix = false;
        
        // Check if any new links were added
        mutations.forEach(mutation => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            shouldFix = true;
          }
        });
        
        if (shouldFix) {
          fixNavigationLinks();
        }
      });
      
      // Start observing the document for DOM changes
      observer.observe(document.body, { 
        childList: true, 
        subtree: true 
      });
      
      // Clean up observer on component unmount
      return () => observer.disconnect();
    }
  }, []);
}

/**
 * Creates a navigation helper component that fixes all links
 * Place this component at the top level of your application
 */
export default function NavigationFix() {
  useInitializeNavigationFix();
  
  // This is a utility component that doesn't render anything
  return null;
}

/**
 * Helper function to handle navigation manually
 * Use this in onClick handlers for buttons or other elements
 */
export function navigateTo(url: string) {
  if (typeof window !== 'undefined') {
    window.location.href = url;
  }
}
