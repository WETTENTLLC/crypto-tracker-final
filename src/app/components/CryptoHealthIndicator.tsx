'use client';
import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface HealthIndicatorProps {
  className?: string;
  showLabel?: boolean;
}

export default function CryptoHealthIndicator({ className = '', showLabel = true }: HealthIndicatorProps) {
  const [health, setHealth] = useState<{ score: number; status: string; activeSource: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthScore();
    
    // Refresh every 2 minutes
    const interval = setInterval(fetchHealthScore, 120000);
    return () => clearInterval(interval);
  }, []);

  const fetchHealthScore = async () => {
    try {
      const response = await fetch('/api/crypto/health');
      if (response.ok) {
        const data = await response.json();
        setHealth({
          score: data.overallHealth,
          status: data.overallHealth >= 80 ? 'healthy' : data.overallHealth >= 60 ? 'warning' : 'critical',
          activeSource: data.activeSource
        });
      }
    } catch (error) {
      console.error('Failed to fetch health status:', error);
      setHealth({
        score: 0,
        status: 'critical',
        activeSource: 'Unknown'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center ${className}`}>
        <Clock className="w-4 h-4 text-gray-400 animate-pulse" />
        {showLabel && <span className="ml-1 text-sm text-gray-500">Checking...</span>}
      </div>
    );
  }

  if (!health) {
    return (
      <div className={`flex items-center ${className}`}>
        <AlertTriangle className="w-4 h-4 text-red-500" />
        {showLabel && <span className="ml-1 text-sm text-red-600">Data Offline</span>}
      </div>
    );
  }

  const getStatusColor = () => {
    switch (health.status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (health.status) {
      case 'healthy': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (health.status) {
      case 'healthy': return `Data ${health.activeSource}`;
      case 'warning': return `${health.activeSource} (Backup)`;
      case 'critical': return 'Data Issues';
      default: return 'Unknown';
    }
  };

  return (
    <div 
      className={`flex items-center cursor-pointer ${className}`}
      title={`Data Health: ${health.score}% - Active Source: ${health.activeSource}`}
    >
      {getStatusIcon()}
      {showLabel && (
        <span className={`ml-1 text-sm ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      )}
    </div>
  );
}
