# Model Context Protocol (MCP) for Crypto Tracker

This document explains how the Crypto Tracker application uses the Model Context Protocol (MCP) approach to implement user acquisition automations without requiring real social media accounts.

## Overview

Instead of direct API integrations with social media platforms, our MCP implementation provides:

1. **Mock services** for development and testing
2. **Analytics aggregation** for tracking without direct integrations
3. **Webhook-based approaches** for events and automation
4. **Local storage** for email subscriptions and analytics

## Architecture

The MCP implementation consists of several components:

### 1. Configuration (src/app/api/mcp/config.ts)

Defines service types and settings:
- Mock services: simulate responses without real API calls
- Aggregator services: combine multiple data sources
- Webhook services: event-based communication
- Analytics services: track user behavior

### 2. Service Implementation (src/app/api/mcp/services.ts)

Provides the core functionality:
- Social media content sharing simulation
- Email subscription handling
- Analytics event tracking
- Content generation and distribution

### 3. API Endpoints

- `/api/mcp/email-capture`: Handles email subscriptions
- `/api/mcp/analytics`: Tracks user events
- `/api/mcp/content`: Generates and distributes content

### 4. Frontend Component (src/app/components/MCPUserAcquisitionAutomation.tsx)

- Implements client-side tracking
- Provides email capture popup
- Works with or without real analytics services

## Benefits of the MCP Approach

1. **No Real Accounts Required**: You can develop and test without actual social media accounts
2. **Local Data Storage**: User data is stored locally during development
3. **Graceful Degradation**: Falls back to mock services when real ones aren't available
4. **Unified Interface**: Consistent API regardless of the backend implementation
5. **Privacy-Focused**: Can operate without sending data to third parties
6. **Cost-Effective**: No API usage fees during development

## How to Use

### Configuration

Environment variables in `.env.local` or `.env.production`:

```
MCP_ENABLED=true
MCP_STORAGE_PATH=./mcp-data
MCP_LOG_LEVEL=info
```

### Development vs. Production

- In development: uses mock services by default
- In production: uses real services when credentials are available, falls back to mock otherwise

### Email Subscription

The system captures emails even without a real email service:
- Stores subscriptions locally during development
- Uses Mailchimp when credentials are available

### Analytics

Tracks user behavior:
- Stores events locally during development
- Sends to Google Analytics when configured

### Content Generation

Creates and distributes content:
- Generates realistic market updates
- Simulates social media sharing
- Provides RSS feed for content syndication

## Extending the MCP Approach

To add new functionality:

1. Add new service configuration to `config.ts`
2. Implement the service in `services.ts`
3. Create API endpoints as needed
4. Update the frontend component to use the new service

## Migration to Real Services

When you're ready to use real social media services:

1. Obtain API credentials for each platform
2. Add them to your environment variables (uncomment the relevant sections)
3. The system will automatically use real services when credentials are available

No code changes are required to switch from mock to real services!
