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
    
    console.log('[Analytics API POST] Received data:', JSON.stringify(data, null, 2)); // DEBUG LOG

    if (!eventName) {
      console.log('[Analytics API POST] Event name missing'); // DEBUG LOG
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
    console.log(`[Analytics API POST] Event '${eventName}' tracked. Timestamp: ${event.timestamp}. Total events now: ${analyticsEvents.length}`); // DEBUG LOG
    
    // Keep only the most recent 1000 events to prevent memory issues
    if (analyticsEvents.length > 1000) {
      analyticsEvents = analyticsEvents.slice(analyticsEvents.length - 1000);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully',
      eventId: analyticsEvents.length // Note: This is current length, not a unique ID for this event
    });
  } catch (error: unknown) {
    console.error('[Analytics API POST] Error tracking analytics event:', error);
    console.error('[Analytics API POST] Request body might be invalid. Expected format: { eventName: string, eventData?: object }');
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
    const date = url.searchParams.get('date'); // Added date parameter
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    console.log(`[Analytics API GET] Request params: eventName=${eventName}, date=${date}, limit=${limit}, offset=${offset}`); // DEBUG LOG
    console.log(`[Analytics API GET] Current analyticsEvents count before filtering: ${analyticsEvents.length}`); // DEBUG LOG
    // For very detailed debugging, uncomment the next line, but be cautious with large arrays:
    // console.log(`[Analytics API GET] All events before filtering: ${JSON.stringify(analyticsEvents, null, 2)}`);
    
    // Filter events if eventName is provided
    let filteredEvents = analyticsEvents;
    if (eventName) {
      filteredEvents = analyticsEvents.filter(event => event.eventName === eventName);
      console.log(`[Analytics API GET] Events after eventName filter ('${eventName}'): ${filteredEvents.length}`); // DEBUG LOG
    }

    // Filter events if date is provided
    if (date) {
      filteredEvents = filteredEvents.filter(event => event.timestamp.startsWith(date));
      console.log(`[Analytics API GET] Events after date filter ('${date}'): ${filteredEvents.length}`); // DEBUG LOG
    }
    
    // Apply pagination
    const paginatedEvents = filteredEvents.slice(
      Math.max(0, filteredEvents.length - offset - limit),
      Math.max(0, filteredEvents.length - offset)
    ).reverse(); // Reverse to get most recent first
    
    console.log(`[Analytics API GET] Returning ${paginatedEvents.length} paginated events.`); // DEBUG LOG
    
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
    console.error('[Analytics API GET] Error retrieving analytics data:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to retrieve analytics data' 
    }, { status: 500 });
  }
}
