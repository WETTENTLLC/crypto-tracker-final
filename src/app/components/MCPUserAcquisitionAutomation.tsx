'use client';
import { useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

// Add type definitions
declare global {
  interface Window {
    gtag: (command: string, action: string, params?: Record<string, unknown>) => void;
    dataLayer: Record<string, unknown>[];
    fbq: (action: string, event: string, params?: Record<string, unknown>) => void;
    rdt: (action: string, params?: Record<string, unknown>) => void;
    lintrk: (action: string, params?: Record<string, unknown>) => void;
    mcpTrackEvent: (eventName: string, eventData: Record<string, unknown>) => void;
    mcpSubscribe: (email: string, firstName?: string, lastName?: string) => Promise<{ success: boolean; error?: string }>;
  }
}

// Component to implement automated user acquisition strategies using MCP approach
export default function MCPUserAcquisitionAutomation() {
  const pathname = usePathname();
  
  useEffect(() => {
    // Log page views for analytics
    if (typeof window !== 'undefined') {
      // Set up MCP tracking function
      window.mcpTrackEvent = async (eventName, eventData) => {
        try {
          const response = await fetch('/api/mcp/analytics', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              eventName,
              eventData,
              sessionId: localStorage.getItem('mcpSessionId') || `session_${Date.now()}`
            })
          });
          return await response.json();
        } catch (error) {
          console.error('Error tracking event:', error);
          return { success: false, error };
        }
      };
      
      // Generate a session ID if not exists
      if (!localStorage.getItem('mcpSessionId')) {
        localStorage.setItem('mcpSessionId', `session_${Date.now()}`);
      }
      
      // Track page view with MCP
      window.mcpTrackEvent('page_view', { 
        page_path: pathname,
        timestamp: new Date().toISOString()
      });
      
      // Also use GA if available
      if (window.gtag) {
        window.gtag('event', 'page_view', {
          page_path: pathname,
        });
      }
      
      // Track time spent on page
      const startTime = new Date();
      
      return () => {
        const endTime = new Date();
        const timeSpent = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
        
        // Track with MCP
        window.mcpTrackEvent('time_on_page', {
          page_path: pathname,
          time_seconds: timeSpent,
        });
        
        // Also use GA if available
        if (window.gtag) {
          window.gtag('event', 'time_on_page', {
            page_path: pathname,
            time_seconds: timeSpent,
          });
        }
      };
    }
  }, [pathname]);

  return (
    <>
      {/* Google Analytics (only if configured) */}
      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
            `}
          </Script>
        </>
      )}
      
      {/* MCP Setup */}
      <Script id="mcp-setup" strategy="afterInteractive">
        {`
          // Setup MCP subscribe function
          window.mcpSubscribe = async (email, firstName, lastName) => {
            try {
              const response = await fetch('/api/mcp/email-capture', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, firstName, lastName })
              });
              return await response.json();
            } catch (error) {
              console.error('Error subscribing:', error);
              return { success: false, error };
            }
          };
        `}
      </Script>      
      {/* Email Capture Popup Logic */}
      <Script id="email-capture" strategy="afterInteractive">
        {`
          // Exit intent detection
          document.addEventListener('mouseout', function(e) {
            // If the mouse leaves the top of the page
            if (e.clientY < 0 && !localStorage.getItem('popupShown')) {
              // Only show if user hasn't subscribed
              if (!localStorage.getItem('subscribed')) {
                // Create and show popup
                const popup = document.createElement('div');
                popup.className = 'popup-container';
                
                popup.innerHTML = '<div class="popup-content">' +
                  '<h2 style="margin-top: 0; font-size: 1.5rem; font-weight: 700; color: #1f2937;">Don\\'t miss out on crypto opportunities!</h2>' +
                  '<p style="margin-bottom: 1.5rem; color: #374151; font-size: 1rem;">Subscribe to get price alerts and market insights directly to your inbox.</p>' +
                  '<form id="popup-form" style="display: flex; flex-direction: column;">' +
                    '<input type="email" id="popup-email" class="popup-input" placeholder="Your email address" required />' +
                    '<button type="submit" class="popup-button">Get Price Alerts</button>' +
                  '</form>' +
                  '<p style="margin-top: 1rem; font-size: 0.875rem; color: #4b5563; text-align: center;">We respect your privacy and will never share your email.</p>' +
                  '<button id="popup-close" class="popup-close">✕</button>' +
                '</div>';
                
                document.body.appendChild(popup);
                
                // Close popup
                document.getElementById('popup-close').addEventListener('click', function() {
                  document.body.removeChild(popup);
                  localStorage.setItem('popupShown', 'true');
                });
                
                // Handle form submission
                document.getElementById('popup-form').addEventListener('submit', function(e) {
                  e.preventDefault();
                  const email = document.getElementById('popup-email').value;
                  
                  // Track event
                  if (window.mcpTrackEvent) {
                    window.mcpTrackEvent('email_subscription_attempt', { email });
                  }
                  
                  // Send to API using MCP
                  window.mcpSubscribe(email)
                    .then(data => {
                      if (data.success) {
                        localStorage.setItem('subscribed', 'true');
                        popup.innerHTML = '<div class="popup-content" style="text-align: center;">' +
                          '<h2 style="margin-top: 0; font-size: 1.5rem; font-weight: 700; color: #1f2937;">Thank you for subscribing!</h2>' +
                          '<p style="margin-bottom: 1.5rem; color: #374151; font-size: 1rem;">You\\'ll receive your first market update soon.</p>' +
                          '<button id="popup-close-success" class="popup-button">Close</button>' +
                        '</div>';
                        
                        // Track successful subscription
                        if (window.mcpTrackEvent) {
                          window.mcpTrackEvent('email_subscription_success', { email });
                        }
                        
                        document.getElementById('popup-close-success').addEventListener('click', function() {
                          document.body.removeChild(popup);
                        });
                      } else {
                        alert('There was an error subscribing. Please try again.');
                      }
                    })
                    .catch(error => {
                      // Track failed subscription
                      if (window.mcpTrackEvent) {
                        window.mcpTrackEvent('email_subscription_error', { email, error: error.toString() });
                      }
                      
                                            alert('There was an error subscribing. Please try again.');
                    });
                });
              }
              
              localStorage.setItem('popupShown', 'true');
            }
          });
        `}
      </Script>
    </>
  );
}
