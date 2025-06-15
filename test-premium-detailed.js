#!/usr/bin/env node

/**
 * Detailed Premium Page Test
 * Comprehensive analysis of premium functionality
 */

import https from 'https';

const PRODUCTION_URL = 'https://crypto-tracker-no-modules-63pevoa5x-wettentllcs-projects.vercel.app';

async function testEndpoint(url, testName) {
  return new Promise((resolve) => {
    console.log(`\n🔍 Testing: ${testName}`);
    console.log(`🌐 URL: ${url}`);
    
    const startTime = Date.now();
    
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const duration = Date.now() - startTime;
        const status = res.statusCode;
        const success = status === 200;
        
        console.log(`📊 Status: ${status} (${success ? 'SUCCESS' : 'FAILED'})`);
        console.log(`⏱️  Duration: ${duration}ms`);
        console.log(`📏 Content Length: ${data.length} bytes`);
        
        if (success) {
          // Check for specific content
          const checks = {
            hasHTML: data.includes('<html'),
            hasReact: data.includes('__NEXT_DATA__'),
            hasPayPalScript: data.includes('paypal'),
            hasPayPalClientId: data.includes('AX_UCD0FG6LaVhl1smF44PQuxkRzoCNE_GreJfYg1DHycaE_IDKHrCJEhfcDWlK5sdVX44E8yBWnFns5'),
            hasPremiumTitle: data.includes('Upgrade to Premium'),
            hasPricing: data.includes('$5.99'),
            hasFeatures: data.includes('Unlimited') && data.includes('price alerts'),
            hasDemoButton: data.includes('Demo Upgrade'),
            hasTextBlack: data.includes('text-black'),
            hasPayPalProvider: data.includes('PayPalScriptProvider'),
            hasErrorHandling: data.includes('onError'),
            hasLocalStorage: data.includes('localStorage'),
          };
          
          console.log(`\n✅ Content Analysis:`);
          Object.entries(checks).forEach(([key, value]) => {
            const icon = value ? '✅' : '❌';
            console.log(`   ${icon} ${key}: ${value ? 'FOUND' : 'MISSING'}`);
          });
          
          const passedChecks = Object.values(checks).filter(Boolean).length;
          const totalChecks = Object.keys(checks).length;
          console.log(`\n📈 Content Score: ${passedChecks}/${totalChecks} (${Math.round(passedChecks/totalChecks*100)}%)`);
          
          // Look for potential issues
          if (data.includes('Application error')) {
            console.log(`❌ Application Error Detected`);
          }
          
          if (data.includes('404') || data.includes('Not Found')) {
            console.log(`❌ 404 Error Detected`);
          }
          
          if (data.length < 1000) {
            console.log(`⚠️  Suspiciously small content size`);
          }
          
          // Show a preview of the content
          console.log(`\n📋 Content Preview (first 500 chars):`);
          console.log('─'.repeat(60));
          console.log(data.substring(0, 500).replace(/\s+/g, ' '));
          console.log('─'.repeat(60));
        }
        
        resolve({ 
          success, 
          status, 
          duration,
          contentLength: data.length,
          content: data,
          testName
        });
      });
    });
    
    req.on('error', (err) => {
      const duration = Date.now() - startTime;
      console.log(`❌ Request Error: ${err.message}`);
      console.log(`⏱️  Duration: ${duration}ms`);
      
      resolve({ 
        success: false, 
        status: 'ERROR', 
        error: err.message,
        duration,
        testName
      });
    });
    
    req.setTimeout(30000, () => {
      req.destroy();
      const duration = Date.now() - startTime;
      console.log(`❌ Request Timeout (30s)`);
      console.log(`⏱️  Duration: ${duration}ms`);
      
      resolve({ 
        success: false, 
        status: 'TIMEOUT',
        duration,
        testName
      });
    });
  });
}

async function main() {
  console.log('🧪 CryptoTracker Premium Page Detailed Analysis');
  console.log('===============================================');
  console.log(`🌐 Production URL: ${PRODUCTION_URL}`);
  console.log(`⏰ Started: ${new Date().toLocaleString()}\n`);
  
  const tests = [
    { url: `${PRODUCTION_URL}/premium`, name: 'Premium Page' },
    { url: `${PRODUCTION_URL}/`, name: 'Homepage (Reference)' },
    { url: `${PRODUCTION_URL}/dashboard`, name: 'Dashboard (Reference)' }
  ];
  
  const results = [];
  
  for (const test of tests) {
    const result = await testEndpoint(test.url, test.name);
    results.push(result);
    
    // Wait between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n🎯 FINAL SUMMARY');
  console.log('================');
  
  const successfulTests = results.filter(r => r.success);
  const failedTests = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successfulTests.length}/${results.length}`);
  console.log(`❌ Failed: ${failedTests.length}/${results.length}`);
  
  if (failedTests.length > 0) {
    console.log(`\n❌ Failed Tests:`);
    failedTests.forEach(test => {
      console.log(`   • ${test.testName}: ${test.status}`);
    });
  }
  
  const premiumResult = results.find(r => r.testName === 'Premium Page');
  
  if (premiumResult && premiumResult.success) {
    console.log(`\n🔍 Premium Page Analysis:`);
    
    const content = premiumResult.content;
    const hasPayPal = content.includes('paypal') || content.includes('PayPal');
    const hasDemo = content.includes('Demo Upgrade');
    const hasTextBlack = content.includes('text-black');
    
    if (hasPayPal) {
      console.log(`✅ PayPal integration appears to be present`);
    } else {
      console.log(`❌ PayPal integration may be missing`);
    }
    
    if (hasDemo) {
      console.log(`✅ Demo upgrade button appears to be present`);
    } else {
      console.log(`❌ Demo upgrade button may be missing`);
    }
    
    if (hasTextBlack) {
      console.log(`✅ Text color fixes appear to be applied`);
    } else {
      console.log(`❌ Text color fixes may not be fully applied`);
    }
    
    console.log(`\n💡 Next Steps:`);
    console.log(`1. Open the premium page in a browser to verify visual appearance`);
    console.log(`2. Test PayPal integration manually`);
    console.log(`3. Try the demo upgrade functionality`);
    console.log(`4. Check browser console for any JavaScript errors`);
    console.log(`\n🌐 Premium Page URL: ${PRODUCTION_URL}/premium`);
  } else {
    console.log(`\n❌ Premium page failed to load properly`);
    console.log(`💡 This suggests a deployment or routing issue`);
  }
  
  process.exit(failedTests.length > 0 ? 1 : 0);
}

main().catch(console.error);
