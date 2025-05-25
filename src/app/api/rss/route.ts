import { NextResponse } from 'next/server';

// API route to generate RSS feed for content syndication
export async function GET() {
  try {
    const apiKey = process.env.COINGECKO_API_KEY || 'CG-d43qzmJiMgUWSyPUnugQesvj';
    
    // Import the function dynamically to avoid issues with server components
    const { generateRSSFeed } = await import('../userAcquisition');
    
    // Generate RSS feed
    const rssFeed = await generateRSSFeed(apiKey);
    
    // Return as XML
    return new NextResponse(rssFeed, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate RSS feed' 
    }, { status: 500 });
  }
}
