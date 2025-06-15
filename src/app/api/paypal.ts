// PayPal API integration
// This file handles all PayPal-related functionality for subscription management

interface PayPalSubscription {
  id: string;
  status: string;
  status_update_time: string;
  plan_id: string;
  start_time: string;
  quantity: string;
  shipping_amount?: {
    currency_code: string;
    value: string;
  };
  subscriber?: {
    name?: {
      given_name: string;
      surname: string;
    };
    email_address: string;
  };
  billing_info?: {
    outstanding_balance: {
      currency_code: string;
      value: string;
    };
    cycle_executions: Array<{
      tenure_type: string;
      sequence: number;
      cycles_completed: number;
      cycles_remaining: number;
      current_pricing_scheme_version: number;
    }>;
  };
  create_time: string;
  update_time: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

interface PayPalTransactionsResponse {
  transactions: Array<{
    id: string;
    status: string;
    payer_email: string;
    payer_name: {
      given_name: string;
      surname: string;
    };
    amount_with_breakdown: {
      gross_amount: {
        currency_code: string;
        value: string;
      };
      fee_amount?: {
        currency_code: string;
        value: string;
      };
      net_amount?: {
        currency_code: string;
        value: string;
      };
    };
    time: string;
  }>;
  total_items: number;
  total_pages: number;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

interface PayPalRefundResponse {
  id: string;
  status: string;
  status_details?: {
    reason: string;
  };
  amount: {
    currency_code: string;
    value: string;
  };
  seller_payable_breakdown?: {
    gross_amount: {
      currency_code: string;
      value: string;
    };
    paypal_fee: {
      currency_code: string;
      value: string;
    };
    net_amount: {
      currency_code: string;
      value: string;
    };
  };
  create_time: string;
  update_time: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

interface PayPalCancelSubscriptionResponse {
  status: string;
  status_change_note?: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

interface PayPalSubscriptionPlan {
  id: string;
  product_id: string;
  name: string;
  description: string;
  status: string;
  billing_cycles: Array<{
    frequency: {
      interval_unit: string;
      interval_count: number;
    };
    tenure_type: string;
    sequence: number;
    total_cycles: number;
    pricing_scheme: {
      fixed_price: {
        value: string;
        currency_code: string;
      };
    };
  }>;
  payment_preferences: {
    auto_bill_outstanding: boolean;
    setup_fee: {
      value: string;
      currency_code: string;
    };
    setup_fee_failure_action: string;
  payment_failure_threshold: number;
};
create_time: string;
update_time: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_CLIENT_SECRET;

// Always use production API to ensure real transactions
const PAYPAL_API_BASE = 'https://api-m.paypal.com';  // Production environment only

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
export const createSubscriptionPlan = async (name: string, description: string, price: string): Promise<PayPalSubscriptionPlan> => {
  try {
    const accessToken = await getPayPalAccessToken();
    
    const response = await fetch(`${PAYPAL_API_BASE}/v1/billing/plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
},
body: JSON.stringify({
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
export const getSubscription = async (subscriptionId: string): Promise<PayPalSubscription> => {
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
export const cancelSubscription = async (subscriptionId: string, reason: string): Promise<PayPalCancelSubscriptionResponse> => {
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

    return await response.json();
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw new Error('Failed to cancel subscription');
  }
};

// Process a refund
export const processRefund = async (captureId: string, amount: string): Promise<PayPalRefundResponse> => {
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
export const listTransactions = async (subscriptionId: string, startDate: string, endDate: string): Promise<PayPalTransactionsResponse> => {
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
export const updateSubscriptionPricing = async (subscriptionId: string, price: string): Promise<PayPalSubscription> => {
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
          value: price
        }
      })
    });

    return await response.json();
  } catch (error) {
    console.error('Error updating subscription pricing:', error);
    throw new Error('Failed to update subscription pricing');
  }
};
