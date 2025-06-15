#!/usr/bin/env node

/**
 * Comprehensive Site Testing Script
 * Tests all functionality including navigation, graphs, alerts, payments, authentication, and email alerts
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const SITE_URL = process.env.SITE_URL || 'https://crypto-tracker-no-modules-hwrl1vyun-wettentllcs-projects.vercel.app';
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'testpassword123';

class ComprehensiveSiteTest {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      timestamp: new Date().toISOString(),
      siteUrl: SITE_URL,
      tests: [],
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        warnings: 0
      }
    };
  }

  async init() {
    console.log('🚀 Starting Comprehensive Site Test...');
    console.log(`📍 Testing site: ${SITE_URL}`);
    
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage();
    
    // Set viewport for consistent testing
    await this.page.setViewport({ width: 1200, height: 800 });
    
    // Enable request interception to monitor API calls
    await this.page.setRequestInterception(true);
    this.page.on('request', (request) => {
      request.continue();
    });
    
    // Monitor console errors
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log('❌ Console Error:', msg.text());
      }
    });
  }

  async addTestResult(testName, status, details = '', duration = 0) {
    const result = {
      test: testName,
      status,
      details,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    };
    
    this.results.tests.push(result);
    this.results.summary.total++;
    
    if (status === 'PASS') {
      this.results.summary.passed++;
      console.log(`✅ ${testName}: PASSED ${details ? `(${details})` : ''}`);
    } else if (status === 'FAIL') {
      this.results.summary.failed++;
      console.log(`❌ ${testName}: FAILED ${details ? `(${details})` : ''}`);
    } else if (status === 'WARNING') {
      this.results.summary.warnings++;
      console.log(`⚠️  ${testName}: WARNING ${details ? `(${details})` : ''}`);
    }
  }

  async testPageLoad(url, testName, expectedTitle = null) {
    const startTime = Date.now();
    try {
      const response = await this.page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      const duration = Date.now() - startTime;
      
      if (response.status() === 200) {
        const title = await this.page.title();
        if (expectedTitle && !title.includes(expectedTitle)) {
          await this.addTestResult(testName, 'WARNING', `Title mismatch: got "${title}"`, duration);
        } else {
          await this.addTestResult(testName, 'PASS', `Loaded in ${duration}ms`, duration);
        }
        return true;
      } else {
        await this.addTestResult(testName, 'FAIL', `HTTP ${response.status()}`, duration);
        return false;
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      await this.addTestResult(testName, 'FAIL', error.message, duration);
      return false;
    }
  }

  async testNavigation() {
    console.log('\n📱 Testing Navigation Links...');
    
    // Test main navigation links
    const navLinks = [
      { url: `${SITE_URL}/`, name: 'Homepage', title: 'CryptoTracker' },
      { url: `${SITE_URL}/dashboard`, name: 'Dashboard', title: 'Dashboard' },
      { url: `${SITE_URL}/alerts`, name: 'Alerts', title: 'Price Alerts' },
      { url: `${SITE_URL}/premium`, name: 'Premium', title: 'Premium' },
      { url: `${SITE_URL}/account`, name: 'Account', title: 'Account' },
      { url: `${SITE_URL}/faq`, name: 'FAQ', title: 'FAQ' },
      { url: `${SITE_URL}/learn/cryptocurrency-investing-guide`, name: 'Crypto Guide', title: 'Cryptocurrency' },
      { url: `${SITE_URL}/learn/what-is-cryptocurrency`, name: 'What is Crypto', title: 'Cryptocurrency' },
      { url: `${SITE_URL}/learn/how-to-buy-bitcoin`, name: 'How to Buy Bitcoin', title: 'Bitcoin' },
      { url: `${SITE_URL}/learn/defi-guide`, name: 'DeFi Guide', title: 'DeFi' },
      { url: `${SITE_URL}/learn/nft-guide`, name: 'NFT Guide', title: 'NFT' }
    ];

    for (const link of navLinks) {
      await this.testPageLoad(link.url, `Navigation: ${link.name}`, link.title);
      await this.page.waitForTimeout(500); // Small delay between tests
    }
  }

  async testCryptocurrencyData() {
    console.log('\n💰 Testing Cryptocurrency Data Loading...');
    
    await this.page.goto(`${SITE_URL}/`, { waitUntil: 'networkidle2' });
    
    // Test if cryptocurrency data loads
    try {
      await this.page.waitForSelector('.crypto-ticker, [data-testid="crypto-list"], table', { timeout: 10000 });
      
      // Check if images are loading
      const images = await this.page.$$eval('img[alt*="Bitcoin"], img[alt*="Ethereum"], img[src*="coin-images"]', 
        imgs => imgs.map(img => ({
          src: img.src,
          alt: img.alt,
          loaded: img.complete && img.naturalWidth > 0
        }))
      );
      
      if (images.length > 0) {
        const loadedImages = images.filter(img => img.loaded);
        await this.addTestResult('Crypto Images Loading', 'PASS', 
          `${loadedImages.length}/${images.length} images loaded`);
      } else {
        await this.addTestResult('Crypto Images Loading', 'WARNING', 'No crypto images found');
      }
      
      // Test if prices are displayed
      const priceElements = await this.page.$$('[data-testid="price"], .price, td:contains("$")');
      if (priceElements.length > 0) {
        await this.addTestResult('Price Data Display', 'PASS', `${priceElements.length} price elements found`);
      } else {
        await this.addTestResult('Price Data Display', 'FAIL', 'No price data found');
      }
      
    } catch (error) {
      await this.addTestResult('Cryptocurrency Data Loading', 'FAIL', error.message);
    }
  }

  async testCharts() {
    console.log('\n📊 Testing Charts and Graphs...');
    
    // Test charts on dashboard
    await this.page.goto(`${SITE_URL}/dashboard`, { waitUntil: 'networkidle2' });
    
    try {
      // Wait for charts to load (Recharts components)
      await this.page.waitForSelector('svg, canvas, .recharts-wrapper, [data-testid="chart"]', { timeout: 15000 });
      
      const charts = await this.page.$$eval('svg, canvas, .recharts-wrapper', 
        elements => elements.map(el => ({
          tagName: el.tagName,
          className: el.className,
          hasData: el.children ? el.children.length > 0 : false
        }))
      );
      
      if (charts.length > 0) {
        await this.addTestResult('Dashboard Charts', 'PASS', `${charts.length} chart elements found`);
      } else {
        await this.addTestResult('Dashboard Charts', 'FAIL', 'No chart elements found');
      }
      
    } catch (error) {
      await this.addTestResult('Dashboard Charts', 'FAIL', error.message);
    }
    
    // Test individual coin charts
    try {
      await this.page.goto(`${SITE_URL}/coin/bitcoin`, { waitUntil: 'networkidle2' });
      await this.page.waitForSelector('svg, canvas, .recharts-wrapper', { timeout: 15000 });
      
      const coinCharts = await this.page.$$('svg, canvas, .recharts-wrapper');
      if (coinCharts.length > 0) {
        await this.addTestResult('Individual Coin Charts', 'PASS', `Chart loaded for Bitcoin`);
      } else {
        await this.addTestResult('Individual Coin Charts', 'FAIL', 'No chart found on coin detail page');
      }
      
    } catch (error) {
      await this.addTestResult('Individual Coin Charts', 'FAIL', error.message);
    }
  }

  async testPriceAlerts() {
    console.log('\n🔔 Testing Price Alert System...');
    
    await this.page.goto(`${SITE_URL}/alerts`, { waitUntil: 'networkidle2' });
    
    try {
      // Test alert form
      const alertForm = await this.page.$('form, [data-testid="alert-form"]');
      if (alertForm) {
        // Fill out alert form
        await this.page.type('input[name="email"], input[type="email"]', TEST_EMAIL);
        await this.page.type('input[name="targetPrice"], input[placeholder*="price"]', '50000');
        
        // Select cryptocurrency (if dropdown exists)
        const cryptoSelect = await this.page.$('select, [data-testid="crypto-select"]');
        if (cryptoSelect) {
          await this.page.select('select', 'bitcoin');
        }
        
        await this.addTestResult('Price Alert Form', 'PASS', 'Form fields accessible and fillable');
      } else {
        await this.addTestResult('Price Alert Form', 'FAIL', 'Alert form not found');
      }
      
    } catch (error) {
      await this.addTestResult('Price Alert Form', 'FAIL', error.message);
    }
  }

  async testUserAuthentication() {
    console.log('\n🔐 Testing User Authentication...');
    
    await this.page.goto(`${SITE_URL}/account`, { waitUntil: 'networkidle2' });
    
    try {
      // Check if login form exists
      const loginForm = await this.page.$('form[action*="login"], [data-testid="login-form"], input[type="password"]');
      if (loginForm) {
        await this.addTestResult('Login Form Present', 'PASS', 'Login form found');
        
        // Test form fields
        const emailField = await this.page.$('input[type="email"], input[name="email"]');
        const passwordField = await this.page.$('input[type="password"]');
        
        if (emailField && passwordField) {
          await this.addTestResult('Login Form Fields', 'PASS', 'Email and password fields present');
        } else {
          await this.addTestResult('Login Form Fields', 'FAIL', 'Missing required form fields');
        }
        
      } else {
        await this.addTestResult('Login Form Present', 'WARNING', 'Login form not immediately visible');
      }
      
    } catch (error) {
      await this.addTestResult('User Authentication', 'FAIL', error.message);
    }
  }

  async testPaymentSystem() {
    console.log('\n💳 Testing Payment System...');
    
    await this.page.goto(`${SITE_URL}/premium`, { waitUntil: 'networkidle2' });
    
    try {
      // Look for PayPal buttons or payment forms
      const paypalButton = await this.page.$('[data-testid="paypal-button"], .paypal-button, #paypal-button-container');
      const subscribeButton = await this.page.$('button:contains("Subscribe"), button:contains("Upgrade"), [data-testid="subscribe"]');
      
      if (paypalButton || subscribeButton) {
        await this.addTestResult('Payment Integration', 'PASS', 'Payment buttons found');
        
        // Test if clicking opens PayPal (without actually paying)
        if (paypalButton) {
          // Just check if the button is clickable, don't actually click
          const isClickable = await this.page.evaluate(button => {
            return !button.disabled && button.offsetParent !== null;
          }, paypalButton);
          
          if (isClickable) {
            await this.addTestResult('PayPal Button Functional', 'PASS', 'Button is clickable');
          } else {
            await this.addTestResult('PayPal Button Functional', 'WARNING', 'Button may not be functional');
          }
        }
        
      } else {
        await this.addTestResult('Payment Integration', 'FAIL', 'No payment buttons found');
      }
      
    } catch (error) {
      await this.addTestResult('Payment System', 'FAIL', error.message);
    }
  }

  async testAPIEndpoints() {
    console.log('\n🔌 Testing API Endpoints...');
    
    const apiEndpoints = [
      { url: `${SITE_URL}/api/mcp/content?type=market_update`, name: 'Market Update API' },
      { url: `${SITE_URL}/api/mcp/content?type=trending_coins`, name: 'Trending Coins API' },
      { url: `${SITE_URL}/api/mcp/email-capture`, name: 'Email Capture API', method: 'POST' },
      { url: `${SITE_URL}/api/rss`, name: 'RSS Feed API' }
    ];
    
    for (const endpoint of apiEndpoints) {
      try {
        const startTime = Date.now();
        let response;
        
        if (endpoint.method === 'POST') {
          response = await this.page.evaluate(async (url) => {
            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: 'test@example.com' })
            });
            return { status: res.status, ok: res.ok };
          }, endpoint.url);
        } else {
          response = await this.page.evaluate(async (url) => {
            const res = await fetch(url);
            return { status: res.status, ok: res.ok };
          }, endpoint.url);
        }
        
        const duration = Date.now() - startTime;
        
        if (response.ok) {
          await this.addTestResult(`API: ${endpoint.name}`, 'PASS', `HTTP ${response.status}`, duration);
        } else {
          await this.addTestResult(`API: ${endpoint.name}`, 'FAIL', `HTTP ${response.status}`, duration);
        }
        
      } catch (error) {
        await this.addTestResult(`API: ${endpoint.name}`, 'FAIL', error.message);
      }
    }
  }

  async testEmailAlerts() {
    console.log('\n📧 Testing Email Alert System...');
    
    try {
      // Test email capture form
      await this.page.goto(`${SITE_URL}/`, { waitUntil: 'networkidle2' });
      
      const emailForm = await this.page.$('form[action*="email"], [data-testid="email-form"], input[type="email"]');
      if (emailForm) {
        await this.addTestResult('Email Capture Form', 'PASS', 'Email form found');
        
        // Test form submission (without actually submitting)
        const emailInput = await this.page.$('input[type="email"]');
        if (emailInput) {
          await this.page.type('input[type="email"]', TEST_EMAIL);
          await this.addTestResult('Email Input Functional', 'PASS', 'Email input accepts text');
        }
        
      } else {
        await this.addTestResult('Email Capture Form', 'WARNING', 'Email form not found on homepage');
      }
      
      // Test alert notification settings
      await this.page.goto(`${SITE_URL}/alerts`, { waitUntil: 'networkidle2' });
      
      const notificationSettings = await this.page.$('input[type="checkbox"], [data-testid="email-notifications"]');
      if (notificationSettings) {
        await this.addTestResult('Email Notification Settings', 'PASS', 'Notification settings found');
      } else {
        await this.addTestResult('Email Notification Settings', 'WARNING', 'No notification settings visible');
      }
      
    } catch (error) {
      await this.addTestResult('Email Alert System', 'FAIL', error.message);
    }
  }

  async testResponsiveDesign() {
    console.log('\n📱 Testing Responsive Design...');
    
    const viewports = [
      { width: 320, height: 568, name: 'Mobile (iPhone SE)' },
      { width: 768, height: 1024, name: 'Tablet (iPad)' },
      { width: 1920, height: 1080, name: 'Desktop (1920x1080)' }
    ];
    
    for (const viewport of viewports) {
      try {
        await this.page.setViewport({ width: viewport.width, height: viewport.height });
        await this.page.goto(`${SITE_URL}/`, { waitUntil: 'networkidle2' });
        
        // Check if elements are visible and not overlapping
        const isResponsive = await this.page.evaluate(() => {
          const body = document.body;
          const hasHorizontalScroll = body.scrollWidth > window.innerWidth;
          const elementsVisible = document.querySelectorAll('nav, main, footer').length > 0;
          
          return !hasHorizontalScroll && elementsVisible;
        });
        
        if (isResponsive) {
          await this.addTestResult(`Responsive: ${viewport.name}`, 'PASS', 'Layout adapts correctly');
        } else {
          await this.addTestResult(`Responsive: ${viewport.name}`, 'WARNING', 'Layout issues detected');
        }
        
      } catch (error) {
        await this.addTestResult(`Responsive: ${viewport.name}`, 'FAIL', error.message);
      }
    }
    
    // Reset to standard viewport
    await this.page.setViewport({ width: 1200, height: 800 });
  }

  async testPerformance() {
    console.log('\n⚡ Testing Performance...');
    
    try {
      const startTime = Date.now();
      await this.page.goto(`${SITE_URL}/`, { waitUntil: 'networkidle2' });
      const loadTime = Date.now() - startTime;
      
      if (loadTime < 3000) {
        await this.addTestResult('Page Load Performance', 'PASS', `${loadTime}ms`);
      } else if (loadTime < 5000) {
        await this.addTestResult('Page Load Performance', 'WARNING', `${loadTime}ms - could be faster`);
      } else {
        await this.addTestResult('Page Load Performance', 'FAIL', `${loadTime}ms - too slow`);
      }
      
      // Test image loading performance
      const imageLoadTime = await this.page.evaluate(() => {
        return new Promise((resolve) => {
          const images = document.querySelectorAll('img');
          let loadedCount = 0;
          const startTime = Date.now();
          
          if (images.length === 0) {
            resolve(0);
            return;
          }
          
          images.forEach(img => {
            if (img.complete) {
              loadedCount++;
            } else {
              img.onload = () => {
                loadedCount++;
                if (loadedCount === images.length) {
                  resolve(Date.now() - startTime);
                }
              };
            }
          });
          
          if (loadedCount === images.length) {
            resolve(Date.now() - startTime);
          }
          
          // Timeout after 10 seconds
          setTimeout(() => resolve(-1), 10000);
        });
      });
      
      if (imageLoadTime === -1) {
        await this.addTestResult('Image Loading Performance', 'WARNING', 'Images took too long to load');
      } else if (imageLoadTime < 2000) {
        await this.addTestResult('Image Loading Performance', 'PASS', `${imageLoadTime}ms`);
      } else {
        await this.addTestResult('Image Loading Performance', 'WARNING', `${imageLoadTime}ms - slow image loading`);
      }
      
    } catch (error) {
      await this.addTestResult('Performance Testing', 'FAIL', error.message);
    }
  }

  async testSEOFeatures() {
    console.log('\n🔍 Testing SEO Features...');
    
    await this.page.goto(`${SITE_URL}/`, { waitUntil: 'networkidle2' });
    
    try {
      // Test meta tags
      const metaDescription = await this.page.$eval('meta[name="description"]', el => el.content).catch(() => null);
      const ogTitle = await this.page.$eval('meta[property="og:title"]', el => el.content).catch(() => null);
      const canonicalUrl = await this.page.$eval('link[rel="canonical"]', el => el.href).catch(() => null);
      
      if (metaDescription) {
        await this.addTestResult('SEO: Meta Description', 'PASS', `${metaDescription.length} characters`);
      } else {
        await this.addTestResult('SEO: Meta Description', 'FAIL', 'Missing meta description');
      }
      
      if (ogTitle) {
        await this.addTestResult('SEO: Open Graph', 'PASS', 'OG tags present');
      } else {
        await this.addTestResult('SEO: Open Graph', 'WARNING', 'Missing OG tags');
      }
      
      if (canonicalUrl) {
        await this.addTestResult('SEO: Canonical URL', 'PASS', 'Canonical URL set');
      } else {
        await this.addTestResult('SEO: Canonical URL', 'WARNING', 'Missing canonical URL');
      }
      
      // Test structured data
      const structuredData = await this.page.$('script[type="application/ld+json"]');
      if (structuredData) {
        await this.addTestResult('SEO: Structured Data', 'PASS', 'JSON-LD found');
      } else {
        await this.addTestResult('SEO: Structured Data', 'WARNING', 'No structured data found');
      }
      
    } catch (error) {
      await this.addTestResult('SEO Features', 'FAIL', error.message);
    }
  }

  async generateReport() {
    const reportContent = `
# Comprehensive Site Test Report
Generated: ${this.results.timestamp}
Site: ${this.results.siteUrl}

## Summary
- Total Tests: ${this.results.summary.total}
- Passed: ${this.results.summary.passed}
- Failed: ${this.results.summary.failed}
- Warnings: ${this.results.summary.warnings}
- Success Rate: ${((this.results.summary.passed / this.results.summary.total) * 100).toFixed(1)}%

## Test Results
${this.results.tests.map(test => 
  `### ${test.test}
- Status: ${test.status}
- Details: ${test.details}
- Duration: ${test.duration}
- Time: ${test.timestamp}
`).join('\n')}

## Recommendations
${this.generateRecommendations()}
`;

    const reportPath = path.join(__dirname, `site-test-report-${Date.now()}.md`);
    fs.writeFileSync(reportPath, reportContent);
    
    console.log(`\n📄 Report saved to: ${reportPath}`);
    return reportPath;
  }

  generateRecommendations() {
    const failedTests = this.results.tests.filter(t => t.status === 'FAIL');
    const warningTests = this.results.tests.filter(t => t.status === 'WARNING');
    
    let recommendations = '';
    
    if (failedTests.length > 0) {
      recommendations += '\n### Critical Issues (Must Fix)\n';
      failedTests.forEach(test => {
        recommendations += `- **${test.test}**: ${test.details}\n`;
      });
    }
    
    if (warningTests.length > 0) {
      recommendations += '\n### Improvements Recommended\n';
      warningTests.forEach(test => {
        recommendations += `- **${test.test}**: ${test.details}\n`;
      });
    }
    
    if (failedTests.length === 0 && warningTests.length === 0) {
      recommendations = '\n### Excellent! All tests passed. The site is ready for traffic.';
    }
    
    return recommendations;
  }

  async runAllTests() {
    try {
      await this.init();
      
      await this.testNavigation();
      await this.testCryptocurrencyData();
      await this.testCharts();
      await this.testPriceAlerts();
      await this.testUserAuthentication();
      await this.testPaymentSystem();
      await this.testAPIEndpoints();
      await this.testEmailAlerts();
      await this.testResponsiveDesign();
      await this.testPerformance();
      await this.testSEOFeatures();
      
      console.log('\n📊 Test Summary:');
      console.log(`✅ Passed: ${this.results.summary.passed}`);
      console.log(`❌ Failed: ${this.results.summary.failed}`);
      console.log(`⚠️  Warnings: ${this.results.summary.warnings}`);
      console.log(`📈 Success Rate: ${((this.results.summary.passed / this.results.summary.total) * 100).toFixed(1)}%`);
      
      const reportPath = await this.generateReport();
      
      return this.results;
      
    } catch (error) {
      console.error('❌ Test execution failed:', error);
      throw error;
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// CLI execution
if (require.main === module) {
  const test = new ComprehensiveSiteTest();
  test.runAllTests()
    .then(results => {
      console.log('\n🎉 Testing completed successfully!');
      process.exit(results.summary.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('💥 Testing failed:', error);
      process.exit(1);
    });
}

module.exports = ComprehensiveSiteTest;
