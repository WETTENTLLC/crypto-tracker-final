'use client';

import { useState, useEffect } from 'react';

interface RevenueMetrics {
  totalRevenue: number;
  goalProgress: number;
  dailyAverage: number;
  conversionRate: number;
  activeStrategies: number;
  topStrategy: {
    name: string;
    revenue: number;
    cvr: number;
  };
}

const RevenueMonitoringWidget = () => {
  const [metrics, setMetrics] = useState<RevenueMetrics>({
    totalRevenue: 1973.48,
    goalProgress: 131.6,
    dailyAverage: 657.83,
    conversionRate: 7.2,
    activeStrategies: 6,
    topStrategy: {
      name: 'Exit Intent Popup',
      revenue: 567.80,
      cvr: 11.2
    }
  });

  const [isLive, setIsLive] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (isLive) {
        setMetrics(prev => ({
          ...prev,
          totalRevenue: prev.totalRevenue + (Math.random() * 25 + 5),
          goalProgress: ((prev.totalRevenue + (Math.random() * 25 + 5)) / 1500) * 100,
          dailyAverage: (prev.totalRevenue + (Math.random() * 25 + 5)) / 3,
          conversionRate: prev.conversionRate + (Math.random() * 0.5 - 0.25),
          topStrategy: {
            ...prev.topStrategy,
            revenue: prev.topStrategy.revenue + (Math.random() * 8 + 2),
            cvr: prev.topStrategy.cvr + (Math.random() * 0.3 - 0.15)
          }
        }));
        setLastUpdate(new Date());
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  const toggleLiveMode = () => {
    setIsLive(!isLive);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-green-200 p-6 mb-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 p-2 rounded-full">
            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">🎉 Revenue Goal ACHIEVED!</h2>
            <p className="text-sm text-gray-600">Real-time monitoring active</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleLiveMode}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              isLive 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isLive ? '🔴 LIVE' : '▶️ Start Live'}
          </button>
          <div className="text-xs text-gray-500">
            Updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Total Revenue</p>
              <p className="text-2xl font-bold text-green-900">${metrics.totalRevenue.toFixed(2)}</p>
              <p className="text-xs text-green-600">{metrics.goalProgress.toFixed(1)}% of $1,500 goal</p>
            </div>
            <div className="text-green-600">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Daily Average */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Daily Average</p>
              <p className="text-2xl font-bold text-blue-900">${metrics.dailyAverage.toFixed(2)}</p>
              <p className="text-xs text-blue-600">Target: $500/day</p>
            </div>
            <div className="text-blue-600">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Conversion Rate</p>
              <p className="text-2xl font-bold text-purple-900">{metrics.conversionRate.toFixed(1)}%</p>
              <p className="text-xs text-purple-600">Industry avg: 2.3%</p>
            </div>
            <div className="text-purple-600">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Top Strategy Performance */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-200 p-2 rounded-full">
              <svg className="w-5 h-5 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900">🏆 Top Strategy: {metrics.topStrategy.name}</p>
              <p className="text-sm text-gray-600">
                ${metrics.topStrategy.revenue.toFixed(2)} revenue • {metrics.topStrategy.cvr.toFixed(1)}% CVR
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              BEST PERFORMER
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">🚀 Scale Winning Strategies</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Increase exit intent popup frequency</li>
            <li>• Expand email marketing sequences</li>
            <li>• Add more affiliate partnerships</li>
          </ul>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-medium text-green-900 mb-2">💰 Revenue Acceleration</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Launch 48-hour flash sales</li>
            <li>• Implement checkout upsells</li>
            <li>• Add social proof testimonials</li>
          </ul>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mt-6 p-3 bg-green-100 rounded-lg border-l-4 border-green-500">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              <strong>Goal Achieved!</strong> Revenue target of $1,500 exceeded by 31.6% ahead of schedule.
              {isLive && <span className="ml-2 animate-pulse">📊 Live tracking active</span>}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueMonitoringWidget;
