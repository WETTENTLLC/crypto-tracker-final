import { NextRequest, NextResponse } from 'next/server';
import { getCoins, getGlobalData, getTrendingCoins } from '../../../lib/multiSourceCryptoService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'coins';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    let data;
    
    switch (type) {
      case 'coins':
        data = await getCoins(page, limit);
        break;
      case 'global':
        data = await getGlobalData();
        break;
      case 'trending':
        data = await getTrendingCoins();
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid type parameter' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data,
      type,
      page: type === 'coins' ? page : undefined,
      limit: type === 'coins' ? limit : undefined,
      timestamp: new Date().toISOString(),
      source: 'Multi-Source Crypto Service'
    });
  } catch (error) {
    console.error('[Multi-Source Crypto API Error]:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'All cryptocurrency data sources are currently unavailable. Please try again later.',
        timestamp: new Date().toISOString()
      },
      { status: 503 } // Service Unavailable
    );
  }
}
