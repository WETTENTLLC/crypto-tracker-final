import { NextResponse } from 'next/server';

interface AnalyticsEvent {
  eventName: string;
  eventData: Record<string, unknown>;
  timestamp: string;
  sessionId: string;
  userAgent: string;
}

// In-memory storage for analytics data (in a production app, this would be a database)
let analyticsEvents: AnalyticsEvent[] = [];

// API route to handle custom analytics tracking
export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Handle both 'eventName' and legacy 'event' field for backwards compatibility
    const eventName = data.eventName || data.event;
    const eventData = data.eventData || data;
    
    if (!eventName) {
      return NextResponse.json({ 
        success: false, 
        error: 'Event name is required (use eventName or event field)' 
      }, { status: 400 });
    }

    // Store the event
    const event = {
      eventName,
      eventData: eventData || {},
      timestamp: new Date().toISOString(),
      sessionId: data.sessionId || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    };
    
    analyticsEvents.push(event);
    
    // Keep only the most recent 1000 events to prevent memory issues
    if (analyticsEvents.length > 1000) {
      analyticsEvents = analyticsEvents.slice(analyticsEvents.length - 1000);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully',
      eventId: analyticsEvents.length
    });  } catch (error: unknown) {
    console.error('Error tracking analytics event:', error);
    console.error('Request body might be invalid. Expected format: { eventName: string, eventData?: object }');
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to track event. Make sure to include eventName in your request.' 
    }, { status: 500 });
  }
}

// API route to retrieve analytics data (for admin dashboard)
export async function GET(request: Request) {
  try {
    // In a real app, you would authenticate this request
    // For now, we'll return all events
    
    // Get query parameters
    const url = new URL(request.url);
    const eventName = url.searchParams.get('eventName');
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    
    // Filter events if eventName is provided
    let filteredEvents = analyticsEvents;
    if (eventName) {
      filteredEvents = analyticsEvents.filter(event => event.eventName === eventName);
    }
    
    // Apply pagination
    const paginatedEvents = filteredEvents.slice(
      Math.max(0, filteredEvents.length - offset - limit),
      Math.max(0, filteredEvents.length - offset)
    ).reverse();
    
    return NextResponse.json({
      success: true,
      data: {
        events: paginatedEvents,
        total: filteredEvents.length,
        limit,
        offset
      }
    });
  } catch (error: unknown) {
    console.error('Error retrieving analytics data:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to retrieve analytics data' 
    }, { status: 500 });
  }
}
