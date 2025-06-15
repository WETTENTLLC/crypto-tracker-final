#!/usr/bin/env node

/**
 * Post-Deployment Comprehensive Test Suite
 * Tests all functionality after deployment fixes have been applied
 */

const http = require('http');
const https = require('https');
const fs = require('fs');

// Configuration
const DEPLOYED_URL = 'https://crypto-tracker-no-modules-63pevoa5x-wettentllcs-projects.vercel.app';
const LOCAL_URL = 'http://localhost:3003';

// Test suites
const TEST_SUITES = {
  critical: [
    // Navigation pages that were failing
    { path: '/', name: 'Homepage', category: 'navigation' },
    { path: '/faq', name: 'FAQ Page', category: 'navigation' },
    { path: '/learn/cryptocurrency-investing-guide', name: 'Crypto Investment Guide', category: 'navigation' },
    { path: '/learn/what-is-cryptocurrency', name: 'What is Cryptocurrency', category: 'navigation' },
    { path: '/learn/how-to-buy-bitcoin', name: 'How to Buy Bitcoin', category: 'navigation' },
    { path: '/learn/defi-guide', name: 'DeFi Guide', category: 'navigation' },
    { path: '/learn/nft-guide', name: 'NFT Guide', category: 'navigation' },
    
    // API endpoints that were failing
    { path: '/api/mcp/content?type=market_update', name: 'Market Update API', category: 'api' },
    { path: '/api/mcp/content?type=trending_coins', name: 'Trending Coins API', category: 'api' },
    { path: '/api/mcp/content?type=price_alert', name: 'Price Alert API', category: 'api' }
  ],
  
  comprehensive: [
    // All routes from the original test suite
    { path: '/', name: 'Homepage', category: 'navigation' },
    { path: '/dashboard', name: 'Dashboard', category: 'navigation' },
    { path: '/alerts', name: 'Price Alerts', category: 'navigation' },
    { path: '/premium', name: 'Premium Page', category: 'navigation' },
    { path: '/account', name: 'Account Page', category: 'navigation' },
    { path: '/faq', name: 'FAQ Page', category: 'navigation' },
    { path: '/learn/cryptocurrency-investing-guide', name: 'Crypto Investment Guide', category: 'navigation' },
    { path: '/learn/what-is-cryptocurrency', name: 'What is Cryptocurrency', category: 'navigation' },
    { path: '/learn/how-to-buy-bitcoin', name: 'How to Buy Bitcoin', category: 'navigation' },
    { path: '/learn/defi-guide', name: 'DeFi Guide', category: 'navigation' },
    { path: '/learn/nft-guide', name: 'NFT Guide', category: 'navigation' },
    { path: '/admin/login', name: 'Admin Login', category: 'admin' },
    
    // API endpoints
    { path: '/api/mcp/content?type=market_update', name: 'Market Update API', category: 'api' },
    { path: '/api/mcp/content?type=trending_coins', name: 'Trending Coins API', category: 'api' },
    { path: '/api/mcp/content?type=price_alert', name: 'Price Alert API', category: 'api' },
    { path: '/api/mcp/analytics', name: 'Analytics API', category: 'api' },
    { path: '/api/mcp/email-capture', name: 'Email Capture API', category: 'api' }
  ]
};

async function testEndpoint(baseUrl, testCase) {
  return new Promise((resolve) => {
    const url = `${baseUrl}${testCase.path}`;
    const client = baseUrl.startsWith('https') ? https : http;
    const startTime = Date.now();
    
    const req = client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const duration = Date.now() - startTime;
        const status = res.statusCode;
        const success = status === 200;
        
        resolve({ 
          ...testCase,
          success, 
          status, 
          url,
          duration,
          contentLength: data.length,
          hasContent: data.length > 100,
          contentPreview: data.substring(0, 200),
          timestamp: new Date().toISOString()
        });
      });
    });
    
    req.on('error', (err) => {
      const duration = Date.now() - startTime;
      resolve({ 
        ...testCase,
        success: false, 
        status: 'ERROR', 
        error: err.message,
        url,
        duration,
        timestamp: new Date().toISOString()
      });
    });
    
    req.setTimeout(15000, () => {
      req.destroy();
      const duration = Date.now() - startTime;
      resolve({ 
        ...testCase,
        success: false, 
        status: 'TIMEOUT',
        url,
        duration,
        timestamp: new Date().toISOString()
      });
    });
  });
}

