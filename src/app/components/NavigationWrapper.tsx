'use client';

import { useEffect } from 'react';
import { forceNavigate } from '../_helpers';

/**
 * Navigation Wrapper Component
 * 
 * This component adds click handlers to all navigation links in the application
 * to ensure they work correctly with direct URL navigation instead of client-side routing.
 * 
 * Usage: Place this component at the top level of your application
 */
export default function NavigationWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Function to fix all links
    const fixLinks = () => {
      const links = document.querySelectorAll('a[href]');
      
      links.forEach(link => {
        // Skip links that already have our fix applied
        if (link.getAttribute('data-nav-fixed')) return;
        
        // Mark this link as fixed
        link.setAttribute('data-nav-fixed', 'true');
        
        // Add event listener to handle navigation
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (!href) return;
          
          // Don't interfere with external links or hash links
          if (href.startsWith('http') || href.startsWith('#')) return;
          
          // Prevent default navigation
          e.preventDefault();
          
          // Force direct URL navigation
          forceNavigate(href);
        });
      });
    };
    
    // Fix links initially
    fixLinks();
    
    // Set up observer to fix links added dynamically
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          fixLinks();
        }
      });
    });
    
    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Show navigation help banner
    const showHelpBanner = () => {
      const hideBanner = localStorage.getItem('hideNavBanner') === 'true';
      if (!hideBanner) {
        const banner = document.createElement('div');
        banner.className = 'fixed bottom-4 right-4 bg-blue-100 text-blue-800 p-4 rounded-lg shadow-lg z-50 max-w-md';
        banner.innerHTML = `
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium">
                Navigation tip: If links don't work with a single click, try double-clicking or use direct URLs.
              </p>
              <div class="mt-2 flex">
                <button id="dismiss-nav-banner" class="text-xs text-blue-600 hover:text-blue-800">
                  Don't show again
                </button>
              </div>
            </div>
          </div>
        `;
        
        document.body.appendChild(banner);
        
        // Add event listener to dismiss button
        document.getElementById('dismiss-nav-banner')?.addEventListener('click', () => {
          banner.remove();
          localStorage.setItem('hideNavBanner', 'true');
        });
      }
    };
    
    // Show banner after a short delay
    setTimeout(showHelpBanner, 2000);
    
    // Cleanup on unmount
    return () => {
      observer.disconnect();
    };
  }, []);
  
  return <>{children}</>;
}
