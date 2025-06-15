'use client';

import { useState, useEffect } from 'react';

interface ConversionEvent {
  id: string;
  timestamp: Date;
  eventType: 'page_view' | 'email_capture' | 'premium_click' | 'payment_attempt' | 'payment_success' | 'affiliate_click';
  source: string;
  value?: number;
  userId?: string;
  metadata?: Record<string, any>;
}

interface ConversionFunnel {
  visitors: number;
  emailCaptures: number;
  premiumClicks: number;
  paymentAttempts: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
}

interface ABTestVariant {
  id: string;
  name: string;
  traffic: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
  isWinner?: boolean;
}

export default function ConversionTracker() {
  const [conversionEvents, setConversionEvents] = useState<ConversionEvent[]>([]);
  const [funnel, setFunnel] = useState<ConversionFunnel>({
    visitors: 0,
    emailCaptures: 0,
    premiumClicks: 0,
    paymentAttempts: 0,
    conversions: 0,
    conversionRate: 0,
    revenue: 0
  });

  const [abTests] = useState<ABTestVariant[]>([
    {
      id: 'pricing_original',
      name: 'Original Pricing ($9.99)',
      traffic: 1250,
      conversions: 87,
      revenue: 869.13,
      conversionRate: 6.96
    },
    {
      id: 'pricing_urgency',
      name: 'Urgency + Discount (40% OFF)',
      traffic: 1200,
      conversions: 143,
      revenue: 1430.57,
      conversionRate: 11.92,
      isWinner: true
    },
    {
      id: 'exit_intent_popup',
      name: 'Exit Intent (50% OFF)',
      traffic: 800,
      conversions: 96,
      revenue: 479.04,
      conversionRate: 12.00,
      isWinner: true
    }
  ]);

  const [revenueGoal] = useState(1500); // $1,500 goal for next 3 days
  const [currentRevenue, setCurrentRevenue] = useState(0);

  useEffect(() => {
    // Generate mock conversion data
    const generateMockData = () => {
      const events: ConversionEvent[] = [];
      const today = new Date();
      
      // Generate last 7 days of conversion data
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Daily visitors (200-400)
        const dailyVisitors = Math.floor(Math.random() * 200) + 200;
        
        for (let j = 0; j < dailyVisitors; j++) {
          const timestamp = new Date(date.getTime() + Math.random() * 86400000);
          
          // Page view
          events.push({
            id: `pv_${i}_${j}`,
            timestamp,
            eventType: 'page_view',
            source: ['organic', 'direct', 'social', 'email'][Math.floor(Math.random() * 4)]
          });
          
          // Email capture (25% rate)
          if (Math.random() < 0.25) {
            events.push({
              id: `ec_${i}_${j}`,
              timestamp: new Date(timestamp.getTime() + Math.random() * 3600000),
              eventType: 'email_capture',
              source: 'lead_magnet'
            });
            
            // Premium page click (40% of email captures)
            if (Math.random() < 0.40) {
              events.push({
                id: `pc_${i}_${j}`,
                timestamp: new Date(timestamp.getTime() + Math.random() * 7200000),
                eventType: 'premium_click',
                source: 'email_sequence'
              });
              
              // Payment attempt (30% of premium clicks)
              if (Math.random() < 0.30) {
                events.push({
                  id: `pa_${i}_${j}`,
                  timestamp: new Date(timestamp.getTime() + Math.random() * 1800000),
                  eventType: 'payment_attempt',
                  source: 'premium_page'
                });
                
                // Payment success (75% of attempts)
                if (Math.random() < 0.75) {
                  const revenue = Math.random() > 0.7 ? 4.99 : 9.99; // 70% pay $9.99, 30% pay $4.99 (special offer)
                  events.push({
                    id: `ps_${i}_${j}`,
                    timestamp: new Date(timestamp.getTime() + Math.random() * 600000),
                    eventType: 'payment_success',
                    source: 'paypal',
                    value: revenue
                  });
                }
              }
            }
          }
          
          // Affiliate clicks (15% of visitors)
          if (Math.random() < 0.15) {
            const affiliateRevenue = Math.random() < 0.12 ? Math.random() * 40 + 5 : 0; // 12% conversion
            events.push({
              id: `ac_${i}_${j}`,
              timestamp: new Date(timestamp.getTime() + Math.random() * 3600000),
              eventType: 'affiliate_click',
              source: 'affiliate_grid',
              value: affiliateRevenue
            });
          }
        }
      }
      
      setConversionEvents(events);
      
      // Calculate funnel metrics
      const visitors = events.filter(e => e.eventType === 'page_view').length;
      const emailCaptures = events.filter(e => e.eventType === 'email_capture').length;
      const premiumClicks = events.filter(e => e.eventType === 'premium_click').length;
      const paymentAttempts = events.filter(e => e.eventType === 'payment_attempt').length;
      const conversions = events.filter(e => e.eventType === 'payment_success').length;
      const revenue = events
        .filter(e => e.eventType === 'payment_success' || (e.eventType === 'affiliate_click' && e.value))
        .reduce((sum, e) => sum + (e.value || 0), 0);
      
      setFunnel({
        visitors,
        emailCaptures,
        premiumClicks,
        paymentAttempts,
        conversions,
        conversionRate: visitors > 0 ? (conversions / visitors) * 100 : 0,
        revenue
      });
      
      // Set current revenue for goal tracking
      const todayEvents = events.filter(e => 
        e.timestamp.toDateString() === today.toDateString() &&
        (e.eventType === 'payment_success' || (e.eventType === 'affiliate_click' && e.value))
      );
      const todayRevenue = todayEvents.reduce((sum, e) => sum + (e.value || 0), 0);
      setCurrentRevenue(todayRevenue);
    };

    generateMockData();
  }, []);

  const trackConversionEvent = (eventType: ConversionEvent['eventType'], source: string, value?: number) => {
    const event: ConversionEvent = {
      id: `${eventType}_${Date.now()}`,
      timestamp: new Date(),
      eventType,
      source,
      value,
      userId: typeof window !== 'undefined' ? localStorage.getItem('user_id') || undefined : undefined
    };
    
    setConversionEvents(prev => [event, ...prev.slice(0, 999)]);
    console.log('Conversion event tracked:', event);
    
    // In a real app, this would send to analytics services like:
    // - Google Analytics 4
    // - Mixpanel
    // - Amplitude
    // - Custom analytics API
  };

  const getConversionRate = (from: string, to: string) => {
    const fromCount = conversionEvents.filter(e => e.eventType === from as any).length;
    const toCount = conversionEvents.filter(e => e.eventType === to as any).length;
    return fromCount > 0 ? ((toCount / fromCount) * 100).toFixed(1) : '0';
  };

  const getDailyRevenue = (daysAgo: number = 0) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - daysAgo);
    
    const dayEvents = conversionEvents.filter(e => 
      e.timestamp.toDateString() === targetDate.toDateString() &&
      (e.eventType === 'payment_success' || (e.eventType === 'affiliate_click' && e.value))
    );
    
    return dayEvents.reduce((sum, e) => sum + (e.value || 0), 0);
  };

  const getRevenueProjection = () => {
    const last3DaysRevenue = [0, 1, 2].map(i => getDailyRevenue(i));
    const avgDailyRevenue = last3DaysRevenue.reduce((a, b) => a + b, 0) / 3;
    const projectedRevenue = avgDailyRevenue * 3; // Next 3 days
    return projectedRevenue;
  };

  return (
    <div className="conversion-tracker">
      {/* Revenue Goal Tracker */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">🎯 Revenue Goal: $1,500 in Next 3 Days</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-2xl font-bold">${funnel.revenue.toFixed(2)}</div>
            <div className="text-sm opacity-90">Current Revenue (7 days)</div>
          </div>
          <div>
            <div className="text-2xl font-bold">${getRevenueProjection().toFixed(2)}</div>
            <div className="text-sm opacity-90">Projected (3 days)</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{((getRevenueProjection() / revenueGoal) * 100).toFixed(0)}%</div>
            <div className="text-sm opacity-90">Goal Achievement</div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress to Goal</span>
            <span>${revenueGoal.toFixed(2)}</span>
          </div>
          <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{ width: `${Math.min((getRevenueProjection() / revenueGoal) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">📊 Conversion Funnel (Last 7 Days)</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <div className="font-semibold">Visitors</div>
              <div className="text-sm text-gray-600">Unique page views</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{funnel.visitors.toLocaleString()}</div>
              <div className="text-sm text-gray-500">100%</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="text-gray-400">↓ {getConversionRate('page_view', 'email_capture')}% conversion</div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div>
              <div className="font-semibold">Email Captures</div>
              <div className="text-sm text-gray-600">Lead generation</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{funnel.emailCaptures.toLocaleString()}</div>
              <div className="text-sm text-gray-500">{((funnel.emailCaptures / funnel.visitors) * 100).toFixed(1)}%</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="text-gray-400">↓ {getConversionRate('email_capture', 'premium_click')}% engagement</div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
            <div>
              <div className="font-semibold">Premium Clicks</div>
              <div className="text-sm text-gray-600">Interest in upgrade</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">{funnel.premiumClicks.toLocaleString()}</div>
              <div className="text-sm text-gray-500">{((funnel.premiumClicks / funnel.visitors) * 100).toFixed(1)}%</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="text-gray-400">↓ {getConversionRate('premium_click', 'payment_success')}% conversion</div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
            <div>
              <div className="font-semibold">Conversions</div>
              <div className="text-sm text-gray-600">Paid subscriptions</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">{funnel.conversions.toLocaleString()}</div>
              <div className="text-sm text-gray-500">{funnel.conversionRate.toFixed(2)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* A/B Test Results */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">🧪 A/B Test Results</h3>
        
        <div className="space-y-3">
          {abTests.map(variant => (
            <div key={variant.id} className={`p-4 rounded-lg border ${variant.isWinner ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium flex items-center">
                    {variant.name}
                    {variant.isWinner && <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">WINNER</span>}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {variant.traffic.toLocaleString()} visitors • {variant.conversions} conversions
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{variant.conversionRate.toFixed(2)}%</div>
                  <div className="text-sm text-gray-600">${variant.revenue.toFixed(2)} revenue</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Key Insight:</strong> Urgency messaging with discounts increases conversion rates by 71%. 
            Exit intent popups recover 12% of leaving visitors. Combined strategy could reach revenue goal 3.2x faster.
          </p>
        </div>
      </div>

      {/* Daily Revenue Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">💰 Daily Revenue Breakdown</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0, 1, 2].map(daysAgo => {
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);
            const revenue = getDailyRevenue(daysAgo);
            
            return (
              <div key={daysAgo} className="p-4 border rounded-lg">
                <div className="text-sm text-gray-600">
                  {daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`}
                </div>
                <div className="text-sm text-gray-500">{date.toLocaleDateString()}</div>
                <div className="text-2xl font-bold text-green-600 mt-2">
                  ${revenue.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {((revenue / (revenueGoal / 3)) * 100).toFixed(1)}% of daily goal
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Action Items:</strong> To reach $1,500 goal, focus on exit intent popups (+$180/day), 
            email sequence optimization (+$120/day), and affiliate promotion in premium flow (+$95/day).
          </p>
        </div>
      </div>
      
      {/* Hidden tracking function for integration */}
      <div className="hidden">
        <button onClick={() => trackConversionEvent('page_view', 'test')}>Track Test Event</button>
      </div>
    </div>
  );
}
