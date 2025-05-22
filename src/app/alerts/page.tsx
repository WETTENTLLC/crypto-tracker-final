'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  
  useEffect(() => {
    // Check premium status
    const premium = localStorage.getItem('isPremium') === 'true';
    setIsPremium(premium);
    
    // Load saved alerts from localStorage
    const savedAlerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]');
    setAlerts(savedAlerts);
  }, []);
  
  const handleDeleteAlert = (index: number) => {
    const updatedAlerts = [...alerts];
    updatedAlerts.splice(index, 1);
    setAlerts(updatedAlerts);
    localStorage.setItem('priceAlerts', JSON.stringify(updatedAlerts));
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Price Alerts</h1>
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          Back to Dashboard
        </Link>
      </div>
      
      {alerts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
          </svg>
          <h2 className="text-xl font-medium text-gray-700 mb-2">No Price Alerts</h2>
          <p className="text-gray-500 mb-4">You haven't set any price alerts yet.</p>
          <Link 
            href="/" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
          >
            Browse Cryptocurrencies
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cryptocurrency
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alert Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {alerts.map((alert, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{alert.coinName}</div>
                    <div className="text-sm text-gray-500">{alert.coinId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      alert.alertType === 'above' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {alert.alertType === 'above' ? 'Above' : 'Below'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${parseFloat(alert.targetPrice).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(alert.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteAlert(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {!isPremium && alerts.length > 0 && (
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-100">
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-4 md:mb-0 md:mr-6 flex-1">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">Upgrade to Premium</h2>
              <p className="text-blue-700 mb-4">
                Get unlimited price alerts, SMS notifications, and more with our premium subscription.
              </p>
              <ul className="text-blue-700 space-y-1 mb-4">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Unlimited price alerts (currently limited to 3)
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  SMS & email notifications
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
    </div>
  );
}