async function runTestSuite(suiteName, tests, baseUrl) {
  console.log(`\n🧪 Running ${suiteName} Test Suite`);
  console.log(`🎯 Target: ${baseUrl}`);
  console.log('─'.repeat(60));
  
  const results = [];
  let passed = 0;
  
  for (const test of tests) {
    const result = await testEndpoint(baseUrl, test);
    results.push(result);
    
    const icon = result.success ? '✅' : '❌';
    const statusText = result.status === 200 ? 'OK' : result.status;
    const durationText = `${result.duration}ms`;
    
    console.log(`${icon} ${result.name.padEnd(30)} ${statusText.toString().padEnd(8)} ${durationText}`);
    
    if (result.success) passed++;
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('─'.repeat(60));
  console.log(`📊 Results: ${passed}/${tests.length} passed (${Math.round((passed/tests.length) * 100)}%)`);
  
  return {
    suiteName,
    baseUrl,
    results,
    summary: {
      total: tests.length,
      passed,
      failed: tests.length - passed,
      successRate: Math.round((passed/tests.length) * 100)
    }
  };
}

async function generateReport(testResults) {
  const timestamp = new Date().toISOString();
  
  // Generate detailed report
  const report = {
    metadata: {
      timestamp,
      testSuite: 'Post-Deployment Validation',
      version: '3.0.0'
    },
    summary: {},
    results: testResults,
    analysis: {
      criticalIssues: [],
      improvements: [],
      recommendations: []
    }
  };
  
  // Calculate overall summary
  const allResults = testResults.flatMap(suite => suite.results);
  const totalTests = allResults.length;
  const totalPassed = allResults.filter(r => r.success).length;
  
  report.summary = {
    totalTests,
    totalPassed,
    totalFailed: totalTests - totalPassed,
    overallSuccessRate: Math.round((totalPassed/totalTests) * 100)
  };
  
  // Analyze results
  const failedTests = allResults.filter(r => !r.success);
  const criticalFailures = failedTests.filter(r => 
    r.category === 'navigation' || r.category === 'api'
  );
  
  if (criticalFailures.length > 0) {
    report.analysis.criticalIssues = criticalFailures.map(test => ({
      test: test.name,
      path: test.path,
      status: test.status,
      category: test.category
    }));
  }
  
  // Generate recommendations
  if (report.summary.overallSuccessRate === 100) {
    report.analysis.recommendations.push('🎉 All tests passed! Deployment fix was successful.');
  } else if (report.summary.overallSuccessRate >= 80) {
    report.analysis.recommendations.push('✅ Deployment largely successful. Address remaining issues.');
  } else {
    report.analysis.recommendations.push('❌ Significant issues remain. Further investigation needed.');
  }
  
  // Save report
  const reportFilename = `post-deployment-test-results-${timestamp.split('T')[0]}.json`;
  fs.writeFileSync(reportFilename, JSON.stringify(report, null, 2));
  
  return { report, reportFilename };
}

async function main() {
  const args = process.argv.slice(2);
  const isQuick = args.includes('--quick');
  const isVerbose = args.includes('--verbose');
  const isLocal = args.includes('--local');
  
  console.log('🚀 CryptoTracker Post-Deployment Test Suite');
  console.log('============================================');
  console.log(`⏰ Started: ${new Date().toLocaleString()}`);
  
  if (isQuick) {
    console.log('⚡ Quick mode: Testing critical routes only');
  }
  
  console.log('');
  
  const testSuites = [];
  
  // Test deployed version
  if (!isLocal) {
    console.log('📡 Testing Deployed Version (Post-Fix)');
    console.log('=====================================');
    
    const deployedTests = isQuick ? TEST_SUITES.critical : TEST_SUITES.comprehensive;
    const deployedResults = await runTestSuite('Deployed', deployedTests, DEPLOYED_URL);
    testSuites.push(deployedResults);
  }
  
  // Test local version for comparison (if requested)
  if (isLocal || args.includes('--compare')) {
    console.log('\n🏠 Testing Local Version (Reference)');
    console.log('====================================');
    
    const localTests = isQuick ? TEST_SUITES.critical : TEST_SUITES.comprehensive;
    const localResults = await runTestSuite('Local', localTests, LOCAL_URL);
    testSuites.push(localResults);
  }
  
  // Generate and display report
  console.log('\n📊 Generating Final Report');
  console.log('==========================');
  
  const { report, reportFilename } = await generateReport(testSuites);
  
  console.log(`\n🎯 FINAL ASSESSMENT:`);
  console.log(`📈 Overall Success Rate: ${report.summary.overallSuccessRate}%`);
  console.log(`✅ Tests Passed: ${report.summary.totalPassed}/${report.summary.totalTests}`);
  console.log(`❌ Tests Failed: ${report.summary.totalFailed}/${report.summary.totalTests}`);
  
  if (report.analysis.criticalIssues.length > 0) {
    console.log(`\n🚨 Critical Issues Remaining:`);
    report.analysis.criticalIssues.forEach(issue => {
      console.log(`   • ${issue.test}: ${issue.status} (${issue.path})`);
    });
  }
  
  console.log(`\n💡 Recommendations:`);
  report.analysis.recommendations.forEach(rec => {
    console.log(`   ${rec}`);
  });
  
  console.log(`\n📋 Detailed report saved: ${reportFilename}`);
  
  // Set exit code based on results
  if (report.summary.overallSuccessRate >= 90) {
    console.log('\n🎉 Deployment fix was successful!');
    process.exit(0);
  } else if (report.summary.overallSuccessRate >= 70) {
    console.log('\n⚠️  Deployment partially successful. Some issues remain.');
    process.exit(1);
  } else {
    console.log('\n❌ Deployment fix was not successful. Significant issues remain.');
    process.exit(2);
  }
}

// Handle errors gracefully
process.on('unhandledRejection', (error) => {
  console.error('💥 Unhandled error:', error);
  process.exit(3);
});

// Run the test suite
main().catch(console.error);
