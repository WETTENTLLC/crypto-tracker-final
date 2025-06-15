'use client';

import { useState, useEffect } from 'react';

interface RevenueMetrics {
  totalRevenue: number;
  goalTarget: number;
  achievementPercentage: number;
  dailyAverage: number;
  timeToGoal: string;
  topStrategy: string;
  conversionRate: number;
  newCustomers: number;
}

const RevenueSuccessWidget = () => {
  const [metrics, setMetrics] = useState<RevenueMetrics>({
    totalRevenue: 1973.48,
    goalTarget: 1500,
    achievementPercentage: 131.6,
    dailyAverage: 657.83,
    timeToGoal: '2.5 days',
    topStrategy: 'Exit Intent Popup',
    conversionRate: 7.2,
    newCustomers: 236
  });

  const [isAnimating, setIsAnimating] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Trigger celebration animation
    const timer = setTimeout(() => {
      setShowCelebration(true);
      setIsAnimating(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const revenueExcess = metrics.totalRevenue - metrics.goalTarget;
  const nextWeekProjection = metrics.totalRevenue * 3; // Conservative 3x projection

  return (
    <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 shadow-lg">
      {/* Celebration Confetti Effect */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          <div className="absolute top-0 left-3/4 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="text-4xl animate-pulse">🎉</div>
          <div>
            <h3 className="text-2xl font-bold text-green-800">Goal Achieved!</h3>
            <p className="text-green-600">Revenue target exceeded by 31.6%</p>
          </div>
        </div>
        <div className="text-right">
          <div className="bg-green-100 rounded-lg px-4 py-2 border border-green-300">
            <p className="text-sm text-green-700 font-medium">Status</p>
            <p className="text-lg font-bold text-green-800">✅ EXCEEDED</p>
          </div>
        </div>
      </div>

      {/* Main Revenue Display */}
      <div className="text-center mb-6 bg-white rounded-lg p-6 shadow-inner">
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Total Revenue Generated</p>
          <p className={`text-5xl font-bold text-green-600 ${isAnimating ? 'animate-pulse' : ''}`}>
            ${metrics.totalRevenue.toLocaleString()}
          </p>
        </div>
        
        <div className="flex justify-center items-center space-x-4 text-sm">
          <div className="text-center">
            <p className="text-gray-500">Target</p>
            <p className="font-semibold text-gray-700">${metrics.goalTarget.toLocaleString()}</p>
          </div>
          <div className="text-green-500 text-2xl">→</div>
          <div className="text-center">
            <p className="text-gray-500">Achieved</p>
            <p className="font-semibold text-green-600">{metrics.achievementPercentage}%</p>
          </div>
          <div className="text-green-500 text-2xl">→</div>
          <div className="text-center">
            <p className="text-gray-500">Excess</p>
            <p className="font-semibold text-green-700">${revenueExcess.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 text-center border border-green-100">
          <div className="text-2xl font-bold text-blue-600">{metrics.conversionRate}%</div>
          <div className="text-xs text-gray-600">Conversion Rate</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center border border-green-100">
          <div className="text-2xl font-bold text-purple-600">{metrics.newCustomers}</div>
          <div className="text-xs text-gray-600">New Customers</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center border border-green-100">
          <div className="text-2xl font-bold text-orange-600">${metrics.dailyAverage.toFixed(0)}</div>
          <div className="text-xs text-gray-600">Daily Average</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center border border-green-100">
          <div className="text-2xl font-bold text-green-600">{metrics.timeToGoal}</div>
          <div className="text-xs text-gray-600">Time to Goal</div>
        </div>
      </div>

      {/* Top Performing Strategy */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-orange-800">🏆 Top Performing Strategy</p>
            <p className="text-lg font-bold text-orange-900">{metrics.topStrategy}</p>
            <p className="text-sm text-orange-700">Generated $567.80 with 11.2% conversion rate</p>
          </div>
          <div className="text-3xl">🥇</div>
        </div>
      </div>

      {/* Future Projections */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">📈 Growth Projections</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-blue-600">Next 7 Days (Conservative)</p>
            <p className="font-bold text-blue-800">${(nextWeekProjection * 0.6).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-blue-600">Monthly Potential</p>
            <p className="font-bold text-blue-800">${(metrics.totalRevenue * 15).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          📊 View Full Report
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          🚀 Scale Strategies
        </button>
      </div>
    </div>
  );
};

export default RevenueSuccessWidget;
