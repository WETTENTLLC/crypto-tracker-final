import mcpConfig from './config';

// Server-side in-memory store for subscribers (placeholder for a real database/CRM)
const serverSideSubscribers: Array<{ email: string; firstName?: string; lastName?: string; timestamp: string }> = [];

// Generic response type for all MCP services
interface MCPResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
  serviceType: string;
}

// Generate a unique ID for mock responses
const generateMockId = () => {
  return `mock_${Math.random().toString(36).substring(2, 15)}`;
};

// Simulate network delay for more realistic behavior
const simulateDelay = async (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Mock implementation for social media sharing
export const shareSocialContent = async (
  content: string, 
  platform: 'twitter' | 'facebook' | 'linkedin' | 'reddit',
  options?: Record<string, unknown> // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<MCPResponse> => {
  const config = mcpConfig.socialMedia[platform];
  
  // If the service is disabled, return early
  if (!config.enabled) {
    return {
      success: false,
      message: `${platform} sharing is disabled`,
      timestamp: new Date().toISOString(),
      serviceType: config.serviceType
    };
  }
  
  // If it's a mock service, simulate a response
  if (config.serviceType === 'mock') {
    const delay = (config.options?.simulateDelay as number) || 500;
    await simulateDelay(delay);
    
    // Simulate success or failure based on mock success rate
    const mockSuccessRate = typeof config.options?.mockSuccessRate === 'number' 
      ? config.options.mockSuccessRate 
      : 0.9;
    const isSuccess = Math.random() < mockSuccessRate;
    
    if (isSuccess) {
      return {
        success: true,
        message: `Content successfully shared to ${platform} (mock)`,
        data: {
          id: generateMockId(),
          platform,
          content,
          url: `https://mock.${platform}.com/post/${generateMockId()}`,
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString(),
        serviceType: 'mock'
      };
    } else {
      return {
        success: false,
        message: `Failed to share to ${platform} (mock)`,
        error: 'Mock service simulated failure',
        timestamp: new Date().toISOString(),
        serviceType: 'mock'
      };
    }
  }
  
  // For webhook or aggregator services
  if (config.serviceType === 'webhook' || config.serviceType === 'aggregator') {
    try {
      // In a real implementation, this would make an API call to the configured endpoint
      // For now, we'll just simulate a successful response
      return {
        success: true,
        message: `Content queued for ${platform} via ${config.serviceType}`,
        data: {
          id: generateMockId(),
          platform,
          content,
          status: 'queued',
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString(),
        serviceType: config.serviceType
      };
    } catch (error) {
      return {
        success: false,
        message: `Error in ${platform} ${config.serviceType}`,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        serviceType: config.serviceType
      };
    }
  }
  
  // Default fallback
  return {
    success: false,
    message: `Unsupported service type for ${platform}`,
    timestamp: new Date().toISOString(),
    serviceType: 'unknown'
  };
};

// Email subscription handling with MCP approach
export const subscribeEmail = async (
  email: string,
  firstName?: string,
  lastName?: string
): Promise<MCPResponse> => {
  // Decide which email service to use
  const mailchimpConfig = mcpConfig.email.mailchimp;
  const alternativeConfig = mcpConfig.email.alternativeService;
  
  // Use alternative service if mailchimp is disabled
  const config = mailchimpConfig.enabled ? mailchimpConfig : alternativeConfig;
  
  if (!config.enabled) {
    return {
      success: false,
      message: 'Email subscription service is disabled',
      timestamp: new Date().toISOString(),
      serviceType: 'none'
    };
  }
  
  // For mock services
  if (config.serviceType === 'mock') {
    const delay = (config.options?.simulateDelay as number) || 1000;
    await simulateDelay(delay);
    
    const mockSuccessRate = typeof config.options?.mockSuccessRate === 'number' 
      ? config.options.mockSuccessRate 
      : 0.95;
    const isSuccess = Math.random() < mockSuccessRate;
    
    if (isSuccess) {
      // Store in localStorage if browser environment and storeLocally is true
      if (typeof window !== 'undefined' && config.options?.storeLocally) {
        const subscribers = JSON.parse(localStorage.getItem('mcp_subscribers') || '[]');
        subscribers.push({
          email,
          firstName,
          lastName,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('mcp_subscribers', JSON.stringify(subscribers));
      }
      
      return {
        success: true,
        message: 'Subscription successful (mock)',
        data: {
          id: generateMockId(),
          email,
          status: 'subscribed',
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString(),
        serviceType: 'mock'
      };
    } else {
      return {
        success: false,
        message: 'Subscription failed (mock)',
        error: 'Mock service simulated failure',
        timestamp: new Date().toISOString(),
        serviceType: 'mock'
      };
    }
  }
  
  // For webhook service (store on server-side in-memory array)
  if (config.serviceType === 'webhook') {
    try {
      // Store in server-side in-memory array if storeLocally option is enabled
      // This is a placeholder for a real database/CRM integration.
      if (config.options?.storeLocally) {
        serverSideSubscribers.push({
          email,
          firstName,
          lastName,
          timestamp: new Date().toISOString()
        });
        console.log('MCP Service: Email captured (server-side in-memory)', { email, firstName, lastName });
        // To view the captured emails (for debugging, remove in production):
        // console.log('Current serverSideSubscribers:', serverSideSubscribers);
      }
      
      return {
        success: true,
        message: 'Subscription successful via webhook (stored server-side in-memory)',
        data: {
          id: generateMockId(),
          email,
          status: 'subscribed',
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString(),
        serviceType: 'webhook'
      };
    } catch (error) {
      console.error('Error in webhook subscription (server-side in-memory):', error);
      return {
        success: false,
        message: 'Error in webhook subscription (server-side in-memory)',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        serviceType: 'webhook'
      };
    }
  }
  
  // Default fallback
  return {
    success: false,
    message: `Unsupported service type for email subscription`,
    timestamp: new Date().toISOString(),
    serviceType: 'unknown'
  };
};

// Track analytics events using the MCP approach
export const trackAnalyticsEvent = async (
  eventName: string,
  eventData: Record<string, unknown>
): Promise<MCPResponse> => {
  const gaConfig = mcpConfig.analytics.googleAnalytics;
  const customConfig = mcpConfig.analytics.customAnalytics;
  
  // Use both Google Analytics and custom analytics if enabled
  const results: MCPResponse[] = [];
  
  // Google Analytics tracking
  if (gaConfig.enabled && typeof window !== 'undefined' && window.gtag) {
    try {
      window.gtag('event', eventName, eventData);
      results.push({
        success: true,
        message: 'Event tracked in Google Analytics',
        data: { eventName, ...eventData },
        timestamp: new Date().toISOString(),
        serviceType: 'analytics'
      });
    } catch (error) {
      results.push({
        success: false,
        message: 'Failed to track in Google Analytics',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        serviceType: 'analytics'
      });
    }
  }
  
  // Custom analytics tracking
  if (customConfig.enabled) {
    try {
      // In a real implementation, this would send data to your custom analytics endpoint
      // For now, we'll store it locally if in browser environment
      if (typeof window !== 'undefined') {
        const events = JSON.parse(localStorage.getItem('mcp_analytics_events') || '[]');
        events.push({
          eventName,
          eventData,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('mcp_analytics_events', JSON.stringify(events));
      }
      
      results.push({
        success: true,
        message: 'Event tracked in custom analytics',
        data: { eventName, ...eventData },
        timestamp: new Date().toISOString(),
        serviceType: 'analytics'
      });
    } catch (error) {
      results.push({
        success: false,
        message: 'Failed to track in custom analytics',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        serviceType: 'analytics'
      });
    }
  }
  
  // Return a combined response
  const allSuccessful = results.every(result => result.success);
  
  return {
    success: allSuccessful,
    message: allSuccessful 
      ? 'Event tracked successfully in all enabled analytics services' 
      : 'Event tracking partially failed',
    data: { results },
    timestamp: new Date().toISOString(),
    serviceType: 'analytics'
  };
};

// Generate content for distribution
export const generateDistributableContent = async (
  contentType: 'market_update' | 'price_alert' | 'trending_coins',
  options?: Record<string, unknown>
): Promise<MCPResponse> => {
  try {
    // Import content generator functions
    const { 
      generateMarketUpdateContent, 
      generateTrendingCoinsContent, 
      generatePriceAlertContent 
    } = await import('./contentGenerator');
    
    let content = '';
      switch (contentType) {
      case 'market_update':
        const marketUpdate = await generateMarketUpdateContent();
        content = marketUpdate || 'Failed to generate market update content';
        break;
      case 'price_alert':
        const coinId = (options?.coinId as string) || 'bitcoin';
        const targetPrice = parseFloat((options?.targetPrice as string) || '0');
        const priceAlert = await generatePriceAlertContent(coinId, targetPrice);
        content = priceAlert || 'Failed to generate price alert content';
        break;
      case 'trending_coins':
        const trendingContent = await generateTrendingCoinsContent();
        content = trendingContent || 'Failed to generate trending coins content';
        break;
      default:
        throw new Error('Unsupported content type');
    }

    // Ensure content is a string
    if (typeof content !== 'string') {
      content = String(content || 'Failed to generate content');
    }
    
    return {
      success: true,
      message: `${contentType} content generated successfully`,
      data: {
        content,
        contentType,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString(),
      serviceType: 'aggregator'
    };  } catch (error) {
    console.error('Error generating distributable content:', error);
    return {
      success: false,
      message: 'Failed to generate content',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      serviceType: 'aggregator'
    };
  }
};

// Distribute content to enabled channels
export const distributeContent = async (
  content: string,
  channels: ('social' | 'email' | 'rss' | 'webpush')[],
  options?: Record<string, unknown>
): Promise<MCPResponse> => {
  const results: Record<string, MCPResponse> = {};
  
  // Distribute to social media
  if (channels.includes('social')) {
    const socialPlatforms = ['twitter', 'facebook', 'linkedin', 'reddit'] as const;
    
    for (const platform of socialPlatforms) {
      if (mcpConfig.socialMedia[platform].enabled) {
        results[platform] = await shareSocialContent(content, platform, options);
      }
    }
  }
    // Distribute via RSS
  if (channels.includes('rss') && mcpConfig.contentDistribution.rss.enabled) {
    // In a real implementation, this would update the RSS feed with the new content
    results.rss = {
      success: true,
      message: 'Content added to RSS feed',
      data: {
        feedUrl: '/api/rss',
        content: String(content).substring(0, 100) + '...'
      },
      timestamp: new Date().toISOString(),
      serviceType: 'aggregator'
    };
  }
    // Distribute via web push
  if (channels.includes('webpush') && mcpConfig.contentDistribution.webPush.enabled) {
    // In a real implementation, this would send web push notifications
    results.webpush = {
      success: true,
      message: 'Content sent via web push notifications',
      data: {
        recipientCount: Math.floor(Math.random() * 100 + 50),
        content: String(content).substring(0, 50) + '...'
      },
      timestamp: new Date().toISOString(),
      serviceType: 'webhook'
    };
  }
  
  // All successful?
  const allSuccessful = Object.values(results).every(result => result.success);
  
  return {
    success: allSuccessful,
    message: allSuccessful 
      ? 'Content distributed successfully to all enabled channels' 
      : 'Content distribution partially failed',
    data: { results },
    timestamp: new Date().toISOString(),
    serviceType: 'aggregator'
  };
};
