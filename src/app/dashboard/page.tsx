'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import RealTimeCryptoTicker from '../components/RealTimeCryptoTicker';
import MarketOverview from '../components/MarketOverview';

export default function UserDashboard() {
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [watchlist, setWatchlist] = useState([
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: '$62,450.00', change: '+2.3%', isPositive: true },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: '$3,120.75', change: '+1.8%', isPositive: true },
    { id: 'solana', name: 'Solana', symbol: 'SOL', price: '$142.25', change: '-0.5%', isPositive: false },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: '$0.58', change: '+0.7%', isPositive: true },
    { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', price: '$0.12', change: '-1.2%', isPositive: false }
  ]);
  
  const [alerts, setAlerts] = useState([
    { id: 1, coinId: 'bitcoin', coinName: 'Bitcoin', targetPrice: 65000, alertType: 'above', createdAt: new Date().toISOString() },
    { id: 2, coinId: 'ethereum', coinName: 'Ethereum', targetPrice: 3000, alertType: 'below', createdAt: new Date().toISOString() }
  ]);
  
  const [portfolioValue, setPortfolioValue] = useState({
    total: '$12,450.75',
    change: '+$345.28',
    changePercent: '+2.8%',
    isPositive: true
  });
  
  const [portfolioData, setPortfolioData] = useState([
    { name: 'Bitcoin', value: 7500 },
    { name: 'Ethereum', value: 3200 },
    { name: 'Solana', value: 950 },
    { name: 'Cardano', value: 450 },
    { name: 'Other', value: 350 }
  ]);
  
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'Alert Triggered', coin: 'Bitcoin', details: 'Price above $62,000', time: '2 hours ago' },
    { id: 2, type: 'Alert Created', coin: 'Ethereum', details: 'Alert when below $3,000', time: '1 day ago' },
    { id: 3, type: 'Watchlist Added', coin: 'Solana', details: 'Added to watchlist', time: '2 days ago' },
    { id: 4, type: 'Premium Upgrade', coin: '', details: 'Subscription activated', time: '3 days ago' }
  ]);
  
  const [trendingCoins, setTrendingCoins] = useState([
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: '$62,450.00', change: '+2.3%', isPositive: true },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: '$3,120.75', change: '+1.8%', isPositive: true },
    { id: 'solana', name: 'Solana', symbol: 'SOL', price: '$142.25', change: '-0.5%', isPositive: false },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: '$0.58', change: '+0.7%', isPositive: true },
    { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', price: '$0.12', change: '-1.2%', isPositive: false }
  ]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  useEffect(() => {
    // Check if user is premium
    const premium = localStorage.getItem('isPremium') === 'true';
    setIsPremium(premium);
    
    // In a real app, we would fetch user-specific data here
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            My Dashboard
          </h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          {!isPremium && (
            <Link
              href="/premium"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Upgrade to Premium
            </Link>
          )}
        </div>
      </div>
      
      {/* Portfolio Value Card - Premium Only */}
      {isPremium ? (
        <div className="bg-white overflow-hidden shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <h2 className="text-lg leading-6 font-medium text-gray-900">Portfolio Value</h2>
                <div className="mt-2 flex items-baseline">
                  <p className="text-3xl font-semibold text-gray-900">
                    {portfolioValue.total}
                  </p>
                  <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                    portfolioValue.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {portfolioValue.isPositive ? (
                      <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="self-center flex-shrink-0 h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className="sr-only">
                      {portfolioValue.isPositive ? 'Increased by' : 'Decreased by'}
                    </span>
                    {portfolioValue.change} ({portfolioValue.changePercent})
                  </p>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <Link
                  href="/portfolio"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Manage Portfolio
                </Link>
                <Link
                  href="/portfolio/add"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Assets
                </Link>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { date: 'Mon', value: 11800 },
                      { date: 'Tue', value: 12100 },
                      { date: 'Wed', value: 11950 },
                      { date: 'Thu', value: 12300 },
                      { date: 'Fri', value: 12100 },
                      { date: 'Sat', value: 12250 },
                      { date: 'Sun', value: 12450 }
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis 
                      domain={['dataMin - 500', 'dataMax + 500']}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={portfolioData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {portfolioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-4 md:mb-0 md:mr-6 flex-1">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">Track Your Crypto Portfolio</h2>
              <p className="text-blue-700 mb-4">
                Upgrade to Premium to track your cryptocurrency portfolio with detailed analytics and performance metrics.
              </p>
              <ul className="text-blue-700 space-y-1 mb-4">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Track all your crypto assets in one place
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  View detailed performance charts
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Get insights on portfolio allocation
                </li>
              </ul>
            </div>
            <div>
              <Link 
                href="/premium" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
              >
                Upgrade Now - $5.99/month
              </Link>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 mb-8">
        {/* Watchlist */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h2 className="text-lg leading-6 font-medium text-gray-900">My Watchlist</h2>
            <Link
              href="/watchlist"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View All
            </Link>
          </div>
          <div className="border-t border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coin
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      24h Change
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {watchlist.map((coin) => (
                    <tr key={coin.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/coin/${coin.id}`} className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            {coin.symbol.substring(0, 1)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{coin.name}</div>
                            <div className="text-sm text-gray-500">{coin.symbol}</div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {coin.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex text-sm ${
                          coin.isPositive ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {coin.change}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Price Alerts */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h2 className="text-lg leading-6 font-medium text-gray-900">My Price Alerts</h2>
            <Link
              href="/alerts"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View All
            </Link>
          </div>
          <div className="border-t border-gray-200">
            {alerts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Coin
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Alert Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Target Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {alerts.map((alert) => (
                      <tr key={alert.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link href={`/coin/${alert.coinId}`} className="text-sm font-medium text-gray-900">
                            {alert.coinName}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            alert.alertType === 'above' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {alert.alertType === 'above' ? 'Above' : 'Below'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${alert.targetPrice.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500">You haven't set any price alerts yet.</p>
                <Link 
                  href="/" 
                  className="mt-2 inline-block text-blue-600 hover:text-blue-500"
                >
                  Browse coins to set alerts
                </Link>
              </div>
            )}
          </div>
          {!isPremium && alerts.length > 0 && (
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <p className="text-xs text-gray-500 mb-1">
                Free users are limited to 3 alerts. {alerts.length}/3 used.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Market Overview */}
      <div className="mb-8">
        <MarketOverview />
      </div>
      
      {/* Real-time Crypto Ticker */}
      <div className="mb-8">
        <RealTimeCryptoTicker />
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Activity */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h2>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {recentActivity.map((activity) => (
                <li key={activity.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                        activity.type === 'Alert Triggered' ? 'bg-yellow-100' :
                        activity.type === 'Alert Created' ? 'bg-blue-100' :
                        activity.type === 'Watchlist Added' ? 'bg-green-100' :
                        'bg-purple-100'
                      }`}>
                        {activity.type === 'Alert Triggered' && (
                          <svg className="h-4 w-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        )}
                        {activity.type === 'Alert Created' && (
                          <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        )}
                        {activity.type === 'Watchlist Added' && (
                          <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                        )}
                        {activity.type === 'Premium Upgrade' && (
                          <svg className="h-4 w-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                        <p className="text-sm text-gray-500">
                          {activity.coin && `${activity.coin}: `}{activity.details}
                        </p>
                      </div>
                    </div>
                    <div className="ml-6 flex-shrink-0">
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Trending Coins */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Trending Coins</h2>
          </div>
          <div className="border-t border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coin
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      24h Change
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trendingCoins.map((coin) => (
                    <tr key={coin.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/coin/${coin.id}`} className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            {coin.symbol.substring(0, 1)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{coin.name}</div>
                            <div className="text-sm text-gray-500">{coin.symbol}</div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {coin.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex text-sm ${
                          coin.isPositive ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {coin.change}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-4">
                          Add Alert
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          Watch
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
