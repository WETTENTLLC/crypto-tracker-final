'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsEvent {
  eventName: string;
  eventData: Record<string, unknown>;
  timestamp: string;
  sessionId: string;
  userAgent: string;
}

interface AnalyticsResponse {
  success: boolean;
  data: {
    events: AnalyticsEvent[];
    total: number;
    limit: number;
    offset: number;
  };
}

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('month');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for real data
  const [conversionData, setConversionData] = useState<Array<{name: string, value: number}>>([]);
  const [trafficData, setTrafficData] = useState<Array<{name: string, users: number}>>([]);
  const [engagementData, setEngagementData] = useState<Array<{name: string, value: number}>>([]);
  const [referralData, setReferralData] = useState<Array<{source: string, users: number, percentage: number}>>([]);
  const [deviceData, setDeviceData] = useState<Array<{name: string, value: number}>>([]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Fetch real analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      try {
        // Fetch events from analytics API
        const response = await fetch(`/api/mcp/analytics?limit=1000`);
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        
        const analyticsData: AnalyticsResponse = await response.json();
        
        if (!analyticsData.success || !analyticsData.data) {
          throw new Error('Invalid analytics data response');
        }
        
        // Process analytics data to generate real metrics
        processAnalyticsData(analyticsData.data.events, timeRange);
        
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, [timeRange]);
  
  // Process analytics data to generate real metrics
  const processAnalyticsData = (events: AnalyticsEvent[], timeRange: string) => {
    if (!events || events.length === 0) {
      // Handle empty data case
      setEmptyDataState();
      return;
    }
    
    // Calculate date range based on timeRange
    const endDate = new Date();
    let startDate = new Date();
    
    if (timeRange === 'week') {
      startDate.setDate(endDate.getDate() - 7);
    } else if (timeRange === 'month') {
      startDate.setMonth(endDate.getMonth() - 1);
    } else if (timeRange === 'year') {
      startDate.setFullYear(endDate.getFullYear() - 1);
    }
    
    // Filter events within the date range
    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.timestamp);
      return eventDate >= startDate && eventDate <= endDate;
    });
    
    // Calculate user conversion
    const userEvents = filteredEvents.filter(event => 
      event.eventName === 'user_signup' || 
      event.eventName === 'premium_subscription');
      
    const freeUsers = userEvents.filter(event => 
      event.eventName === 'user_signup' && 
      !event.eventData.isPremium).length;
      
    const premiumUsers = userEvents.filter(event => 
      event.eventName === 'premium_subscription' || 
      (event.eventName === 'user_signup' && event.eventData.isPremium)).length;
    
    setConversionData([
      { name: 'Free Users', value: freeUsers || 0 },
      { name: 'Premium Users', value: premiumUsers || 0 }
    ]);
    
    // Calculate traffic data
    const trafficMetrics = calculateTrafficMetrics(filteredEvents, timeRange);
    setTrafficData(trafficMetrics);
    
    // Calculate engagement data
    const alertsCreated = filteredEvents.filter(event => 
      event.eventName === 'alert_created').length;
      
    const portfolioViews = filteredEvents.filter(event => 
      event.eventName === 'portfolio_viewed').length;
      
    const chartInteractions = filteredEvents.filter(event => 
      event.eventName === 'chart_interaction').length;
      
    const coinDetails = filteredEvents.filter(event => 
      event.eventName === 'coin_details_viewed').length;
    
    setEngagementData([
      { name: 'Alerts Created', value: alertsCreated },
      { name: 'Portfolio Views', value: portfolioViews },
      { name: 'Chart Interactions', value: chartInteractions },
      { name: 'Coin Details', value: coinDetails }
    ]);
    
    // Calculate referral data
    const referralMetrics = calculateReferralMetrics(filteredEvents);
    setReferralData(referralMetrics);
    
    // Calculate device data
    const deviceMetrics = calculateDeviceMetrics(filteredEvents);
    setDeviceData(deviceMetrics);
  };
  
  // Helper function to calculate traffic metrics
  const calculateTrafficMetrics = (events: AnalyticsEvent[], timeRange: string) => {
    // Calculate the traffic data based on the timeRange
    if (timeRange === 'week') {
      // Group by day of week
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const dayData = days.map(day => ({
        name: day,
        users: 0
      }));
      
      events.forEach(event => {
        if (event.eventName === 'page_view') {
          const date = new Date(event.timestamp);
          const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1; // Convert Sunday=0 to Sunday=6
          dayData[dayIndex].users++;
        }
      });
      
      return dayData;
    } else if (timeRange === 'month') {
      // Group by week
      const result = [];
      const endDate = new Date();
      
      for (let i = 0; i < 5; i++) {
        const weekStart = new Date();
        weekStart.setDate(endDate.getDate() - (i * 7) - 7);
        
        const weekEnd = new Date();
        weekEnd.setDate(endDate.getDate() - (i * 7));
        
        const weekEvents = events.filter(event => {
          const eventDate = new Date(event.timestamp);
          return eventDate >= weekStart && eventDate < weekEnd && event.eventName === 'page_view';
        });
        
        result.unshift({
          name: `Week ${5-i}`,
          users: weekEvents.length
        });
      }
      
      return result;
    } else if (timeRange === 'year') {
      // Group by month
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthData = months.map(month => ({
        name: month,
        users: 0
      }));
      
      events.forEach(event => {
        if (event.eventName === 'page_view') {
          const date = new Date(event.timestamp);
          monthData[date.getMonth()].users++;
        }
      });
      
      return monthData;
    }
    
    return [];
  };
  
  // Helper function to calculate referral metrics
  const calculateReferralMetrics = (events: AnalyticsEvent[]) => {
    const pageViewEvents = events.filter(event => event.eventName === 'page_view');
    const referralCounts: Record<string, number> = {
      'Google': 0,
      'Direct': 0,
      'Social Media': 0,
      'Referrals': 0,
      'Other': 0
    };
    
    pageViewEvents.forEach(event => {
      const referrer = (event.eventData.referrer as string) || 'Direct';
      
      if (referrer.includes('google')) {
        referralCounts['Google']++;
      } else if (referrer.includes('facebook') || referrer.includes('twitter') || 
                referrer.includes('instagram') || referrer.includes('linkedin')) {
        referralCounts['Social Media']++;
      } else if (referrer === 'Direct' || referrer === '') {
        referralCounts['Direct']++;
      } else if (referrer !== 'Direct' && referrer !== '') {
        referralCounts['Referrals']++;
      } else {
        referralCounts['Other']++;
      }
    });
    
    const total = Object.values(referralCounts).reduce((sum, count) => sum + count, 0) || 1;
    
    return Object.entries(referralCounts).map(([source, users]) => ({
      source,
      users,
      percentage: parseFloat(((users / total) * 100).toFixed(1))
    }));
  };
  
  // Helper function to calculate device metrics
  const calculateDeviceMetrics = (events: AnalyticsEvent[]) => {
    const deviceCounts = {
      'Desktop': 0,
      'Mobile': 0,
      'Tablet': 0
    };
    
    events.forEach(event => {
      const userAgent = event.userAgent.toLowerCase();
      
      if (userAgent.includes('mobile') && !userAgent.includes('tablet')) {
        deviceCounts['Mobile']++;
      } else if (userAgent.includes('tablet') || 
                (userAgent.includes('ipad') || 
                (userAgent.includes('android') && !userAgent.includes('mobile')))) {
        deviceCounts['Tablet']++;
      } else {
        deviceCounts['Desktop']++;
      }
    });
    
    return Object.entries(deviceCounts).map(([name, value]) => ({
      name,
      value
    }));
  };
  
  // Set empty state when no data is available
  const setEmptyDataState = () => {
    setConversionData([
      { name: 'Free Users', value: 0 },
      { name: 'Premium Users', value: 0 }
    ]);
    
    setTrafficData(
      timeRange === 'week' 
        ? Array.from({ length: 7 }, (_, i) => ({ 
            name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i], 
            users: 0 
          }))
        : timeRange === 'month'
          ? Array.from({ length: 5 }, (_, i) => ({ 
              name: `Week ${i+1}`, 
              users: 0 
            }))
          : Array.from({ length: 12 }, (_, i) => ({ 
              name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i], 
              users: 0 
            }))
    );
    
    setEngagementData([
      { name: 'Alerts Created', value: 0 },
      { name: 'Portfolio Views', value: 0 },
      { name: 'Chart Interactions', value: 0 },
      { name: 'Coin Details', value: 0 }
    ]);
    
    setReferralData([
      { source: 'Google', users: 0, percentage: 0 },
      { source: 'Direct', users: 0, percentage: 0 },
      { source: 'Social Media', users: 0, percentage: 0 },
      { source: 'Referrals', users: 0, percentage: 0 },
      { source: 'Other', users: 0, percentage: 0 }
    ]);
    
    setDeviceData([
      { name: 'Desktop', value: 0 },
      { name: 'Mobile', value: 0 },
      { name: 'Tablet', value: 0 }
    ]);
  };
  
  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };
  
  // Render UI for analytics dashboard
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
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading analytics data...</div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading analytics data</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      ) : (
        <>
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
                    <p className="text-xl font-semibold text-blue-900">{conversionData[0]?.value || 0}</p>
                    <p className="text-xs text-blue-600">
                      {conversionData[0]?.value && conversionData[1]?.value
                        ? `${((conversionData[0]?.value / (conversionData[0]?.value + conversionData[1]?.value)) * 100).toFixed(1)}% of total`
                        : '0% of total'}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-700">Premium Users</p>
                    <p className="text-xl font-semibold text-green-900">{conversionData[1]?.value || 0}</p>
                    <p className="text-xs text-green-600">
                      {conversionData[0]?.value && conversionData[1]?.value
                        ? `${((conversionData[1]?.value / (conversionData[0]?.value + conversionData[1]?.value)) * 100).toFixed(1)}% of total`
                        : '0% of total'}
                    </p>
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
                    <p className="text-lg font-semibold text-blue-900">{deviceData[0]?.value || 0}</p>
                    <p className="text-xs text-blue-600">
                      {deviceData.reduce((sum, item) => sum + item.value, 0) > 0
                        ? `${((deviceData[0]?.value / deviceData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%`
                        : '0%'}
                    </p>
                  </div>
                  <div className="bg-green-50 p-2 rounded-lg">
                    <p className="text-sm text-green-700">Mobile</p>
                    <p className="text-lg font-semibold text-green-900">{deviceData[1]?.value || 0}</p>
                    <p className="text-xs text-green-600">
                      {deviceData.reduce((sum, item) => sum + item.value, 0) > 0
                        ? `${((deviceData[1]?.value / deviceData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%`
                        : '0%'}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded-lg">
                    <p className="text-sm text-yellow-700">Tablet</p>
                    <p className="text-lg font-semibold text-yellow-900">{deviceData[2]?.value || 0}</p>
                    <p className="text-xs text-yellow-600">
                      {deviceData.reduce((sum, item) => sum + item.value, 0) > 0
                        ? `${((deviceData[2]?.value / deviceData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%`
                        : '0%'}
                    </p>
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
                          style={{ width: `${(item.value / Math.max(...engagementData.map(d => d.value) || [1])) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
