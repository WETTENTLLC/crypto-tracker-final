'use client';
import { useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

// Add type definitions
declare global {
  interface Window {
    gtag: (command: string, action: string, params?: Record<string, unknown>) => void;
    dataLayer: Record<string, unknown>[];
    fbq: (action: string, event: string, params?: Record<string, unknown> | undefined) => void;
    rdt: (action: string, params?: Record<string, unknown> | undefined) => void;
    lintrk: (action: string, params?: Record<string, unknown> | undefined) => void;
    mcpTrackEvent: (eventName: string, eventData: Record<string, unknown>) => void;
    mcpSubscribe: (email: string, firstName?: string, lastName?: string) => Promise<{ success: boolean; error?: string; }>;
  }
}

// Component to implement automated user acquisition strategies
export default function UserAcquisitionAutomation() {
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
      {/* Google Analytics */}
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
      
      {/* Twitter Pixel */}
      <Script id="twitter-pixel" strategy="afterInteractive">
        {`
          !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
          },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
          a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
          twq('config','${process.env.NEXT_PUBLIC_TWITTER_PIXEL_ID}');
        `}
      </Script>
      
      {/* Facebook Pixel */}
      <Script id="facebook-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      
      {/* LinkedIn Insight Tag */}
      <Script id="linkedin-insight" strategy="afterInteractive">
        {`
          _linkedin_partner_id = "${process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID}";
          window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
          window._linkedin_data_partner_ids.push(_linkedin_partner_id);
          (function(l) {
            if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
            window.lintrk.q=[]}
            var s = document.getElementsByTagName("script")[0];
            var b = document.createElement("script");
            b.type = "text/javascript";b.async = true;
            b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
            s.parentNode.insertBefore(b, s);})(window.lintrk);
        `}
      </Script>
      
      {/* Reddit Pixel */}
      <Script id="reddit-pixel" strategy="afterInteractive">
        {`
          !function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);rdt('init','${process.env.NEXT_PUBLIC_REDDIT_PIXEL_ID}');rdt('track', 'PageVisit');
        `}
      </Script>
      
      {/* Email Capture Popup Logic */}
      <Script id="email-capture" strategy="afterInteractive">
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

          // Exit intent detection
          document.addEventListener('mouseout', function(e) {
            // If the mouse leaves the top of the page
            if (e.clientY < 0 && !localStorage.getItem('popupShown')) {
              // Only show if user hasn't subscribed
              if (!localStorage.getItem('subscribed')) {
                // Create and show popup
                const popup = document.createElement('div');
                popup.style.position = 'fixed';
                popup.style.top = '0';
                popup.style.left = '0';
                popup.style.width = '100%';
                popup.style.height = '100%';
                popup.style.backgroundColor = 'rgba(0,0,0,0.7)';
                popup.style.zIndex = '9999';
                popup.style.display = 'flex';
                popup.style.justifyContent = 'center';
                popup.style.alignItems = 'center';
                
                popup.innerHTML = \`
                  <div style="background-color: white; padding: 2rem; border-radius: 0.5rem; max-width: 500px; width: 90%;">
                    <h2 style="margin-top: 0;">Don't miss out on crypto opportunities!</h2>
                    <p>Subscribe to get price alerts and market insights directly to your inbox.</p>
                    <form id="popup-form" style="display: flex; flex-direction: column;">
                      <input type="email" id="popup-email" placeholder="Your email address" style="margin-bottom: 1rem; padding: 0.5rem;" required />
                      <button type="submit" style="background-color: #3b82f6; color: white; border: none; padding: 0.5rem; border-radius: 0.25rem;">Subscribe</button>
                    </form>
                    <button id="popup-close" style="background: none; border: none; position: absolute; top: 1rem; right: 1rem; cursor: pointer;">✕</button>
                  </div>
                \`;
                
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
                        popup.innerHTML = \`
                          <div style="background-color: white; padding: 2rem; border-radius: 0.5rem; max-width: 500px; width: 90%; text-align: center;">
                            <h2 style="margin-top: 0;">Thank you for subscribing!</h2>
                            <p>You'll receive your first market update soon.</p>
                            <button id="popup-close-success" style="background-color: #3b82f6; color: white; border: none; padding: 0.5rem; border-radius: 0.25rem; margin-top: 1rem;">Close</button>
                          </div>
                        \`;
                        
                        // Track successful subscription
                        if (window.mcpTrackEvent) {
                          window.mcpTrackEvent('email_subscription_success', { email });
                        }
                        
                        document.getElementById('popup-close-success').addEventListener('click', function() {
                          document.body.removeChild(popup);
                        });
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
