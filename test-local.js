#!/usr/bin/env node

/**
 * Local Testing Script for CryptoTracker
 * Tests the locally running development server to verify functionality
 */

import http from 'http';

const BASE_URL = 'http://localhost:3003';

async function testEndpoint(path, testName) {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${path}`;
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const status = res.statusCode;
        const success = status === 200;
        console.log(`${success ? '✅' : '❌'} ${testName}: ${status} (${path})`);
        resolve({ success, status, data: data.slice(0, 200) });
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ ${testName}: ERROR (${err.message})`);
      resolve({ success: false, status: 'ERROR', error: err.message });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      console.log(`❌ ${testName}: TIMEOUT`);
      resolve({ success: false, status: 'TIMEOUT' });
    });
  });
}

async function runLocalTests() {
  console.log('🧪 Testing Local CryptoTracker Instance');
  console.log('🎯 Target:', BASE_URL);
  console.log('');

  const tests = [
    // Navigation Pages
    ['/', 'Homepage'],
    ['/faq', 'FAQ Page'],
    ['/learn/cryptocurrency-investing-guide', 'Crypto Guide'],
    ['/learn/what-is-cryptocurrency', 'What is Crypto'],
    ['/learn/how-to-buy-bitcoin', 'How to Buy Bitcoin'],
    ['/learn/defi-guide', 'DeFi Guide'],
    ['/learn/nft-guide', 'NFT Guide'],
    
    // API Endpoints  
    ['/api/mcp/content?type=market_update', 'Market Update API'],
    ['/api/mcp/content?type=trending_coins', 'Trending Coins API'],
    ['/api/mcp/content?type=price_alert', 'Price Alert API'],
  ];

  let passed = 0;
  const results = [];

  for (const [path, testName] of tests) {
    const result = await testEndpoint(path, testName);
    results.push({ path, testName, ...result });
    if (result.success) passed++;
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('');
  console.log('📊 Local Test Results:');
  console.log(`✅ Passed: ${passed}/${tests.length}`);
  console.log(`❌ Failed: ${tests.length - passed}/${tests.length}`);
  console.log(`📈 Success Rate: ${Math.round((passed/tests.length) * 100)}%`);

  if (passed === tests.length) {
    console.log('🎉 All local tests passed! The issue is with deployment.');
  } else {
    console.log('⚠️  Some tests failed locally. Check the implementation.');
  }

  return results;
}

// Run tests
runLocalTests().catch(console.error);
