import axios from 'axios';
import Twitter from 'twitter-v2';
import { FacebookAdsApi, Page } from 'facebook-nodejs-business-sdk';
import Mailchimp from '@mailchimp/mailchimp_marketing';

// Twitter API integration for automated content sharing
// Twitter API response types
interface TwitterApiResponseData {
  id: string;
  text: string;
}

interface TwitterApiResponse {
  data: TwitterApiResponseData;
}

// Return type for the function
interface TwitterShareResult {
  success: boolean;
  id: string;
  text: string;
}

export const shareToTwitter = async (
  content: string, 
  apiKey: string, 
  apiSecret: string, 
  accessToken: string, 
  accessTokenSecret: string
): Promise<TwitterShareResult> => {
  try {
    // Initialize Twitter client
    const client = new Twitter({
      consumer_key: apiKey,
      consumer_secret: apiSecret,
      access_token_key: accessToken,
      access_token_secret: accessTokenSecret
    });
    
    // Post tweet
    const response = await client.post('tweets', {
      text: content
    }) as TwitterApiResponse;
    
    // Type assertion for the response
    if (response && typeof response === 'object' && 'data' in response && 
        typeof response.data === 'object' && response.data !== null) {
      return {
        success: true,
        id: (response.data as TwitterApiResponseData).id,
        text: (response.data as TwitterApiResponseData).text
      };
    }
    
    throw new Error('Invalid response format from Twitter API');
  } catch (error) {
    console.error('Error sharing to Twitter:', error);
    throw new Error('Failed to share to Twitter');
  }
};

// Facebook API integration for page posts
// Facebook API response and result types
interface FacebookApiResponse {
  id: string;
  [key: string]: unknown;
}

interface FacebookShareResult {
  success: boolean;
  id: string;
  message: string;
}

export const shareToFacebook = async (
  content: string, 
  pageId: string, 
  accessToken: string
): Promise<FacebookShareResult> => {
  try {
    // Initialize Facebook API
    FacebookAdsApi.init(accessToken);
    const page = new Page(pageId);
    
    // Create page post
    const response = await page.createFeed(
      [],
      {
        message: content
      }
    ) as unknown as FacebookApiResponse;
    
    return {
      success: true,
      id: response.id || 'unknown',
      message: content
    };
  } catch (error) {
    console.error('Error sharing to Facebook:', error);
    throw new Error('Failed to share to Facebook');
  }
};

// LinkedIn API integration for professional network sharing
// LinkedIn API response and result types
interface LinkedInApiResponse {
  data: {
    id: string;
    [key: string]: unknown;
  }
}

interface LinkedInShareResult {
  success: boolean;
  id: string;
  text: string;
}

export const shareToLinkedIn = async (
  content: string, 
  accessToken: string
): Promise<LinkedInShareResult> => {
  try {
    // LinkedIn API requires OAuth 2.0 authentication
    const response: LinkedInApiResponse = await axios.post('https://api.linkedin.com/v2/ugcPosts', {
      author: 'urn:li:person:{PERSON_ID}', // Replace with actual person ID
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content
          },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });
    
    return {
      success: true,
      id: response.data.id,
      text: content
    };
  } catch (error) {
    console.error('Error sharing to LinkedIn:', error);
    throw new Error('Failed to share to LinkedIn');
  }
};

// Email marketing integration (Mailchimp)
// Email marketing integration (Mailchimp)
// Mailchimp API response and result types
interface MailchimpResponse {
  id: string;
  email_address: string;
  status: string;
  [key: string]: unknown;
}

interface MailchimpResult {
  success: boolean;
  id: string;
  email_address: string;
  status: string;
}

export const addToMailchimpList = async (
  email: string,
  firstName: string | null,
  lastName: string | null,
  apiKey: string,
  listId: string,
  serverPrefix: string
): Promise<MailchimpResult> => {
  try {
    // Set up Mailchimp client
    Mailchimp.setConfig({
      apiKey: apiKey,
      server: serverPrefix
    });
    
    // Add subscriber to list
    const response: MailchimpResponse = await Mailchimp.lists.addListMember(listId, {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName || '',
        LNAME: lastName || ''
      }
    });
    
    return {
      success: true,
      id: response.id,
      email_address: response.email_address,
      status: response.status
    };
  } catch (error) {
    console.error('Error adding to Mailchimp list:', error);
    throw new Error('Failed to add to Mailchimp list');
  }
};

// CoinGecko API integration for trending coins
// CoinGecko API trending coin response interfaces
interface TrendingCoinItem {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  small: string;
  large: string;
  slug: string;
  price_btc: number;
  score: number;
}

interface TrendingCoinData {
  item: TrendingCoinItem;
}

interface TrendingExchange {
  id: string;
  name: string;
  market_type: string;
  thumb: string;
  image: string;
}

interface TrendingCoinsResponse {
  coins: TrendingCoinData[];
  exchanges: TrendingExchange[];
}

