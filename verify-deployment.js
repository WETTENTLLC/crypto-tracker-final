#!/usr/bin/env node

/**
 * Vercel Deployment Verification Script
 * 
 * This script tests the deployed CryptoTracker application to ensure 
 * that all key functionality is working correctly in production.
 * 
 * Usage:
 * 1. Update the BASE_URL constant with your deployed Vercel URL
 * 2. Run: node verify-deployment.js
 */

import https from 'https';

// Update this to your deployed Vercel URL
const BASE_URL = 'https://crypto-tracker-no-modules-hwrl1vyun-wettentllcs-projects.vercel.app';

// List of endpoints to test
const endpoints = [
  { path: '/', name: 'Homepage' },
  { path: '/api/rss', name: 'RSS Feed API' },
  { path: '/coin/bitcoin', name: 'Bitcoin Detail Page' },
  { path: '/coin/ethereum', name: 'Ethereum Detail Page' },
  { path: '/sitemap.xml', name: 'Sitemap' },
  { path: '/robots.txt', name: 'Robots.txt' },
  { path: '/schema-organization.json', name: 'Organization Schema' },
  { path: '/schema-website.json', name: 'Website Schema' }
];

// Function to make a GET request and check status
function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${endpoint.path}`;
    console.log(`Testing ${endpoint.name}: ${url}`);
    
    https.get(url, (res) => {
      const { statusCode } = res;
      
      if (statusCode === 200) {
        console.log(`✅ ${endpoint.name}: SUCCESS (${statusCode})`);
        resolve(true);
      } else {
        console.log(`❌ ${endpoint.name}: FAILED (${statusCode})`);
        resolve(false);
      }
      
      // Consume response data to free up memory
      res.resume();
    }).on('error', (e) => {
      console.log(`❌ ${endpoint.name}: ERROR - ${e.message}`);
      resolve(false);
    });
  });
}

// Main verification function
async function verifyDeployment() {
  console.log('=== CryptoTracker Deployment Verification ===');
  console.log(`Testing deployment at: ${BASE_URL}\n`);
  
  let successes = 0;
  const total = endpoints.length;
  
  for (const endpoint of endpoints) {
    const success = await testEndpoint(endpoint);
    if (success) successes++;
  }
  
  console.log('\n=== Verification Summary ===');
  console.log(`Passed: ${successes}/${total} tests`);
  
  if (successes === total) {
    console.log('✅ All tests passed! Deployment is working correctly.');
    return true;
  } else {
    console.log('⚠️ Some tests failed. Review the results above and check your deployment.');
    return false;
  }
}

// Run the verification
verifyDeployment().then(success => {
  process.exit(success ? 0 : 1);
});
