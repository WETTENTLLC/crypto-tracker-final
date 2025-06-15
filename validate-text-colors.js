#!/usr/bin/env node

/**
 * Text Color Validation Script
 * Verifies that text color fixes are working correctly in production
 */

import https from 'https';

const PRODUCTION_URL = 'https://crypto-tracker-no-modules-j0fnuk55u-wettentllcs-projects.vercel.app';

const TEXT_COLOR_CHECKS = [
  {
    page: '/',
    name: 'Homepage',
    checks: [
      { element: 'text-black', description: 'Black text elements' },
      { anti: 'text-gray-500', description: 'Should not have gray-500 text' },
      { anti: 'text-gray-600', description: 'Should not have gray-600 text' }
    ]
  },
  {
    page: '/premium',
    name: 'Premium Page',
    checks: [
      { element: 'text-black', description: 'Black text elements' },
      { anti: 'text-gray-400', description: 'Should not have gray-400 text' }
    ]
  },
  {
    page: '/dashboard',
    name: 'Dashboard',
    checks: [
      { element: 'text-black', description: 'Black text elements' },
      { anti: 'text-gray-500', description: 'Should not have gray-500 text' }
    ]
  }
];

async function checkPageContent(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function validateTextColors() {
  console.log('🎨 Text Color Validation Script');
  console.log('================================');
  console.log(`🎯 Target: ${PRODUCTION_URL}`);
  console.log('');

  let allPassed = true;
  const results = [];

  for (const pageCheck of TEXT_COLOR_CHECKS) {
    console.log(`📄 Checking ${pageCheck.name}...`);
    
    try {
      const url = `${PRODUCTION_URL}${pageCheck.page}`;
      const content = await checkPageContent(url);
      
      const pageResults = {
        page: pageCheck.name,
        url: pageCheck.page,
        checks: []
      };

      for (const check of pageCheck.checks) {
        if (check.element) {
          // Check for presence of desired elements
          const hasElement = content.includes(check.element);
          const status = hasElement ? '✅' : '❌';
          console.log(`  ${status} ${check.description}: ${hasElement ? 'FOUND' : 'NOT FOUND'}`);
          
          pageResults.checks.push({
            type: 'presence',
            check: check.description,
            passed: hasElement,
            element: check.element
          });
          
          if (!hasElement) allPassed = false;
        }
        
        if (check.anti) {
          // Check for absence of unwanted elements
          const hasAntiElement = content.includes(check.anti);
          const status = !hasAntiElement ? '✅' : '❌';
          console.log(`  ${status} ${check.description}: ${!hasAntiElement ? 'GOOD' : 'STILL PRESENT'}`);
          
          pageResults.checks.push({
            type: 'absence',
            check: check.description,
            passed: !hasAntiElement,
            element: check.anti
          });
          
          if (hasAntiElement) allPassed = false;
        }
      }
      
      results.push(pageResults);
      console.log('');
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.log(`  ❌ Error checking ${pageCheck.name}: ${error.message}`);
      allPassed = false;
    }
  }

  console.log('🏁 VALIDATION SUMMARY');
  console.log('====================');
  
  if (allPassed) {
    console.log('🎉 ALL TEXT COLOR FIXES VERIFIED!');
    console.log('✅ Black text is properly implemented');
    console.log('✅ Gray text has been successfully replaced');
    console.log('✅ User readability significantly improved');
  } else {
    console.log('⚠️  Some text color issues may remain');
    console.log('❌ Manual review recommended for specific elements');
  }
  
  console.log('');
  console.log('📊 Detailed Results:');
  results.forEach(result => {
    console.log(`\n📄 ${result.page}:`);
    result.checks.forEach(check => {
      const icon = check.passed ? '✅' : '❌';
      console.log(`  ${icon} ${check.check}`);
    });
  });

  return { allPassed, results };
}

// Run validation
validateTextColors()
  .then(({ allPassed }) => {
    process.exit(allPassed ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Validation failed:', error);
    process.exit(2);
  });
