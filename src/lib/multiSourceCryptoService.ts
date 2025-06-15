// Multi-Source Cryptocurrency Data Service
// Provides redundant data fetching from multiple crypto APIs

import { cryptoDataConfig, type CryptoDataSource } from './cryptoDataConfig';

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
  image?: string | null; // Allow null for image
}

interface GlobalMarketData {
  total_market_cap: { usd: number };
  total_volume: { usd: number };
  market_cap_percentage: { btc: number };
  market_cap_change_percentage_24h_usd: number;
}

interface TrendingCoinItem {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;
}

interface TrendingCoin {
  item: TrendingCoinItem;
}

interface TrendingCoinsData {
  coins: TrendingCoin[];
}

interface SourceHealthInfo {
  isHealthy: boolean;
  lastChecked: number;
  errors: number;
  enabled: boolean;
  priority: number;
  name: string;
}

class MultiSourceCryptoService {
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private sourceHealthStatus: Map<string, { isHealthy: boolean; lastChecked: number; errors: number }> = new Map();

  constructor() {
    // Initialize health status for all sources
    Object.keys(cryptoDataConfig.sources).forEach(sourceName => {
      this.sourceHealthStatus.set(sourceName, {
        isHealthy: true,
        lastChecked: Date.now(),
        errors: 0
      });
    });
  }

