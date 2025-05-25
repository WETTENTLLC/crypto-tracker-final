'use client';
import { useState, useEffect, useCallback } from 'react';
import { getCoinMarketChart, MarketChart } from '../api/coingecko';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PriceChartProps {
  coinId: string;
  days?: number;
  height?: number;
  showControls?: boolean;
}

export default function RealTimePriceChart({ 
  coinId, 
  days = 7, 
  height = 300,
  showControls = true
}: PriceChartProps) {
  const [chartData, setChartData] = useState<MarketChart | null>(null);
  const [selectedDays, setSelectedDays] = useState<number>(days);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Format timestamp for X-axis
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Format price data for chart
  const formatChartData = (data: [number, number][]) => {
    if (!data || !data.length) return [];
    
    // If we have too many data points, let's sample them
    const maxDataPoints = 100;
    let sampled = data;
    
    if (data.length > maxDataPoints) {
      const interval = Math.floor(data.length / maxDataPoints);
      sampled = data.filter((_, index) => index % interval === 0);
    }
    
    return sampled.map(([timestamp, price]) => ({
      timestamp,
      date: formatDate(timestamp),
      price
    }));
  };

  // Fetch chart data
  const fetchChartData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCoinMarketChart(coinId, selectedDays);
      setChartData(data);
      setError(null);
    } catch (err) {
      console.error(`Error fetching chart data for ${coinId}:`, err);
      setError('Failed to fetch price chart data');
    } finally {
      setLoading(false);
    }
  }, [coinId, selectedDays]);

  // Fetch data when component mounts or when selectedDays changes
  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  // Generate color based on price trend
  const getLineColor = () => {
    if (!chartData || !chartData.prices || chartData.prices.length < 2) return '#8884d8';
    
    const firstPrice = chartData.prices[0][1];
    const lastPrice = chartData.prices[chartData.prices.length - 1][1];
    
    return lastPrice >= firstPrice ? '#10b981' : '#ef4444';
  };

  if (loading && !chartData) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800" style={{ height }}>
        <div className="animate-pulse h-full">
          <div className="h-full bg-gray-200 rounded dark:bg-gray-700"></div>
        </div>
      </div>
    );
  }

  if (error && !chartData) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={fetchChartData}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const formattedData = chartData ? formatChartData(chartData.prices) : [];
  const lineColor = getLineColor();

  return (
    <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
      {showControls && (
        <div className="flex justify-end mb-4">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setSelectedDays(1)}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                selectedDays === 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
              } border border-gray-200 dark:border-gray-600`}
            >
              24h
            </button>
            <button
              type="button"
              onClick={() => setSelectedDays(7)}
              className={`px-4 py-2 text-sm font-medium ${
                selectedDays === 7
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
              } border-t border-b border-gray-200 dark:border-gray-600`}
            >
              7d
            </button>
            <button
              type="button"
              onClick={() => setSelectedDays(30)}
              className={`px-4 py-2 text-sm font-medium ${
                selectedDays === 30
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
              } border-t border-b border-gray-200 dark:border-gray-600`}
            >
              30d
            </button>
            <button
              type="button"
              onClick={() => setSelectedDays(90)}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                selectedDays === 90
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
              } border border-gray-200 dark:border-gray-600`}
            >
              90d
            </button>
          </div>
        </div>
      )}
      
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData}
            margin={{
              top: 5,
              right: 20,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#6B7280' }}
              tickMargin={10}
              axisLine={{ stroke: '#374151', opacity: 0.3 }}
            />
            <YAxis 
              tick={{ fill: '#6B7280' }}
              tickMargin={10}
              axisLine={{ stroke: '#374151', opacity: 0.3 }}
              tickFormatter={(value) => {
                if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
                return `$${value.toFixed(value < 10 ? 2 : 0)}`;
              }}
              domain={['dataMin', 'dataMax']}
            />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: 'none',
                borderRadius: '0.375rem',
                color: '#F3F4F6'
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={lineColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
