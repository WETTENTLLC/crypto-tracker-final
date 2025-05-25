// This file provides utility functions for generating crypto content based on real data
import { getCoins, getTrendingCoins, getGlobalData } from '../coingecko';

// Format price with appropriate precision
export const formatPrice = (price: number) => {
  if (price < 0.01) return price.toFixed(6);
  if (price < 1) return price.toFixed(4);
  if (price < 1000) return price.toFixed(2);
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(price);
};

// Generate market update content based on real-time data
export const generateMarketUpdateContent = async () => {
  try {
    // Get top coins data
    const coins = await getCoins(1, 20);
    
    // Get global market data
    const globalData = await getGlobalData();
    
    if (!coins.length) {
      throw new Error('Failed to fetch coin data');
    }
    
    // Sort coins by 24h price change percentage for gainers and losers
    const sortedCoins = [...coins].sort((a, b) => 
      b.price_change_percentage_24h - a.price_change_percentage_24h
    );
    
    const topGainers = sortedCoins.slice(0, 3);
    const topLosers = sortedCoins.slice(-3).reverse();
    
    // Format global market data
    const marketCapChange = globalData?.data?.market_cap_change_percentage_24h_usd || 0;
    const marketCapChangeFormatted = marketCapChange >= 0 
      ? `+${marketCapChange.toFixed(2)}%` 
      : `${marketCapChange.toFixed(2)}%`;
      
    const marketDirection = marketCapChange >= 0 ? '📈' : '📉';
    
    // Build the content string
    let content = `📊 Crypto Market Update ${marketDirection}\n\n`;
    
    // Add market overview
    content += `Global Market: ${marketCapChangeFormatted} (24h)\n`;
    content += `BTC Dominance: ${(globalData?.data?.market_cap_percentage?.btc || 0).toFixed(1)}%\n\n`;
    
    // Add top gainers
    content += `🚀 Top Gainers (24h):\n`;
    topGainers.forEach(coin => {
      const change = coin.price_change_percentage_24h >= 0 
        ? `+${coin.price_change_percentage_24h.toFixed(2)}%`
        : `${coin.price_change_percentage_24h.toFixed(2)}%`;
      content += `${coin.name} (${coin.symbol.toUpperCase()}): $${formatPrice(coin.current_price)} | ${change}\n`;
    });
    
    content += '\n';
    
    // Add top losers
    content += `📉 Top Losers (24h):\n`;
    topLosers.forEach(coin => {
      const change = coin.price_change_percentage_24h >= 0 
        ? `+${coin.price_change_percentage_24h.toFixed(2)}%`
        : `${coin.price_change_percentage_24h.toFixed(2)}%`;
      content += `${coin.name} (${coin.symbol.toUpperCase()}): $${formatPrice(coin.current_price)} | ${change}\n`;
    });
    
    content += '\nTrack these coins and set price alerts on CryptoTracker!';
    
    return content;
  } catch (error) {
    console.error('Error generating market update content:', error);
    return null;
  }
};

// Generate trending coins content based on real data
export const generateTrendingCoinsContent = async () => {
  try {
    const trendingData = await getTrendingCoins();
    const trendingCoins = trendingData?.coins || [];
    
    if (!trendingCoins.length) {
      throw new Error('Failed to fetch trending coins');
    }
    
    // Build the content string
    let content = `🔥 Trending Coins Today 🔥\n\n`;
    
    // Add trending coins
    // Define interfaces for trending coin data structure
    interface TrendingCoinItem {
      name: string;
      symbol: string;
      market_cap_rank?: number;
    }
    
    interface TrendingCoinData {
      item: TrendingCoinItem;
    }

    trendingCoins.slice(0, 5).forEach((coinData: TrendingCoinData, index: number) => {
      const coin: TrendingCoinItem = coinData.item;
      content += `${index + 1}. ${coin.name} (${coin.symbol.toUpperCase()})`;
      if (coin.market_cap_rank) {
        content += ` | Rank #${coin.market_cap_rank}`;
      }
      content += '\n';
    });
    
    content += '\nStay ahead of the market with CryptoTracker!';
    
    return content;
  } catch (error) {
    console.error('Error generating trending coins content:', error);
    return null;
  }
};

// Generate price alert content based on real data
export const generatePriceAlertContent = async (coinId: string = 'bitcoin', targetPrice?: number) => {
  try {
    const coins = await getCoins(1, 100);
    const coin = coins.find(c => c.id === coinId) || coins[0];
    
    if (!coin) {
      throw new Error('Failed to fetch coin data');
    }
    
    // If no target price provided, generate one based on current price
    const price = coin.current_price;
    const randomFactor = Math.random() * 0.05 + 0.01; // 1-5% change
    const direction = Math.random() > 0.5;
    const simulatedTargetPrice = direction 
      ? price * (1 + randomFactor) 
      : price * (1 - randomFactor);
      
    const actualTargetPrice = targetPrice || simulatedTargetPrice;
    const priceText = `$${formatPrice(actualTargetPrice)}`;
    const actionText = actualTargetPrice > price ? 'surpassed' : 'dropped below';
    
    // Build the content string
    let content = `⚠️ Price Alert ⚠️\n\n`;
    content += `${coin.name} (${coin.symbol.toUpperCase()}) has ${actionText} ${priceText}!\n\n`;
    content += `Current price: $${formatPrice(price)}\n`;
    content += `24h change: ${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}%\n\n`;
    content += `Check your CryptoTracker dashboard for more details.`;
    
    return content;
  } catch (error) {
    console.error('Error generating price alert content:', error);
    return null;
  }
};