export const getTrendingCoins = async (apiKey: string): Promise<TrendingCoinsResponse> => {
  try {
    const response = await axios.get<TrendingCoinsResponse>('https://api.coingecko.com/api/v3/search/trending', {
      headers: {
        'x-cg-api-key': apiKey
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting trending coins:', error);
    throw new Error('Failed to get trending coins');
  }
};

// Automated content generation based on market movements
// Types for market update data
interface Coin {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
}

interface MarketUpdateResponse {
  success: boolean;
  content: string;
  timestamp: string;
}

export const generateMarketUpdate = async (apiKey: string): Promise<MarketUpdateResponse> => {
  try {
    // Get top coins
    const response = await axios.get<Coin[]>('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h'
      },
      headers: {
        'x-cg-api-key': apiKey
      }
    });
    
    const coins = response.data;
    
    // Generate market update content
    let content = '📊 Crypto Market Update 📊\n\n';
    
    // Add top performers
    const gainers = [...coins].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0, 3);
    content += '🚀 Top Gainers (24h):\n';
    gainers.forEach(coin => {
      content += `${coin.name} (${coin.symbol.toUpperCase()}): ${coin.price_change_percentage_24h.toFixed(2)}%\n`;
    });
    
    // Add worst performers
    const losers = [...coins].sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h).slice(0, 3);
    content += '\n📉 Top Losers (24h):\n';
    losers.forEach(coin => {
      content += `${coin.name} (${coin.symbol.toUpperCase()}): ${coin.price_change_percentage_24h.toFixed(2)}%\n`;
    });
    
    // Add CTA
    content += '\nTrack these coins and set price alerts on CryptoTracker! 👉 ' + process.env.NEXT_PUBLIC_SITE_URL;
    
    return {
      success: true,
      content,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating market update:', error);
    throw new Error('Failed to generate market update');
  }
};

// Schedule automated content sharing
// Social platform configuration types
interface TwitterConfig {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

interface FacebookConfig {
  pageId: string;
  accessToken: string;
}

// Result types
interface SharingPlatformResult {
  platform: string;
  success: boolean;
  result: TwitterShareResult | FacebookShareResult | Error;
}

interface ScheduledSharingResult {
  success: boolean;
  timestamp: string;
  platforms: SharingPlatformResult[];
}

export const scheduleContentSharing = (
  apiKey: string, 
  twitterConfig: TwitterConfig | null, 
  facebookConfig: FacebookConfig | null
): () => Promise<ScheduledSharingResult> => {
  // This function would be called by a cron job or scheduler in production
  return async (): Promise<ScheduledSharingResult> => {
    try {
      // Generate market update
      const update = await generateMarketUpdate(apiKey);
      
      // Share to social platforms
      const sharePromises: Promise<TwitterShareResult | FacebookShareResult>[] = [];
      
      if (twitterConfig && twitterConfig.apiKey) {
        sharePromises.push(shareToTwitter(
          update.content, 
          twitterConfig.apiKey, 
          twitterConfig.apiSecret, 
          twitterConfig.accessToken, 
          twitterConfig.accessTokenSecret
        ));
      }
      
      if (facebookConfig && facebookConfig.pageId) {
        sharePromises.push(shareToFacebook(
          update.content, 
          facebookConfig.pageId, 
          facebookConfig.accessToken
        ));
      }
      
      const results = await Promise.allSettled(sharePromises);
      
      return {
        success: true,
        timestamp: new Date().toISOString(),
        platforms: results.map((result, index) => ({
          platform: index === 0 ? 'twitter' : 'facebook',
          success: result.status === 'fulfilled',
          result: result.status === 'fulfilled' ? result.value : result.reason
        }))
      };
    } catch (error) {
      console.error('Error in scheduled content sharing:', error);
      throw new Error('Failed to execute scheduled content sharing');
    }
  };
};

// Generate RSS feed for content syndication
// Define interfaces for the coin data from API response
interface CoinMarketData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency: number;
  market_cap: number;
  total_volume: number;
}

export const generateRSSFeed = async (apiKey: string): Promise<string> => {
  try {
    // Get market data
    const response = await axios.get<CoinMarketData[]>('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 20,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h,7d'
      },
      headers: {
        'x-cg-api-key': apiKey
      }
    });
    
    const coins: CoinMarketData[] = response.data;
    
    // Generate RSS XML
    let rss: string = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CryptoTracker Market Updates</title>
    <link>${process.env.NEXT_PUBLIC_SITE_URL}</link>
    <description>Latest cryptocurrency market updates and price alerts</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
`;
    
    // Add items for each coin
    coins.forEach((coin: CoinMarketData) => {
      const pubDate: string = new Date().toUTCString();
      const description: string = `
        <p><strong>${coin.name} (${coin.symbol.toUpperCase()})</strong> is currently trading at $${coin.current_price.toLocaleString()}.</p>
        <p>24h Change: ${coin.price_change_percentage_24h.toFixed(2)}%</p>
        <p>7d Change: ${coin.price_change_percentage_7d_in_currency.toFixed(2)}%</p>
        <p>Market Cap: $${coin.market_cap.toLocaleString()}</p>
        <p>Volume (24h): $${coin.total_volume.toLocaleString()}</p>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/coin/${coin.id}">View detailed analysis and set price alerts</a></p>
      `;
      
      rss += `
    <item>
      <title>${coin.name} (${coin.symbol.toUpperCase()}) Price Update</title>
      <link>${process.env.NEXT_PUBLIC_SITE_URL}/coin/${coin.id}</link>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="false">crypto-${coin.id}-${Date.now()}</guid>
      <description><![CDATA[${description}]]></description>
    </item>`;
    });
    
    // Close RSS
    rss += `
  </channel>
</rss>`;
    
    return rss;
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    throw new Error('Failed to generate RSS feed');
  }
};
