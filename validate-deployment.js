#!/usr/bin/env node

/**
 * Deployment Validation and Fix Script
 * This script helps diagnose and fix deployment issues for CryptoTracker
 */

import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';

const DEPLOYED_URL = 'https://crypto-tracker-no-modules-hwrl1vyun-wettentllcs-projects.vercel.app';
const LOCAL_URL = 'http://localhost:3003';

// Routes that should exist on both local and deployed versions
const CRITICAL_ROUTES = [
  '/',
  '/faq',
  '/learn/cryptocurrency-investing-guide',
  '/learn/what-is-cryptocurrency', 
  '/learn/how-to-buy-bitcoin',
  '/learn/defi-guide',
  '/learn/nft-guide',
  '/api/mcp/content?type=market_update',
  '/api/mcp/content?type=trending_coins',
  '/api/mcp/content?type=price_alert'
];

async function testEndpoint(baseUrl, path, _testName) {
  return new Promise((resolve) => {
    const url = `${baseUrl}${path}`;
    const client = baseUrl.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const status = res.statusCode;
        const success = status === 200;
        resolve({ 
          success, 
          status, 
          path,
          url,
          contentLength: data.length,
          hasContent: data.length > 100
        });
      });
    });
    
    req.on('error', (err) => {
      resolve({ 
        success: false, 
        status: 'ERROR', 
        error: err.message,
        path,
        url
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({ 
        success: false, 
        status: 'TIMEOUT',
        path,
        url
      });
    });
  });
}

async function validateDeployment() {
  console.log('🔍 CryptoTracker Deployment Validation');
  console.log('======================================');
  console.log('');

  // Test deployed version
  console.log('📡 Testing Deployed Version...');
  const deployedResults = [];
  for (const route of CRITICAL_ROUTES) {
    const result = await testEndpoint(DEPLOYED_URL, route, `Deployed ${route}`);
    deployedResults.push(result);
    
    const status = result.success ? '✅' : '❌';
    const statusText = result.status === 200 ? 'OK' : result.status;
    console.log(`${status} ${route} - ${statusText}`);
    
    await new Promise(resolve => setTimeout(resolve, 200)); // Rate limiting
  }

  console.log('');
  
  // Test local version (if available)
  console.log('🏠 Testing Local Version...');
  const localResults = [];
  for (const route of CRITICAL_ROUTES) {
    const result = await testEndpoint(LOCAL_URL, route, `Local ${route}`);
    localResults.push(result);
    
    const status = result.success ? '✅' : '❌';
    const statusText = result.status === 200 ? 'OK' : result.status;
    console.log(`${status} ${route} - ${statusText}`);
    
    await new Promise(resolve => setTimeout(resolve, 100)); 
  }

  console.log('\n');
  console.log('📊 Analysis & Comparison');
  console.log('========================');

  const deployedSuccesses = deployedResults.filter(r => r.success).length;
  const localSuccesses = localResults.filter(r => r.success).length;
  
  console.log(`Deployed Success Rate: ${deployedSuccesses}/${CRITICAL_ROUTES.length} (${Math.round(deployedSuccesses/CRITICAL_ROUTES.length*100)}%)`);
  console.log(`Local Success Rate: ${localSuccesses}/${CRITICAL_ROUTES.length} (${Math.round(localSuccesses/CRITICAL_ROUTES.length*100)}%)`);
  
  console.log('\n');
  console.log('🔍 Route-by-Route Comparison:');
  
  for (let i = 0; i < CRITICAL_ROUTES.length; i++) {
    const route = CRITICAL_ROUTES[i];
    const deployed = deployedResults[i];
    const local = localResults[i];
    
    const deployedIcon = deployed.success ? '✅' : '❌';
    const localIcon = local.success ? '✅' : '❌';
    
    console.log(`${route}:`);
    console.log(`  Deployed: ${deployedIcon} ${deployed.status}`);
    console.log(`  Local:    ${localIcon} ${local.status}`);
    
    if (local.success && !deployed.success) {
      console.log(`  🚨 DEPLOYMENT ISSUE: Works locally but not deployed`);
    }
    console.log('');
  }

  // Generate recommendations
  console.log('💡 Deployment Fix Recommendations:');
  console.log('===================================');
  
  // const failedRoutes = deployedResults.filter(r => !r.success);
  const workingLocallyButNotDeployed = [];
  
  for (let i = 0; i < CRITICAL_ROUTES.length; i++) {
    const route = CRITICAL_ROUTES[i];
    const deployed = deployedResults[i];
    const local = localResults[i];
    
    if (local.success && !deployed.success) {
      workingLocallyButNotDeployed.push(route);
    }
  }

  if (workingLocallyButNotDeployed.length > 0) {
    console.log('🎯 CRITICAL: Routes working locally but failing on deployment:');
    workingLocallyButNotDeployed.forEach(route => {
      console.log(`   • ${route}`);
    });
    console.log('');
    console.log('📋 Recommended Actions:');
    console.log('1. Verify Vercel deployment includes all built files');
    console.log('2. Check Vercel build logs for any excluded files');
    console.log('3. Redeploy with fresh build');
    console.log('4. Verify vercel.json configuration');
    console.log('5. Check Vercel project settings for route handling');
  }

  // Check if there are build files that should be deployed
  console.log('');
  console.log('📁 Checking Build Output...');
  
  const buildDir = path.join(process.cwd(), '.next');
  if (fs.existsSync(buildDir)) {
    console.log('✅ .next build directory exists');
    
    const serverDir = path.join(buildDir, 'server', 'app');
    if (fs.existsSync(serverDir)) {
      console.log('✅ Server app directory exists');
      
      // Check for specific routes
      const faqPath = path.join(serverDir, 'faq', 'page.html');
      const learnDir = path.join(serverDir, 'learn');
      
      console.log(`FAQ build file exists: ${fs.existsSync(faqPath) ? '✅' : '❌'}`);
      console.log(`Learn directory exists: ${fs.existsSync(learnDir) ? '✅' : '❌'}`);
      
      if (fs.existsSync(learnDir)) {
        const learnPages = fs.readdirSync(learnDir);
        console.log(`Learn pages built: ${learnPages.length}`);
        learnPages.forEach(page => {
          console.log(`   • ${page}`);
        });
      }
    }
  } else {
    console.log('❌ No build directory found. Run "npm run build" first.');
  }

  console.log('');
  console.log('🏁 Validation Complete');
  
  return {
    deployedSuccesses,
    localSuccesses,
    totalRoutes: CRITICAL_ROUTES.length,
    deploymentIssues: workingLocallyButNotDeployed.length,
    needsRedeployment: workingLocallyButNotDeployed.length > 0
  };
}

// Run validation
validateDeployment().then(results => {
  if (results.needsRedeployment) {
    console.log('⚠️  Deployment issues detected. Redeployment recommended.');
    process.exit(1);
  } else {
    console.log('✅ Deployment validation passed.');
    process.exit(0);
  }
}).catch(err => {
  console.error('💥 Validation failed:', err);
  process.exit(1);
});
