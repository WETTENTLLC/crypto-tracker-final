// PayPal API integration
// This file handles all PayPal-related functionality for subscription management

const PAYPAL_CLIENT_ID = 'AX_UCD0FG6LaVhl1smF44PQuxkRzoCNE_GreJfYg1DHycaE_IDKHrCJEhfcDWlK5sdVX44E8yBWnFns5';
const PAYPAL_SECRET = 'ELac9rsu8SC5C5pa04b3N2ywO9UAZ_s7p9eXl59E1-kryMttyJ-ndyLlHUqtT058pmMoP9aMEZEBnEUX';
const PAYPAL_API_BASE = 'https://api-m.sandbox.paypal.com'; // Use sandbox for development, change to https://api-m.paypal.com for production

// Function to get PayPal access token
export const getPayPalAccessToken = async (): Promise<string> => {
  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
    const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`
      },
      body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting PayPal access token:', error);
    throw new Error('Failed to authenticate with PayPal');
  }
};

// Create a subscription plan
export const createSubscriptionPlan = async (name: string, description: string, price: string): Promise<any> => {
  try {
    const accessToken = await getPayPalAccessToken();
    
    const response = await fetch(`${PAYPAL_API_BASE}/v1/billing/plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        product_id: 'PROD-5BG87665TS610315P', // Replace with your product ID
        name,
        description,
        billing_cycles: [
          {
            frequency: {
              interval_unit: 'MONTH',
              interval_count: 1
            },
            tenure_type: 'REGULAR',
            sequence: 1,
            total_cycles: 0, // Infinite cycles
            pricing_scheme: {
              fixed_price: {
                value: price,
                currency_code: 'USD'
              }
            }
          }
        ],
        payment_preferences: {
          auto_bill_outstanding: true,
          setup_fee: {
            value: '0',
            currency_code: 'USD'
          },
          setup_fee_failure_action: 'CONTINUE',
          payment_failure_threshold: 3
        }
      })
    });

    return await response.json();
  } catch (error) {
    console.error('Error creating subscription plan:', error);
    throw new Error('Failed to create subscription plan');
  }
};

// Get subscription details
export const getSubscription = async (subscriptionId: string): Promise<any> => {
  try {
    const accessToken = await getPayPalAccessToken();
    
    const response = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return await response.json();
  } catch (error) {
    console.error('Error getting subscription details:', error);
    throw new Error('Failed to get subscription details');
  }
};

// Cancel a subscription
export const cancelSubscription = async (subscriptionId: string, reason: string): Promise<any> => {
  try {
    const accessToken = await getPayPalAccessToken();
    
    const response = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        reason
      })
    });

    return response.status === 204; // Success returns 204 No Content
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw new Error('Failed to cancel subscription');
  }
};

// Process a refund
export const processRefund = async (captureId: string, amount: string): Promise<any> => {
  try {
    const accessToken = await getPayPalAccessToken();
    
    const response = await fetch(`${PAYPAL_API_BASE}/v2/payments/captures/${captureId}/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        amount: {
          value: amount,
          currency_code: 'USD'
        }
      })
    });

    return await response.json();
  } catch (error) {
    console.error('Error processing refund:', error);
    throw new Error('Failed to process refund');
  }
};

// List transactions
export const listTransactions = async (subscriptionId: string, startDate: string, endDate: string): Promise<any> => {
  try {
    const accessToken = await getPayPalAccessToken();
    
    const response = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}/transactions?start_time=${startDate}&end_time=${endDate}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return await response.json();
  } catch (error) {
    console.error('Error listing transactions:', error);
    throw new Error('Failed to list transactions');
  }
};

// Update subscription pricing
export const updateSubscriptionPricing = async (subscriptionId: string, price: string): Promise<any> => {
  try {
    const accessToken = await getPayPalAccessToken();
    
    const response = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}/revise`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        plan_id: 'P-5ML4271244454362WXNWU5NQ', // Replace with your plan ID
        shipping_amount: {
          currency_code: 'USD',
          value: '0'
        }
      })
    });

    return await response.json();
  } catch (error) {
    console.error('Error updating subscription pricing:', error);
    throw new Error('Failed to update subscription pricing');
  }
};
