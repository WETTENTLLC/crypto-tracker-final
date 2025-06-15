'use client';

import { useState, useEffect } from 'react';

export default function VisitorCounter() {
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [recentSignups, setRecentSignups] = useState<number>(0);

  useEffect(() => {
    // Simulate real-time visitor counting with some realistic fluctuation
    const baseVisitors = 89;
    const baseSignups = 23;
    
    // Generate a realistic visitor count between 80-120
    const generateVisitorCount = () => {
      const variation = Math.floor(Math.random() * 40) - 20; // -20 to +20
      return Math.max(60, baseVisitors + variation);
    };
    
    // Generate signup count between 15-35
    const generateSignupCount = () => {
      const variation = Math.floor(Math.random() * 20) - 10; // -10 to +10
      return Math.max(10, baseSignups + variation);
    };

    // Set initial counts
    setVisitorCount(generateVisitorCount());
    setRecentSignups(generateSignupCount());

    // Update counts every 10-30 seconds to simulate real activity
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance to update
        setVisitorCount(generateVisitorCount());
      }
      if (Math.random() > 0.8) { // 20% chance to update signups
        setRecentSignups(generateSignupCount());
      }
    }, Math.random() * 20000 + 10000); // 10-30 seconds

    return () => clearInterval(interval);
  }, []);

  if (visitorCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900">
            <span className="font-bold text-green-600">{visitorCount}</span> people viewing this page
          </div>
          <div className="text-xs text-gray-500 mt-1">
            <span className="font-bold text-blue-600">{recentSignups}</span> signed up in the last hour
          </div>
        </div>
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
}
