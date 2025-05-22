import { NextResponse } from 'next/server';
import { generateMarketUpdate, generateRSSFeed } from '../../userAcquisition';

// API route to generate and schedule automated content
export async function GET(request: Request) {
  try {
    const apiKey = process.env.COINGECKO_API_KEY || 'CG-d43qzmJiMgUWSyPUnugQesvj';
    
    // Generate market update content
    const marketUpdate = await generateMarketUpdate(apiKey);
    
    // In a production environment, this would actually post to social media
    // using the configured API keys and tokens
    
    return NextResponse.json({
      success: true,
      message: 'Automated content generated successfully',
      content: marketUpdate.content,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in automated content generation:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate automated content' 
    }, { status: 500 });
  }
}
