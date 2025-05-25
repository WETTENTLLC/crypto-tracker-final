#!/usr/bin/env node

/**
 * Advanced SEO Health Check Tool
 * Validates all SEO implementations and provides recommendations
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { exec } = require('child_process');

class SEOHealthChecker {
  constructor() {
    this.baseUrl = 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app';
    this.errors = [];
    this.warnings = [];
    this.successes = [];
    this.recommendations = [];
  }

  log(type, message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    
    switch (type.toLowerCase()) {
      case 'error':
        this.errors.push(message);
        console.error('\x1b[31m%s\x1b[0m', logMessage);
        break;
      case 'warning':
        this.warnings.push(message);
        console.warn('\x1b[33m%s\x1b[0m', logMessage);
        break;
      case 'success':
        this.successes.push(message);
        console.log('\x1b[32m%s\x1b[0m', logMessage);
        break;
      case 'info':
        console.log('\x1b[36m%s\x1b[0m', logMessage);
        break;
      default:
        console.log(logMessage);
    }
  }

  async checkUrl(url, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Request timeout after ${timeout}ms`));
      }, timeout);

      https.get(url, (res) => {
        clearTimeout(timer);
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, data }));
      }).on('error', (err) => {
        clearTimeout(timer);
        reject(err);
      });
    });
  }

  async checkSitemaps() {
    this.log('info', 'Checking sitemap accessibility...');
    
    const sitemaps = [
      '/sitemap.xml',
      '/sitemap-images.xml',
      '/sitemap-news.xml',
      '/sitemap-videos.xml',
      '/sitemap-mobile.xml'
    ];

    for (const sitemap of sitemaps) {
      try {
        const response = await this.checkUrl(`${this.baseUrl}${sitemap}`);
        if (response.statusCode === 200) {
          this.log('success', `Sitemap ${sitemap} is accessible`);
          
          // Check if sitemap contains valid XML
          if (response.data.includes('<?xml') && response.data.includes('</urlset>')) {
            this.log('success', `Sitemap ${sitemap} contains valid XML structure`);
          } else {
            this.log('warning', `Sitemap ${sitemap} may not have valid XML structure`);
          }
        } else {
          this.log('error', `Sitemap ${sitemap} returned status ${response.statusCode}`);
        }
      } catch (error) {
        this.log('error', `Failed to access sitemap ${sitemap}: ${error.message}`);
      }
    }
  }

  async checkRobotsTxt() {
    this.log('info', 'Checking robots.txt...');
    
    try {
      const response = await this.checkUrl(`${this.baseUrl}/robots.txt`);
      if (response.statusCode === 200) {
        this.log('success', 'robots.txt is accessible');
        
        // Check for essential directives
        const robotsContent = response.data.toLowerCase();
        if (robotsContent.includes('sitemap:')) {
          this.log('success', 'robots.txt contains sitemap directives');
        } else {
          this.log('warning', 'robots.txt missing sitemap directives');
        }
        
        if (robotsContent.includes('user-agent:')) {
          this.log('success', 'robots.txt contains user-agent directives');
        } else {
          this.log('warning', 'robots.txt missing user-agent directives');
        }
      } else {
        this.log('error', `robots.txt returned status ${response.statusCode}`);
      }
    } catch (error) {
      this.log('error', `Failed to access robots.txt: ${error.message}`);
    }
  }

  async checkPWAManifest() {
    this.log('info', 'Checking PWA manifest...');
    
    try {
      const response = await this.checkUrl(`${this.baseUrl}/manifest.json`);
      if (response.statusCode === 200) {
        this.log('success', 'PWA manifest is accessible');
        
        try {
          const manifest = JSON.parse(response.data);
          const requiredFields = ['name', 'short_name', 'start_url', 'display', 'background_color', 'theme_color', 'icons'];
          
          for (const field of requiredFields) {
            if (manifest[field]) {
              this.log('success', `Manifest contains required field: ${field}`);
            } else {
              this.log('warning', `Manifest missing required field: ${field}`);
            }
          }
          
          // Check icons
          if (manifest.icons && manifest.icons.length > 0) {
            this.log('success', `Manifest contains ${manifest.icons.length} icon(s)`);
          } else {
            this.log('error', 'Manifest missing icons');
          }
        } catch (parseError) {
          this.log('error', 'Manifest contains invalid JSON');
        }
      } else {
        this.log('error', `PWA manifest returned status ${response.statusCode}`);
      }
    } catch (error) {
      this.log('error', `Failed to access PWA manifest: ${error.message}`);
    }
  }

  async checkServiceWorker() {
    this.log('info', 'Checking service worker...');
    
    try {
      const response = await this.checkUrl(`${this.baseUrl}/sw.js`);
      if (response.statusCode === 200) {
        this.log('success', 'Service worker is accessible');
        
        const swContent = response.data;
        const features = [
          { pattern: /cache/i, name: 'Caching functionality' },
          { pattern: /fetch/i, name: 'Fetch event handling' },
          { pattern: /install/i, name: 'Install event handling' },
          { pattern: /activate/i, name: 'Activate event handling' },
          { pattern: /notification/i, name: 'Push notification support' }
        ];
        
        features.forEach(feature => {
          if (feature.pattern.test(swContent)) {
            this.log('success', `Service worker includes ${feature.name}`);
          } else {
            this.log('warning', `Service worker missing ${feature.name}`);
          }
        });
      } else {
        this.log('error', `Service worker returned status ${response.statusCode}`);
      }
    } catch (error) {
      this.log('error', `Failed to access service worker: ${error.message}`);
    }
  }

  async checkMetaTags() {
    this.log('info', 'Checking meta tags on homepage...');
    
    try {
      const response = await this.checkUrl(this.baseUrl);
      if (response.statusCode === 200) {
        const html = response.data;
        
        const metaChecks = [
          { pattern: /<title[^>]*>([^<]+)<\/title>/i, name: 'Title tag' },
          { pattern: /<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']+)["\'][^>]*>/i, name: 'Meta description' },
          { pattern: /<meta[^>]*property=["\']og:title["\'][^>]*>/i, name: 'Open Graph title' },
          { pattern: /<meta[^>]*property=["\']og:description["\'][^>]*>/i, name: 'Open Graph description' },
          { pattern: /<meta[^>]*property=["\']og:image["\'][^>]*>/i, name: 'Open Graph image' },
          { pattern: /<meta[^>]*name=["\']twitter:card["\'][^>]*>/i, name: 'Twitter Card' },
          { pattern: /<link[^>]*rel=["\']canonical["\'][^>]*>/i, name: 'Canonical URL' },
          { pattern: /<script[^>]*type=["\']application\/ld\+json["\'][^>]*>/i, name: 'Structured data (JSON-LD)' }
        ];
        
        metaChecks.forEach(check => {
          if (check.pattern.test(html)) {
            this.log('success', `Found ${check.name}`);
          } else {
            this.log('warning', `Missing ${check.name}`);
          }
        });
      } else {
        this.log('error', `Homepage returned status ${response.statusCode}`);
      }
    } catch (error) {
      this.log('error', `Failed to check homepage meta tags: ${error.message}`);
    }
  }

  async checkPageSpeed() {
    this.log('info', 'Performing basic page speed check...');
    
    try {
      const startTime = Date.now();
      const response = await this.checkUrl(this.baseUrl);
      const loadTime = Date.now() - startTime;
      
      if (loadTime < 2000) {
        this.log('success', `Page loaded in ${loadTime}ms (Excellent)`);
      } else if (loadTime < 3000) {
        this.log('warning', `Page loaded in ${loadTime}ms (Good)`);
      } else {
        this.log('warning', `Page loaded in ${loadTime}ms (Needs improvement)`);
        this.recommendations.push('Consider optimizing images, minifying CSS/JS, and implementing better caching');
      }
    } catch (error) {
      this.log('error', `Failed to check page speed: ${error.message}`);
    }
  }

  async checkSSL() {
    this.log('info', 'Checking SSL certificate...');
    
    try {
      const response = await this.checkUrl(this.baseUrl);
      this.log('success', 'SSL certificate is valid and accessible');
      
      // Check security headers
      const securityHeaders = [
        'strict-transport-security',
        'x-frame-options',
        'x-content-type-options',
        'content-security-policy'
      ];
      
      securityHeaders.forEach(header => {
        if (response.headers[header]) {
          this.log('success', `Security header present: ${header}`);
        } else {
          this.log('warning', `Security header missing: ${header}`);
          this.recommendations.push(`Add ${header} security header`);
        }
      });
    } catch (error) {
      this.log('error', `SSL check failed: ${error.message}`);
    }
  }

  generateReport() {
    const timestamp = new Date().toISOString();
    const report = {
      timestamp,
      summary: {
        errors: this.errors.length,
        warnings: this.warnings.length,
        successes: this.successes.length,
        score: Math.max(0, 100 - (this.errors.length * 10) - (this.warnings.length * 5))
      },
      details: {
        errors: this.errors,
        warnings: this.warnings,
        successes: this.successes,
        recommendations: this.recommendations
      }
    };

    // Save report to file
    const reportPath = path.join(__dirname, 'seo-health-reports');
    if (!fs.existsSync(reportPath)) {
      fs.mkdirSync(reportPath, { recursive: true });
    }

    const filename = `seo-health-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(path.join(reportPath, filename), JSON.stringify(report, null, 2));

    this.log('info', `SEO Health Report generated: ${filename}`);
    this.log('info', `Overall SEO Score: ${report.summary.score}/100`);
    
    if (report.summary.score >= 90) {
      this.log('success', 'Excellent SEO health! 🎉');
    } else if (report.summary.score >= 75) {
      this.log('success', 'Good SEO health! 👍');
    } else if (report.summary.score >= 60) {
      this.log('warning', 'SEO health needs improvement 🔧');
    } else {
      this.log('error', 'SEO health requires immediate attention! 🚨');
    }

    return report;
  }

  async runFullAudit() {
    this.log('info', 'Starting comprehensive SEO health check...');
    
    try {
      await this.checkSitemaps();
      await this.checkRobotsTxt();
      await this.checkPWAManifest();
      await this.checkServiceWorker();
      await this.checkMetaTags();
      await this.checkPageSpeed();
      await this.checkSSL();
      
      const report = this.generateReport();
      
      // Generate recommendations based on findings
      if (this.errors.length > 0) {
        this.log('info', 'Priority fixes needed:');
        this.errors.forEach(error => console.log(`  - ${error}`));
      }
      
      if (this.warnings.length > 0) {
        this.log('info', 'Recommended improvements:');
        this.warnings.forEach(warning => console.log(`  - ${warning}`));
      }
      
      if (this.recommendations.length > 0) {
        this.log('info', 'Additional recommendations:');
        this.recommendations.forEach(rec => console.log(`  - ${rec}`));
      }

      return report;
    } catch (error) {
      this.log('error', `Audit failed: ${error.message}`);
      throw error;
    }
  }
}

// Run the audit if called directly
if (require.main === module) {
  const checker = new SEOHealthChecker();
  checker.runFullAudit()
    .then(report => {
      process.exit(report.summary.errors > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('Audit failed:', error);
      process.exit(1);
    });
}

module.exports = SEOHealthChecker;
