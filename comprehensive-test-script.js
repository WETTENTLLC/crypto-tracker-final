#!/usr/bin/env node

/**
 * Comprehensive CryptoTracker Testing Script
 * 
 * This script tests all functionality of the cryptocurrency tracking website including:
 * - Navigation and page loading
 * - API endpoints and data fetching
 * - Authentication and premium features
 * - PayPal integration
 * - Real-time cryptocurrency data
 * - Price alerts functionality
 * - Responsive design
 * - SEO features
 * - Performance metrics
 * 
 * Usage: node comprehensive-test-script.js [OPTIONS]
 * 
 * Options:
 *   --url=URL          Test a specific URL (default: production site)
 *   --output=FILE      Save results to file (default: test-results.json)
 *   --verbose          Show detailed output
 *   --quick            Run only critical tests
 *   --admin            Include admin functionality tests
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Configuration
const CONFIG = {
  SITE_URL: process.env.SITE_URL || 'https://crypto-tracker-no-modules-mbj901bup-wettentllcs-projects.vercel.app',
  TIMEOUT: 30000,
  OUTPUT_FILE: 'test-results.json',
  VERBOSE: false,
  QUICK_MODE: false,
  ADMIN_TESTS: false,
  
  // Admin credentials for testing
  ADMIN_EMAIL: 'admin@cryptotracker.com',
  ADMIN_PASSWORD: 'admin123',
  
  // Test data
  TEST_EMAIL: 'test@example.com',
  TEST_PHONE: '+1234567890'
};

class CryptoTrackerTestSuite {
  constructor(options = {}) {
    this.config = { ...CONFIG, ...options };
    this.results = {
      metadata: {
        timestamp: new Date().toISOString(),
        siteUrl: this.config.SITE_URL,
        testSuite: 'CryptoTracker Comprehensive Test',
        version: '2.0.0'
      },
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        warnings: 0,
        errors: 0,
        duration: 0
      },
      categories: {
        navigation: { tests: [], passed: 0, failed: 0, warnings: 0 },
        api: { tests: [], passed: 0, failed: 0, warnings: 0 },
        authentication: { tests: [], passed: 0, failed: 0, warnings: 0 },
        payments: { tests: [], passed: 0, failed: 0, warnings: 0 },
        crypto_data: { tests: [], passed: 0, failed: 0, warnings: 0 },
        alerts: { tests: [], passed: 0, failed: 0, warnings: 0 },
        premium: { tests: [], passed: 0, failed: 0, warnings: 0 },
        admin: { tests: [], passed: 0, failed: 0, warnings: 0 },
        performance: { tests: [], passed: 0, failed: 0, warnings: 0 },
        seo: { tests: [], passed: 0, failed: 0, warnings: 0 }
      },
      recommendations: [],
      detailed_results: []
    };
    this.startTime = Date.now();
  }

  // Utility method to make HTTP requests
  async makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const urlObj = new URL(url);
      const isHttps = urlObj.protocol === 'https:';
      const client = isHttps ? https : http;
      
      const requestOptions = {
        hostname: urlObj.hostname,
        port: urlObj.port || (isHttps ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: options.method || 'GET',
        headers: {
          'User-Agent': 'CryptoTracker-TestSuite/2.0.0',
          'Accept': 'text/html,application/json,*/*',
          ...options.headers
        },
        timeout: this.config.TIMEOUT
      };

      const req = client.request(requestOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          const duration = Date.now() - startTime;
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data,
            duration: duration,
            url: url
          });
        });
      });

      req.on('error', (error) => {
        const duration = Date.now() - startTime;
        reject({ error: error.message, duration, url });
      });

      req.on('timeout', () => {
        req.destroy();
        reject({ error: 'Request timeout', duration: this.config.TIMEOUT, url });
      });

      if (options.body) {
        req.write(options.body);
      }
      
      req.end();
    });
  }

  // Add test result
  addTestResult(category, testName, status, details = '', duration = 0, url = '') {
    const result = {
      test: testName,
      category: category,
      status: status,
      details: details,
      duration: duration,
      url: url,
      timestamp: new Date().toISOString()
    };

    this.results.categories[category].tests.push(result);
    this.results.detailed_results.push(result);
    this.results.summary.total++;

    switch (status) {
      case 'PASS':
        this.results.summary.passed++;
        this.results.categories[category].passed++;
        if (this.config.VERBOSE) console.log(`✅ [${category.toUpperCase()}] ${testName}: PASSED ${details ? `(${details})` : ''}`);
        break;
      case 'FAIL':
        this.results.summary.failed++;
        this.results.categories[category].failed++;
        console.log(`❌ [${category.toUpperCase()}] ${testName}: FAILED ${details ? `(${details})` : ''}`);
        break;
      case 'WARNING':
        this.results.summary.warnings++;
        this.results.categories[category].warnings++;
        console.log(`⚠️  [${category.toUpperCase()}] ${testName}: WARNING ${details ? `(${details})` : ''}`);
        break;
      case 'ERROR':
        this.results.summary.errors++;
        console.log(`💥 [${category.toUpperCase()}] ${testName}: ERROR ${details ? `(${details})` : ''}`);
        break;
    }
  }

  // Test page availability and basic functionality
  async testPageAvailability(url, pageName, category = 'navigation', expectedContent = []) {
    try {
      const response = await this.makeRequest(url);
      
      if (response.statusCode === 200) {
        let contentChecks = 0;
        let contentPassed = 0;
        
        // Check for expected content
        if (expectedContent.length > 0) {
          for (const content of expectedContent) {
            contentChecks++;
            if (response.data.toLowerCase().includes(content.toLowerCase())) {
              contentPassed++;
            }
          }
        }
        
        if (contentChecks === 0 || contentPassed === contentChecks) {
          this.addTestResult(category, `${pageName} Page Load`, 'PASS', 
            `HTTP 200, ${response.duration}ms${contentChecks > 0 ? `, content verified` : ''}`, 
            response.duration, url);
        } else {
          this.addTestResult(category, `${pageName} Page Load`, 'WARNING', 
            `HTTP 200, ${response.duration}ms, content check: ${contentPassed}/${contentChecks}`, 
            response.duration, url);
        }
        
        return response;
      } else {
        this.addTestResult(category, `${pageName} Page Load`, 'FAIL', 
          `HTTP ${response.statusCode}`, response.duration, url);
        return null;
      }
    } catch (error) {
      this.addTestResult(category, `${pageName} Page Load`, 'ERROR', 
        error.error || error.message, error.duration || 0, url);
      return null;
    }
  }

  // Test all navigation pages
  async testNavigation() {
    console.log('\n📱 Testing Navigation & Page Availability...');
    
    const pages = [
      { url: `${this.config.SITE_URL}/`, name: 'Homepage', content: ['CryptoTracker', 'cryptocurrency', 'price'] },
      { url: `${this.config.SITE_URL}/dashboard`, name: 'Dashboard', content: ['dashboard', 'portfolio'] },
      { url: `${this.config.SITE_URL}/alerts`, name: 'Price Alerts', content: ['alerts', 'price'] },
      { url: `${this.config.SITE_URL}/premium`, name: 'Premium', content: ['premium', 'subscription', 'paypal'] },
      { url: `${this.config.SITE_URL}/account`, name: 'Account', content: ['account', 'subscription'] },
      { url: `${this.config.SITE_URL}/faq`, name: 'FAQ', content: ['faq', 'questions'] },
      { url: `${this.config.SITE_URL}/learn/cryptocurrency-investing-guide`, name: 'Crypto Guide', content: ['cryptocurrency', 'investing'] },
      { url: `${this.config.SITE_URL}/learn/what-is-cryptocurrency`, name: 'What is Crypto', content: ['cryptocurrency', 'bitcoin'] },
      { url: `${this.config.SITE_URL}/learn/how-to-buy-bitcoin`, name: 'How to Buy Bitcoin', content: ['bitcoin', 'buy'] },
      { url: `${this.config.SITE_URL}/learn/defi-guide`, name: 'DeFi Guide', content: ['defi', 'decentralized'] },
      { url: `${this.config.SITE_URL}/learn/nft-guide`, name: 'NFT Guide', content: ['nft', 'tokens'] }
    ];

    for (const page of pages) {
      await this.testPageAvailability(page.url, page.name, 'navigation', page.content);
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Test API endpoints
  async testAPIEndpoints() {
    console.log('\n🔌 Testing API Endpoints...');
    
    const endpoints = [
      {
        url: `${this.config.SITE_URL}/api/mcp/content?type=market_update`,
        name: 'Market Update API',
        expectedContent: ['bitcoin', 'price', 'market'],
        method: 'GET'
      },
      {
        url: `${this.config.SITE_URL}/api/mcp/content?type=trending_coins`,
        name: 'Trending Coins API',
        expectedContent: ['trending', 'coins'],
        method: 'GET'
      },
      {
        url: `${this.config.SITE_URL}/api/mcp/content?type=price_alert`,
        name: 'Price Alert API',
        expectedContent: ['alert', 'price'],
        method: 'GET'
      },
      {
        url: `${this.config.SITE_URL}/api/rss`,
        name: 'RSS Feed',
        expectedContent: ['xml', 'rss', 'crypto'],
        method: 'GET'
      }
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await this.makeRequest(endpoint.url, { method: endpoint.method });
        
        if (response.statusCode === 200) {
          let contentValid = false;
          if (endpoint.expectedContent) {
            contentValid = endpoint.expectedContent.some(content => 
              response.data.toLowerCase().includes(content.toLowerCase())
            );
          } else {
            contentValid = true;
          }
          
          if (contentValid) {
            this.addTestResult('api', endpoint.name, 'PASS', 
              `HTTP 200, ${response.duration}ms, content valid`, response.duration, endpoint.url);
          } else {
            this.addTestResult('api', endpoint.name, 'WARNING', 
              `HTTP 200, ${response.duration}ms, content check failed`, response.duration, endpoint.url);
          }
        } else {
          this.addTestResult('api', endpoint.name, 'FAIL', 
            `HTTP ${response.statusCode}`, response.duration, endpoint.url);
        }
      } catch (error) {
        this.addTestResult('api', endpoint.name, 'ERROR', 
          error.error || error.message, error.duration || 0, endpoint.url);
      }
    }

    // Test POST endpoint for email capture
    try {
      const emailData = JSON.stringify({ email: this.config.TEST_EMAIL });
      const response = await this.makeRequest(`${this.config.SITE_URL}/api/mcp/email-capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(emailData)
        },
        body: emailData
      });

      if (response.statusCode === 200 || response.statusCode === 201) {
        this.addTestResult('api', 'Email Capture API', 'PASS', 
          `HTTP ${response.statusCode}, ${response.duration}ms`, response.duration, 
          `${this.config.SITE_URL}/api/mcp/email-capture`);
      } else {
        this.addTestResult('api', 'Email Capture API', 'WARNING', 
          `HTTP ${response.statusCode}`, response.duration, 
          `${this.config.SITE_URL}/api/mcp/email-capture`);
      }
    } catch (error) {
      this.addTestResult('api', 'Email Capture API', 'ERROR', 
        error.error || error.message, error.duration || 0, 
        `${this.config.SITE_URL}/api/mcp/email-capture`);
    }
  }

  // Test authentication pages
  async testAuthentication() {
    console.log('\n🔐 Testing Authentication System...');
    
    // Test admin login page
    const adminLoginResponse = await this.testPageAvailability(
      `${this.config.SITE_URL}/admin/login`, 
      'Admin Login', 
      'authentication',
      ['admin', 'login', 'email', 'password']
    );

    if (adminLoginResponse) {
      // Check for login form elements
      const hasLoginForm = adminLoginResponse.data.includes('form') || 
                          adminLoginResponse.data.includes('email') ||
                          adminLoginResponse.data.includes('password');
      
      if (hasLoginForm) {
        this.addTestResult('authentication', 'Login Form Elements', 'PASS', 
          'Login form elements detected');
      } else {
        this.addTestResult('authentication', 'Login Form Elements', 'WARNING', 
          'Login form elements not clearly identified');
      }
    }

    // Test account protection (should redirect to premium or login)
    const accountResponse = await this.testPageAvailability(
      `${this.config.SITE_URL}/account`, 
      'Account Page Protection', 
      'authentication',
      ['premium', 'login', 'subscription']
    );

    if (accountResponse) {
      const hasProtection = accountResponse.data.includes('premium') || 
                           accountResponse.data.includes('login') ||
                           accountResponse.data.includes('subscription');
      
      if (hasProtection) {
        this.addTestResult('authentication', 'Account Protection', 'PASS', 
          'Account page properly protected');
      } else {
        this.addTestResult('authentication', 'Account Protection', 'WARNING', 
          'Account protection mechanism unclear');
      }
    }
  }

  // Test PayPal integration and premium features
  async testPaymentSystem() {
    console.log('\n💳 Testing Payment & Premium System...');
    
    const premiumResponse = await this.testPageAvailability(
      `${this.config.SITE_URL}/premium`, 
      'Premium Page', 
      'payments',
      ['premium', 'paypal', 'subscription', 'price']
    );

    if (premiumResponse) {
      // Check for PayPal integration
      const hasPayPal = premiumResponse.data.includes('paypal') || 
                       premiumResponse.data.includes('PayPal') ||
                       premiumResponse.data.includes('payment');
      
      if (hasPayPal) {
        this.addTestResult('payments', 'PayPal Integration Present', 'PASS', 
          'PayPal integration detected on premium page');
      } else {
        this.addTestResult('payments', 'PayPal Integration Present', 'FAIL', 
          'PayPal integration not detected');
      }

      // Check for pricing information
      const hasPricing = premiumResponse.data.includes('$') && 
                        (premiumResponse.data.includes('month') || premiumResponse.data.includes('price'));
      
      if (hasPricing) {
        this.addTestResult('payments', 'Pricing Information', 'PASS', 
          'Pricing information found');
      } else {
        this.addTestResult('payments', 'Pricing Information', 'WARNING', 
          'Pricing information not clearly displayed');
      }

      // Check for premium features description
      const hasFeatures = premiumResponse.data.includes('unlimited') || 
                         premiumResponse.data.includes('alerts') ||
                         premiumResponse.data.includes('features');
      
      if (hasFeatures) {
        this.addTestResult('payments', 'Premium Features Listed', 'PASS', 
          'Premium features described');
      } else {
        this.addTestResult('payments', 'Premium Features Listed', 'WARNING', 
          'Premium features not clearly described');
      }
    }

    // Test webhook endpoint (should return method not allowed for GET)
    try {
      const webhookResponse = await this.makeRequest(`${this.config.SITE_URL}/api/webhooks/paypal`);
      
      if (webhookResponse.statusCode === 405) {
        this.addTestResult('payments', 'PayPal Webhook Endpoint', 'PASS', 
          'Webhook endpoint exists (Method Not Allowed expected for GET)', 
          webhookResponse.duration, `${this.config.SITE_URL}/api/webhooks/paypal`);
      } else if (webhookResponse.statusCode === 404) {
        this.addTestResult('payments', 'PayPal Webhook Endpoint', 'FAIL', 
          'Webhook endpoint not found', webhookResponse.duration, 
          `${this.config.SITE_URL}/api/webhooks/paypal`);
      } else {
        this.addTestResult('payments', 'PayPal Webhook Endpoint', 'WARNING', 
          `Unexpected response: HTTP ${webhookResponse.statusCode}`, 
          webhookResponse.duration, `${this.config.SITE_URL}/api/webhooks/paypal`);
      }
    } catch (error) {
      this.addTestResult('payments', 'PayPal Webhook Endpoint', 'ERROR', 
        error.error || error.message, error.duration || 0, 
        `${this.config.SITE_URL}/api/webhooks/paypal`);
    }
  }

  // Test cryptocurrency data functionality
  async testCryptocurrencyData() {
    console.log('\n💰 Testing Cryptocurrency Data...');
    
    const homepageResponse = await this.testPageAvailability(
      `${this.config.SITE_URL}/`, 
      'Homepage Crypto Data', 
      'crypto_data',
      ['bitcoin', 'ethereum', 'price', '$']
    );

    if (homepageResponse) {
      // Check for cryptocurrency price data
      const hasPriceData = homepageResponse.data.includes('$') && 
                          (homepageResponse.data.includes('bitcoin') || 
                           homepageResponse.data.includes('ethereum') ||
                           homepageResponse.data.includes('BTC') ||
                           homepageResponse.data.includes('ETH'));
      
      if (hasPriceData) {
        this.addTestResult('crypto_data', 'Price Data Display', 'PASS', 
          'Cryptocurrency price data found on homepage');
      } else {
        this.addTestResult('crypto_data', 'Price Data Display', 'WARNING', 
          'Cryptocurrency price data not clearly visible');
      }

      // Check for market data
      const hasMarketData = homepageResponse.data.includes('market') && 
                           (homepageResponse.data.includes('cap') || 
                            homepageResponse.data.includes('volume'));
      
      if (hasMarketData) {
        this.addTestResult('crypto_data', 'Market Data Display', 'PASS', 
          'Market cap/volume data found');
      } else {
        this.addTestResult('crypto_data', 'Market Data Display', 'WARNING', 
          'Market data not clearly visible');
      }

      // Check for trending/popular coins
      const hasTrending = homepageResponse.data.includes('trending') || 
                         homepageResponse.data.includes('popular') ||
                         homepageResponse.data.includes('top');
      
      if (hasTrending) {
        this.addTestResult('crypto_data', 'Trending Coins', 'PASS', 
          'Trending/popular coins section found');
      } else {
        this.addTestResult('crypto_data', 'Trending Coins', 'WARNING', 
          'Trending coins section not found');
      }
    }

    // Test dashboard data
    const dashboardResponse = await this.testPageAvailability(
      `${this.config.SITE_URL}/dashboard`, 
      'Dashboard Crypto Data', 
      'crypto_data',
      ['dashboard', 'portfolio', 'watchlist']
    );

    if (dashboardResponse) {
      const hasPortfolio = dashboardResponse.data.includes('portfolio') || 
                          dashboardResponse.data.includes('holdings');
      
      if (hasPortfolio) {
        this.addTestResult('crypto_data', 'Portfolio Display', 'PASS', 
          'Portfolio functionality found on dashboard');
      } else {
        this.addTestResult('crypto_data', 'Portfolio Display', 'WARNING', 
          'Portfolio functionality not clearly visible');
      }
    }
  }

  // Test price alerts functionality
  async testPriceAlerts() {
    console.log('\n🔔 Testing Price Alerts System...');
    
    const alertsResponse = await this.testPageAvailability(
      `${this.config.SITE_URL}/alerts`, 
      'Alerts Page', 
      'alerts',
      ['alerts', 'price', 'notification']
    );

    if (alertsResponse) {
      // Check for alert creation interface
      const hasAlertForm = alertsResponse.data.includes('form') || 
                          alertsResponse.data.includes('create') ||
                          alertsResponse.data.includes('alert');
      
      if (hasAlertForm) {
        this.addTestResult('alerts', 'Alert Creation Interface', 'PASS', 
          'Alert creation interface found');
      } else {
        this.addTestResult('alerts', 'Alert Creation Interface', 'WARNING', 
          'Alert creation interface not clearly visible');
      }

      // Check for free tier limitations
      const hasLimitations = alertsResponse.data.includes('free') && 
                            (alertsResponse.data.includes('3') || 
                             alertsResponse.data.includes('limit'));
      
      if (hasLimitations) {
        this.addTestResult('alerts', 'Free Tier Limitations', 'PASS', 
          'Free tier limitations properly displayed');
      } else {
        this.addTestResult('alerts', 'Free Tier Limitations', 'WARNING', 
          'Free tier limitations not clearly communicated');
      }

      // Check for premium upsell
      const hasPremiumUpsell = alertsResponse.data.includes('premium') || 
                              alertsResponse.data.includes('unlimited');
      
      if (hasPremiumUpsell) {
        this.addTestResult('alerts', 'Premium Upsell', 'PASS', 
          'Premium upsell messaging found');
      } else {
        this.addTestResult('alerts', 'Premium Upsell', 'WARNING', 
          'Premium upsell not clearly presented');
      }
    }
  }

  // Test premium features accessibility
  async testPremiumFeatures() {
    console.log('\n⭐ Testing Premium Features...');
    
    // Test account page (premium features)
    const accountResponse = await this.testPageAvailability(
      `${this.config.SITE_URL}/account`, 
      'Premium Account Page', 
      'premium',
      ['premium', 'subscription', 'billing']
    );

    if (accountResponse) {
      // Check for subscription management
      const hasSubscriptionMgmt = accountResponse.data.includes('subscription') || 
                                 accountResponse.data.includes('cancel') ||
                                 accountResponse.data.includes('billing');
      
      if (hasSubscriptionMgmt) {
        this.addTestResult('premium', 'Subscription Management', 'PASS', 
          'Subscription management features found');
      } else {
        this.addTestResult('premium', 'Subscription Management', 'WARNING', 
          'Subscription management not clearly visible');
      }

      // Check for premium feature access
      const hasPremiumFeatures = accountResponse.data.includes('unlimited') || 
                                accountResponse.data.includes('advanced') ||
                                accountResponse.data.includes('exclusive');
      
      if (hasPremiumFeatures) {
        this.addTestResult('premium', 'Premium Feature Access', 'PASS', 
          'Premium features properly described');
      } else {
        this.addTestResult('premium', 'Premium Feature Access', 'WARNING', 
          'Premium features not clearly outlined');
      }
    }
  }

  // Test admin functionality (if enabled)
  async testAdminFunctionality() {
    if (!this.config.ADMIN_TESTS) return;
    
    console.log('\n👨‍💼 Testing Admin Functionality...');
    
    // Test admin dashboard access
    const adminDashResponse = await this.testPageAvailability(
      `${this.config.SITE_URL}/admin/dashboard`, 
      'Admin Dashboard', 
      'admin',
      ['admin', 'dashboard', 'analytics']
    );

    // Test admin users page
    await this.testPageAvailability(
      `${this.config.SITE_URL}/admin/users`, 
      'Admin Users', 
      'admin',
      ['users', 'management']
    );

    // Test admin payments page
    await this.testPageAvailability(
      `${this.config.SITE_URL}/admin/payments`, 
      'Admin Payments', 
      'admin',
      ['payments', 'transactions', 'paypal']
    );

    // Test admin settings page
    await this.testPageAvailability(
      `${this.config.SITE_URL}/admin/settings`, 
      'Admin Settings', 
      'admin',
      ['settings', 'configuration']
    );
  }

  // Test performance metrics
  async testPerformance() {
    console.log('\n⚡ Testing Performance Metrics...');
    
    const testUrls = [
      `${this.config.SITE_URL}/`,
      `${this.config.SITE_URL}/dashboard`,
      `${this.config.SITE_URL}/premium`
    ];

    let totalLoadTime = 0;
    let successfulTests = 0;

    for (const url of testUrls) {
      try {
        const response = await this.makeRequest(url);
        if (response.statusCode === 200) {
          successfulTests++;
          totalLoadTime += response.duration;
          
          // Evaluate page load time
          if (response.duration < 1000) {
            this.addTestResult('performance', `Load Time: ${url.split('/').pop() || 'homepage'}`, 'PASS', 
              `${response.duration}ms (excellent)`, response.duration, url);
          } else if (response.duration < 3000) {
            this.addTestResult('performance', `Load Time: ${url.split('/').pop() || 'homepage'}`, 'WARNING', 
              `${response.duration}ms (acceptable)`, response.duration, url);
          } else {
            this.addTestResult('performance', `Load Time: ${url.split('/').pop() || 'homepage'}`, 'FAIL', 
              `${response.duration}ms (too slow)`, response.duration, url);
          }

          // Check response size (basic)
          const sizeKB = Buffer.byteLength(response.data, 'utf8') / 1024;
          if (sizeKB < 500) {
            this.addTestResult('performance', `Page Size: ${url.split('/').pop() || 'homepage'}`, 'PASS', 
              `${sizeKB.toFixed(1)}KB (good)`, response.duration, url);
          } else if (sizeKB < 1000) {
            this.addTestResult('performance', `Page Size: ${url.split('/').pop() || 'homepage'}`, 'WARNING', 
              `${sizeKB.toFixed(1)}KB (large)`, response.duration, url);
          } else {
            this.addTestResult('performance', `Page Size: ${url.split('/').pop() || 'homepage'}`, 'FAIL', 
              `${sizeKB.toFixed(1)}KB (too large)`, response.duration, url);
          }
        }
      } catch (error) {
        this.addTestResult('performance', `Performance: ${url.split('/').pop() || 'homepage'}`, 'ERROR', 
          error.error || error.message, error.duration || 0, url);
      }
    }

    // Calculate average load time
    if (successfulTests > 0) {
      const avgLoadTime = totalLoadTime / successfulTests;
      if (avgLoadTime < 1500) {
        this.addTestResult('performance', 'Average Load Time', 'PASS', 
          `${avgLoadTime.toFixed(0)}ms across ${successfulTests} pages`);
      } else if (avgLoadTime < 3000) {
        this.addTestResult('performance', 'Average Load Time', 'WARNING', 
          `${avgLoadTime.toFixed(0)}ms across ${successfulTests} pages`);
      } else {
        this.addTestResult('performance', 'Average Load Time', 'FAIL', 
          `${avgLoadTime.toFixed(0)}ms across ${successfulTests} pages`);
      }
    }
  }

  // Test SEO features
  async testSEO() {
    console.log('\n🔍 Testing SEO Features...');
    
    const homepageResponse = await this.makeRequest(`${this.config.SITE_URL}/`);
    
    if (homepageResponse && homepageResponse.statusCode === 200) {
      const html = homepageResponse.data.toLowerCase();
      
      // Check for title tag
      if (html.includes('<title>') && html.includes('</title>')) {
        this.addTestResult('seo', 'Title Tag', 'PASS', 'Title tag found');
      } else {
        this.addTestResult('seo', 'Title Tag', 'FAIL', 'Title tag missing');
      }

      // Check for meta description
      if (html.includes('meta name="description"') || html.includes('meta property="description"')) {
        this.addTestResult('seo', 'Meta Description', 'PASS', 'Meta description found');
      } else {
        this.addTestResult('seo', 'Meta Description', 'WARNING', 'Meta description not found');
      }

      // Check for Open Graph tags
      if (html.includes('meta property="og:')) {
        this.addTestResult('seo', 'Open Graph Tags', 'PASS', 'Open Graph tags found');
      } else {
        this.addTestResult('seo', 'Open Graph Tags', 'WARNING', 'Open Graph tags not found');
      }

      // Check for structured data
      if (html.includes('application/ld+json') || html.includes('schema.org')) {
        this.addTestResult('seo', 'Structured Data', 'PASS', 'Structured data found');
      } else {
        this.addTestResult('seo', 'Structured Data', 'WARNING', 'Structured data not found');
      }

      // Check for canonical URL
      if (html.includes('rel="canonical"')) {
        this.addTestResult('seo', 'Canonical URL', 'PASS', 'Canonical URL found');
      } else {
        this.addTestResult('seo', 'Canonical URL', 'WARNING', 'Canonical URL not found');
      }

      // Check for robots meta tag
      if (html.includes('name="robots"')) {
        this.addTestResult('seo', 'Robots Meta Tag', 'PASS', 'Robots meta tag found');
      } else {
        this.addTestResult('seo', 'Robots Meta Tag', 'WARNING', 'Robots meta tag not found');
      }

      // Check for heading tags
      if (html.includes('<h1>') || html.includes('<h2>')) {
        this.addTestResult('seo', 'Heading Tags', 'PASS', 'Heading tags found');
      } else {
        this.addTestResult('seo', 'Heading Tags', 'WARNING', 'Heading tags not found');
      }
    }

    // Test robots.txt
    try {
      const robotsResponse = await this.makeRequest(`${this.config.SITE_URL}/robots.txt`);
      if (robotsResponse.statusCode === 200) {
        this.addTestResult('seo', 'Robots.txt', 'PASS', 'Robots.txt exists and accessible');
      } else {
        this.addTestResult('seo', 'Robots.txt', 'WARNING', `Robots.txt returned HTTP ${robotsResponse.statusCode}`);
      }
    } catch (error) {
      this.addTestResult('seo', 'Robots.txt', 'WARNING', 'Robots.txt not accessible');
    }

    // Test sitemap
    try {
      const sitemapResponse = await this.makeRequest(`${this.config.SITE_URL}/sitemap.xml`);
      if (sitemapResponse.statusCode === 200) {
        this.addTestResult('seo', 'Sitemap', 'PASS', 'Sitemap.xml exists and accessible');
      } else {
        this.addTestResult('seo', 'Sitemap', 'WARNING', `Sitemap.xml returned HTTP ${sitemapResponse.statusCode}`);
      }
    } catch (error) {
      this.addTestResult('seo', 'Sitemap', 'WARNING', 'Sitemap.xml not accessible');
    }
  }

  // Generate recommendations based on test results
  generateRecommendations() {
    const recommendations = [];
    const failedTests = this.results.detailed_results.filter(test => test.status === 'FAIL');
    const warningTests = this.results.detailed_results.filter(test => test.status === 'WARNING');
    const errorTests = this.results.detailed_results.filter(test => test.status === 'ERROR');

    // Critical issues
    if (failedTests.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        category: 'Critical Issues',
        items: failedTests.map(test => `${test.test}: ${test.details}`)
      });
    }

    if (errorTests.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        category: 'System Errors',
        items: errorTests.map(test => `${test.test}: ${test.details}`)
      });
    }

    // Warnings
    if (warningTests.length > 0) {
      recommendations.push({
        priority: 'MEDIUM',
        category: 'Improvements',
        items: warningTests.map(test => `${test.test}: ${test.details}`)
      });
    }

    // Performance recommendations
    const avgPerformance = this.results.detailed_results
      .filter(test => test.category === 'performance' && test.duration > 0)
      .reduce((acc, test, idx, arr) => acc + test.duration / arr.length, 0);

    if (avgPerformance > 2000) {
      recommendations.push({
        priority: 'MEDIUM',
        category: 'Performance',
        items: ['Consider optimizing page load times', 'Implement caching strategies', 'Optimize images and assets']
      });
    }

    // SEO recommendations
    const seoIssues = this.results.categories.seo.tests.filter(test => test.status !== 'PASS');
    if (seoIssues.length > 0) {
      recommendations.push({
        priority: 'LOW',
        category: 'SEO',
        items: seoIssues.map(test => `Improve ${test.test}: ${test.details}`)
      });
    }

    this.results.recommendations = recommendations;
  }

  // Generate comprehensive test report
  generateReport() {
    this.results.summary.duration = Date.now() - this.startTime;
    this.generateRecommendations();

    const report = {
      ...this.results,
      metadata: {
        ...this.results.metadata,
        testDuration: `${(this.results.summary.duration / 1000).toFixed(2)}s`
      }
    };

    // Save to file
    try {
      fs.writeFileSync(this.config.OUTPUT_FILE, JSON.stringify(report, null, 2));
      console.log(`\n📊 Detailed report saved to: ${this.config.OUTPUT_FILE}`);
    } catch (error) {
      console.error(`Error saving report: ${error.message}`);
    }

    return report;
  }

  // Print summary to console
  printSummary() {
    const { summary, categories } = this.results;
    const successRate = summary.total > 0 ? ((summary.passed / summary.total) * 100).toFixed(1) : 0;

    console.log('\n' + '='.repeat(70));
    console.log('🎯 CRYPTOTRACKER COMPREHENSIVE TEST SUMMARY');
    console.log('='.repeat(70));
    console.log(`📊 Total Tests: ${summary.total}`);
    console.log(`✅ Passed: ${summary.passed}`);
    console.log(`❌ Failed: ${summary.failed}`);
    console.log(`⚠️  Warnings: ${summary.warnings}`);
    console.log(`💥 Errors: ${summary.errors}`);
    console.log(`📈 Success Rate: ${successRate}%`);
    console.log(`⏱️  Duration: ${(summary.duration / 1000).toFixed(2)} seconds`);

    console.log('\n📋 CATEGORY BREAKDOWN:');
    Object.keys(categories).forEach(category => {
      const cat = categories[category];
      if (cat.tests.length > 0) {
        const catSuccess = cat.tests.length > 0 ? ((cat.passed / cat.tests.length) * 100).toFixed(0) : 0;
        console.log(`  ${category.toUpperCase()}: ${cat.passed}/${cat.tests.length} (${catSuccess}%)`);
      }
    });

    // Print recommendations
    if (this.results.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      this.results.recommendations.forEach(rec => {
        console.log(`\n${rec.priority} PRIORITY - ${rec.category}:`);
        rec.items.forEach(item => console.log(`  • ${item}`));
      });
    }

    // Final assessment
    console.log('\n🎯 FINAL ASSESSMENT:');
    if (summary.failed === 0 && summary.errors === 0) {
      if (summary.warnings === 0) {
        console.log('🟢 EXCELLENT: All tests passed! Your CryptoTracker site is ready for production.');
      } else {
        console.log('🟡 GOOD: Core functionality works well. Address warnings for optimal performance.');
      }
    } else if (summary.failed <= 2 && summary.errors === 0) {
      console.log('🟠 ACCEPTABLE: Most features work. Fix failed tests before major traffic.');
    } else {
      console.log('🔴 NEEDS WORK: Critical issues found. Address failed tests and errors immediately.');
    }

    console.log('='.repeat(70));
  }

  // Main test runner
  async runAllTests() {
    console.log(`🚀 Starting CryptoTracker Comprehensive Test Suite`);
    console.log(`📍 Target: ${this.config.SITE_URL}`);
    console.log(`⚙️  Mode: ${this.config.QUICK_MODE ? 'Quick' : 'Full'}`);
    
    try {
      // Core tests
      await this.testNavigation();
      await this.testAPIEndpoints();
      await this.testAuthentication();
      await this.testPaymentSystem();
      await this.testCryptocurrencyData();
      await this.testPriceAlerts();
      await this.testPremiumFeatures();
      
      // Optional tests
      if (!this.config.QUICK_MODE) {
        await this.testPerformance();
        await this.testSEO();
      }
      
      if (this.config.ADMIN_TESTS) {
        await this.testAdminFunctionality();
      }
      
      // Generate final report
      this.generateReport();
      this.printSummary();
      
      return this.results;
      
    } catch (error) {
      console.error('💥 Test suite execution failed:', error);
      this.addTestResult('system', 'Test Suite Execution', 'ERROR', error.message);
      throw error;
    }
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};
  
  args.forEach(arg => {
    if (arg.startsWith('--url=')) {
      options.SITE_URL = arg.split('=')[1];
    } else if (arg.startsWith('--output=')) {
      options.OUTPUT_FILE = arg.split('=')[1];
    } else if (arg === '--verbose') {
      options.VERBOSE = true;
    } else if (arg === '--quick') {
      options.QUICK_MODE = true;
    } else if (arg === '--admin') {
      options.ADMIN_TESTS = true;
    } else if (arg === '--help') {
      console.log(`
CryptoTracker Comprehensive Test Suite

Usage: node comprehensive-test-script.js [OPTIONS]

Options:
  --url=URL          Test a specific URL (default: production site)
  --output=FILE      Save results to file (default: test-results.json)
  --verbose          Show detailed output
  --quick            Run only critical tests
  --admin            Include admin functionality tests
  --help             Show this help message

Examples:
  node comprehensive-test-script.js
  node comprehensive-test-script.js --url=http://localhost:3000 --verbose
  node comprehensive-test-script.js --quick --admin
      `);
      process.exit(0);
    }
  });
  
  return options;
}

// Main execution
if (require.main === module) {
  const options = parseArgs();
  const testSuite = new CryptoTrackerTestSuite(options);
  
  testSuite.runAllTests()
    .then(results => {
      const exitCode = results.summary.failed > 0 || results.summary.errors > 0 ? 1 : 0;
      console.log(`\n🏁 Test suite completed. Exit code: ${exitCode}`);
      process.exit(exitCode);
    })
    .catch(error => {
      console.error('💥 Fatal error:', error);
      process.exit(1);
    });
}

module.exports = CryptoTrackerTestSuite;
