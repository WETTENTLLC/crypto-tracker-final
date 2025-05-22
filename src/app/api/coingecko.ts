import axios from 'axios';

const BASE_URL = 'https://api.coingecko.com/api/v3';
const API_KEY = 'CG-d43qzmJiMgUWSyPUnugQesvj';

// API rate limits: Higher limits with API key
// Adding delay to prevent rate limiting in case of heavy usage
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

export interface CoinDetail extends Coin {
  description: {
    en: string;
  };
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    announcement_url: string[];
    twitter_screen_name: string;
    facebook_username: string;
    telegram_channel_identifier: string;
    subreddit_url: string;
  };
  market_data: {
    current_price: {
      usd: number;
    };
    price_change_percentage_1h_in_currency: {
      usd: number;
    };
    price_change_percentage_24h_in_currency: {
      usd: number;
    };
    price_change_percentage_7d_in_currency: {
      usd: number;
    };
    price_change_percentage_30d_in_currency: {
      usd: number;
    };
  };
}

export interface MarketChart {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

// Helper function to add API key to requests
const getHeaders = () => {
  return {
    'x-cg-api-key': API_KEY
  };
};

// Get list of coins with market data
export const getCoins = async (
  page = 1,
  perPage = 50,
  currency = 'usd'
): Promise<Coin[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/coins/markets`, {
      params: {
        vs_currency: currency,
        order: 'market_cap_desc',
        per_page: perPage,
        page: page,
        sparkline: false,
        price_change_percentage: '24h',
      },
      headers: getHeaders()
    });
    
    // Reduced delay since we have an API key
    await delay(200);
    return response.data;
  } catch (error) {
    console.error('Error fetching coins:', error);
    return [];
  }
};

// Get detailed information for a specific coin
export const getCoinDetails = async (coinId: string): Promise<CoinDetail | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/coins/${coinId}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
      },
      headers: getHeaders()
    });
    
    // Reduced delay since we have an API key
    await delay(200);
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for coin ${coinId}:`, error);
    return null;
  }
};

// Get historical market data for a specific coin
export const getCoinMarketChart = async (
  coinId: string,
  days = 7,
  currency = 'usd'
): Promise<MarketChart | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: currency,
        days: days,
      },
      headers: getHeaders()
    });
    
    // Reduced delay since we have an API key
    await delay(200);
    return response.data;
  } catch (error) {
    console.error(`Error fetching market chart for coin ${coinId}:`, error);
    return null;
  }
};

// Search for coins, categories and markets
export const searchCoins = async (query: string): Promise<any> => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        query: query,
      },
      headers: getHeaders()
    });
    
    // Reduced delay since we have an API key
    await delay(200);
    return response.data;
  } catch (error) {
    console.error('Error searching coins:', error);
    return { coins: [] };
  }
};

// Get global crypto market data
export const getGlobalData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/global`, {
      headers: getHeaders()
    });
    
    await delay(200);
    return response.data;
  } catch (error) {
    console.error('Error fetching global data:', error);
    return null;
  }
};

// Get trending coins
export const getTrendingCoins = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/search/trending`, {
      headers: getHeaders()
    });
    
    await delay(200);
    return response.data;
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    return { coins: [] };
  }
};
