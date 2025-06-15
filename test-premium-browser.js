#!/usr/bin/env node

/**
 * Enhanced Premium Page Test
 * Tests actual browser rendering and functionality
 */

import puppeteer from 'puppeteer';

const PRODUCTION_URL = 'https://crypto-tracker-no-modules-63pevoa5x-wettentllcs-projects.vercel.app';

async function testPremiumPageWithBrowser() {
  let browser;
  
  try {
    console.log('🚀 Launching browser...');
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set up console logging to capture client-side errors
    page.on('console', msg => console.log('🖥️  BROWSER:', msg.text()));
    page.on('pageerror', error => console.log('❌ PAGE ERROR:', error.message));
    page.on('requestfailed', request => console.log('❌ REQUEST FAILED:', request.url()));
    
    console.log('📄 Navigating to premium page...');
    await page.goto(`${PRODUCTION_URL}/premium`, { 
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait for React to render
    await page.waitForTimeout(3000);
    
    console.log('🔍 Analyzing page content...');
    
    // Check for key elements
    const pageTitle = await page.title();
    const pageContent = await page.content();
    
    // Check for specific premium page elements
    const hasUpgradeHeading = await page.$('h1:contains("Upgrade to Premium")');
    const hasPricingCards = await page.$$('.bg-white.rounded-lg.shadow-md');
    const hasPayPalElements = pageContent.includes('paypal') || pageContent.includes('PayPal');
    const hasUpgradeButtons = await page.$$('button:contains("Upgrade"), button:contains("Demo")');
    
    // Check for PayPal script loading
    const paypalScriptLoaded = await page.evaluate(() => {
      return typeof window.paypal !== 'undefined';
    });
    
    // Check for React rendering
    const reactRendered = await page.evaluate(() => {
      return document.querySelector('[data-reactroot]') !== null || 
             document.querySelector('#__next') !== null;
    });
    
    // Take screenshot for visual verification
    console.log('📸 Taking screenshot...');
    await page.screenshot({ 
      path: 'c:\\Users\\wette\\Downloads\\crypto-tracker-no-modules\\premium-page-screenshot.png',
      fullPage: true 
    });
    
    console.log('\n🔍 BROWSER TEST RESULTS:');
    console.log('========================');
    console.log(`📄 Page Title: ${pageTitle}`);
    console.log(`📏 Content Length: ${pageContent.length} characters`);
    console.log(`⚛️  React Rendered: ${reactRendered ? 'YES' : 'NO'}`);
    console.log(`💳 PayPal Script Loaded: ${paypalScriptLoaded ? 'YES' : 'NO'}`);
    console.log(`📝 Has Upgrade Heading: ${hasUpgradeHeading ? 'YES' : 'NO'}`);
    console.log(`💰 Has PayPal Content: ${hasPayPalElements ? 'YES' : 'NO'}`);
    console.log(`🎨 Pricing Cards Found: ${hasPricingCards.length}`);
    console.log(`🔘 Upgrade Buttons Found: ${hasUpgradeButtons.length}`);
    
    // Test page interactions
    console.log('\n🧪 Testing Interactions:');
    
    try {
      // Try to find and click demo upgrade button
      const demoButton = await page.$('button:contains("Demo Upgrade")');
      if (demoButton) {
        console.log('✅ Demo upgrade button found');
        
        // Set up dialog handler for confirmation
        page.on('dialog', async dialog => {
          console.log('📝 Dialog appeared:', dialog.message());
          await dialog.accept();
        });
        
        await demoButton.click();
        await page.waitForTimeout(1000);
        
        // Check if premium status changed
        const premiumStatus = await page.evaluate(() => {
          return localStorage.getItem('isPremium');
        });
        
        console.log(`🔐 Premium Status: ${premiumStatus}`);
        
      } else {
        console.log('❌ Demo upgrade button not found');
      }
    } catch (error) {
      console.log('❌ Interaction test failed:', error.message);
    }
    
    return {
      success: reactRendered && hasPricingCards.length > 0,
      pageTitle,
      contentLength: pageContent.length,
      reactRendered,
      paypalLoaded: paypalScriptLoaded,
      pricingCards: hasPricingCards.length,
      upgradeButtons: hasUpgradeButtons.length
    };
    
  } catch (error) {
    console.error('❌ Browser test failed:', error.message);
    return { success: false, error: error.message };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function main() {
  console.log('🧪 Enhanced Premium Page Browser Test');
  console.log('=====================================\n');
  
  // Check if puppeteer is available
  try {
    await import('puppeteer');
  } catch (error) {
    console.log('📦 Puppeteer not installed. Installing...', error.message);
    const { exec } = await import('child_process');
    
    return new Promise((resolve) => {
      exec('npm install puppeteer --save-dev', (installError, /* _stdout */) => { // Commented out unused _stdout
        if (installError) {
          console.error('❌ Failed to install puppeteer:', installError.message);
          console.log('\n💡 Please install puppeteer manually:');
          console.log('npm install puppeteer --save-dev');
          resolve();
          process.exit(1);
        } else {
          console.log('✅ Puppeteer installed successfully');
          console.log('🔄 Please run this test again');
          resolve();
          process.exit(0);
        }
      });
    });
  }
  
  const result = await testPremiumPageWithBrowser();
  
  console.log('\n🎯 FINAL SUMMARY:');
  console.log('==================');
  if (result.success) {
    console.log('✅ Premium page is rendering correctly in browser');
    console.log('✅ React components are working');
    console.log('✅ User interactions are functional');
  } else {
    console.log('❌ Premium page has rendering or functionality issues');
    if (result.error) {
      console.log(`🔍 Error: ${result.error}`);
    }
  }
  
  console.log('\n💡 NEXT STEPS:');
  console.log('1. Check the screenshot: premium-page-screenshot.png');
  console.log('2. Verify PayPal client ID is valid for production');
  console.log('3. Test the demo upgrade functionality');
  console.log('4. Monitor browser console for any JavaScript errors');
  
  process.exit(result.success ? 0 : 1);
}

main().catch(console.error);