  // Get cached data if valid
  private getCachedData(key: string): unknown | null {
    if (!cryptoDataConfig.cacheEnabled) return null;
    
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < (cryptoDataConfig.cacheTTL * 1000)) {
      return cached.data;
    }
    return null;
  }

  // Set cache data
  private setCacheData(key: string, data: unknown): void {
    if (cryptoDataConfig.cacheEnabled) {
      this.cache.set(key, { data, timestamp: Date.now() });
    }
  }

  // Check if source is healthy
  private isSourceHealthy(sourceName: string): boolean {
    const status = this.sourceHealthStatus.get(sourceName);
    return status ? status.isHealthy : false;
  }

  // Mark source as unhealthy
  private markSourceUnhealthy(sourceName: string, error: string): void {
    const status = this.sourceHealthStatus.get(sourceName);
    if (status) {
      status.isHealthy = false;
      status.errors += 1;
      status.lastChecked = Date.now();
      console.warn(`[MultiSourceCryptoService] Source ${sourceName} marked unhealthy: ${error}`);
    }
  }

  // Mark source as healthy
  private markSourceHealthy(sourceName: string): void {
    const status = this.sourceHealthStatus.get(sourceName);
    if (status) {
      status.isHealthy = true;
      status.errors = 0;
      status.lastChecked = Date.now();
    }
  }

  // Get coins data from CoinGecko (primary source)
  private async getCoinsFromCoinGecko(page: number = 1, limit: number = 100): Promise<CoinData[]> {
    const source = cryptoDataConfig.sources.coingecko;
    if (!source.enabled || !this.isSourceHealthy('coingecko')) {
      throw new Error('CoinGecko source unavailable');
    }

    const params = new URLSearchParams({
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: limit.toString(),
      page: page.toString(),
      sparkline: 'false'
    });

    if (source.apiKey) {
      params.append('x_cg_demo_api_key', source.apiKey);
    }

    const response = await fetch(`${source.baseUrl}/coins/markets?${params}`);
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    return await response.json();
  }

  // Get coins data from CoinMarketCap
  private async getCoinsFromCoinMarketCap(limit: number = 100): Promise<CoinData[]> {
    const source = cryptoDataConfig.sources.coinmarketcap;
    if (!source.enabled || !this.isSourceHealthy('coinmarketcap') || !source.apiKey) {
      throw new Error('CoinMarketCap source unavailable');
    }

    const response = await fetch(`${source.baseUrl}/cryptocurrency/listings/latest?limit=${limit}`, {
      headers: {
        'X-CMC_PRO_API_KEY': source.apiKey,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`CoinMarketCap API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform CoinMarketCap data to our format
    interface CoinMarketCapCoin {
        id: number;
        slug: string;
        symbol: string;
        name: string;
        quote: { USD: { price: number; market_cap: number; percent_change_24h: number; volume_24h: number } };
        cmc_rank: number;
    }
    return data.data.map((coin: CoinMarketCapCoin) => ({
      id: coin.slug,
      symbol: coin.symbol.toLowerCase(),
      name: coin.name,
      current_price: coin.quote.USD.price,
      market_cap: coin.quote.USD.market_cap,
      market_cap_rank: coin.cmc_rank,
      price_change_percentage_24h: coin.quote.USD.percent_change_24h,
      total_volume: coin.quote.USD.volume_24h,
      image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`
    }));
  }

  // Get coins data from Binance
  private async getCoinsFromBinance(): Promise<CoinData[]> {
    const source = cryptoDataConfig.sources.binance;
    if (!source.enabled || !this.isSourceHealthy('binance')) {
      throw new Error('Binance source unavailable');
    }

    const response = await fetch(`${source.baseUrl}/ticker/24hr`);
    
    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status}`);
    }

    const data = await response.json();
    
    interface BinanceTicker {
        symbol: string;
        lastPrice: string;
        priceChangePercent: string;
        volume: string;
    }
    // Filter for USDT pairs and transform to our format
    const usdtPairs = data.filter((ticker: BinanceTicker) => ticker.symbol.endsWith('USDT'));
    
    return usdtPairs.slice(0, 50).map((ticker: BinanceTicker, index: number) => ({
      id: ticker.symbol.replace('USDT', '').toLowerCase(),
      symbol: ticker.symbol.replace('USDT', '').toLowerCase(),
      name: ticker.symbol.replace('USDT', ''),
      current_price: parseFloat(ticker.lastPrice),
      market_cap: 0, // Binance doesn't provide market cap
      market_cap_rank: index + 1,
      price_change_percentage_24h: parseFloat(ticker.priceChangePercent),
      total_volume: parseFloat(ticker.volume),
      image: null
    }));
  }

  // Get coins data from Coinbase
  private async getCoinsFromCoinbase(): Promise<CoinData[]> {
    const source = cryptoDataConfig.sources.coinbase;
    if (!source.enabled || !this.isSourceHealthy('coinbase')) {
      throw new Error('Coinbase source unavailable');
    }

    const response = await fetch(`${source.baseUrl}/exchange-rates?currency=USD`);
    
    if (!response.ok) {
      throw new Error(`Coinbase API error: ${response.status}`);
    }

    const data = await response.json();
    const rates = data.data.rates;
    
    // Transform to our format (limited data from Coinbase)
    const coins = Object.entries(rates).slice(0, 20).map(([symbol, price], index) => ({
      id: symbol.toLowerCase(),
      symbol: symbol.toLowerCase(),
      name: symbol,
      current_price: 1 / parseFloat(price as string),
      market_cap: 0,
      market_cap_rank: index + 1,
      price_change_percentage_24h: 0,
      total_volume: 0,
      image: null
    }));

    return coins.filter(coin => ['btc', 'eth', 'ada', 'dot', 'link'].includes(coin.symbol));
  }

  // Get sorted sources by priority
  private getSortedSources(): Array<{ name: string; source: CryptoDataSource }> {
    return Object.entries(cryptoDataConfig.sources)
      .filter(([name, source]) => source.enabled && this.isSourceHealthy(name))
      .map(([name, sourceObj]) => ({ name, source: sourceObj })) // Renamed source to sourceObj to avoid conflict
      .sort((a, b) => a.source.priority - b.source.priority);
  }

  // Main method to get coins with fallback
  async getCoins(page: number = 1, limit: number = 100): Promise<CoinData[]> {
    const cacheKey = `coins_${page}_${limit}`;
    
    // Try cache first
    const cached = this.getCachedData(cacheKey) as CoinData[] | null;
    if (cached) {
      return cached;
    }

    const sortedSources = this.getSortedSources();
    
    for (const { name } of sortedSources) { // Removed unused 'source'
      try {
        let coins: CoinData[] = [];
        
        switch (name) {
          case 'coingecko':
            coins = await this.getCoinsFromCoinGecko(page, limit);
            break;
          case 'coinmarketcap':
            coins = await this.getCoinsFromCoinMarketCap(limit);
            break;
          case 'binance':
            coins = await this.getCoinsFromBinance();
            break;
          case 'coinbase':
            coins = await this.getCoinsFromCoinbase();
            break;
          default:
            continue;
        }

        if (coins && coins.length > 0) {
          this.markSourceHealthy(name);
          this.setCacheData(cacheKey, coins);
          console.log(`[MultiSourceCryptoService] Successfully fetched ${coins.length} coins from ${name}`);
          return coins;
        }
      } catch (error) {
        this.markSourceUnhealthy(name, error instanceof Error ? error.message : 'Unknown error');
        console.warn(`[MultiSourceCryptoService] Failed to fetch from ${name}:`, error);
      }
    }

    // If all sources fail, try to return cached data even if stale
    const staleCache = this.cache.get(cacheKey);
    if (staleCache) {
      console.warn('[MultiSourceCryptoService] All sources failed, returning stale cache data');
      return staleCache.data as CoinData[];
    }

    throw new Error('All cryptocurrency data sources are unavailable');
  }

  // Get global market data with fallback
  async getGlobalData(): Promise<{ data: GlobalMarketData } | null> {
    const cacheKey = 'global_data';
    
    // Try cache first
    const cached = this.getCachedData(cacheKey) as { data: GlobalMarketData } | null;
    if (cached) {
      return cached;
    }

    // Try CoinGecko first (most reliable for global data)
    try {
      const source = cryptoDataConfig.sources.coingecko;
      if (source.enabled && this.isSourceHealthy('coingecko')) {
        const params = new URLSearchParams();
        if (source.apiKey) {
          params.append('x_cg_demo_api_key', source.apiKey);
        }

        const response = await fetch(`${source.baseUrl}/global?${params}`);
        
        if (response.ok) {
          const data = await response.json();
          this.setCacheData(cacheKey, data);
          this.markSourceHealthy('coingecko');
          return data;
        }
      }
    } catch (error) {
      this.markSourceUnhealthy('coingecko', error instanceof Error ? error.message : 'Unknown error');
    }

    // Fallback to mock global data if all sources fail
    const fallbackData = {
      data: {
        total_market_cap: { usd: 2500000000000 },
        total_volume: { usd: 65000000000 },
        market_cap_percentage: { btc: 42.5 },
        market_cap_change_percentage_24h_usd: 2.3
      }
    };

    console.warn('[MultiSourceCryptoService] Using fallback global market data');
    return fallbackData;
  }

  // Get trending coins with fallback
  async getTrendingCoins(): Promise<TrendingCoinsData> {
    const cacheKey = 'trending_coins';
    
    // Try cache first
    const cached = this.getCachedData(cacheKey) as TrendingCoinsData | null;
    if (cached) {
      return cached;
    }

    // Try CoinGecko for trending data
    try {
      const source = cryptoDataConfig.sources.coingecko;
      if (source.enabled && this.isSourceHealthy('coingecko')) {
        const params = new URLSearchParams();
        if (source.apiKey) {
          params.append('x_cg_demo_api_key', source.apiKey);
        }

        const response = await fetch(`${source.baseUrl}/search/trending?${params}`);
        
        if (response.ok) {
          const data = await response.json();
          this.setCacheData(cacheKey, data);
          this.markSourceHealthy('coingecko');
          return data;
        }
      }
    } catch (error) {
      this.markSourceUnhealthy('coingecko', error instanceof Error ? error.message : 'Unknown error');
    }

    // Fallback to top coins as "trending"
    try {
      const topCoins = await this.getCoins(1, 10);
      const fallbackTrending = {
        coins: topCoins.slice(0, 7).map(coin => ({
          item: {
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            market_cap_rank: coin.market_cap_rank
          }
        }))
      };
      
      console.warn('[MultiSourceCryptoService] Using top coins as fallback trending data');
      return fallbackTrending;
    } catch (error) {
      console.error('[MultiSourceCryptoService] Failed to get fallback trending data:', error);
      return { coins: [] };
    }
  }

  // Get health status of all sources
  getSourceHealthStatus(): Record<string, SourceHealthInfo> {
    const status: Record<string, SourceHealthInfo> = {};
    
    this.sourceHealthStatus.forEach((health, sourceName) => {
      const sourceConfig = cryptoDataConfig.sources[sourceName as keyof typeof cryptoDataConfig.sources];
      status[sourceName] = {
        ...health,
        enabled: sourceConfig?.enabled || false,
        priority: sourceConfig?.priority || 999,
        name: sourceConfig?.name || sourceName
      };
    });

    return status;
  }
}

// Export singleton instance
export const multiSourceCryptoService = new MultiSourceCryptoService();

// Export individual methods for compatibility
export const getCoins = (page?: number, limit?: number) => multiSourceCryptoService.getCoins(page, limit);
export const getGlobalData = () => multiSourceCryptoService.getGlobalData();
export const getTrendingCoins = () => multiSourceCryptoService.getTrendingCoins();
export const getSourceHealthStatus = () => multiSourceCryptoService.getSourceHealthStatus();
