'use client';
import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Activity, TrendingUp, Database } from 'lucide-react';

interface SourceHealth {
  isHealthy: boolean;
  lastChecked: number;
  errors: number;
  name?: string;
}

interface HealthStatus {
  overallHealth: number;
  activeSource: string;
  sources: Record<string, SourceHealth>;
  recommendations: string[];
}

export default function CryptoSourceHealthDashboard() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHealthStatus();
    
    // Refresh health status every 30 seconds
    const interval = setInterval(fetchHealthStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchHealthStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/crypto/health');
      
      if (!response.ok) {
        throw new Error('Failed to fetch health status');
      }
      
      const data = await response.json();
      setHealthStatus(data);
      setError(null);
    } catch (err) {
      setError('Failed to load health status');
      console.error('Health status fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-green-600 bg-green-100';
    if (health >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSourceIcon = (isHealthy: boolean) => {
    return isHealthy ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <AlertTriangle className="h-5 w-5 text-red-600" />
    );
  };

  const formatLastChecked = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (loading && !healthStatus) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !healthStatus) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-red-500">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
        <button 
          onClick={fetchHealthStatus}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Health Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
            <Database className="h-6 w-6 mr-2" />
            Crypto Data Sources Health
          </h2>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(healthStatus?.overallHealth || 0)}`}>
            {healthStatus?.overallHealth || 0}% Healthy
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              {healthStatus?.overallHealth || 0}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Overall Health</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {healthStatus?.activeSource || 'Unknown'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Source</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Object.keys(healthStatus?.sources || {}).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Sources</div>
          </div>
        </div>

        {/* Health Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              (healthStatus?.overallHealth || 0) >= 80 ? 'bg-green-600' :
              (healthStatus?.overallHealth || 0) >= 50 ? 'bg-yellow-600' : 'bg-red-600'
            }`}
            style={{ width: `${healthStatus?.overallHealth || 0}%` }}
          ></div>
        </div>

        {/* Recommendations */}
        {healthStatus?.recommendations && healthStatus.recommendations.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-2">Recommendations:</h3>
            <ul className="space-y-1">
              {healthStatus.recommendations.map((recommendation, index) => (
                <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Individual Source Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Individual Source Status
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(healthStatus?.sources || {}).map(([sourceName, source]) => (
            <div 
              key={sourceName}
              className={`border rounded-lg p-4 ${
                source.isHealthy 
                  ? 'border-green-200 bg-green-50 dark:bg-green-900/20' 
                  : 'border-red-200 bg-red-50 dark:bg-red-900/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800 dark:text-white capitalize">
                  {source.name || sourceName}
                </h4>
                {getSourceIcon(source.isHealthy)}
              </div>
              
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className={source.isHealthy ? 'text-green-600' : 'text-red-600'}>
                    {source.isHealthy ? 'Healthy' : 'Unhealthy'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Errors:</span>
                  <span className="text-gray-800 dark:text-white">{source.errors}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Last Check:</span>
                  <span className="text-gray-800 dark:text-white">
                    {formatLastChecked(source.lastChecked)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Refresh Controls */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Auto-refresh every 30 seconds
        </div>
        <button
          onClick={fetchHealthStatus}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center"
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          {loading ? 'Refreshing...' : 'Refresh Now'}
        </button>
      </div>
    </div>
  );
}
