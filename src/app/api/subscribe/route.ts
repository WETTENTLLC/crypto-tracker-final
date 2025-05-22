import { NextResponse } from 'next/server';

// API route to handle email subscriptions for user acquisition
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
    
    // In production, this would connect to an email marketing API like Mailchimp
    // For now, we'll simulate a successful subscription
    
    console.log('New subscriber:', email, firstName, lastName);
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Subscription successful',
      data: {
        email,
        subscriptionDate: new Date().toISOString(),
        status: 'active'
      }
    });
  } catch (error) {
    console.error('Error processing subscription:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process subscription' 
    }, { status: 500 });
  }
}
