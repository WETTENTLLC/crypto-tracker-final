import { NextResponse } from 'next/server';
import crypto from 'crypto'; // Needed for signature verification

// Function to get the raw body as text
async function getRawBody(request: Request): Promise<string> {
  const reader = request.body?.getReader();
  if (!reader) {
    return '';
  }
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  return new TextDecoder().decode(
    chunks.reduce((acc, chunk) => {
      const tmp = new Uint8Array(acc.length + chunk.length);
      tmp.set(acc);
      tmp.set(chunk, acc.length);
      return tmp;
    }, new Uint8Array(0))
  );
}

// Function to verify PayPal webhook signature
async function verifyWebhookSignature(request: Request, rawBody: string): Promise<boolean> {
  try {
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    if (!webhookId) {
      console.error('PAYPAL_WEBHOOK_ID is not set in environment variables.');
      return false;
    }

    const headers = request.headers;
    const transmissionId = headers.get('paypal-transmission-id');
    const timestamp = headers.get('paypal-transmission-time');
    const webhookSignature = headers.get('paypal-transmission-sig');
    const certUrl = headers.get('paypal-cert-url');

    if (!transmissionId || !timestamp || !webhookSignature || !certUrl) {
      console.error('Missing required PayPal webhook headers for signature verification.');
      return false;
    }

    // Fetch PayPal's public certificate (caching this in production is recommended)
    const certResponse = await fetch(certUrl);
    if (!certResponse.ok) {
      console.error(`Failed to fetch PayPal public certificate from ${certUrl}. Status: ${certResponse.status}`);
      return false;
    }
    const certPublicKey = await certResponse.text();

    // Construct the signature base string
    // The raw request body must be used here
    const signatureBase = `${transmissionId}|${timestamp}|${webhookId}|${rawBody}`;
    
    const verifier = crypto.createVerify('sha256WithRSAEncryption');
    verifier.update(signatureBase);
    
    // The webhookSignature is base64 encoded
    const isVerified = verifier.verify(certPublicKey, webhookSignature, 'base64');

    if (!isVerified) {
      console.warn('PayPal webhook signature verification failed.');
    } else {
      console.log('PayPal webhook signature verified successfully.');
    }
    return isVerified;

  } catch (error) {
    console.error('Error during PayPal webhook signature verification:', error);
    return false;
  }
}

// This file handles PayPal webhook events for subscription management
export async function POST(request: Request) {
  let rawRequestBody = '';
  try {
    // IMPORTANT: Clone the request to read the body for verification,
    // as the body can only be consumed once.
    const requestClone = request.clone();
    rawRequestBody = await getRawBody(requestClone);
    
    const payload = await request.json(); // Original request is consumed here for its JSON payload
    
    // Verify webhook signature in production
    if (process.env.NODE_ENV === 'production') {
      // Pass the raw request body to the verification function
      const isValid = await verifyWebhookSignature(request, rawRequestBody);
      if (!isValid) {
        console.warn('PayPal webhook signature invalid. Rejecting request.');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }
    
    // Process different webhook event types
    const eventType = payload.event_type;
    
    switch (eventType) {
      case 'PAYMENT.SALE.COMPLETED':
        // Handle successful payment
        // In a real app, you would update the user's subscription status in the database
        console.log('Payment completed:', payload.resource.id);
        break;
        
      case 'BILLING.SUBSCRIPTION.CREATED':
        // Handle new subscription
        console.log('Subscription created:', payload.resource.id);
        break;
        
      case 'BILLING.SUBSCRIPTION.CANCELLED':
        // Handle cancelled subscription
        console.log('Subscription cancelled:', payload.resource.id);
        break;
        
      case 'BILLING.SUBSCRIPTION.EXPIRED':
        // Handle expired subscription
        console.log('Subscription expired:', payload.resource.id);
        break;
        
      case 'PAYMENT.SALE.REFUNDED':
        // Handle refunded payment
        console.log('Payment refunded:', payload.resource.id);
        break;
        
      default:
        // Handle other event types
        console.log('Unhandled event type:', eventType);
    }
    
    // Return success response
    return NextResponse.json({ status: 'success' });
  } catch (error) { // Removed 'any' type, will let TypeScript infer or use 'unknown' and then check type
    console.error('Error processing webhook:', error);
    // Log the raw body if parsing failed, as it might not be JSON
    // Check if error is an instance of Error to safely access message property
    if (error instanceof Error && (error.message.includes('Unexpected token') || error.message.includes('invalid json'))) {
      console.error('Raw request body that failed JSON parsing:', rawRequestBody);
    }
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 });
  }
}
