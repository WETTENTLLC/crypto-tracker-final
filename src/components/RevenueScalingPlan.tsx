'use client';

import { useState, useEffect } from 'react';

interface ScalingOpportunity {
  id: string;
  title: string;
  description: string;
  potentialRevenue: number;
  effort: 'Low' | 'Medium' | 'High';
  timeframe: string;
  impact: 'Low' | 'Medium' | 'High';
  status: 'Ready' | 'In Progress' | 'Planned';
  category: 'Pricing' | 'Marketing' | 'Product' | 'Operations';
}

const RevenueScalingPlan = () => {
  const [scalingOpportunities, setScalingOpportunities] = useState<ScalingOpportunity[]>([
    {
      id: '1',
      title: 'Double Exit Intent Popup Reach',
      description: 'Expand exit intent detection to mobile users and add scroll-based triggers',
      potentialRevenue: 800,
      effort: 'Low',
      timeframe: '1-2 days',
      impact: 'High',
      status: 'Ready',
      category: 'Marketing'
    },
    {
      id: '2',
      title: 'Launch Enterprise Tier ($49.99/month)',
      description: 'Create premium enterprise tier with advanced analytics and API access',
      potentialRevenue: 1200,
      effort: 'Medium',
      timeframe: '3-5 days',
      impact: 'High',
      status: 'Ready',
      category: 'Pricing'
    },
    {
      id: '3',
      title: 'Automated Upsell Flow',
      description: 'Add checkout upsells for premium features and annual plans',
      potentialRevenue: 600,
      effort: 'Low',
      timeframe: '1 day',
      impact: 'Medium',
      status: 'Ready',
      category: 'Marketing'
    },
    {
      id: '4',
      title: 'Referral Program Launch',
      description: 'Implement referral system with $5 credit for referrer and referee',
      potentialRevenue: 900,
      effort: 'Medium',
      timeframe: '2-3 days',
      impact: 'High',
      status: 'Planned',
      category: 'Marketing'
    },
    {
      id: '5',
      title: 'API Monetization',
      description: 'Launch developer API access with usage-based pricing',
      potentialRevenue: 1500,
      effort: 'High',
      timeframe: '5-7 days',
      impact: 'High',
      status: 'Planned',
      category: 'Product'
    },
    {
      id: '6',
      title: 'International Pricing Optimization',
      description: 'Implement purchasing power parity pricing for global markets',
      potentialRevenue: 400,
      effort: 'Medium',
      timeframe: '2-4 days',
      impact: 'Medium',
      status: 'Planned',
      category: 'Pricing'
    },
    {
      id: '7',
      title: 'White-label Solution',
      description: 'Offer branded crypto tracker for other businesses',
      potentialRevenue: 2000,
      effort: 'High',
      timeframe: '7-10 days',
      impact: 'High',
      status: 'Planned',
      category: 'Product'
    },
    {
      id: '8',
      title: 'Flash Sale Automation',
      description: 'Automated weekend and holiday flash sales with dynamic pricing',
      potentialRevenue: 500,
      effort: 'Low',
      timeframe: '1 day',
      impact: 'Medium',
      status: 'Ready',
      category: 'Marketing'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'revenue' | 'effort' | 'timeframe'>('revenue');

  const categories = ['All', 'Pricing', 'Marketing', 'Product', 'Operations'];

  const filteredOpportunities = scalingOpportunities
    .filter(opp => selectedCategory === 'All' || opp.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'revenue') return b.potentialRevenue - a.potentialRevenue;
      if (sortBy === 'effort') {
        const effortOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
        return effortOrder[a.effort] - effortOrder[b.effort];
      }
      return 0;
    });

  const totalPotentialRevenue = filteredOpportunities.reduce((sum, opp) => sum + opp.potentialRevenue, 0);
  const readyOpportunities = filteredOpportunities.filter(opp => opp.status === 'Ready');

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Low': return 'text-green-600';
      case 'Medium': return 'text-orange-600';
      case 'High': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready': return 'bg-green-100 text-green-800 border-green-300';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Planned': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Pricing': return '💰';
      case 'Marketing': return '📢';
      case 'Product': return '🚀';
      case 'Operations': return '⚙️';
      default: return '📋';
    }
  };

  const implementOpportunity = (id: string) => {
    setScalingOpportunities(prev => 
      prev.map(opp => 
        opp.id === id 
          ? { ...opp, status: 'In Progress' as const }
          : opp
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Revenue Scaling Plan</h2>
          <p className="text-gray-600 mt-1">Opportunities to scale from $1,973 to $10,000+ monthly</p>
        </div>
        <div className="mt-4 lg:mt-0 flex items-center space-x-4">
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
            <p className="text-sm text-green-600">Total Potential</p>
            <p className="text-xl font-bold text-green-800">${totalPotentialRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-2xl mr-3">⚡</div>
            <div>
              <p className="text-sm text-blue-600">Ready to Implement</p>
              <p className="text-xl font-bold text-blue-800">{readyOpportunities.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-2xl mr-3">💰</div>
            <div>
              <p className="text-sm text-green-600">Quick Win Revenue</p>
              <p className="text-xl font-bold text-green-800">
                ${readyOpportunities.reduce((sum, opp) => sum + opp.potentialRevenue, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-2xl mr-3">🎯</div>
            <div>
              <p className="text-sm text-purple-600">High Impact Items</p>
              <p className="text-xl font-bold text-purple-800">
                {filteredOpportunities.filter(opp => opp.impact === 'High').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-2xl mr-3">⏱️</div>
            <div>
              <p className="text-sm text-orange-600">Low Effort Wins</p>
              <p className="text-xl font-bold text-orange-800">
                {filteredOpportunities.filter(opp => opp.effort === 'Low').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category !== 'All' && getCategoryIcon(category)} {category}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'revenue' | 'effort' | 'timeframe')}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="revenue">Sort by Revenue</option>
          <option value="effort">Sort by Effort</option>
          <option value="timeframe">Sort by Timeframe</option>
        </select>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOpportunities.map((opportunity) => (
          <div
            key={opportunity.id}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getCategoryIcon(opportunity.category)}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{opportunity.title}</h3>
                  <p className="text-sm text-gray-600">{opportunity.category}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(opportunity.status)}`}>
                {opportunity.status}
              </div>
            </div>

            <p className="text-gray-700 mb-4">{opportunity.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Potential Revenue</p>
                <p className="text-xl font-bold text-green-600">${opportunity.potentialRevenue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Timeframe</p>
                <p className="font-medium text-gray-900">{opportunity.timeframe}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEffortColor(opportunity.effort)}`}>
                    {opportunity.effort} Effort
                  </span>
                </div>
                <div>
                  <span className={`text-sm font-medium ${getImpactColor(opportunity.impact)}`}>
                    {opportunity.impact} Impact
                  </span>
                </div>
              </div>
            </div>

            {opportunity.status === 'Ready' && (
              <button
                onClick={() => implementOpportunity(opportunity.id)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                🚀 Implement Now
              </button>
            )}
            
            {opportunity.status === 'In Progress' && (
              <div className="w-full bg-blue-50 border border-blue-200 text-blue-700 font-medium py-2 px-4 rounded-lg text-center">
                ⏳ In Progress
              </div>
            )}
            
            {opportunity.status === 'Planned' && (
              <div className="w-full bg-gray-50 border border-gray-200 text-gray-600 font-medium py-2 px-4 rounded-lg text-center">
                📅 Planned
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Implementation Timeline */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🗓️ Recommended Implementation Timeline</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-white rounded border-l-4 border-green-500">
            <div className="font-medium text-green-700">Week 1 (Days 1-3):</div>
            <div className="text-gray-700">Exit Intent Expansion, Upsell Flow, Flash Sale Automation</div>
            <div className="ml-auto font-bold text-green-600">+$1,900</div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white rounded border-l-4 border-blue-500">
            <div className="font-medium text-blue-700">Week 2 (Days 4-7):</div>
            <div className="text-gray-700">Enterprise Tier Launch, Referral Program, International Pricing</div>
            <div className="ml-auto font-bold text-blue-600">+$2,500</div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white rounded border-l-4 border-purple-500">
            <div className="font-medium text-purple-700">Week 3 (Days 8-14):</div>
            <div className="text-gray-700">API Monetization, White-label Development</div>
            <div className="ml-auto font-bold text-purple-600">+$3,500</div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800">Projected 2-Week Revenue Increase:</p>
              <p className="text-sm text-gray-600">Current: $1,973 → Projected: $9,873</p>
            </div>
            <div className="text-2xl font-bold text-green-600">+$7,900</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueScalingPlan;
