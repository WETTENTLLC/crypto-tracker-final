// PayPal Subscription Plan Setup Script
const fetch = require('node-fetch');

const PAYPAL_CLIENT_ID = 'AX_UCD0FG6LaVhl1smF44PQuxkRzoCNE_GreJfYg1DHycaE_IDKHrCJEhfcDWlK5sdVX44E8yBWnFns5';
const PAYPAL_CLIENT_SECRET = 'ELac9rsu8SC5C5pa04b3N2ywO9UAZ_s7p9eXl59E1-kryMttyJ-ndyLlHUqtT058pmMoP9aMEZEBnEUX';
const PAYPAL_BASE_URL = 'https://api-m.paypal.com'; // Production

async function getAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  
  const data = await response.json();
  return data.access_token;
}

async function createProduct() {
  const accessToken = await getAccessToken();
  
  const productData = {
    name: 'CryptoTracker Premium',
    description: 'Premium cryptocurrency tracking with unlimited alerts and advanced analytics',
    type: 'SERVICE',
    category: 'SOFTWARE'
  };
  
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/catalogs/products`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(productData)
  });
  
  const product = await response.json();
  console.log('Product created:', product.id);
  return product.id;
}

async function createSubscriptionPlan(productId, planName, price) {
  const accessToken = await getAccessToken();
  
  const planData = {
    product_id: productId,
    name: planName,
    description: `${planName} subscription for CryptoTracker Premium`,
    status: 'ACTIVE',
    billing_cycles: [{
      frequency: {
        interval_unit: 'MONTH',
        interval_count: 1
      },
      tenure_type: 'REGULAR',
      sequence: 1,
      total_cycles: 0,
      pricing_scheme: {
        fixed_price: {
          value: price,
          currency_code: 'USD'
        }
      }
    }],
    payment_preferences: {
      auto_bill_outstanding: true,
      setup_fee: {
        value: '0',
        currency_code: 'USD'
      },
      setup_fee_failure_action: 'CONTINUE',
      payment_failure_threshold: 3
    },
    taxes: {
      percentage: '0',
      inclusive: false
    }
  };
  
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/billing/plans`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(planData)
  });
  
  const plan = await response.json();
  console.log(`${planName} plan created:`, plan.id);
  return plan.id;
}

async function setupPayPalSubscriptions() {
  try {
    console.log('Setting up PayPal subscription plans...');
    
    // Create product
    const productId = await createProduct();
    
    // Create subscription plans
    const monthlyPlanId = await createSubscriptionPlan(productId, 'Monthly Premium', '9.99');
    const specialOfferPlanId = await createSubscriptionPlan(productId, 'Special Offer', '4.99');
    
    console.log('\n✅ PayPal Setup Complete!');
    console.log('\nAdd these to your environment variables:');
    console.log(`NEXT_PUBLIC_PAYPAL_MONTHLY_PLAN_ID=${monthlyPlanId}`);
    console.log(`NEXT_PUBLIC_PAYPAL_SPECIAL_PLAN_ID=${specialOfferPlanId}`);
    
  } catch (error) {
    console.error('❌ PayPal setup failed:', error);
  }
}

setupPayPalSubscriptions();