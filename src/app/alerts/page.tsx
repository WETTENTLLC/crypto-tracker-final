'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PageLayout from '../components/PageLayout';

interface Alert {
  coinName: string;
  coinId: string;
  alertType: 'above' | 'below';
  targetPrice: string;
  createdAt: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
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
    <PageLayout title="My Price Alerts">
      {alerts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
          </svg>
          <h2 className="text-xl font-medium text-black mb-2">No Price Alerts</h2>
          <p className="text-gray-500 mb-4">You haven&apos;t set any price alerts yet.</p>
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
          >
            Browse Cryptocurrencies
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          <ul className="divide-y divide-gray-200">
            {alerts.map((alert, index) => (
              <li key={index} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-black">{alert.coinName}</div>
                  <div className="text-sm text-gray-500">
                    Alert if price is {alert.alertType} ${alert.targetPrice}
                  </div>
                  <div className="text-xs text-gray-400">
                    Created: {new Date(alert.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteAlert(index)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {!isPremium && alerts.length >= 3 && (
        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.332-.216 3.001-1.742 3.001H4.42c-1.526 0-2.492-1.669-1.742-3.001l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-3a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You have reached the maximum number of alerts for free users.
                <Link href="/premium" className="font-medium underline text-yellow-700 hover:text-yellow-600 ml-1">
                  Upgrade to Premium
                </Link>
                {' '}for unlimited alerts.
              </p>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
