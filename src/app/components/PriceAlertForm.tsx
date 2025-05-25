import { useState } from 'react';

interface PriceAlertFormProps {
  coinId: string;
  coinName: string;
  currentPrice: number;
}

export default function PriceAlertForm({ coinId, coinName, currentPrice }: PriceAlertFormProps) {
  const [alertType, setAlertType] = useState<'above' | 'below'>('above');
  const [price, setPrice] = useState<string>(currentPrice.toString());
  const [alertCreated, setAlertCreated] = useState<boolean>(false);
  const [alertCount, setAlertCount] = useState<number>(0);
  const [showLimitMessage, setShowLimitMessage] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For free tier, limit to 3 alerts
    if (alertCount >= 3) {
      setShowLimitMessage(true);
      return;
    }
    
    // In a real app, this would save to a database
    // For now, we'll just simulate alert creation
    setAlertCreated(true);
    setAlertCount(alertCount + 1);
    
    // Store in localStorage for persistence
    const alerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]');
    alerts.push({
      coinId,
      coinName,
      targetPrice: parseFloat(price),
      alertType,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('priceAlerts', JSON.stringify(alerts));
    
    // Reset form
    setTimeout(() => {
      setAlertCreated(false);
    }, 3000);
  };

  return (
    <div>
      {alertCreated && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          Alert created successfully! We&apos;ll notify you when {coinName} goes {alertType} ${price}.
        </div>
      )}
      
      {showLimitMessage && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded-md">
          <p className="font-medium">Free tier limit reached</p>
          <p>You&apos;ve reached the maximum of 3 alerts for free accounts. Upgrade to Premium for unlimited alerts!</p>
          <button 
            className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
            onClick={() => setShowLimitMessage(false)}
          >
            Dismiss
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="alertType">Alert me when price goes:</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center text-gray-700 font-medium">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="alertType"
                value="above"
                checked={alertType === 'above'}
                onChange={() => setAlertType('above')}
                aria-label="Alert when price goes above"
              />
              <span className="ml-2">Above</span>
            </label>
            <label className="inline-flex items-center text-gray-700 font-medium">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="alertType"
                value="below"
                checked={alertType === 'below'}
                onChange={() => setAlertType('below')}
                aria-label="Alert when price goes below"
              />
              <span className="ml-2">Below</span>
            </label>
          </div>
        </div>
        
        <div>
          <label htmlFor="price" className="block text-gray-700 font-semibold mb-2">
            Target Price (USD)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-600 font-semibold">$</span>
            </div>
            <input
              type="number"
              id="price"
              name="price"
              step="0.000001"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="0.00"
              required
              aria-label="Target price in USD"
            />
          </div>
          <p className="mt-1 text-sm text-gray-600 font-medium">
            Current price: ${currentPrice.toFixed(currentPrice < 1 ? 6 : 2)}
          </p>
        </div>
        
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Alert
          </button>
          <p className="mt-2 text-sm text-gray-600 text-center font-medium">
            {3 - alertCount} of 3 free alerts remaining
          </p>
        </div>
      </form>
    </div>
  );
}
