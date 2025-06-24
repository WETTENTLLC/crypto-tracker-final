import { NextRequest, NextResponse } from 'next/server';

interface AnalyticsEvent {
  timestamp: string;
  event: string;
  page: string;
  userAgent?: string;
  ip?: string;
  referrer?: string;
}

// Simple in-memory storage (in production, use a database)
let analyticsData: AnalyticsEvent[] = [];

export async function POST(request: NextRequest) {
  try {
    const { event, page, metadata } = await request.json();
    
    const analyticsEvent: AnalyticsEvent = {
      timestamp: new Date().toISOString(),
      event,
      page,
      userAgent: request.headers.get('user-agent') || undefined,
      ip: request.ip || request.headers.get('x-forwarded-for') || undefined,
      referrer: request.headers.get('referer') || undefined,
      ...metadata
    };
    
    analyticsData.push(analyticsEvent);
    
    // Keep only last 1000 events to prevent memory issues
    if (analyticsData.length > 1000) {
      analyticsData = analyticsData.slice(-1000);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }
}

export async function GET() {
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const recent24h = analyticsData.filter(event => new Date(event.timestamp) > last24Hours);
  const recent7d = analyticsData.filter(event => new Date(event.timestamp) > last7Days);
  
  const stats = {
    total: {
      pageViews: analyticsData.filter(e => e.event === 'page_view').length,
      premiumClicks: analyticsData.filter(e => e.event === 'premium_click').length,
      paymentAttempts: analyticsData.filter(e => e.event === 'payment_attempt').length,
      paymentSuccess: analyticsData.filter(e => e.event === 'payment_success').length,
      emailSignups: analyticsData.filter(e => e.event === 'email_signup').length,
    },
    last24h: {
      pageViews: recent24h.filter(e => e.event === 'page_view').length,
      premiumClicks: recent24h.filter(e => e.event === 'premium_click').length,
      paymentAttempts: recent24h.filter(e => e.event === 'payment_attempt').length,
      paymentSuccess: recent24h.filter(e => e.event === 'payment_success').length,
      emailSignups: recent24h.filter(e => e.event === 'email_signup').length,
    },
    last7d: {
      pageViews: recent7d.filter(e => e.event === 'page_view').length,
      premiumClicks: recent7d.filter(e => e.event === 'premium_click').length,
      paymentAttempts: recent7d.filter(e => e.event === 'payment_attempt').length,
      paymentSuccess: recent7d.filter(e => e.event === 'payment_success').length,
      emailSignups: recent7d.filter(e => e.event === 'email_signup').length,
    },
    conversionRate: {
      premiumToPayment: recent7d.filter(e => e.event === 'premium_click').length > 0 
        ? (recent7d.filter(e => e.event === 'payment_attempt').length / recent7d.filter(e => e.event === 'premium_click').length * 100).toFixed(2)
        : '0',
      paymentSuccess: recent7d.filter(e => e.event === 'payment_attempt').length > 0
        ? (recent7d.filter(e => e.event === 'payment_success').length / recent7d.filter(e => e.event === 'payment_attempt').length * 100).toFixed(2)
        : '0'
    },
    recentEvents: analyticsData.slice(-20).reverse()
  };
  
  return NextResponse.json(stats);
}