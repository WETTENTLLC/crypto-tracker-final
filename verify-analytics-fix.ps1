# Analytics API Fix Verification Script
# This script tests the analytics API endpoint with both formats of event data

$BaseUrl = "https://crypto-tracker-no-modules-5zoj9kynx-wettentllcs-projects.vercel.app"

Write-Host "Testing Analytics API Fix..." -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan

# Test with 'event' field (legacy format)
Write-Host "`nTest 1: Using 'event' field (legacy format)" -ForegroundColor Yellow
$body1 = @{
    event = "page_view"
    sessionId = "test_session_$(Get-Random)"
    data = @{
        page = "/dashboard"
    }
} | ConvertTo-Json

try {
    $response1 = Invoke-RestMethod -Uri "$BaseUrl/api/mcp/analytics" -Method POST -Body $body1 -ContentType "application/json" 
    Write-Host "SUCCESS: API accepted legacy format" -ForegroundColor Green
    Write-Host "Response: $($response1 | ConvertTo-Json)" -ForegroundColor Gray
} catch {
    Write-Host "FAILURE: API rejected legacy format" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}

# Test with 'eventName' field (new format)
Write-Host "`nTest 2: Using 'eventName' field (new format)" -ForegroundColor Yellow
$body2 = @{
    eventName = "button_click"
    eventData = @{
        buttonId = "cta-premium"
        location = "header"
    }
    sessionId = "test_session_$(Get-Random)"
} | ConvertTo-Json

try {
    $response2 = Invoke-RestMethod -Uri "$BaseUrl/api/mcp/analytics" -Method POST -Body $body2 -ContentType "application/json" 
    Write-Host "SUCCESS: API accepted new format" -ForegroundColor Green
    Write-Host "Response: $($response2 | ConvertTo-Json)" -ForegroundColor Gray
} catch {
    Write-Host "FAILURE: API rejected new format" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}

# Test GET endpoint to retrieve stored events
Write-Host "`nTest 3: Retrieving analytics data" -ForegroundColor Yellow
try {
    $response3 = Invoke-RestMethod -Uri "$BaseUrl/api/mcp/analytics" -Method GET
    Write-Host "SUCCESS: Retrieved analytics data" -ForegroundColor Green
    Write-Host "Total events: $($response3.data.total)" -ForegroundColor Gray
    
    if ($response3.data.events.Count -gt 0) {
        Write-Host "Latest event: $($response3.data.events[0] | ConvertTo-Json)" -ForegroundColor Gray
    }
} catch {
    Write-Host "FAILURE: Could not retrieve analytics data" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host "`nVerification Complete!" -ForegroundColor Cyan
