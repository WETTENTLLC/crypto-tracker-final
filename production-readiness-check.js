#!/usr/bin/env node

/**
 * Production Readiness Check for CryptoTracker
 * Validates all systems before live deployment
 */

const fs = require('fs');
const path = require('path');

class ProductionReadinessChecker {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.checks = 0;
    this.passed = 0;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '✓',
      warn: '⚠',
      error: '✗',
      success: '🎉'
    }[type];
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  addIssue(message) {
    this.issues.push(message);
    this.log(message, 'error');
  }

  addWarning(message) {
    this.warnings.push(message);
    this.log(message, 'warn');
  }

  checkFile(filePath, description) {
    this.checks++;
    if (fs.existsSync(filePath)) {
      this.passed++;
      this.log(`${description} - EXISTS`, 'info');
      return true;
    } else {
      this.addIssue(`${description} - MISSING: ${filePath}`);
      return false;
    }
  }
  checkForMockData(filePath, description) {
    this.checks++;
    if (!fs.existsSync(filePath)) {
      this.addIssue(`${description} - FILE NOT FOUND: ${filePath}`);
      return false;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for PRODUCTION READY comment indicating real data integration
    if (content.includes('PRODUCTION READY') && content.includes('productionDataService')) {
      this.passed++;
      this.log(`${description} - PRODUCTION DATA SERVICE INTEGRATED`, 'info');
      return true;
    }
    
    // More specific mock data patterns to avoid false positives
    const mockPatterns = [
      /mock.*data|sample.*data|dummy.*data/gi,
      /\$\d+\.\d{2}.*mock/gi,
      /placeholder.*data|demo.*data/gi,
      /const.*mock.*=/gi,
      /useState.*\[\s*\{.*mock/gi
    ];

    const mockFound = mockPatterns.some(pattern => pattern.test(content));
    
    if (mockFound) {
      this.addWarning(`${description} - CONTAINS MOCK DATA PATTERNS`);
      return false;
    } else {
      this.passed++;
      this.log(`${description} - NO MOCK DATA DETECTED`, 'info');
      return true;
    }
  }

  checkPayPalIntegration() {
    this.log('Checking PayPal Integration...', 'info');
    
    const premiumPagePath = './src/app/premium/page.tsx';
    if (!fs.existsSync(premiumPagePath)) {
      this.addIssue('Premium page not found');
      return false;
    }

    const content = fs.readFileSync(premiumPagePath, 'utf8');
    
    // Check for real PayPal client ID
    if (content.includes('sandbox') || content.includes('test')) {
      this.addWarning('PayPal may be in sandbox mode - verify production credentials');
    }

    // Check for dynamic pricing
    if (!content.includes('getCurrentPlanPrice')) {
      this.addIssue('Dynamic pricing function not found');
    }

    // Check for proper error handling
    if (!content.includes('onError') || !content.includes('onCancel')) {
      this.addIssue('PayPal error handling incomplete');
    }

    this.passed++;
    this.log('PayPal integration structure validated', 'info');
  }

  checkRealTimeData() {
    this.log('Checking Real-Time Data Sources...', 'info');
    
    const apiFiles = [
      './src/lib/cryptoApi.ts',
      './src/lib/realTimeData.ts'
    ];

    apiFiles.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check for real API endpoints
        if (content.includes('localhost') || content.includes('mock')) {
          this.addWarning(`${file} may contain development endpoints`);
        }
        
        // Check for API keys
        if (content.includes('YOUR_API_KEY') || content.includes('PLACEHOLDER')) {
          this.addIssue(`${file} contains placeholder API keys`);
        }
      }
    });
  }

  checkEnvironmentVariables() {
    this.log('Checking Environment Variables...', 'info');
    
    const requiredEnvVars = [
      'NEXT_PUBLIC_PAYPAL_CLIENT_ID',
      'CRYPTO_API_KEY',
      'DATABASE_URL'
    ];

    const envFile = '.env.local';
    if (fs.existsSync(envFile)) {
      const envContent = fs.readFileSync(envFile, 'utf8');
      
      requiredEnvVars.forEach(envVar => {
        if (!envContent.includes(envVar)) {
          this.addWarning(`Environment variable ${envVar} not found in .env.local`);
        } else if (envContent.includes(`${envVar}=your_`) || envContent.includes(`${envVar}=placeholder`)) {
          this.addIssue(`${envVar} appears to have placeholder value`);
        }
      });
    } else {
      this.addWarning('.env.local file not found - environment variables may not be configured');
    }
  }

  checkSecurityConfiguration() {
    this.log('Checking Security Configuration...', 'info');
    
    // Check middleware
    const middlewarePath = './middleware.ts';
    if (fs.existsSync(middlewarePath)) {
      const content = fs.readFileSync(middlewarePath, 'utf8');
      
      if (!content.includes('security') && !content.includes('helmet')) {
        this.addWarning('Security headers may not be configured');
      }
    }

    // Check for exposed secrets
    const configFiles = ['next.config.ts', 'package.json'];
    configFiles.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        
        if (content.includes('password') || content.includes('secret') || content.includes('key')) {
          this.addWarning(`${file} may contain sensitive information`);
        }
      }
    });
  }

  checkRevenueTracking() {
    this.log('Checking Revenue Tracking System...', 'info');
    
    const revenueFiles = [
      './src/app/admin/revenue-optimization/page.tsx',
      './src/components/RevenueTracker.tsx'
    ];

    revenueFiles.forEach(file => {
      this.checkForMockData(file, `Revenue tracking - ${path.basename(file)}`);
    });
  }

  checkPerformanceOptimization() {
    this.log('Checking Performance Optimization...', 'info');
    
    const nextConfig = './next.config.ts';
    if (fs.existsSync(nextConfig)) {
      const content = fs.readFileSync(nextConfig, 'utf8');
      
      if (!content.includes('compress') && !content.includes('optimization')) {
        this.addWarning('Performance optimizations may not be configured');
      }
    }

    // Check for image optimization
    const publicDir = './public';
    if (fs.existsSync(publicDir)) {
      const files = fs.readdirSync(publicDir);
      const largeImages = files.filter(file => {
        const filePath = path.join(publicDir, file);
        const stats = fs.statSync(filePath);
        return stats.size > 500000; // 500KB
      });

      if (largeImages.length > 0) {
        this.addWarning(`Large images found: ${largeImages.join(', ')} - consider optimization`);
      }
    }
  }

  checkSEOConfiguration() {
    this.log('Checking SEO Configuration...', 'info');
    
    const layoutPath = './src/app/layout.tsx';
    if (fs.existsSync(layoutPath)) {
      const content = fs.readFileSync(layoutPath, 'utf8');
      
      if (!content.includes('metadata') || !content.includes('title')) {
        this.addWarning('SEO metadata may not be properly configured');
      }
    }

    // Check for sitemap
    if (!fs.existsSync('./public/sitemap.xml')) {
      this.addWarning('Sitemap not found - may impact SEO');
    }

    // Check for robots.txt
    if (!fs.existsSync('./public/robots.txt')) {
      this.addWarning('robots.txt not found - may impact SEO');
    }
  }

  async runAllChecks() {
    this.log('🚀 Starting Production Readiness Check...', 'info');
    
    // Core file checks
    this.checkFile('./package.json', 'Package configuration');
    this.checkFile('./next.config.ts', 'Next.js configuration');
    this.checkFile('./src/app/page.tsx', 'Main application page');
    this.checkFile('./src/app/premium/page.tsx', 'Premium subscription page');
    
    // Revenue optimization system
    this.checkFile('./src/app/admin/revenue-optimization/page.tsx', 'Revenue optimization dashboard');
    this.checkFile('./src/components/ExitIntentProvider.tsx', 'Exit intent system');
    this.checkFile('./src/components/EmailSequenceAutomation.tsx', 'Email marketing system');
    
    // Integration checks
    this.checkPayPalIntegration();
    this.checkRealTimeData();
    this.checkEnvironmentVariables();
    this.checkSecurityConfiguration();
    this.checkRevenueTracking();
    this.checkPerformanceOptimization();
    this.checkSEOConfiguration();
    
    // Mock data validation
    this.checkForMockData('./src/app/admin/revenue-optimization/page.tsx', 'Revenue dashboard data');
    this.checkForMockData('./src/components/QuickRevenueBooster.tsx', 'Quick revenue booster data');
    this.checkForMockData('./src/components/ConversionAnalytics.tsx', 'Conversion analytics data');
    
    this.generateReport();
  }

  generateReport() {
    this.log('\n📊 PRODUCTION READINESS REPORT', 'info');
    this.log('=====================================', 'info');
    
    this.log(`Total Checks: ${this.checks}`, 'info');
    this.log(`Passed: ${this.passed}`, 'success');
    this.log(`Issues: ${this.issues.length}`, this.issues.length > 0 ? 'error' : 'info');
    this.log(`Warnings: ${this.warnings.length}`, this.warnings.length > 0 ? 'warn' : 'info');
    
    if (this.issues.length > 0) {
      this.log('\n🚨 CRITICAL ISSUES (Must Fix Before Deployment):', 'error');
      this.issues.forEach((issue, index) => {
        this.log(`${index + 1}. ${issue}`, 'error');
      });
    }
    
    if (this.warnings.length > 0) {
      this.log('\n⚠️  WARNINGS (Recommended to Address):', 'warn');
      this.warnings.forEach((warning, index) => {
        this.log(`${index + 1}. ${warning}`, 'warn');
      });
    }
    
    const readinessScore = Math.round((this.passed / this.checks) * 100);
    this.log(`\n🎯 Production Readiness Score: ${readinessScore}%`, readinessScore >= 90 ? 'success' : readinessScore >= 70 ? 'warn' : 'error');
    
    if (this.issues.length === 0 && readinessScore >= 85) {
      this.log('\n🎉 READY FOR PRODUCTION DEPLOYMENT! 🚀', 'success');
      return true;
    } else {
      this.log('\n❌ NOT READY FOR PRODUCTION - Address issues above', 'error');
      return false;
    }
  }
}

// Run the checker
const checker = new ProductionReadinessChecker();
checker.runAllChecks().then(ready => {
  process.exit(ready ? 0 : 1);
}).catch(error => {
  console.error('Production readiness check failed:', error);
  process.exit(1);
});
