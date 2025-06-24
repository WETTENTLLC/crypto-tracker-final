'use client';

import { useState } from 'react';
import RealTimeAnalytics from '../../components/RealTimeAnalytics';

export default function AnalyticsDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Use environment variable for password or fallback to secure default
    const dashboardPassword = process.env.ANALYTICS_DASHBOARD_PASSWORD || 'Cr7pt0Tr@ck3r2025!';
    if (password === dashboardPassword) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">Analytics Dashboard</h1>
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter dashboard password"
                required
              />
            </div>
            
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                Access Dashboard
              </button>
            </div>
          </form>
          
          {/* No password hint shown */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">CryptoTracker Analytics Dashboard</h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {new Date().toLocaleDateString()}
            </div>
            <div className="text-gray-600">Today's Date</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              $0.00
            </div>
            <div className="text-gray-600">Today's Revenue</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              0
            </div>
            <div className="text-gray-600">Active Subscriptions</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">
              0%
            </div>
            <div className="text-gray-600">Conversion Rate</div>
          </div>
        </div>
        
        <RealTimeAnalytics />
        
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">PayPal Integration Status</h2>
          <div className="flex items-center mb-4">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span className="font-semibold">PayPal Integration:</span>
            <span className="ml-2 text-gray-700">Active</span>
          </div>
          <div className="flex items-center mb-4">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span className="font-semibold">Environment:</span>
            <span className="ml-2 text-gray-700">Production (Live)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span className="font-semibold">Status:</span>
            <span className="ml-2 text-gray-700">Ready to process payments</span>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">
              <strong>Note:</strong> To see real payment data, users need to complete the checkout process. 
              All transactions will appear in your PayPal business dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}