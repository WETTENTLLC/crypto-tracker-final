import { NextResponse } from 'next/server';
import { getPayPalAccessToken } from '@/app/api/paypal';

// Define an interface for the structure of individual transaction details from PayPal
interface PayPalTransactionDetail {
  transaction_info: {
    transaction_id: string;
    transaction_initiation_date: string;
    transaction_updated_date?: string; // Optional, based on typical API responses
    transaction_status: string;
    transaction_event_code: string;
    transaction_amount: {
      value: string;
      currency_code: string;
    };
    // Add other relevant fields from transaction_info if needed
  };
  payer_info?: { // Optional, as it might not always be present or needed for all views
    email_address?: string;
    // Add other relevant fields from payer_info if needed
  };
  // Add other top-level fields from the transaction detail object if needed
}

// Define an interface for the overall structure of the PayPal transaction data response
interface PayPalTransactionData {
  transaction_details?: PayPalTransactionDetail[]; // This is an array of transaction details
  // Include other fields from the response if necessary, e.g., page_info, links
}

// API route to fetch PayPal transactions for a specific date
export async function GET(request: Request) {
  try {
    // Get date from query parameters
    const url = new URL(request.url);
    const date = url.searchParams.get('date');
    
    if (!date) {
      return NextResponse.json({ 
        success: false, 
        error: 'Date parameter is required' 
      }, { status: 400 });
    }
    
    // Format date range (full day from 00:00:00 to 23:59:59)
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    // Format dates for PayPal API
    const startDateStr = startDate.toISOString();
    const endDateStr = endDate.toISOString();
    
    // Call PayPal API to get transactions
    const accessToken = await getPayPalAccessToken();
    
    const response = await fetch(`https://api-m.paypal.com/v1/reporting/transactions?start_date=${startDateStr}&end_date=${endDateStr}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      // It's good practice to type errorData if its structure is known
      const errorMessage = typeof errorData === 'object' && errorData !== null && 'message' in errorData ? (errorData as {message: string}).message : response.statusText;
      return NextResponse.json({ 
        success: false, 
        error: `PayPal API Error: ${errorMessage}` 
      }, { status: response.status });
    }
    
    const transactionData = await response.json() as PayPalTransactionData;
    
    // Filter and format transactions
    const transactions = transactionData.transaction_details
      ?.filter((tx: PayPalTransactionDetail) => 
        tx.transaction_info.transaction_status === "S" && // Successful transactions
        tx.transaction_info.transaction_event_code === "T0006" // Payment transactions (this code might vary, confirm with PayPal docs for subscriptions/sales)
      )
      .map((tx: PayPalTransactionDetail) => ({
        id: tx.transaction_info.transaction_id,
        date: tx.transaction_info.transaction_initiation_date,
        amount: {
          value: tx.transaction_info.transaction_amount.value,
          currency: tx.transaction_info.transaction_amount.currency_code
        },
        status: tx.transaction_info.transaction_status,
        customer: tx.payer_info?.email_address || 'Unknown'
      })) || [];
    
    return NextResponse.json({
      success: true,
      transactions,
      total: transactions.length,
      date: date
    });
  } catch (error: unknown) {
    console.error('Error retrieving PayPal transaction data:', error);
    // It's better to provide a generic error message to the client for security
    const errorMessage = 'Failed to retrieve PayPal transaction data'; // Changed let to const
    if (error instanceof Error) {
        // You might log error.message to your server logs but not send it directly to client
        console.error('Detailed error:', error.message);
    }
    return NextResponse.json({ 
      success: false, 
      error: errorMessage 
    }, { status: 500 });
  }
}
