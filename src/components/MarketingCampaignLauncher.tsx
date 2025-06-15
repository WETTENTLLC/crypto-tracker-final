'use client';

import { useState } from 'react';

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'social' | 'ads' | 'sms';
  status: 'draft' | 'active' | 'paused' | 'completed';
  audience: number;
  estimatedReach: number;
  estimatedRevenue: number;
  cost: number;
  roi: number;
  launchTime: string;
}

const MarketingCampaignLauncher = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 'flash-sale-email',
      name: '24h Flash Sale Email Blast',
      type: 'email',
      status: 'draft',
      audience: 2847,
      estimatedReach: 1423,
      estimatedRevenue: 285.60,
      cost: 0,
      roi: 100,
      launchTime: 'Ready to launch'
    },
    {
      id: 'social-urgency',
      name: 'Social Media Urgency Campaign',
      type: 'social',
      status: 'draft',
      audience: 5632,
      estimatedReach: 1689,
      estimatedRevenue: 168.90,
      cost: 25,
      roi: 675,
      launchTime: 'Ready to launch'
    },
    {
      id: 'retargeting-ads',
      name: 'Premium Retargeting Ads',
      type: 'ads',
      status: 'active',
      audience: 1234,
      estimatedReach: 987,
      estimatedRevenue: 493.50,
      cost: 75,
      roi: 658,
      launchTime: '2 hours ago'
    },
    {
      id: 'sms-lastchance',
      name: 'Last Chance SMS Campaign',
      type: 'sms',
      status: 'draft',
      audience: 892,
      estimatedReach: 801,
      estimatedRevenue: 240.30,
      cost: 15,
      roi: 1602,
      launchTime: 'Ready to launch'
    }
  ]);

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'email' as 'email' | 'social' | 'ads' | 'sms',
    audience: 0,
    isCreating: false
  });

  const quickTemplates = [
    {
      name: '50% OFF Flash Sale',
      type: 'email',
      subject: '⚡ FLASH SALE: 50% OFF Premium - 24 Hours Only!',
      estimatedRevenue: 450,
      audience: 2847,
      icon: '📧'
    },
    {
      name: 'Exit Intent Special',
      type: 'email', 
      subject: 'Wait! Don\'t miss your 60% discount...',
      estimatedRevenue: 320,
      audience: 1234,
      icon: '🚪'
    },
    {
      name: 'Social Media Buzz',
      type: 'social',
      subject: 'Limited time crypto tracking premium deal!',
      estimatedRevenue: 280,
      audience: 5632,
      icon: '📱'
    },
    {
      name: 'Retargeting Campaign',
      type: 'ads',
      subject: 'Complete your premium upgrade',
      estimatedRevenue: 520,
      audience: 987,
      icon: '🎯'
    },
    {
      name: 'Urgency SMS Blast',
      type: 'sms',
      subject: 'CryptoTracker: Only 3 hours left for 50% OFF!',
      estimatedRevenue: 240,
      audience: 892,
      icon: '📲'
    },
    {
      name: 'Weekend Special',
      type: 'email',
      subject: '🎉 Weekend Special: Premium for $4.99',
      estimatedRevenue: 390,
      audience: 2156,
      icon: '🎉'
    }
  ];

  const campaignMetrics = {
    totalEstimatedRevenue: campaigns.reduce((sum, c) => sum + c.estimatedRevenue, 0),
    totalAudience: campaigns.reduce((sum, c) => sum + c.audience, 0),
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    averageROI: campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.length
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return '📧';
      case 'social': return '📱';
      case 'ads': return '🎯';
      case 'sms': return '📲';
      default: return '📊';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const launchCampaign = (campaignId: string) => {
    setCampaigns(campaigns.map(c => 
      c.id === campaignId 
        ? { ...c, status: 'active' as const, launchTime: 'Just launched' }
        : c
    ));
  };

  const createFromTemplate = (template: typeof quickTemplates[0]) => {
    const newCampaignData: Campaign = {
      id: `campaign-${Date.now()}`,
      name: template.name,
      type: template.type as 'email' | 'social' | 'ads' | 'sms', // Added type assertion
      status: 'draft',
      audience: template.audience,
      estimatedReach: Math.floor(template.audience * 0.5),
      estimatedRevenue: template.estimatedRevenue,
      cost: template.type === 'ads' ? 50 : template.type === 'sms' ? 15 : 0,
      roi: template.type === 'ads' ? 900 : template.type === 'sms' ? 1600 : 100,
      launchTime: 'Ready to launch'
    };
    
    setCampaigns([...campaigns, newCampaignData]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">🚀 Campaign Launcher</h3>
          <p className="text-sm text-gray-600 mt-1">Deploy high-impact marketing campaigns in minutes</p>
        </div>
        <button
          onClick={() => setNewCampaign({ ...newCampaign, isCreating: true })}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Campaign
        </button>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Est. Revenue</p>
              <p className="text-2xl font-bold text-blue-900">${campaignMetrics.totalEstimatedRevenue.toFixed(0)}</p>
            </div>
            <div className="text-blue-500">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Audience</p>
              <p className="text-2xl font-bold text-green-900">{campaignMetrics.totalAudience.toLocaleString()}</p>
            </div>
            <div className="text-green-500">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Active Campaigns</p>
              <p className="text-2xl font-bold text-purple-900">{campaignMetrics.activeCampaigns}</p>
            </div>
            <div className="text-purple-500">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 4.414V13a1 1 0 11-2 0V4.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Avg ROI</p>
              <p className="text-2xl font-bold text-orange-900">{campaignMetrics.averageROI.toFixed(0)}%</p>
            </div>
            <div className="text-orange-500">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launch Templates */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">⚡ Quick Launch Templates</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickTemplates.map((template, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{template.icon}</span>
                  <div>
                    <h5 className="font-medium text-gray-900">{template.name}</h5>
                    <p className="text-xs text-gray-500">{template.type.toUpperCase()}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Est. Revenue:</span>
                  <span className="font-semibold text-green-600">${template.estimatedRevenue}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Audience:</span>
                  <span className="font-medium">{template.audience.toLocaleString()}</span>
                </div>
              </div>
              
              <button 
                onClick={() => createFromTemplate(template)}
                className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Use Template
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Campaign List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">📋 Campaign Management</h4>
        <div className="space-y-3">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{getTypeIcon(campaign.type)}</span>
                  <div>
                    <h5 className="font-medium text-gray-900">{campaign.name}</h5>
                    <p className="text-sm text-gray-500">{campaign.launchTime}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                  {campaign.status === 'draft' && (
                    <button
                      onClick={() => launchCampaign(campaign.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      Launch Now
                    </button>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Audience</p>
                  <p className="font-semibold">{campaign.audience.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Est. Reach</p>
                  <p className="font-semibold">{campaign.estimatedReach.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Est. Revenue</p>
                  <p className="font-semibold text-green-600">${campaign.estimatedRevenue.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Cost</p>
                  <p className="font-semibold">${campaign.cost}</p>
                </div>
                <div>
                  <p className="text-gray-600">ROI</p>
                  <p className="font-semibold text-blue-600">{campaign.roi}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Tips */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">💡 Campaign Success Tips</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-green-800 mb-2">🎯 High-Converting Elements</h5>
            <ul className="list-disc list-inside text-xs text-gray-500 space-y-1">
              <li>• Use urgency language (&quot;Last 24 hours&quot;, &quot;Limited time&quot;)</li>
              <li>• Include specific discount percentages (50% OFF vs &quot;Big Discount&quot;)</li>
              <li>• Clear Call-to-Action (CTA)</li>
              <li>• Personalize with user&apos;s crypto interests</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingCampaignLauncher;
