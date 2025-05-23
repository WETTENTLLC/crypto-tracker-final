# Analytics API Issue Investigation Guide

## Issue Overview
The `/api/mcp/analytics` endpoint is returning a 400 Bad Request error when called with POST requests containing event data.

## Current Status
- **Endpoint**: https://crypto-tracker-no-modules-5zoj9kynx-wettentllcs-projects.vercel.app/api/mcp/analytics
- **Method**: POST
- **Response Code**: 400 Bad Request
- **Impact**: Unable to track user interactions and page views

## Troubleshooting Steps

### 1. Examine Route Implementation

Let's review the current implementation of the analytics API route:

```typescript
// Path: src/app/api/mcp/analytics/route.ts
import { NextResponse } from 'next/server';
import { trackEvent } from '../services';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Required parameters validation
    if (!body.event) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required parameter: event' 
      }, { status: 400 });
    }
    
    // Additional validation might be present here
    
    const result = await trackEvent(body.event, body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Event tracked successfully',
      data: result.data
    });
  } catch (error) {
    console.error('Error tracking event:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to track event' 
    }, { status: 500 });
  }
}
```

### 2. Check TrackEvent Implementation

Review the implementation of the `trackEvent` function in `services.ts`:

```typescript
// Path: src/app/api/mcp/services.ts
export const trackEvent = async (
  eventName: string,
  eventData: Record<string, any>
): Promise<MCPResponse> => {
  try {
    // Validation logic may be present here
    
    // Processing logic
    
    return {
      success: true,
      message: 'Event tracked successfully',
      data: {
        eventId: generateMockId(),
        eventName,
        timestamp: new Date().toISOString(),
        // Other data
      },
      timestamp: new Date().toISOString(),
      serviceType: 'analytics'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to track event',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      serviceType: 'analytics'
    };
  }
};
```

### 3. Common Causes of 400 Bad Request

1. **Missing Required Fields**: The API may be expecting specific fields beyond just `event`
2. **Invalid Data Type**: A field might be the wrong data type (e.g., string instead of number)
3. **Malformed JSON**: The request body might not be valid JSON
4. **Strict Validation**: The API might have strict validation rules for field formats

### 4. Solution Approaches

#### Solution 1: Simplify Request Schema

Create a minimal valid request that includes only the essential fields:

```typescript
const minimalBody = {
  event: "page_view",
  timestamp: new Date().toISOString()
};
```

#### Solution 2: Check for Additional Required Fields

Review the implementation for all required fields validation:

```typescript
// Possible validation in route.ts or services.ts
if (!body.event || !body.userId || !body.timestamp) {
  return NextResponse.json({ 
    success: false, 
    error: 'Missing required parameters' 
  }, { status: 400 });
}
```

#### Solution 3: Fix Data Type Issues

Ensure all fields have the correct data types:

```typescript
// Example fix
const body = {
  event: "page_view",
  page: "/dashboard",
  userId: "test-user-123", // Must be string
  properties: {
    referrer: "direct",
    device: "desktop"
  },
  timestamp: new Date().toISOString() // Must be ISO string
};
```

### 5. Temporary Workaround

If needed, implement a temporary client-side workaround to avoid blocking user experience:

```typescript
// Client-side code
const trackAnalytics = async (event, data) => {
  try {
    const response = await fetch('/api/mcp/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, ...data })
    });
    
    if (!response.ok) {
      // Fall back to localStorage tracking
      const localEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      localEvents.push({ 
        event, 
        ...data, 
        timestamp: new Date().toISOString(),
        failed: true
      });
      localStorage.setItem('analytics_events', JSON.stringify(localEvents));
      console.warn('Falling back to local storage for analytics');
    }
  } catch (error) {
    console.error('Analytics error:', error);
  }
};
```

## Testing the Fix

Once the issue is identified and fixed, test with the following request:

```bash
$body = @{
    event = "page_view"
    page = "/dashboard"
    timestamp = (Get-Date).ToString("o")
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://crypto-tracker-no-modules-5zoj9kynx-wettentllcs-projects.vercel.app/api/mcp/analytics" -Method POST -Body $body -ContentType "application/json"
```

## Expected Response

```json
{
  "success": true,
  "message": "Event tracked successfully",
  "data": {
    "eventId": "mock_abc123",
    "eventName": "page_view",
    "timestamp": "2025-05-23T12:00:00.000Z"
  }
}
```
