'use client';

import { useState, useEffect } from 'react';

interface AnalyticsStats {
  total: {
    pageViews: number;
    premiumClicks: number;
    paymentAttempts: number;
    paymentSuccess: number;
    emailSignups: number;
  };
  last24h: {
    pageViews: number;
    premiumClicks: number;
    paymentAttempts: number;
    paymentSuccess: number;
    emailSignups: number;
  };
  last7d: {
    pageViews: number;
    premiumClicks: number;
    paymentAttempts: number;
    paymentSuccess: number;
    emailSignups: number;
  };
  conversionRate: {
    premiumToPayment: string;
    paymentSuccess: string;
  };
  recentEvents: Array<{
    timestamp: string;
    event: string;
    page: string;
  }>;
}

export default function RealTimeAnalytics() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Track page view when component mounts
    trackEvent('page_view', window.location.pathname);
    
    // Set up interval to fetch analytics data
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/analytics');
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        const data = await response.json();
        setStats(data);
        setLoading(false);
      } catch (err) {
        setError('Error loading analytics data');
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Function to track events
  const trackEvent = async (event: string, page: string, metadata = {}) => {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event,
          page,
          metadata,
        }),
      });
    } catch (err) {
      console.error('Failed to track event:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-40 bg-gray-200 rounded mb-4"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="text-gray-500">No analytics data available</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Real-Time Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold mb-2">Last 24 Hours</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Page Views:</span>
              <span className="font-semibold">{stats.last24h.pageViews}</span>
            </div>
            <div className="flex justify-between">
              <span>Premium Clicks:</span>
              <span className="font-semibold">{stats.last24h.premiumClicks}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Attempts:</span>
              <span className="font-semibold">{stats.last24h.paymentAttempts}</span>
            </div>
            <div className="flex justify-between">
              <span>Successful Payments:</span>
              <span className="font-semibold text-green-600">{stats.last24h.paymentSuccess}</span>
            </div>
            <div className="flex justify-between">
              <span>Email Signups:</span>
              <span className="font-semibold">{stats.last24h.emailSignups}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold mb-2">Last 7 Days</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Page Views:</span>
              <span className="font-semibold">{stats.last7d.pageViews}</span>
            </div>
            <div className="flex justify-between">
              <span>Premium Clicks:</span>
              <span className="font-semibold">{stats.last7d.premiumClicks}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Attempts:</span>
              <span className="font-semibold">{stats.last7d.paymentAttempts}</span>
            </div>
            <div className="flex justify-between">
              <span>Successful Payments:</span>
              <span className="font-semibold text-green-600">{stats.last7d.paymentSuccess}</span>
            </div>
            <div className="flex justify-between">
              <span>Email Signups:</span>
              <span className="font-semibold">{stats.last7d.emailSignups}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold mb-2">Conversion Rates</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Premium → Payment:</span>
              <span className="font-semibold">{stats.conversionRate.premiumToPayment}%</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Success Rate:</span>
              <span className="font-semibold">{stats.conversionRate.paymentSuccess}%</span>
            </div>
            <div className="mt-4 pt-4 border-t border-green-200">
              <div className="text-lg font-semibold">Total Payments</div>
              <div className="text-2xl font-bold text-green-600">{stats.total.paymentSuccess}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Time</th>
                <th className="py-2 px-4 border-b text-left">Event</th>
                <th className="py-2 px-4 border-b text-left">Page</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentEvents.map((event, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="py-2 px-4 border-b">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span className={`
                      ${event.event === 'payment_success' ? 'text-green-600 font-semibold' : ''}
                      ${event.event === 'payment_attempt' ? 'text-blue-600' : ''}
                      ${event.event === 'premium_click' ? 'text-purple-600' : ''}
                    `}>
                      {event.event.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">{event.page}</td>
                </tr>
              ))}
              {stats.recentEvents.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-gray-500">
                    No recent events recorded
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 text-center">
        Data refreshes automatically every 30 seconds
      </div>
    </div>
  );
}

// Export the tracking function for use in other components
export function trackAnalyticsEvent(event: string, page: string, metadata = {}) {
  try {
    fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event,
        page,
        metadata,
      }),
    });
  } catch (err) {
    console.error('Failed to track event:', err);
  }
}