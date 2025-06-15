// Multiple Cryptocurrency Data Sources MCP
// This service provides redundant crypto data from multiple sources

export interface CryptoDataSource {
  name: string;
  enabled: boolean;
  baseUrl: string;
  apiKey?: string;
  rateLimit: number; // requests per minute
  priority: number; // 1 = highest priority
}

export interface CryptoDataConfig {
  sources: {
    coingecko: CryptoDataSource;
    coinmarketcap: CryptoDataSource;
    cryptocompare: CryptoDataSource;
    binance: CryptoDataSource;
    coinbase: CryptoDataSource;
    kraken: CryptoDataSource;
    fallbackCache: CryptoDataSource;
  };
  fallbackStrategy: 'priority' | 'roundRobin' | 'fastest';
  cacheEnabled: boolean;
  cacheTTL: number; // seconds
}

// Multiple crypto data sources configuration
export const cryptoDataConfig: CryptoDataConfig = {
  sources: {
    // Primary source - CoinGecko (we're already using this)
    coingecko: {
      name: 'CoinGecko',
      enabled: true,
      baseUrl: 'https://api.coingecko.com/api/v3',
      apiKey: process.env.COINGECKO_API_KEY,
      rateLimit: 30, // 30 calls per minute on free tier
      priority: 1
    },
    
    // Secondary source - CoinMarketCap
    coinmarketcap: {
      name: 'CoinMarketCap',
      enabled: true,
      baseUrl: 'https://pro-api.coinmarketcap.com/v1',
      apiKey: process.env.COINMARKETCAP_API_KEY,
      rateLimit: 33, // 333 calls per day on basic plan
      priority: 2
    },
    
    // Third source - CryptoCompare
    cryptocompare: {
      name: 'CryptoCompare',
      enabled: true,
      baseUrl: 'https://min-api.cryptocompare.com/data',
      apiKey: process.env.CRYPTOCOMPARE_API_KEY,
      rateLimit: 100, // 100k calls per month on free tier
      priority: 3
    },
    
    // Fourth source - Binance (no API key needed for public data)
    binance: {
      name: 'Binance',
      enabled: true,
      baseUrl: 'https://api.binance.com/api/v3',
      rateLimit: 1200, // 1200 requests per minute
      priority: 4
    },
    
    // Fifth source - Coinbase (public API)
    coinbase: {
      name: 'Coinbase',
      enabled: true,
      baseUrl: 'https://api.coinbase.com/v2',
      rateLimit: 10000, // 10,000 requests per hour
      priority: 5
    },
    
    // Sixth source - Kraken (public API)
    kraken: {
      name: 'Kraken',
      enabled: true,
      baseUrl: 'https://api.kraken.com/0/public',
      rateLimit: 60, // 60 calls per minute
      priority: 6
    },
    
    // Fallback cache (local storage/database)
    fallbackCache: {
      name: 'Fallback Cache',
      enabled: true,
      baseUrl: '/api/crypto/cache',
      rateLimit: 9999,
      priority: 99
    }
  },
  
  fallbackStrategy: 'priority',
  cacheEnabled: true,
  cacheTTL: 300 // 5 minutes cache
};

export default cryptoDataConfig;
