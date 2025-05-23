'use client';
import { useState, useEffect } from 'react';
import { getCoins, getTrendingCoins, Coin } from '../api/coingecko';

export default function RealTimeCryptoTicker() {
  const [topCoins, setTopCoins] = useState<Coin[]>([]);
  const [trendingCoins, setTrendingCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // Format price with appropriate precision
  const formatPrice = (price: number) => {
    if (price < 0.01) return price.toFixed(6);
    if (price < 1) return price.toFixed(4);
    if (price < 1000) return price.toFixed(2);
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(price);
  };

  // Format percentage change
  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  // Fetch top and trending coins
  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      
      // Fetch top coins by market cap
      const topCoinsData = await getCoins(1, 10);
      
      // Fetch trending coins
      const trendingData = await getTrendingCoins();
      const trendingItems = trendingData?.coins || [];
      
      setTopCoins(topCoinsData);
      setTrendingCoins(trendingItems);
      setLastUpdate(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      console.error('Error fetching crypto data:', err);
      setError('Failed to fetch cryptocurrency data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on initial load and set up refresh interval
  useEffect(() => {
    fetchCryptoData();
    
    // Refresh data every 60 seconds
    const interval = setInterval(() => {
      fetchCryptoData();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading && topCoins.length === 0) {
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

  if (error && topCoins.length === 0) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800 border-l-4 border-red-500">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={fetchCryptoData}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 mb-8">
      {/* Top Coins Section */}
      <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Top Cryptocurrencies
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {lastUpdate}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Coin</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price (USD)</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">24h Change</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Market Cap</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {topCoins.map((coin) => (
                <tr key={coin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 mr-2">
                        <img src={coin.image} alt={coin.name} className="h-8 w-8 rounded-full" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{coin.name}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-sm">{coin.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-gray-900 dark:text-white font-medium">
                    ${formatPrice(coin.current_price)}
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap text-right font-medium ${
                    coin.price_change_percentage_24h >= 0 
                      ? 'text-green-600 dark:text-green-500' 
                      : 'text-red-600 dark:text-red-500'
                  }`}>
                    {formatChange(coin.price_change_percentage_24h)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-gray-900 dark:text-white">
                    ${new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(coin.market_cap)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Trending Coins Section */}
      {trendingCoins.length > 0 && (
        <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Trending on CoinGecko
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingCoins.slice(0, 6).map((item, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center">
                <div className="flex-shrink-0 h-10 w-10 mr-3">
                  <img src={item.item.small} alt={item.item.name} className="h-10 w-10 rounded-full" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{item.item.name}</div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm">#{item.item.market_cap_rank} • {item.item.symbol.toUpperCase()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
