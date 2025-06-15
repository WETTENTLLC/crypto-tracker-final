// Generate real analytics test data
// This script simulates user events to populate the analytics system with real data

import fetch from 'node-fetch';

const API_ENDPOINT = 'http://localhost:3003/api/mcp/analytics'; // Updated API endpoint
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36'
];

const REFERRERS = [
  'https://www.google.com',
  'https://www.bing.com',
  'https://www.facebook.com',
  'https://www.twitter.com',
  'https://www.linkedin.com',
  'https://www.reddit.com',
  'https://www.coinmarketcap.com',
  'https://www.coingecko.com',
  'Direct',
  ''
];

const COIN_NAMES = [
  'Bitcoin',
  'Ethereum',
  'Cardano',
  'Solana',
  'Ripple',
  'Polkadot',
  'Avalanche',
  'Chainlink',
  'Litecoin',
  'Polygon'
];

// Generate a random date within the last X days
function randomDate(days = 30) {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * days));
  return date.toISOString();
}

// Generate a random user email
function randomEmail() {
  const names = ['john', 'jane', 'alex', 'maria', 'sam', 'emma', 'dave', 'sarah', 'mike', 'lisa'];
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
  
  const name = names[Math.floor(Math.random() * names.length)];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const num = Math.floor(Math.random() * 1000);
  
  return `${name}${num}@${domain}`;
}

// Record an analytics event
async function recordEvent(eventName, eventData, timestamp = new Date().toISOString(), userAgent = null) {
  try {
    const sessionId = `test-session-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    // Ensure timestamp is in YYYY-MM-DDTHH:mm:ss.sssZ format
    const isoTimestamp = new Date(timestamp).toISOString();

    const payload = {
      eventName,
      eventData,
      sessionId,
      timestamp: isoTimestamp // Use the formatted ISO timestamp
    };
    // console.log(`[generate-analytics-data] Sending event: ${eventName}, Timestamp: ${isoTimestamp}`); // DEBUG LOG

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': userAgent || USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error recording ${eventName} event:`, error);
    throw error;
  }
}

// Generate page view events
async function generatePageViews(count = 100) {
  console.log(`Generating ${count} page_view events...`);
  
  for (let i = 0; i < count; i++) {
    const referrer = REFERRERS[Math.floor(Math.random() * REFERRERS.length)];
    const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
    const timestamp = randomDate();
    const path = ['/', '/dashboard', '/coins', '/portfolio', '/alerts', '/news'][Math.floor(Math.random() * 6)];
    
    await recordEvent('page_view', {
      path,
      referrer,
      duration: Math.floor(Math.random() * 300) + 10 // 10-310 seconds
    }, timestamp, userAgent);
    
    if (i % 10 === 0) {
      console.log(`  Progress: ${i}/${count}`);
    }
  }
  
  console.log(`✅ Generated ${count} page_view events`);
}

// Generate user signup events
async function generateSignups(count = 20) {
  console.log(`Generating ${count} user_signup events...`);
  
  for (let i = 0; i < count; i++) {
    const isPremium = Math.random() < 0.3; // 30% are premium
    const email = randomEmail();
    const timestamp = randomDate();
    
    await recordEvent('user_signup', {
      email,
      isPremium,
      source: ['organic', 'referral', 'social', 'paid'][Math.floor(Math.random() * 4)]
    }, timestamp);
  }
  
  console.log(`✅ Generated ${count} user_signup events`);
}

// Generate premium subscription events
async function generatePremiumSubscriptions(count = 10) {
  console.log(`Generating ${count} premium_subscription events...`);
  
  for (let i = 0; i < count; i++) {
    const email = randomEmail();
    const timestamp = randomDate(20); // Last 20 days
    const paymentMethod = ['paypal', 'credit_card'][Math.floor(Math.random() * 2)];
    
    await recordEvent('premium_subscription', {
      email,
      plan: 'monthly',
      amount: 5.99,
      paymentMethod,
      transactionId: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    }, timestamp);
  }
  
  console.log(`✅ Generated ${count} premium_subscription events`);
}

