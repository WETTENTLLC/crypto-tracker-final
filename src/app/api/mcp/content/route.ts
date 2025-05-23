import { NextResponse } from 'next/server';
import { generateDistributableContent, distributeContent } from '../services';

// API route to generate and distribute content using MCP approach
export async function GET(request: Request) {
  try {
    // Get content type from query params
    const url = new URL(request.url);
    const contentType = url.searchParams.get('type') as 'market_update' | 'price_alert' | 'trending_coins';
    
    if (!contentType || !['market_update', 'price_alert', 'trending_coins'].includes(contentType)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid content type. Must be one of: market_update, price_alert, trending_coins' 
      }, { status: 400 });
    }
    
    // Generate content
    const contentResult = await generateDistributableContent(contentType);
    
    if (!contentResult.success) {
      return NextResponse.json({ 
        success: false, 
        error: contentResult.error || 'Failed to generate content' 
      }, { status: 500 });
    }
    
    // Get distribution channels
    const channelsParam = url.searchParams.get('channels') || 'social,rss';
    const channels = channelsParam.split(',') as ('social' | 'email' | 'rss' | 'webpush')[];
    
    // Distribute the content
    const distributionResult = await distributeContent(
      contentResult.data?.content,
      channels
    );
    
    return NextResponse.json({
      success: true,
      message: 'Content generated and distributed successfully',
      content: contentResult.data?.content,
      distribution: distributionResult.data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in content generation and distribution:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate and distribute content' 
    }, { status: 500 });
  }
}
