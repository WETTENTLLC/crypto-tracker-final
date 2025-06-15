'use client';
import { useState, useEffect } from 'react';
import { getGlobalData } from '../api/coingecko';
import RealTimePriceChart from './RealTimePriceChart';

interface GlobalData {
  total_market_cap?: {
    usd?: number;
  };
  market_cap_change_percentage_24h_usd?: number;
  total_volume?: {
    usd?: number;
  };
  market_cap_percentage?: {
    btc?: number;
    eth?: number;
  };
  active_cryptocurrencies?: number;
}

export default function MarketOverview() {
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredCoin, setFeaturedCoin] = useState<string>('bitcoin');

  // Format large numbers with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Format market cap in billions
  const formatMarketCap = (marketCap: number) => {
    const inBillions = marketCap / 1000000000;
    return `$${inBillions.toFixed(2)}B`;
  };

  // Format percentage
  const formatPercentage = (percentage: number) => {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(2)}%`;
  };

  // Fetch global market data
  const fetchGlobalData = async () => {
    try {
      setLoading(true);
      const data = await getGlobalData();
      setGlobalData(data?.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching global market data:', err);
      setError('Failed to fetch global market data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on initial load
  useEffect(() => {
    fetchGlobalData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(() => {
      fetchGlobalData();
    }, 300000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading && !globalData) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
              <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !globalData) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800 border-l-4 border-red-500">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={fetchGlobalData}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Handle null data gracefully
  if (!globalData) {
    return null;
  }

  const marketCapUsd = globalData.total_market_cap?.usd || 0;
  const marketCapChange = globalData.market_cap_change_percentage_24h_usd || 0;
  const totalVolume = globalData.total_volume?.usd || 0;
  const btcDominance = globalData.market_cap_percentage?.btc || 0;
  const ethDominance = globalData.market_cap_percentage?.eth || 0;
  const activeCryptocurrencies = globalData.active_cryptocurrencies || 0;

  return (
    <div className="grid gap-6 mb-8">
      <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Global Market Overview
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Market Cap</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {formatMarketCap(marketCapUsd)}
            </div>
            <div className={`text-sm ${marketCapChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatPercentage(marketCapChange)} (24h)
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-500 dark:text-gray-400">24h Trading Volume</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {formatMarketCap(totalVolume)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {((totalVolume / marketCapUsd) * 100).toFixed(2)}% of market cap
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm text-black dark:text-gray-400">Market Dominance</div>
            <div className="flex items-center">
              <div className="flex-1">
                <div className="text-md font-medium text-gray-900 dark:text-white">BTC</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {btcDominance.toFixed(1)}%
                </div>
              </div>
              <div className="flex-1">
                <div className="text-md font-medium text-gray-900 dark:text-white">ETH</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {ethDominance.toFixed(1)}%
                </div>
              </div>
              <div className="flex-1">
                <div className="text-md font-medium text-gray-900 dark:text-white">Others</div>
                <div className="text-sm text-black dark:text-gray-400">
                  {(100 - btcDominance - ethDominance).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-800 dark:text-white">Featured Chart</h3>
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setFeaturedCoin('bitcoin')}
                className={`px-3 py-1 text-xs font-medium rounded-l-lg ${
                  featuredCoin === 'bitcoin'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                } border border-gray-200 dark:border-gray-600`}
              >
                Bitcoin
              </button>
              <button
                type="button"
                onClick={() => setFeaturedCoin('ethereum')}
                className={`px-3 py-1 text-xs font-medium ${
                  featuredCoin === 'ethereum'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                } border-t border-b border-gray-200 dark:border-gray-600`}
              >
                Ethereum
              </button>
              <button
                type="button"
                onClick={() => setFeaturedCoin('solana')}
                className={`px-3 py-1 text-xs font-medium rounded-r-lg ${
                  featuredCoin === 'solana'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                } border border-gray-200 dark:border-gray-600`}
              >
                Solana
              </button>
            </div>
          </div>
          <RealTimePriceChart coinId={featuredCoin} days={7} height={250} showControls={false} />
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {formatNumber(activeCryptocurrencies)} active cryptocurrencies tracked
        </div>
      </div>
    </div>
  );
}
