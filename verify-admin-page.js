#!/usr/bin/env node

/**
 * Admin Page Verification Script
 * 
 * This script tests the admin login page of the CryptoTracker application
 * to ensure that it loads correctly in production.
 * 
 * Usage:
 * 1. Ensure the BASE_URL points to your deployed Vercel URL
 * 2. Run: node verify-admin-page.js
 */

import https from 'https';

// Update this to your deployed Vercel URL
const BASE_URL = 'https://crypto-tracker-no-modules-hwrl1vyun-wettentllcs-projects.vercel.app';

// Admin endpoint to test
const adminEndpoint = '/admin/login';

// Function to make a GET request and check status
function testAdminPage() {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${adminEndpoint}`;
    console.log(`Testing Admin Login Page: ${url}`);
    
    https.get(url, (res) => {
      const { statusCode } = res;
      let data = '';
      
      // Collect response data
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      // Process complete response
      res.on('end', () => {
        if (statusCode === 200) {
          // Check if the page contains expected content
          const hasAdminLoginText = data.includes('Admin Login');
          const hasEmailField = data.includes('email-address');
          const hasPasswordField = data.includes('password');
          
          if (hasAdminLoginText && hasEmailField && hasPasswordField) {
            console.log(`✅ Admin Login Page: SUCCESS (${statusCode}) - Page content looks correct`);
            resolve(true);
          } else {
            console.log(`⚠️ Admin Login Page: WARNING (${statusCode}) - Page returned 200 but content may be incorrect`);
            console.log(`   - Contains 'Admin Login' text: ${hasAdminLoginText}`);
            console.log(`   - Contains email field: ${hasEmailField}`);
            console.log(`   - Contains password field: ${hasPasswordField}`);
            resolve(false);
          }
        } else {
          console.log(`❌ Admin Login Page: FAILED (${statusCode})`);
          resolve(false);
        }
      });
    }).on('error', (e) => {
      console.log(`❌ Admin Login Page: ERROR - ${e.message}`);
      reject(e);
    });
  });
}

// Main function to run tests
async function main() {
  console.log('=== CryptoTracker Admin Page Verification ===');
  console.log(`Testing deployment at: ${BASE_URL}`);
  
  try {
    const result = await testAdminPage();
    
    console.log('=== Verification Summary ===');
    if (result) {
      console.log('✅ Admin login page is working correctly!');
    } else {
      console.log('❌ Admin login page has issues!');
    }
  } catch (error) {
    console.error('Error during verification:', error);
  }
}

main();
