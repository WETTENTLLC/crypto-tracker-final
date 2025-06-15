"use client";

import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, BarChart2, Zap, Target, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';

interface AffiliatePartner {
  id: string;
  name: string;
  logo: string;
  category: 'exchange' | 'wallet' | 'platform' | 'education' | 'tool';
  commission: number;
  description: string;
  features: string[];
  ctaText: string;
  affiliateLink: string;
  trustScore: number;
  userRating: number;
  isSponsored: boolean;
  revenueShare: number; // percentage of commission we earn
}

interface AffiliateClick {
  partnerId: string;
  timestamp: Date;
  userId?: string;
  source: string;
  revenue?: number;
}

export default function AffiliateMarketingTracker() {
  const [affiliatePartners] = useState<AffiliatePartner[]>([
    {
      id: 'binance',
      name: 'Binance',
      logo: '🟡',
      category: 'exchange',
      commission: 40,
      description: 'World\'s largest crypto exchange with lowest fees',
      features: ['0.1% trading fees', 'Spot & Futures trading', '300+ cryptocurrencies', '24/7 customer support'],
      ctaText: 'Get 20% Fee Discount',
      affiliateLink: 'https://binance.com/ref/cryptotracker',
      trustScore: 9.5,
      userRating: 4.7,
      isSponsored: true,
      revenueShare: 40
    },
    {
      id: 'coinbase',
      name: 'Coinbase',
      logo: '🔵',
      category: 'exchange',
      commission: 50,
      description: 'Most trusted crypto exchange for beginners',
      features: ['User-friendly interface', 'Bank transfers', 'DeFi features', 'Secure storage'],
      ctaText: 'Get $10 Free Bitcoin',
      affiliateLink: 'https://coinbase.com/join/cryptotracker',
      trustScore: 9.2,
      userRating: 4.5,
      isSponsored: true,
      revenueShare: 50
    },
    {
      id: 'ledger',
      name: 'Ledger',
      logo: '🔒',
      category: 'wallet',
      commission: 15,
      description: 'Hardware wallet for maximum security',
      features: ['Offline storage', 'Supports 1,800+ coins', 'Bluetooth connectivity', 'Mobile app'],
      ctaText: 'Secure Your Crypto',
      affiliateLink: 'https://ledger.com/ref/cryptotracker',
      trustScore: 9.8,
      userRating: 4.8,
      isSponsored: false,
      revenueShare: 15
    },
    {
      id: 'tradingview',
      name: 'TradingView',
      logo: '📈',
      category: 'tool',
      commission: 25,
      description: 'Professional charting and analysis tools',
      features: ['Advanced charts', 'Technical indicators', 'Social trading', 'Price alerts'],
      ctaText: 'Try Pro Free',
      affiliateLink: 'https://tradingview.com/ref/cryptotracker',
      trustScore: 9.0,
      userRating: 4.6,
      isSponsored: false,
      revenueShare: 25
    },
    {
      id: 'cryptocom',
      name: 'Crypto.com',
      logo: '💳',
      category: 'platform',
      commission: 30,
      description: 'Crypto trading with rewards credit card',
      features: ['Visa card rewards', 'Staking rewards', 'DeFi features', 'No fees'],
      ctaText: 'Get $25 Sign-up Bonus',
      affiliateLink: 'https://crypto.com/app/cryptotracker',
      trustScore: 8.8,
      userRating: 4.4,
      isSponsored: true,
      revenueShare: 30
    },
    {
      id: 'blockfi',
      name: 'BlockFi',
      logo: '🏦',
      category: 'platform',
      commission: 35,
      description: 'Earn interest on your cryptocurrency',
      features: ['Up to 8.5% APY', 'Crypto-backed loans', 'No minimum balance', 'FDIC insured'],
      ctaText: 'Start Earning Interest',
      affiliateLink: 'https://blockfi.com/ref/cryptotracker',
      trustScore: 8.5,
      userRating: 4.3,
      isSponsored: false,
      revenueShare: 35
    }
  ]);

  const [clickData, setClickData] = useState<AffiliateClick[]>([]);
  const [dailyRevenue, setDailyRevenue] = useState<number>(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(0);

  useEffect(() => {
    // Simulate affiliate tracking data
    const generateMockData = () => {
      const mockClicks: AffiliateClick[] = [];
      const today = new Date();
      
      // Generate last 30 days of data
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Random number of clicks per day (5-25)
        const clicksPerDay = Math.floor(Math.random() * 20) + 5;
        
        for (let j = 0; j < clicksPerDay; j++) {
          const randomPartner = affiliatePartners[Math.floor(Math.random() * affiliatePartners.length)];
          const hasConversion = Math.random() < 0.15; // 15% conversion rate
          
          mockClicks.push({
            partnerId: randomPartner.id,
            timestamp: new Date(date.getTime() + Math.random() * 86400000),
            source: ['premium_page', 'dashboard', 'newsletter', 'blog'][Math.floor(Math.random() * 4)],
            revenue: hasConversion ? Math.random() * 50 + 10 : undefined
          });
        }
      }
      
      setClickData(mockClicks);
      
      // Calculate revenue
      const todayClicks = mockClicks.filter(click => 
        click.timestamp.toDateString() === today.toDateString()
      );
      const todayRevenue = todayClicks.reduce((sum, click) => sum + (click.revenue || 0), 0);
      setDailyRevenue(todayRevenue);
      
      const monthRevenue = mockClicks.reduce((sum, click) => sum + (click.revenue || 0), 0);
      setMonthlyRevenue(monthRevenue);
    };

    generateMockData();
  }, [affiliatePartners]);

  const trackAffiliateClick = (partnerId: string, source: string = 'direct') => {
    const partner = affiliatePartners.find(p => p.id === partnerId);
    if (!partner) return;

    // In a real app, this would:
    // 1. Track the click in analytics
    // 2. Set affiliate cookies
    // 3. Redirect to partner with tracking parameters
    console.log(`Affiliate click tracked: ${partner.name} from ${source}`);
    
    // Add to local tracking
    const newClick: AffiliateClick = {
      partnerId,
      timestamp: new Date(),
      source,
    };
    
    setClickData(prev => [newClick, ...prev.slice(0, 99)]); // Keep last 100 clicks
    
    // Open affiliate link
    window.open(partner.affiliateLink, '_blank');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'exchange': return '🏪';
      case 'wallet': return '💰';
      case 'platform': return '🌐';
      case 'education': return '📚';
      case 'tool': return '🛠️';
      default: return '🔗';
    }
  };

  const getTopPerformers = () => {
    const revenue = clickData.reduce((acc, click) => {
      if (click.revenue) {
        acc[click.partnerId] = (acc[click.partnerId] || 0) + click.revenue;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(revenue)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([partnerId, revenue]) => ({
        partner: affiliatePartners.find(p => p.id === partnerId),
        revenue
      }));
  };

  return (
    <div className="affiliate-marketing-tracker">
      {/* Revenue Dashboard */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">💰 Affiliate Revenue Dashboard</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">${dailyRevenue.toFixed(2)}</div>
            <div className="text-sm text-blue-700">Today&apos;s Revenue</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">${monthlyRevenue.toFixed(2)}</div>
            <div className="text-sm text-green-700">Monthly Revenue</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{clickData.length}</div>
            <div className="text-sm text-purple-700">Total Clicks</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{((clickData.filter(c => c.revenue).length / clickData.length) * 100).toFixed(1)}%</div>
            <div className="text-sm text-orange-700">Conversion Rate</div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="mb-4">
          <h4 className="font-medium mb-2">🏆 Top Performing Partners</h4>
          <div className="space-y-2">
            {getTopPerformers().map((item) => (
              <div key={item.partner?.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center">
                  <span className="text-lg mr-2">{item.partner?.logo}</span>
                  <span className="font-medium">{item.partner?.name}</span>
                </div>
                <span className="text-green-600 font-semibold">${item.revenue.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Affiliate Partners Grid */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">🤝 Partner Recommendations</h3>
          <div className="text-sm text-gray-600">
            Earn up to ${(monthlyRevenue * 1.5).toFixed(0)}/month potential
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {affiliatePartners.map(partner => (
            <div key={partner.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{partner.logo}</span>
                  <div>
                    <h4 className="font-semibold">{partner.name}</h4>
                    <div className="text-xs text-gray-500 flex items-center">
                      <span className="mr-2">{getCategoryIcon(partner.category)}</span>
                      <span>★ {partner.userRating}</span>
                      {partner.isSponsored && (
                        <span className="ml-2 bg-blue-100 text-blue-800 px-1 rounded text-xs">Sponsored</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className="text-green-600 font-semibold">{partner.commission}% commission</div>
                  <div className="text-gray-500">Trust: {partner.trustScore}/10</div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{partner.description}</p>
              
              <ul className="text-xs text-gray-600 mb-3 space-y-1">
                {partner.features.slice(0, 2).map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-green-500 mr-1">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => trackAffiliateClick(partner.id, 'partner_grid')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded transition-colors"
              >
                {partner.ctaText}
              </button>
              
              <div className="text-xs text-gray-500 mt-2 text-center">
                Revenue potential: ${(partner.revenueShare * 2).toFixed(0)}/month
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-800 mb-2">💡 Revenue Optimization Tips</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Strategic placement in premium onboarding can increase conversions by 45%</li>
            <li>• Email newsletter promotions generate 2.3x higher conversion rates</li>
            <li>• Exit-intent popups with affiliate offers recover 12% of leaving visitors</li>
            <li>• Educational content with relevant affiliate links converts at 18% vs 8% for direct ads</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
