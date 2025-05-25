// MCP (Model Context Protocol) Configuration
// This file configures mock services and alternatives to direct social media API integrations

export interface MCPServiceConfig {
  enabled: boolean;
  serviceType: 'mock' | 'aggregator' | 'webhook' | 'analytics';
  endpoint?: string;
  apiKey?: string;
  options?: Record<string, unknown>;
}

export interface MCPConfig {
  socialMedia: {
    twitter: MCPServiceConfig;
    facebook: MCPServiceConfig;
    linkedin: MCPServiceConfig;
    reddit: MCPServiceConfig;
  };
  email: {
    mailchimp: MCPServiceConfig;
    alternativeService: MCPServiceConfig;
  };
  analytics: {
    googleAnalytics: MCPServiceConfig;
    customAnalytics: MCPServiceConfig;
  };
  contentDistribution: {
    rss: MCPServiceConfig;
    webPush: MCPServiceConfig;
    seo: MCPServiceConfig;
  };
}

// Default configuration with mock services enabled
const mcpConfig: MCPConfig = {
  socialMedia: {
    twitter: {
      enabled: true,
      serviceType: 'mock',
      options: {
        simulateResponse: true,
        simulateDelay: 500,
        mockSuccessRate: 0.95
      }
    },
    facebook: {
      enabled: true,
      serviceType: 'mock',
      options: {
        simulateResponse: true,
        simulateDelay: 500,
        mockSuccessRate: 0.95
      }
    },
    linkedin: {
      enabled: true,
      serviceType: 'mock',
      options: {
        simulateResponse: true,
        simulateDelay: 500,
        mockSuccessRate: 0.95
      }
    },
    reddit: {
      enabled: true,
      serviceType: 'mock',
      options: {
        simulateResponse: true,
        simulateDelay: 500,
        mockSuccessRate: 0.95
      }
    }
  },
  email: {
    mailchimp: {
      enabled: false,
      serviceType: 'mock',
      options: {
        simulateResponse: true,
        simulateDelay: 1000,
        mockSuccessRate: 0.98
      }
    },
    alternativeService: {
      enabled: true,
      serviceType: 'webhook',
      endpoint: '/api/mcp/email-capture',
      options: {
        storeLocally: true,
        exportCsv: true
      }
    }
  },
  analytics: {
    googleAnalytics: {
      enabled: process.env.GOOGLE_ANALYTICS_ID ? true : false,
      serviceType: 'analytics',
      apiKey: process.env.GOOGLE_ANALYTICS_ID
    },
    customAnalytics: {
      enabled: true,
      serviceType: 'analytics',
      endpoint: '/api/mcp/analytics',
      options: {
        trackPageViews: true,
        trackEvents: true,
        trackConversions: true
      }
    }
  },
  contentDistribution: {
    rss: {
      enabled: true,
      serviceType: 'aggregator',
      endpoint: '/api/rss'
    },
    webPush: {
      enabled: false,
      serviceType: 'webhook',
      endpoint: '/api/mcp/push-notifications'
    },
    seo: {
      enabled: true,
      serviceType: 'aggregator',
      options: {
        generateSitemap: true,
        generateStructuredData: true
      }
    }
  }
};

export default mcpConfig;