// Generate alert creation events
async function generateAlertCreations(count = 30) {
  console.log(`Generating ${count} alert_created events...`);
  
  for (let i = 0; i < count; i++) {
    const email = randomEmail();
    const timestamp = randomDate();
    const coinName = COIN_NAMES[Math.floor(Math.random() * COIN_NAMES.length)];
    const alertType = ['price_above', 'price_below', 'percent_change'][Math.floor(Math.random() * 3)];
    
    await recordEvent('alert_created', {
      userEmail: email,
      alertId: `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      coinName,
      alertType,
      targetPrice: Math.random() * 50000 + 100,
      percentChange: Math.random() * 20 - 10
    }, timestamp);
  }
  
  console.log(`✅ Generated ${count} alert_created events`);
}

// Generate alert triggered events
async function generateAlertTriggers(count = 15) {
  console.log(`Generating ${count} alert_triggered events...`);
  
  for (let i = 0; i < count; i++) {
    const email = randomEmail();
    const timestamp = randomDate(10); // Last 10 days
    const coinName = COIN_NAMES[Math.floor(Math.random() * COIN_NAMES.length)];
    
    await recordEvent('alert_triggered', {
      userEmail: email,
      alertId: `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      coinName,
      price: Math.random() * 50000 + 100,
      notificationSent: Math.random() < 0.9 // 90% success rate
    }, timestamp);
  }
  
  console.log(`✅ Generated ${count} alert_triggered events`);
}

// Generate portfolio view events
async function generatePortfolioViews(count = 40) {
  console.log(`Generating ${count} portfolio_viewed events...`);
  
  for (let i = 0; i < count; i++) {
    const email = randomEmail();
    const timestamp = randomDate();
    
    await recordEvent('portfolio_viewed', {
      userEmail: email,
      portfolioSize: Math.floor(Math.random() * 10) + 1,
      totalValue: Math.random() * 100000 + 1000
    }, timestamp);
  }
  
  console.log(`✅ Generated ${count} portfolio_viewed events`);
}

// Generate chart interaction events
async function generateChartInteractions(count = 50) {
  console.log(`Generating ${count} chart_interaction events...`);
  
  for (let i = 0; i < count; i++) {
    const timestamp = randomDate();
    const coinName = COIN_NAMES[Math.floor(Math.random() * COIN_NAMES.length)];
    
    await recordEvent('chart_interaction', {
      coinName,
      timeRange: ['1d', '7d', '30d', '90d', '1y'][Math.floor(Math.random() * 5)],
      chartType: ['line', 'candlestick', 'bar'][Math.floor(Math.random() * 3)]
    }, timestamp);
  }
  
  console.log(`✅ Generated ${count} chart_interaction events`);
}

// Generate coin details view events
async function generateCoinDetailsViews(count = 60) {
  console.log(`Generating ${count} coin_details_viewed events...`);
  
  for (let i = 0; i < count; i++) {
    const timestamp = randomDate();
    const coinName = COIN_NAMES[Math.floor(Math.random() * COIN_NAMES.length)];
    
    await recordEvent('coin_details_viewed', {
      coinName,
      viewDuration: Math.floor(Math.random() * 300) + 5 // 5-305 seconds
    }, timestamp);
  }
  
  console.log(`✅ Generated ${count} coin_details_viewed events`);
}

// Generate revenue events
async function generateRevenueEvents(count = 15) {
  console.log(`Generating ${count} revenue_recorded events...`);
  
  const streams = ['premium_subscriptions', 'advertising', 'affiliate_marketing', 'api_access'];
  
  for (let i = 0; i < count; i++) {
    const timestamp = randomDate(30);
    const stream = streams[Math.floor(Math.random() * streams.length)];
    const date = timestamp.split('T')[0];
    
    let amount;
    switch (stream) {
      case 'premium_subscriptions':
        amount = (Math.random() * 50 + 20).toFixed(2); // $20-$70
        break;
      case 'advertising':
        amount = (Math.random() * 30 + 10).toFixed(2); // $10-$40
        break;
      case 'affiliate_marketing':
        amount = (Math.random() * 20 + 5).toFixed(2); // $5-$25
        break;
      case 'api_access':
        amount = (Math.random() * 10 + 1).toFixed(2); // $1-$11
        break;
    }
    
    await recordEvent('revenue_recorded', {
      stream,
      amount,
      date,
      source: stream === 'premium_subscriptions' ? 'paypal' : 'manual'
    }, timestamp);
  }
  
  // Add a few events specifically for today
  console.log(`Generating a few revenue_recorded events for today (${new Date().toISOString().split('T')[0]})...`);
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTimestamp = new Date().toISOString();

  for (let i = 0; i < 3; i++) { // Generate 3 events for today
    const stream = streams[Math.floor(Math.random() * streams.length)];
    let amount;
    switch (stream) {
      case 'premium_subscriptions':
        amount = (Math.random() * 50 + 20).toFixed(2);
        break;
      case 'advertising':
        amount = (Math.random() * 30 + 10).toFixed(2);
        break;
      case 'affiliate_marketing':
        amount = (Math.random() * 20 + 5).toFixed(2);
        break;
      case 'api_access':
        amount = (Math.random() * 10 + 1).toFixed(2);
        break;
    }
    await recordEvent('revenue_recorded', {
      stream,
      amount,
      date: todayStr, // Ensure date is today
      source: stream === 'premium_subscriptions' ? 'paypal' : 'manual'
    }, todayTimestamp); // Ensure timestamp is today
  }

  console.log(`✅ Generated ${count + 3} revenue_recorded events (including for today)`);
}

