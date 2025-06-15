// This script records revenue events to the analytics API
// Run this after processing payments or transactions

import fetch from 'node-fetch';

// Record a revenue event to the analytics API
async function recordRevenueEvent(stream, amount, date = new Date().toISOString().split('T')[0]) {
  try {
    const response = await fetch('http://localhost:3000/api/mcp/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        eventName: 'revenue_recorded',
        eventData: {
          stream,
          amount,
          date,
          timestamp: new Date().toISOString()
        },
        sessionId: `revenue-tracker-${Date.now()}`
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(`API returned error: ${data.error || 'Unknown error'}`);
    }
    
    console.log(`Revenue event recorded for ${stream}: $${amount} on ${date}`);
    return data;
  } catch (error) {
    console.error('Error recording revenue event:', error);
    throw error;
  }
}

// Record PayPal transactions to analytics
async function recordPayPalTransactions(date = new Date().toISOString().split('T')[0]) {
  try {
    // Fetch transactions from PayPal API
    const response = await fetch(`http://localhost:3000/api/paypal/transactions?date=${date}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch PayPal transactions: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(`API returned error: ${data.error || 'Unknown error'}`);
    }
    
    // Record each transaction as a revenue event
    let totalAmount = 0;
    
    for (const transaction of data.transactions) {
      const amount = parseFloat(transaction.amount.value);
      totalAmount += amount;
      
      // Record individual transaction
      await recordRevenueEvent('premium_subscriptions', amount, date);
    }
    
    console.log(`Recorded ${data.transactions.length} PayPal transactions totaling $${totalAmount.toFixed(2)}`);
    return { transactions: data.transactions.length, amount: totalAmount };
  } catch (error) {
    console.error('Error recording PayPal transactions:', error);
    throw error;
  }
}

// Record advertising revenue
async function recordAdvertisingRevenue(amount, date = new Date().toISOString().split('T')[0]) {
  return recordRevenueEvent('advertising', amount, date);
}

// Record affiliate marketing revenue
async function recordAffiliateRevenue(amount, date = new Date().toISOString().split('T')[0]) {
  return recordRevenueEvent('affiliate_marketing', amount, date);
}

// Record API access revenue
async function recordApiAccessRevenue(amount, date = new Date().toISOString().split('T')[0]) {
  return recordRevenueEvent('api_access', amount, date);
}

// Example usage
async function main() {
  try {
    // Record PayPal transactions first
    await recordPayPalTransactions();
    
    // Then record other revenue streams 
    // In a real implementation, you would fetch this data from your ad network, affiliate programs, etc.
    await recordAdvertisingRevenue(10.50);
    await recordAffiliateRevenue(5.25);
    await recordApiAccessRevenue(2.75);
    
    console.log('All revenue recorded successfully!');
  } catch (error) {
    console.error('Error in main execution:', error);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export {
  recordRevenueEvent,
  recordPayPalTransactions,
  recordAdvertisingRevenue,
  recordAffiliateRevenue,
  recordApiAccessRevenue
};
