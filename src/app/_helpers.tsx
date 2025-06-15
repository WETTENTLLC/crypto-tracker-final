'use client';

/**
 * Global helper functions for the CryptoTracker application
 */

/**
 * Force navigation to a URL
 * Use this to bypass client-side navigation issues
 */
export function forceNavigate(url: string) {
  if (typeof window !== 'undefined') {
    window.location.href = url;
  }
}

/**
 * Check if user is admin
 */
export function isAdminUser(): boolean {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('isAdmin') === 'true';
  }
  return false;
}

/**
 * Check if user has premium access
 */
export function isPremiumUser(): boolean {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('isPremium') === 'true';
  }
  return false;
}

/**
 * Set premium status
 */
export function setPremiumStatus(status: boolean): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('isPremium', status ? 'true' : 'false');
  }
}

/**
 * Set admin status
 */
export function setAdminStatus(status: boolean): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('isAdmin', status ? 'true' : 'false');
  }
}

/**
 * Create a click handler that forces navigation
 */
export function createNavigationHandler(url: string) {
  return (e: React.MouseEvent) => {
    e.preventDefault();
    forceNavigate(url);
  };
}

/**
 * Applies navigation handlers to all links on the page
 * Call this in useEffect to fix navigation across the entire app
 */
export function applyGlobalNavigationFix(): void {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // Get all links
    const links = document.querySelectorAll('a[href]');
    
    // Apply navigation handlers to each link
    links.forEach(link => {
      // Skip links that already have a handler
      if (link.getAttribute('data-nav-fixed')) return;
      
      // Mark as fixed
      link.setAttribute('data-nav-fixed', 'true');
      
      // Get href
      const href = link.getAttribute('href');
      if (!href) return;
      
      // Skip external links and hash links
      if (href.startsWith('http') || href.startsWith('#')) return;
      
      // Add click handler
      link.addEventListener('click', (e) => {
        e.preventDefault();
        forceNavigate(href);
      });
    });
  }
}
