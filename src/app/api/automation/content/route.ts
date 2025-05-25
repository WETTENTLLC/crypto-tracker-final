import { NextResponse } from 'next/server';
import { generateMarketUpdate } from '../../userAcquisition';

// API route to generate and schedule automated content
export async function GET() {
  try {
    // Get API keys from environment variables
    const coingeckoApiKey = process.env.COINGECKO_API_KEY;
    
    // Twitter API config
    const twitterConfig = {
      apiKey: process.env.TWITTER_API_KEY,
      apiSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    };
    
    // Facebook API config
    const facebookConfig = {
      appId: process.env.FACEBOOK_APP_ID,
      appSecret: process.env.FACEBOOK_APP_SECRET,
      pageId: process.env.FACEBOOK_PAGE_ID
    };
    
    // Validate required API keys
    if (!coingeckoApiKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'CoinGecko API key not configured' 
      }, { status: 500 });
    }
    
    // Generate market update content
    const marketUpdate = await generateMarketUpdate(coingeckoApiKey);
    
    // If social media credentials are available, post the content
    const socialShares = [];
    
    // Dynamically import to avoid issues with server components
    const { shareToTwitter, shareToFacebook } = await import('../../userAcquisition');
    
    // Share to Twitter if configured
    if (twitterConfig.apiKey && twitterConfig.apiSecret && 
        twitterConfig.accessToken && twitterConfig.accessTokenSecret) {
      try {
        const twitterResult = await shareToTwitter(
          marketUpdate.content,
          twitterConfig.apiKey,
          twitterConfig.apiSecret,
          twitterConfig.accessToken,
          twitterConfig.accessTokenSecret
        );
        socialShares.push({ platform: 'twitter', result: twitterResult });
      } catch (error) {
        console.error('Error sharing to Twitter:', error);
        socialShares.push({ platform: 'twitter', error: 'Failed to share' });
      }
    }
    
    // Share to Facebook if configured
    if (facebookConfig.appId && facebookConfig.appSecret && facebookConfig.pageId) {
      try {
        const facebookResult = await shareToFacebook(
          marketUpdate.content,
          facebookConfig.pageId,
          process.env.FACEBOOK_ACCESS_TOKEN || ''
        );
        socialShares.push({ platform: 'facebook', result: facebookResult });
      } catch (error) {
        console.error('Error sharing to Facebook:', error);
        socialShares.push({ platform: 'facebook', error: 'Failed to share' });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Automated content generated successfully',
      content: marketUpdate.content,
      socialShares: socialShares.length > 0 ? socialShares : 'No social shares configured',
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
