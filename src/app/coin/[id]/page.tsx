'use client';

import { useState, useEffect } from 'react';
import { getCoinDetails, getCoinMarketChart, CoinDetail, MarketChart } from '../../api/coingecko';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Image from 'next/image';
import Link from 'next/link';
import PriceAlertForm from '../../components/PriceAlertForm';

// Define params prop type for dynamic route
type PageProps = {
  params: {
    id: string;
  };
}

export default function CoinDetailPage({ params }: PageProps) {
  const { id } = params;
  const [coin, setCoin] = useState<CoinDetail | null>(null);
  const [chartData, setChartData] = useState<MarketChart | null>(null);
  const [timeframe, setTimeframe] = useState<number>(7); // Default to 7 days
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        setLoading(true);
        const coinData = await getCoinDetails(id);
        setCoin(coinData);
        
        const marketData = await getCoinMarketChart(id, timeframe);
        setChartData(marketData);
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch coin data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinData();
  }, [id, timeframe]);

  const formatData = (data: [number, number][]) => {
    return data?.map(([timestamp, value]) => ({
      date: new Date(timestamp).toLocaleDateString(),
      price: value,
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: price < 1 ? 6 : 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  const formatPercent = (percent: number) => {
    return percent?.toFixed(2) + '%';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !coin) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error || 'Failed to load coin data'}</span>
        <Link href="/" className="block mt-4 text-blue-600 hover:underline">
          Return to home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <Image 
            src={coin.image} 
            alt={coin.name} 
            width={64} 
            height={64} 
            className="rounded-full mr-4"
          />
          <div>
            <h1 className="text-3xl font-bold">{coin.name}</h1>
            <p className="text-gray-500">{coin.symbol.toUpperCase()}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-3xl font-bold">
            {formatPrice(coin.market_data.current_price.usd)}
          </div>
          <div className={`text-lg font-medium ${
            coin.market_data.price_change_percentage_24h_in_currency.usd > 0 
              ? 'text-green-600' 
              : 'text-red-600'
          }`}>
            {formatPercent(coin.market_data.price_change_percentage_24h_in_currency.usd)}
            <span className="text-gray-500 text-sm ml-1">24h</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Price Chart</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setTimeframe(1)} 
              className={`px-3 py-1 rounded-md text-sm ${
                timeframe === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              24h
            </button>
            <button 
              onClick={() => setTimeframe(7)} 
              className={`px-3 py-1 rounded-md text-sm ${
                timeframe === 7 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              7d
            </button>
            <button 
              onClick={() => setTimeframe(30)} 
              className={`px-3 py-1 rounded-md text-sm ${
                timeframe === 30 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              30d
            </button>
            <button 
              onClick={() => setTimeframe(90)} 
              className={`px-3 py-1 rounded-md text-sm ${
                timeframe === 90 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              90d
            </button>
          </div>
        </div>
        
        <div className="h-[400px] w-full">
          {chartData && chartData.prices ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formatData(chartData.prices)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }} 
                  tickFormatter={(value) => {
                    if (timeframe <= 7) return value;
                    return value.split('/')[0] + '/' + value.split('/')[1];
                  }}
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    return new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      notation: 'compact',
                    }).format(value);
                  }}
                />
                <Tooltip 
                  formatter={(value: number) => [formatPrice(value), 'Price']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">No chart data available</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Market Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Market Cap</span>
              <span className="font-medium">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  notation: 'compact',
                  compactDisplay: 'short',
                }).format(coin.market_cap)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">24h Trading Volume</span>
              <span className="font-medium">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  notation: 'compact',
                  compactDisplay: 'short',
                }).format(coin.total_volume)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Circulating Supply</span>
              <span className="font-medium">
                {new Intl.NumberFormat('en-US').format(coin.circulating_supply)} {coin.symbol.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Max Supply</span>
              <span className="font-medium">
                {coin.max_supply 
                  ? new Intl.NumberFormat('en-US').format(coin.max_supply) + ' ' + coin.symbol.toUpperCase()
                  : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">All-Time High</span>
              <span className="font-medium">
                {formatPrice(coin.ath)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">All-Time Low</span>
              <span className="font-medium">
                {formatPrice(coin.atl)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Set Price Alert</h2>
          <PriceAlertForm 
            coinId={coin.id} 
            coinName={coin.name} 
            currentPrice={coin.market_data.current_price.usd} 
          />
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Premium Features</h3>
            <p className="text-blue-700 mb-3">Upgrade to Premium for:</p>
            <ul className="text-blue-700 space-y-2">
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                Unlimited price alerts
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                SMS & email notifications
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                Portfolio tracking
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                Ad-free experience
              </li>
            </ul>
            <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200">
              Upgrade to Premium - $5.99/month
            </button>
          </div>
        </div>
      </div>

      {coin.description?.en && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">About {coin.name}</h2>
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: coin.description.en }}
          />
        </div>
      )}
    </div>
  );
}
