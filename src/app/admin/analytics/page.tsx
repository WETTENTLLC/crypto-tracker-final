'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('month');
  
  const [conversionData] = useState([
    { name: 'Free Users', value: 917 },
    { name: 'Premium Users', value: 328 }
  ]);
  
  const [trafficData, setTrafficData] = useState([
    { name: 'Week 1', users: 320 },
    { name: 'Week 2', users: 350 },
    { name: 'Week 3', users: 410 },
    { name: 'Week 4', users: 490 },
    { name: 'Week 5', users: 520 }
  ]);
  
  const [engagementData] = useState([
    { name: 'Alerts Created', value: 4721 },
    { name: 'Portfolio Views', value: 3250 },
    { name: 'Chart Interactions', value: 8940 },
    { name: 'Coin Details', value: 6320 }
  ]);
  
  const [referralData] = useState([
    { source: 'Google', users: 520, percentage: 41.8 },
    { source: 'Direct', users: 350, percentage: 28.1 },
    { source: 'Social Media', users: 180, percentage: 14.5 },
    { source: 'Referrals', users: 120, percentage: 9.6 },
    { source: 'Other', users: 75, percentage: 6.0 }
  ]);
  
  const [deviceData] = useState([
    { name: 'Desktop', value: 640 },
    { name: 'Mobile', value: 480 },
    { name: 'Tablet', value: 125 }
  ]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    
    // In a real app, this would fetch new data based on the time range
    // For demo purposes, we'll just simulate different data
    if (range === 'week') {
      setTrafficData([
        { name: 'Mon', users: 80 },
        { name: 'Tue', users: 95 },
        { name: 'Wed', users: 110 },
        { name: 'Thu', users: 100 },
        { name: 'Fri', users: 120 },
        { name: 'Sat', users: 130 },
        { name: 'Sun', users: 115 }
      ]);
    } else if (range === 'month') {
      setTrafficData([
        { name: 'Week 1', users: 320 },
        { name: 'Week 2', users: 350 },
        { name: 'Week 3', users: 410 },
        { name: 'Week 4', users: 490 },
        { name: 'Week 5', users: 520 }
      ]);
    } else if (range === 'year') {
      setTrafficData([
        { name: 'Jan', users: 850 },
        { name: 'Feb', users: 920 },
        { name: 'Mar', users: 1050 },
        { name: 'Apr', users: 1150 },
        { name: 'May', users: 1245 }
      ]);
    }
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Analytics
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Export Analytics
          </button>
        </div>
      </div>
      
      <div className="bg-white overflow-hidden shadow rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">User Traffic</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => handleTimeRangeChange('week')} 
                className={`px-3 py-1 rounded-md text-sm ${
                  timeRange === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Week
              </button>
              <button 
                onClick={() => handleTimeRangeChange('month')} 
                className={`px-3 py-1 rounded-md text-sm ${
                  timeRange === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Month
              </button>
              <button 
                onClick={() => handleTimeRangeChange('year')} 
                className={`px-3 py-1 rounded-md text-sm ${
                  timeRange === 'year' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Year
              </button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#4f46e5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">User Conversion</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={conversionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {conversionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Users']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-center">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">Free Users</p>
                <p className="text-xl font-semibold text-blue-900">917</p>
                <p className="text-xs text-blue-600">73.7% of total</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-700">Premium Users</p>
                <p className="text-xl font-semibold text-green-900">328</p>
                <p className="text-xs text-green-600">26.3% of total</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Device Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Users']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="bg-blue-50 p-2 rounded-lg">
                <p className="text-sm text-blue-700">Desktop</p>
                <p className="text-lg font-semibold text-blue-900">640</p>
                <p className="text-xs text-blue-600">51.4%</p>
              </div>
              <div className="bg-green-50 p-2 rounded-lg">
                <p className="text-sm text-green-700">Mobile</p>
                <p className="text-lg font-semibold text-green-900">480</p>
                <p className="text-xs text-green-600">38.6%</p>
              </div>
              <div className="bg-yellow-50 p-2 rounded-lg">
                <p className="text-sm text-yellow-700">Tablet</p>
                <p className="text-lg font-semibold text-yellow-900">125</p>
                <p className="text-xs text-yellow-600">10.0%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Traffic Sources</h3>
          </div>
          <div className="border-t border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Users
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {referralData.map((source, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {source.source}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {source.users}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {source.percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">User Engagement</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="space-y-4">
              {engagementData.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    <span className="text-sm font-medium text-gray-700">{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(item.value / Math.max(...engagementData.map(d => d.value))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
