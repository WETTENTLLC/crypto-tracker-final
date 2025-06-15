#!/usr/bin/env node

/**
 * Live Production Validation Script
 * Tests all critical functionality on the live production deployment
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

class ProductionValidator {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.passed = 0;
    this.failed = 0;
    this.warnings = 0;
  }

  async log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const colors = {
      info: '📝',
      success: '✅',
      error: '❌',
      warning: '⚠️'
    };
    console.log(`${colors[type]} [${timestamp}] ${message}`);
  }

  async httpRequest(url) {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);
      const client = parsedUrl.protocol === 'https:' ? https : http;
      
      const req = client.get(url, {
        headers: {
          'User-Agent': 'Production-Validator/1.0'
        }
      }, (res) => {
        resolve({
          status: res.statusCode,
          headers: res.headers
        });
      });
      
      req.on('error', reject);
      req.setTimeout(10000, () => {
        reject(new Error('Request timeout'));
      });
    });
  }

  async testEndpoint(path, description, expectedStatus = 200) {
    try {
      const url = `${this.baseUrl}${path}`;
      await this.log(`Testing ${description}: ${url}`, 'info');
      
      const response = await this.httpRequest(url);
      
      const acceptableStatuses = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];
      
      if (acceptableStatuses.includes(response.status)) {
        await this.log(`✓ ${description} - Status: ${response.status}`, 'success');
        this.passed++;
        return true;
      } else {
        await this.log(`✗ ${description} - Expected: ${expectedStatus}, Got: ${response.status}`, 'error');
        this.failed++;
        return false;
      }
    } catch (error) {
      await this.log(`✗ ${description} - Error: ${error.message}`, 'error');
      this.failed++;
      return false;
    }
  }

  async testAPIEndpoint(path, description) {
    try {
      const url = `${this.baseUrl}${path}`;
      await this.log(`Testing API ${description}: ${url}`, 'info');
      
      const response = await this.httpRequest(url);
      const contentType = response.headers['content-type'];
      
      if ((response.status >= 200 && response.status < 300) && 
          (contentType?.includes('application/json') || contentType?.includes('text/xml'))) {
        await this.log(`✓ API ${description} - Status: ${response.status}, Type: ${contentType}`, 'success');
        this.passed++;
        return true;
      } else {
        await this.log(`⚠ API ${description} - Status: ${response.status}, Type: ${contentType}`, 'warning');
        this.warnings++;
        return false;
      }
    } catch (error) {
      await this.log(`✗ API ${description} - Error: ${error.message}`, 'error');
      this.failed++;
      return false;
    }
  }

  async runAllTests() {
    await this.log('🚀 Starting Live Production Validation...', 'info');
    await this.log(`Testing production deployment: ${this.baseUrl}`, 'info');

    // Core pages
    await this.testEndpoint('/', 'Homepage');
    await this.testEndpoint('/dashboard', 'Dashboard Page');
    await this.testEndpoint('/premium', 'Premium Page');
    await this.testEndpoint('/admin/login', 'Admin Login Page');
    
    // Admin pages (should redirect or show login)
    await this.testEndpoint('/admin', 'Admin Dashboard', [200, 302, 401]);
    await this.testEndpoint('/admin/payments', 'Admin Payments', [200, 302, 401]);
    await this.testEndpoint('/admin/revenue-optimization', 'Admin Revenue', [200, 302, 401]);
    
    // API endpoints
    await this.testAPIEndpoint('/api/rss', 'RSS Feed');
    await this.testAPIEndpoint('/api/automation/content', 'Content API');
    
    // Static files
    await this.testEndpoint('/robots.txt', 'Robots.txt');
    await this.testEndpoint('/sitemap.xml', 'Sitemap');
    
    // Generate report
    await this.generateReport();
  }

  async generateReport() {
    const total = this.passed + this.failed + this.warnings;
    const successRate = Math.round((this.passed / total) * 100);
    
    await this.log('', 'info');
    await this.log('📊 LIVE PRODUCTION VALIDATION REPORT', 'info');
    await this.log('=====================================', 'info');
    await this.log(`Production URL: ${this.baseUrl}`, 'info');
    await this.log(`Total Tests: ${total}`, 'info');
    await this.log(`✅ Passed: ${this.passed}`, 'success');
    await this.log(`❌ Failed: ${this.failed}`, this.failed > 0 ? 'error' : 'info');
    await this.log(`⚠️ Warnings: ${this.warnings}`, this.warnings > 0 ? 'warning' : 'info');
    await this.log(`📈 Success Rate: ${successRate}%`, successRate >= 80 ? 'success' : 'error');
    
    if (successRate >= 80) {
      await this.log('', 'info');
      await this.log('🎉 PRODUCTION DEPLOYMENT VALIDATED SUCCESSFULLY! 🚀', 'success');
      await this.log('Your CryptoTracker application is live and operational!', 'success');
    } else {
      await this.log('', 'info');
      await this.log('⚠️ Production deployment needs attention', 'warning');
      await this.log('Some critical components may not be functioning correctly', 'warning');
    }
  }
}

// Run validation
const productionUrl = 'https://crypto-tracker-no-modules-r98ich870-wettentllcs-projects.vercel.app';
const validator = new ProductionValidator(productionUrl);
validator.runAllTests().catch(console.error);
