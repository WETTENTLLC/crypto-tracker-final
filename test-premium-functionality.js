#!/usr/bin/env node

/**
 * Premium Page Functionality Test
 * Tests the premium upgrade buttons and PayPal integration
 */

import https from 'https';

const PRODUCTION_URL = 'https://crypto-tracker-no-modules-63pevoa5x-wettentllcs-projects.vercel.app';

async function testPremiumPage() {
  return new Promise((resolve) => {
    const url = `${PRODUCTION_URL}/premium`;
    
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('🔍 Testing Premium Page Functionality');
        console.log('=====================================');
        console.log(`📄 URL: ${url}`);
        console.log(`📊 Status: ${res.statusCode}`);
        console.log(`📏 Content Length: ${data.length} characters`);
        
        // Check for PayPal integration
        const hasPayPalScript = data.includes('paypal');
        const hasPayPalButtons = data.includes('PayPalButtons');
        const hasUpgradeButton = data.includes('Upgrade') || data.includes('upgrade');
        const hasReactPayPal = data.includes('@paypal/react-paypal-js');
        
        console.log('\n🔧 Component Analysis:');
        console.log(`✅ PayPal Script Integration: ${hasPayPalScript ? 'FOUND' : 'MISSING'}`);
        console.log(`✅ PayPal Buttons Component: ${hasPayPalButtons ? 'FOUND' : 'MISSING'}`);
        console.log(`✅ Upgrade Button Text: ${hasUpgradeButton ? 'FOUND' : 'MISSING'}`);
        console.log(`✅ React PayPal Package: ${hasReactPayPal ? 'FOUND' : 'MISSING'}`);
        
        // Check for potential issues
        const potentialIssues = [];
        
        if (!hasPayPalScript) {
          potentialIssues.push('PayPal script may not be loading');
        }
        
        if (!hasPayPalButtons) {
          potentialIssues.push('PayPal buttons component may not be rendering');
        }
        
        if (data.includes('error') || data.includes('Error')) {
          potentialIssues.push('Error messages detected in page content');
        }
        
        if (data.includes('undefined') || data.includes('null')) {
          potentialIssues.push('Undefined/null values detected');
        }
        
        console.log('\n⚠️  Potential Issues:');
        if (potentialIssues.length === 0) {
          console.log('✅ No obvious issues detected');
        } else {
          potentialIssues.forEach(issue => {
            console.log(`❌ ${issue}`);
          });
        }
        
        // Check for specific premium page elements
        console.log('\n📋 Premium Page Elements:');
        console.log(`💳 Payment Form: ${data.includes('PayPal') ? 'PRESENT' : 'MISSING'}`);
        console.log(`💰 Pricing: ${data.includes('$5.99') ? 'PRESENT' : 'MISSING'}`);
        console.log(`📊 Feature Comparison: ${data.includes('Free Plan') && data.includes('Premium Plan') ? 'PRESENT' : 'MISSING'}`);
        console.log(`🔒 Security Notice: ${data.includes('Secure') ? 'PRESENT' : 'MISSING'}`);
        
        resolve({
          status: res.statusCode,
          hasPayPal: hasPayPalScript,
          hasButtons: hasPayPalButtons,
          issues: potentialIssues,
          success: res.statusCode === 200 && hasPayPalScript && hasPayPalButtons
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

async function main() {
  console.log('🧪 Premium Page Functionality Test');
  console.log('===================================\n');
  
  const result = await testPremiumPage();
  
  console.log('\n🎯 SUMMARY:');
  if (result.success) {
    console.log('✅ Premium page appears to be functioning correctly');
  } else {
    console.log('❌ Premium page has functionality issues');
    if (result.error) {
      console.log(`🔍 Error: ${result.error}`);
    }
  }
  
  console.log('\n💡 RECOMMENDATIONS:');
  console.log('1. Check browser console for JavaScript errors');
  console.log('2. Verify PayPal client ID is correctly configured');
  console.log('3. Test PayPal buttons in different browsers');
  console.log('4. Ensure premium status localStorage is working');
  
  process.exit(result.success ? 0 : 1);
}

main().catch(console.error);
