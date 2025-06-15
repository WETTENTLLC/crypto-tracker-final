import { useState, useEffect } from 'react';
import { getCoins, Coin } from '../api/coingecko';
import Link from 'next/link';
import Image from 'next/image';
import { navigateTo } from '../utils/NavigationFix';

export default function CoinList() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        const data = await getCoins(page);
        setCoins(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch cryptocurrency data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, [page]);

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

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coin</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">24h %</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {coins.map((coin) => (
            <tr key={coin.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{coin.market_cap_rank}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link href={`/coin/${coin.id}`} className="flex items-center" prefetch={true} onClick={(e) => {
                  e.preventDefault();
                  navigateTo(`/coin/${coin.id}`);
                }}>
                  <div className="flex-shrink-0 h-8 w-8 mr-3">
                    <Image 
                      src={coin.image} 
                      alt={coin.name} 
                      width={32} 
                      height={32} 
                      className="rounded-full" 
                      onError={(e) => {
                        e.currentTarget.src = '/crypto-placeholder.svg';
                      }}
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNmM2Y0ZjYiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0iIzk0YTNiOCIgeD0iOCIgeT0iOCI+CjxwYXRoIGQ9Im04IDFhNyA3IDAgMSAwIDAgMTRhNyA3IDAgMCAwIDAtMTR6bTAgMTJhNSA1IDAgMSAxIDAtMTBhNSA1IDAgMCAxIDAgMTB6Ii8+Cjwvc3ZnPgo8L3N2Zz4K"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900">{coin.name}</div>
                    <div className="text-sm text-gray-500">{coin.symbol.toUpperCase()}</div>
                  </div>
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                {formatPrice(coin.current_price)}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                coin.price_change_percentage_24h > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatPercent(coin.price_change_percentage_24h)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  notation: 'compact',
                  compactDisplay: 'short',
                }).format(coin.market_cap)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="flex justify-between items-center mt-4 px-6 py-3">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className={`px-4 py-2 border rounded-md ${
            page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50'
          }`}
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {page}
        </span>
        <button
          onClick={handleNextPage}
          className="px-4 py-2 border rounded-md bg-white text-blue-600 hover:bg-blue-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
