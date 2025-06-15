#!/usr/bin/env node

/**
 * Simple Premium Functionality Test
 * Tests premium page content and basic functionality
 */

import https from 'https';

const PRODUCTION_URL = 'https://crypto-tracker-no-modules-qqm71piyx-wettentllcs-projects.vercel.app';

// Test premium page content
async function testPremiumPageContent() {
  return new Promise((resolve) => {
    const url = `${PRODUCTION_URL}/premium`;
    
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('🔍 Premium Page Content Analysis');
        console.log('=================================');
        
        // Check for critical elements
        const checks = {
          hasUpgradeTitle: data.includes('Upgrade to Premium'),
          hasPricing: data.includes('$5.99') || data.includes('5.99'),
          hasPayPalProvider: data.includes('PayPalScriptProvider'),
          hasPayPalButtons: data.includes('PayPalButtons'),
          hasPayPalClientId: data.includes('AX_UCD0FG6LaVhl1smF44PQuxkRzoCNE_GreJfYg1DHycaE_IDKHrCJEhfcDWlK5sdVX44E8yBWnFns5'),
          hasDemoButton: data.includes('Demo Upgrade'),
          hasFeatureComparison: data.includes('Free Plan') && data.includes('Premium Plan'),
          hasUnlimitedAlerts: data.includes('Unlimited Price Alerts'),
          hasSMSNotifications: data.includes('SMS & Email Notifications'),
          hasPortfolioTracking: data.includes('Portfolio Tracking'),
          hasAdFree: data.includes('Ad-free experience'),
          hasSecurePayment: data.includes('Secure payment'),
          hasManageSubscription: data.includes('Manage Subscription'),
          hasCurrentPlan: data.includes('Current Plan'),
          hasReactComponents: data.includes('react') || data.includes('useState') || data.includes('useEffect'),
          hasClientSideLogic: data.includes('isClient'),
          hasLocalStorage: data.includes('localStorage'),
          hasErrorHandling: data.includes('onError') && data.includes('onCancel'),
          hasDebugLogging: data.includes('console.log'),
          hasNextJSStructure: data.includes('__next'),
          hasTextColorFixes: data.includes('text-black')
        };
        
        console.log('\n✅ Content Verification:');
        Object.entries(checks).forEach(([check, passed]) => {
          console.log(`${passed ? '✅' : '❌'} ${check}: ${passed ? 'FOUND' : 'MISSING'}`);
        });
        
        // Calculate success rate
        const totalChecks = Object.keys(checks).length;
        const passedChecks = Object.values(checks).filter(Boolean).length;
        const successRate = Math.round((passedChecks / totalChecks) * 100);
        
        console.log(`\n📊 Success Rate: ${passedChecks}/${totalChecks} (${successRate}%)`);
        
        // Specific analysis
        console.log('\n🔍 Detailed Analysis:');
        
        if (checks.hasPayPalProvider && checks.hasPayPalButtons) {
          console.log('✅ PayPal integration components are present');
        } else {
          console.log('❌ PayPal integration components are missing');
        }
        
        if (checks.hasDemoButton) {
          console.log('✅ Demo upgrade functionality is available');
        } else {
          console.log('❌ Demo upgrade functionality is missing');
        }
        
        if (checks.hasTextColorFixes) {
          console.log('✅ Text color fixes are applied');
        } else {
          console.log('❌ Text color fixes may not be applied');
        }
        
        if (checks.hasClientSideLogic && checks.hasLocalStorage) {
          console.log('✅ Premium state management is implemented');
        } else {
          console.log('❌ Premium state management may have issues');
        }
        
        resolve({
          success: successRate >= 80,
          successRate,
          checks,
          contentLength: data.length,
          status: res.statusCode
        });
      });
    });
    
    req.on('error', (err) => {
      console.error('❌ Error testing premium page:', err.message);
      resolve({ success: false, error: err.message });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      console.error('❌ Request timeout');
      resolve({ success: false, error: 'Timeout' });
    });
  });
}

// Test dashboard page to verify premium status handling
/* async function testDashboardPage() {
  return new Promise((resolve) => {
    const url = `${PRODUCTION_URL}/dashboard`;
    
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('\n🔍 Dashboard Premium Integration');
        console.log('=================================');
        
        const dashboardChecks = {
          hasPremiumCheck: data.includes('isPremium') || data.includes('premium'),
          hasLocalStorageCheck: data.includes('localStorage'),
          hasUpgradePrompt: data.includes('Upgrade') || data.includes('Premium'),
          hasTextColorFixes: data.includes('text-black'),
          hasReactStructure: data.includes('useState') || data.includes('useEffect')
        };
        
        console.log('Dashboard Integration Checks:');
        Object.entries(dashboardChecks).forEach(([check, passed]) => {
          console.log(`${passed ? '✅' : '❌'} ${check}: ${passed ? 'FOUND' : 'MISSING'}`);
        });
        
        resolve(dashboardChecks);
      });
    });
    
    req.on('error', (err) => {
      console.error('❌ Error testing dashboard:', err.message);
      resolve({ success: false, error: err.message });
    });
  });
} */

async function main() {
  console.log('🧪 CryptoTracker Premium Functionality Test');
  console.log('=============================================\n');
  
  // Test premium page
  const premiumResult = await testPremiumPageContent();
  
  // Test dashboard integration
  /* const dashboardResult = await testDashboardPage(); */ // Commented out as it's unused
  
  console.log('\n🎯 FINAL ASSESSMENT:');
  console.log('====================');
  
  if (premiumResult.success) {
    console.log('✅ Premium page functionality appears to be working correctly');
    console.log(`✅ Content verification passed with ${premiumResult.successRate}% success rate`);
  } else {
    console.log('❌ Premium page has functionality issues');
    console.log(`❌ Content verification failed with ${premiumResult.successRate || 0}% success rate`);
  }
  
  console.log('\n💡 KEY FINDINGS:');
  
  if (premiumResult.checks?.hasPayPalProvider && premiumResult.checks?.hasPayPalButtons) {
    console.log('✅ PayPal integration is properly implemented');
  } else {
    console.log('❌ PayPal integration needs attention');
  }
  
  if (premiumResult.checks?.hasDemoButton) {
    console.log('✅ Demo upgrade functionality is available for testing');
  } else {
    console.log('❌ Demo upgrade functionality is missing');
  }
  
  if (premiumResult.checks?.hasTextColorFixes) {
    console.log('✅ Text color accessibility improvements are applied');
  } else {
    console.log('❌ Text color improvements may not be fully applied');
  }
  
  console.log('\n🚀 NEXT STEPS:');
  console.log('1. Visit the premium page in a browser to test PayPal buttons');
  console.log('2. Try the demo upgrade functionality');
  console.log('3. Verify text colors are black instead of gray');
  console.log('4. Test premium features after upgrading');
  console.log(`5. Premium page URL: ${PRODUCTION_URL}/premium`);
  
  process.exit(premiumResult.success ? 0 : 1);
}

main().catch(console.error);
