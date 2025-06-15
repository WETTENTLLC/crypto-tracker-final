import { NextResponse } from 'next/server';
import { generateDistributableContent, distributeContent } from '../services';

interface ContentData {
  content: string;
}

interface ContentResult {
  success: boolean;
  data?: ContentData;
  error?: string;
}

// API route to generate and distribute content using MCP approach
export async function GET(request: Request) {
  try {
    // Get content type from query params
    const url = new URL(request.url);
    const contentType = url.searchParams.get('type');
    
    if (!contentType || !['market_update', 'price_alert', 'trending_coins'].includes(contentType)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid content type. Must be one of: market_update, price_alert, trending_coins' 
      }, { status: 400 });
    }
    
    // Generate content
    const mcpResponse = await generateDistributableContent(contentType as 'market_update' | 'price_alert' | 'trending_coins');
    const contentResult: ContentResult = {
      success: mcpResponse.success,
      data: mcpResponse.data ? { content: mcpResponse.data as string } : undefined,
      error: mcpResponse.error
    };
    
    if (!contentResult.success) {
      return NextResponse.json({ 
        success: false, 
        error: contentResult.error || 'Failed to generate content' 
      }, { status: 500 });
    }
    
    // Get distribution channels
    const channelsParam = url.searchParams.get('channels') || 'social,rss';
    const channels = channelsParam.split(',') as ('social' | 'email' | 'rss' | 'webpush')[];
    
    // Ensure content exists before distribution
    if (!contentResult.data?.content) {
      return NextResponse.json({ 
        success: false, 
        error: 'No content available for distribution' 
      }, { status: 500 });
    }
      // Distribute the content
    const distributionResult = await distributeContent(
      String(contentResult.data.content),
      channels
    );
    
    return NextResponse.json({
      success: true,
      message: 'Content generated and distributed successfully',
      content: contentResult.data?.content,
      distribution: distributionResult.data,
      timestamp: new Date().toISOString()
    });  } catch (error) {
    console.error('Error in content generation and distribution:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate and distribute content',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
