import { NextResponse } from 'next/server';
import axios from 'axios';

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

    // Get Mailchimp configuration from environment variables
    const apiKey = process.env.MAILCHIMP_API_KEY;
    const listId = process.env.MAILCHIMP_LIST_ID;
    const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
    
    if (!apiKey || !listId || !serverPrefix) {
      console.error('Missing Mailchimp configuration');
      return NextResponse.json({ 
        success: false, 
        error: 'Email service not configured' 
      }, { status: 500 });
    }

    // Prepare data for Mailchimp
    const subscriberData = {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName || '',
        LNAME: lastName || ''
      }
    };

    // Send request to Mailchimp API
    await axios.post(
      `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}/members`,
      subscriberData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`
        }
      }
    );

    // Track the subscription event in analytics
    console.log('New subscriber added to Mailchimp:', email);
    
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
  } catch (error: unknown) {
    // Check if this is a Mailchimp error about already subscribed
    if (axios.isAxiosError(error) && error.response?.status === 400 && 
        error.response.data?.title === 'Member Exists') {
      return NextResponse.json({
        success: true,
        message: 'You are already subscribed',
        data: {
          email: (await request.json()).email,
          status: 'active'
        }
      });
    }
    
    console.error('Error processing subscription:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process subscription' 
    }, { status: 500 });
  }
}
