"use client";

import { useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ABTest {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  variantA: {
    name: string;
    visitors: number;
    conversions: number;
    revenue: number;
  };
  variantB: {
    name: string;
    visitors: number;
    conversions: number;
    revenue: number;
  };
  startDate: string;
  endDate?: string;
  confidence: number;
  winner?: 'A' | 'B' | null;
}

const ABTestingManager: React.FC<ABTestingManagerProps> = ({ /* initialTests = [], onUpdateTest, onCreateTest */ }) => {
  const [tests, setTests] = useState<ABTest[]>([
    {
      id: 'premium-pricing-test',
      name: 'Premium Pricing Strategy',
      status: 'active',
      variantA: {
        name: 'Standard Pricing ($9.99)',
        visitors: 1547,
        conversions: 89,
        revenue: 889.11
      },
      variantB: {
        name: 'Limited Time Offer (40% OFF)',
        visitors: 1623,
        conversions: 142,
        revenue: 1418.00
      },
      startDate: '2024-12-19',
      confidence: 87.3,
      winner: 'B'
    },
    {
      id: 'exit-intent-test',
      name: 'Exit Intent Popup',
      status: 'active',
      variantA: {
        name: 'No Exit Intent',
        visitors: 2341,
        conversions: 67,
        revenue: 669.33
      },
      variantB: {
        name: 'Exit Intent Popup (50% OFF)',
        visitors: 2289,
        conversions: 156,
        revenue: 1560.00
      },
      startDate: '2024-12-19',
      confidence: 94.7,
      winner: 'B'
    },
    {
      id: 'landing-page-test',
      name: 'Landing Page Hero Section',
      status: 'active',
      variantA: {
        name: 'Feature-focused Hero',
        visitors: 1834,
        conversions: 73,
        revenue: 729.27
      },
      variantB: {
        name: 'Benefit-focused Hero',
        visitors: 1798,
        conversions: 95,
        revenue: 950.05
      },
      startDate: '2024-12-19',
      confidence: 78.9,
      winner: null
    }
  ]);

  const [newTestForm, setNewTestForm] = useState({
    name: '',
    variantAName: '',
    variantBName: '',
    isOpen: false
  });

  const calculateConversionRate = (conversions: number, visitors: number) => {
    return visitors > 0 ? ((conversions / visitors) * 100).toFixed(2) : '0.00';
  };

  const calculateRevenuePerVisitor = (revenue: number, visitors: number) => {
    return visitors > 0 ? (revenue / visitors).toFixed(2) : '0.00';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWinnerBadge = (winner: string | null, confidence: number) => {
    if (!winner) return null;
    
    const confidenceColor = confidence >= 95 ? 'bg-green-500' : confidence >= 85 ? 'bg-yellow-500' : 'bg-orange-500';
    
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${confidenceColor}`}>
        Winner: Variant {winner} ({confidence.toFixed(1)}% confidence)
      </div>
    );
  };

  const totalRevenueIncrease = tests.reduce((acc, test) => {
    if (test.winner === 'B') {
      const increase = test.variantB.revenue - test.variantA.revenue;
      return acc + increase;
    }
    return acc;
  }, 0);

  const avgConversionImprovement = tests.reduce((acc, test) => {
    const rateA = (test.variantA.conversions / test.variantA.visitors) * 100;
    const rateB = (test.variantB.conversions / test.variantB.visitors) * 100;
    const improvement = ((rateB - rateA) / rateA) * 100;
    return acc + improvement;
  }, 0) / tests.length;

  const createNewTest = () => {
    if (!newTestForm.name || !newTestForm.variantAName || !newTestForm.variantBName) return;

    const newTest: ABTest = {
      id: `test-${Date.now()}`,
      name: newTestForm.name,
      status: 'active',
      variantA: {
        name: newTestForm.variantAName,
        visitors: 0,
        conversions: 0,
        revenue: 0
      },
      variantB: {
        name: newTestForm.variantBName,
        visitors: 0,
        conversions: 0,
        revenue: 0
      },
      startDate: new Date().toISOString().split('T')[0],
      confidence: 0,
      winner: null
    };

    setTests([...tests, newTest]);
    setNewTestForm({ name: '', variantAName: '', variantBName: '', isOpen: false });
  };

  const testPerformanceData = tests.map(test => ({
    name: test.name,
    'Variant A Conv Rate': parseFloat(calculateConversionRate(test.variantA.conversions, test.variantA.visitors)),
    'Variant B Conv Rate': parseFloat(calculateConversionRate(test.variantB.conversions, test.variantB.visitors)),
    'Revenue A': test.variantA.revenue,
    'Revenue B': test.variantB.revenue
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">A/B Testing Manager</h3>
          <p className="text-sm text-gray-600 mt-1">Optimize conversions and maximize revenue</p>
        </div>
        <button
          onClick={() => setNewTestForm({ ...newTestForm, isOpen: true })}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New Test
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Revenue Increase</p>
              <p className="text-2xl font-bold text-green-900">${totalRevenueIncrease.toFixed(0)}</p>
            </div>
            <div className="text-green-500">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Avg Conv. Improvement</p>
              <p className="text-2xl font-bold text-blue-900">+{avgConversionImprovement.toFixed(1)}%</p>
            </div>
            <div className="text-blue-500">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Active Tests</p>
              <p className="text-2xl font-bold text-purple-900">{tests.filter(t => t.status === 'active').length}</p>
            </div>
            <div className="text-purple-500">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="mb-8">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Test Performance Comparison</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={testPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Variant A Conv Rate" fill="#94a3b8" name="Variant A Conv Rate %" />
              <Bar dataKey="Variant B Conv Rate" fill="#3b82f6" name="Variant B Conv Rate %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Test List */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Current Tests</h4>
        {tests.map((test) => (
          <div key={test.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h5 className="font-medium text-gray-900">{test.name}</h5>
                <p className="text-sm text-gray-500">Started: {test.startDate}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                  {test.status}
                </span>
                {getWinnerBadge(test.winner ?? null, test.confidence)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Variant A */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h6 className="font-medium text-gray-700 mb-2">Variant A: {test.variantA.name}</h6>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Visitors:</span>
                    <span className="font-medium">{test.variantA.visitors.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conversions:</span>
                    <span className="font-medium">{test.variantA.conversions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conv. Rate:</span>
                    <span className="font-medium">{calculateConversionRate(test.variantA.conversions, test.variantA.visitors)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue:</span>
                    <span className="font-medium">${test.variantA.revenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RPV:</span>
                    <span className="font-medium">${calculateRevenuePerVisitor(test.variantA.revenue, test.variantA.visitors)}</span>
                  </div>
                </div>
              </div>

              {/* Variant B */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <h6 className="font-medium text-gray-700 mb-2">Variant B: {test.variantB.name}</h6>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Visitors:</span>
                    <span className="font-medium">{test.variantB.visitors.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conversions:</span>
                    <span className="font-medium">{test.variantB.conversions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conv. Rate:</span>
                    <span className="font-medium">{calculateConversionRate(test.variantB.conversions, test.variantB.visitors)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue:</span>
                    <span className="font-medium">${test.variantB.revenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RPV:</span>
                    <span className="font-medium">${calculateRevenuePerVisitor(test.variantB.revenue, test.variantB.visitors)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Test Modal */}
      {newTestForm.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New A/B Test</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Name</label>
                <input
                  type="text"
                  value={newTestForm.name}
                  onChange={(e) => setNewTestForm({ ...newTestForm, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="e.g., Premium Feature Showcase"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Variant A Name</label>
                <input
                  type="text"
                  value={newTestForm.variantAName}
                  onChange={(e) => setNewTestForm({ ...newTestForm, variantAName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="e.g., Current Design"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Variant B Name</label>
                <input
                  type="text"
                  value={newTestForm.variantBName}
                  onChange={(e) => setNewTestForm({ ...newTestForm, variantBName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="e.g., Enhanced Feature List"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setNewTestForm({ name: '', variantAName: '', variantBName: '', isOpen: false })}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={createNewTest}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ABTestingManager;