// Generate revenue_recorded events specifically for today
async function generateTodaysRevenueEvents(count = 5) {
  console.log(`Generating ${count} revenue_recorded events for today...`);
  const today = new Date(); // Use current date and time

  const revenueStreams = [
    { stream: 'premium_subscriptions', minAmount: 5, maxAmount: 20 },
    { stream: 'advertising', minAmount: 1, maxAmount: 10 },
    { stream: 'affiliate_marketing', minAmount: 2, maxAmount: 15 },
    { stream: 'api_access', minAmount: 10, maxAmount: 50 }
  ];

  for (let i = 0; i < count; i++) {
    const streamDetails = revenueStreams[Math.floor(Math.random() * revenueStreams.length)];
    const amount = parseFloat((Math.random() * (streamDetails.maxAmount - streamDetails.minAmount) + streamDetails.minAmount).toFixed(2));
    
    // Generate a timestamp for today, but at a random time
    const eventTimestamp = new Date(today);
    eventTimestamp.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
    
    const eventData = {
      amount: amount,
      currency: 'USD',
      stream: streamDetails.stream, // Ensure this matches what revenue-tracker.js expects
      transactionId: `txn-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      userId: `user-${Math.floor(Math.random() * 1000)}`
    };
    
    // console.log(`[generate-analytics-data] Recording today\'s revenue event: Stream: ${streamDetails.stream}, Amount: ${amount}, Timestamp: ${eventTimestamp.toISOString()}`);
    await recordEvent('revenue_recorded', eventData, eventTimestamp.toISOString());
  }
  console.log(`✅ Generated ${count} revenue_recorded events for today`);
}


async function main() {
  console.log('🚀 Starting analytics data generation...');

  // Generate different types of events
  await generatePageViews(100);
  await generateSignups(50);
  await generatePremiumSubscriptions(30);
  await generateAlertCreations(40);
  await generateAlertTriggers(25);
  await generatePortfolioViews(70);
  await generateChartInteractions(90);
  await generateCoinDetailsViews(120);
  await generateRevenueEvents(50);
  await generateTodaysRevenueEvents(7); // Generate 7 revenue events for today

  console.log('\n✅ Analytics data generation completed successfully!');
}

// Main function to generate all test data
async function generateAllTestData() {
  try {
    console.log('🚀 Starting analytics test data generation...');
    console.log('=============================================');
    
    await generatePageViews(200);
    await generateSignups(30);
    await generatePremiumSubscriptions(15);
    await generateAlertCreations(50);
    await generateAlertTriggers(20);
    await generatePortfolioViews(60);
    await generateChartInteractions(80);
    await generateCoinDetailsViews(100);
    await generateRevenueEvents(20);
    await generateTodaysRevenueEvents(7); // Generate 7 revenue events for today

    console.log('=============================================');
    console.log('✅ Successfully generated all test analytics data!');
    console.log('You can now view this data in the admin analytics dashboard.');
  } catch (error) {
    console.error('❌ Error generating test data:', error);
    process.exit(1);
  }
}

// Run if called directly - ES Module compatible check
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAllTestData();
}

export {
  recordEvent,
  generatePageViews,
  generateSignups,
  generatePremiumSubscriptions,
  generateAlertCreations,
  generateAlertTriggers,
  generatePortfolioViews,
  generateChartInteractions,
  generateCoinDetailsViews,
  generateRevenueEvents,
  generateTodaysRevenueEvents,
  generateAllTestData
};
