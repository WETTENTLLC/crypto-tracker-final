'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Coin } from '../api/coingecko'; // Import Coin type

// Define a type for the price data within the WebSocket message
interface CryptoPriceData {
  usd: number;
  usd_24h_change?: number; // Optional: 24-hour change
}

// Define a type for individual trending coin item
interface TrendingCoinItem {
  id: string;
  name: string;
  symbol: string;
  small: string; // URL to the small image
  market_cap_rank: number;
  // Add other fields if needed from the server's trending data structure
}

// Define a type for the WebSocket message data
interface CryptoUpdateMessageData {
  prices: {
    [key: string]: CryptoPriceData; // e.g., 'bitcoin', 'ethereum'
  };
  trending: TrendingCoinItem[];
}

// Define the structure for a coin object used in the component state
interface DisplayCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h?: number; // Made optional to handle WS updates
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated?: string;
  // roi is omitted as it's not used in the ticker and might be complex to source consistently
}

export default function RealTimeCryptoTicker() {
  const [topCoins, setTopCoins] = useState<DisplayCoin[]>([]);
  const [trendingCoins, setTrendingCoins] = useState<TrendingCoinItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [wsError, setWsError] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);

  const initialCoinGeckoIds = ['bitcoin', 'ethereum', 'dogecoin'];

  // Store for initial coin details like name, symbol, image, fetched once
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [coinDetailsCache, setCoinDetailsCache] = useState<Record<string, Partial<DisplayCoin>>>({});

  // Format price with appropriate precision
  const formatPrice = (price: number) => {
    if (price < 0.01) return price.toFixed(6);
    if (price < 1) return price.toFixed(4);
    if (price < 1000) return price.toFixed(2);
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(price);
  };

  // Format percentage change
  const formatChange = (change: number | undefined) => {
    if (typeof change === 'undefined') return 'N/A';
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  // Function to fetch initial details for top coins (name, image, symbol)
  // This is a simplified example; you might fetch from your own API or a more detailed CoinGecko endpoint
  const fetchInitialCoinDetails = async () => {
    const details: Record<string, Partial<DisplayCoin>> = {
      bitcoin: { 
        name: 'Bitcoin', 
        symbol: 'BTC', 
        image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
        market_cap_rank: 1,
        market_cap: 0, 
        total_volume: 0, 
        circulating_supply: 0, 
        fully_diluted_valuation: null, 
        high_24h: 0, 
        low_24h: 0, 
        price_change_24h: 0, 
        market_cap_change_24h: 0, 
        market_cap_change_percentage_24h: 0, 
        total_supply: null, 
        max_supply: null, 
        ath: 0, 
        ath_change_percentage: 0, 
        ath_date: '', 
        atl: 0, 
        atl_change_percentage: 0, 
        atl_date: ''
      },
      ethereum: { 
        name: 'Ethereum', 
        symbol: 'ETH', 
        image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png', 
        market_cap_rank: 2,
        market_cap: 0, 
        total_volume: 0, 
        circulating_supply: 0, 
        fully_diluted_valuation: null, 
        high_24h: 0, 
        low_24h: 0, 
        price_change_24h: 0, 
        market_cap_change_24h: 0, 
        market_cap_change_percentage_24h: 0, 
        total_supply: null, 
        max_supply: null, 
        ath: 0, 
        ath_change_percentage: 0, 
        ath_date: '', 
        atl: 0, 
        atl_change_percentage: 0, 
        atl_date: ''
      },
      dogecoin: { 
        name: 'Dogecoin', 
        symbol: 'DOGE', 
        image: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png', 
        market_cap_rank: 8,
        market_cap: 0, 
        total_volume: 0, 
        circulating_supply: 0, 
        fully_diluted_valuation: null, 
        high_24h: 0, 
        low_24h: 0, 
        price_change_24h: 0, 
        market_cap_change_24h: 0, 
        market_cap_change_percentage_24h: 0, 
        total_supply: null, 
        max_supply: null, 
        ath: 0, 
        ath_change_percentage: 0, 
        ath_date: '', 
        atl: 0, 
        atl_change_percentage: 0, 
        atl_date: ''
      },
    };
    setCoinDetailsCache(details);
    const initialTopCoins: DisplayCoin[] = initialCoinGeckoIds.map(id => {
      const detail = details[id] || {}; // Fallback to empty object if id not in details
      return {
        id,
        name: detail.name || id,
        symbol: detail.symbol || id.toUpperCase(),
        image: detail.image || '',
        current_price: 0, 
        price_change_percentage_24h: 0, 
        market_cap_rank: detail.market_cap_rank || 0,
        market_cap: detail.market_cap || 0,
        total_volume: detail.total_volume || 0,
        circulating_supply: detail.circulating_supply || 0,
        fully_diluted_valuation: detail.fully_diluted_valuation === undefined ? null : detail.fully_diluted_valuation,
        high_24h: detail.high_24h || 0,
        low_24h: detail.low_24h || 0,
        price_change_24h: detail.price_change_24h || 0,
        market_cap_change_24h: detail.market_cap_change_24h || 0,
        market_cap_change_percentage_24h: detail.market_cap_change_percentage_24h || 0,
        total_supply: detail.total_supply === undefined ? null : detail.total_supply,
        max_supply: detail.max_supply === undefined ? null : detail.max_supply,
        ath: detail.ath || 0,
        ath_change_percentage: detail.ath_change_percentage || 0,
        ath_date: detail.ath_date || '',
        atl: detail.atl || 0,
        atl_change_percentage: detail.atl_change_percentage || 0,
        atl_date: detail.atl_date || '',
        last_updated: new Date().toISOString(),
      };
    });
    setTopCoins(initialTopCoins);
  };

  useEffect(() => {
    fetchInitialCoinDetails(); // Fetch names, symbols, images once

    // Initialize WebSocket connection
    // Determine WebSocket URL based on environment
    const wsProtocol = window.location.protocol === 'https:/' ? 'wss:' : 'ws:';
    const wsHost = window.location.host; // Assumes WS server is on the same host as Next.js app
    // If server.js runs on a different port than the Next.js app in dev (e.g. Next on 3003, WS on 3000 from server.js default)
    // you might need to adjust wsHost or use a fixed port for development, e.g. `ws://localhost:3000`
    // For this setup, server.js integrates with Next.js, so it should be the same host/port.
    const wsUrl = `${wsProtocol}//${wsHost}`;
    
    ws.current = new WebSocket(wsUrl);
    console.log(`Attempting to connect WebSocket to ${wsUrl}`);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setWsError(null);
      setLoading(false); // Consider loading complete once WS is open and initial data is received
    };

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data as string);
        if (message.type === 'cryptoUpdate' && message.data) {
          const wsData: CryptoUpdateMessageData = message.data;
          // console.log('WebSocket message received:', wsData); // For debugging

          // Update Top Coins
          if (wsData.prices) {
            setTopCoins(prevTopCoins => 
              prevTopCoins.map(coin => {
                const priceInfo = wsData.prices[coin.id];
                if (priceInfo) {
                  return {
                    ...coin,
                    current_price: priceInfo.usd,
                    price_change_percentage_24h: priceInfo.usd_24h_change ?? coin.price_change_percentage_24h, // Use existing if new is undefined
                    last_updated: new Date().toISOString(),
                  };
                }
                return coin;
              })
            );
          }

          // Update Trending Coins
          if (wsData.trending) {
            setTrendingCoins(wsData.trending);
          }

          setLastUpdate(new Date().toLocaleTimeString());
          setError(null);
          if (loading) setLoading(false);
        }
      } catch (e) {
        console.error('Error processing WebSocket message:', e);
      }
    };

    ws.current.onerror = (event) => {
      console.error('WebSocket error:', event);
      setWsError('WebSocket connection error. Real-time updates may be unavailable.');
      setError('WebSocket connection error.'); // Also set general error for UI
      setLoading(false);
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      setWsError('WebSocket disconnected. Attempting to reconnect...');
      // Implement reconnection logic if desired
      // For simplicity, this example doesn't auto-reconnect but you could add a timeout here to try new WebSocket(wsUrl)
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  // Remove the direct fetchTrendingCoins call and its useEffect block
  // as trending coins are now received via WebSocket.

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

  // Display WebSocket-specific error if present
  if (wsError && topCoins.length === 0) { // Only show if no data yet
    return (
      <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800 border-l-4 border-red-500">
        <p className="text-red-500">{wsError}</p>
        <p className="text-sm text-gray-500">Real-time price updates are currently unavailable. Trending coins might still be displayed.</p>
      </div>
    );
  }

  // Display general error if WS error didn't cover it and no data
  if (error && topCoins.length === 0) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800 border-l-4 border-red-500">
        <p className="text-red-500">{error}</p>
        {/* No retry button for WebSocket, it should attempt to connect on its own or show disconnected message */}
      </div>
    );
  }

  return (
    <div className="grid gap-6 mb-8">
      {/* Top Coins Section - Now powered by WebSocket */}
      <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Real-Time Top Cryptocurrencies
          </h2>
          {(lastUpdate && !wsError) && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last Update: {lastUpdate} (Live)
            </p>
          )}
          {wsError && (
             <p className="text-sm text-red-500 dark:text-red-400">
              {wsError}
            </p>
          )}
        </div>
        {topCoins.length === 0 && !loading && !error && !wsError && (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            Waiting for live price data...
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-gray-600 dark:text-gray-400">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  #
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Price (USD)
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  24h Change
                </th>
              </tr>
            </thead>
            <tbody>
              {topCoins.map((coin, index) => (
                <tr key={coin.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{index + 1}</td>
                  <td className="px-4 py-2 flex items-center">
                    <div className="flex-shrink-0">
                      {coin.image && (
                        <Image src={coin.image} alt={coin.name} width={24} height={24} className="rounded-full" />
                      )}
                    </div>
                    <div className="ml-3">
                      <span className="ml-2 font-semibold text-gray-800 dark:text-white">{coin.name}</span>
                      <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({coin.symbol?.toUpperCase()})</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    ${formatPrice(coin.current_price)}
                  </td>
                  <td className={`px-4 py-2 whitespace-nowrap text-sm ${ (coin.price_change_percentage_24h || 0) >= 0 ? 'text-green-600' : 'text-red-600' }`}>
                    {formatChange(coin.price_change_percentage_24h)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trending Coins Section - Now also powered by WebSocket */}
      <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
           <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Trending Cryptocurrencies
          </h2>
          {(lastUpdate && !wsError && trendingCoins.length > 0) && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Live from CoinGecko (via WebSocket)
            </p>
          )}
        </div>
        {trendingCoins.length === 0 && !loading && !error && !wsError && (
          <p className="text-gray-500 dark:text-gray-400">No trending data available at the moment.</p>
        )}
        {wsError && trendingCoins.length === 0 && (
            <p className="text-sm text-red-500 dark:text-red-400">
              Trending data unavailable due to WebSocket issue.
            </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingCoins.map((coin) => (
            <div key={coin.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow">
              {coin.small && (
                <Image src={coin.small} alt={coin.name} width={32} height={32} className="rounded-full mr-3" />
              )}
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">{coin.name} ({coin.symbol.toUpperCase()})</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Rank: {coin.market_cap_rank}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
