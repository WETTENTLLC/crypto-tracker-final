import { NextResponse } from 'next/server';
import { subscribeEmail } from '../services';

// API route to handle email subscriptions using MCP approach
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, firstName, lastName } = data;
    
    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid email address' 
      }, { status: 400 });
    }

    // Subscribe using MCP service
    const result = await subscribeEmail(email, firstName, lastName);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Subscription successful',
        data: {
          email,
          subscriptionDate: new Date().toISOString(),
          status: 'active'
        }
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error || 'Failed to process subscription'
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error processing subscription:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process subscription' 
    }, { status: 500 });
  }
}
