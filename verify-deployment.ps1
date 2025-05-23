# Automated Deployment Verification Script

<#
.SYNOPSIS
    Verifies the deployment of the Cryptocurrency Tracker application.
.DESCRIPTION
    This script tests all critical API endpoints and functionality of the Cryptocurrency Tracker
    application after deployment to ensure everything is working correctly.
.PARAMETER BaseUrl
    The base URL of the deployed application.
.EXAMPLE
    .\verify-deployment.ps1 -BaseUrl "https://crypto-tracker-no-modules-5zoj9kynx-wettentllcs-projects.vercel.app"
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$BaseUrl
)

# Set error action preference
$ErrorActionPreference = "Continue"

# Initialize results tracking
$results = @{
    Pass = 0
    Fail = 0
    Warnings = 0
    TotalTests = 0
}

# Helper function to log test results
function Log-TestResult {
    param(
        [string]$TestName,
        [bool]$Success,
        [string]$Message,
        [string]$ExpectedResult,
        [string]$ActualResult,
        [bool]$Warning = $false
    )
    
    $results.TotalTests++
    
    if ($Success) {
        $results.Pass++
        Write-Host "✅ PASS: $TestName" -ForegroundColor Green
    } elseif ($Warning) {
        $results.Warnings++
        Write-Host "⚠️ WARNING: $TestName" -ForegroundColor Yellow
    } else {
        $results.Fail++
        Write-Host "❌ FAIL: $TestName" -ForegroundColor Red
    }
    
    Write-Host "  $Message"
    
    if ($ExpectedResult) {
        Write-Host "  Expected: $ExpectedResult" -ForegroundColor Cyan
    }
    
    if ($ActualResult) {
        if (-not $Success -and -not $Warning) {
            Write-Host "  Actual: $ActualResult" -ForegroundColor Red
        } else {
            Write-Host "  Actual: $ActualResult" -ForegroundColor Cyan
        }
    }
    
    Write-Host ""
}

# Helper function to measure response time
function Measure-ResponseTime {
    param(
        [ScriptBlock]$ScriptBlock
    )
    
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    $result = & $ScriptBlock
    $sw.Stop()
    
    return @{
        Result = $result
        ElapsedMilliseconds = $sw.ElapsedMilliseconds
    }
}

# Display script header
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  Cryptocurrency Tracker Deployment Verification       " -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "Testing deployment at: $BaseUrl" -ForegroundColor Cyan
Write-Host "Started at: $(Get-Date)" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if the main page is accessible
try {
    $test = Measure-ResponseTime { Invoke-WebRequest -Uri $BaseUrl -UseBasicParsing }
    $statusCode = $test.Result.StatusCode
    $responseTime = $test.ElapsedMilliseconds
    
    Log-TestResult -TestName "Main Page Accessibility" -Success ($statusCode -eq 200) `
        -Message "Main page should return HTTP 200" `
        -ExpectedResult "HTTP 200" `
        -ActualResult "HTTP $statusCode (Response Time: $responseTime ms)"
    
    # Check response time as a separate test
    Log-TestResult -TestName "Main Page Response Time" -Success ($responseTime -lt 3000) `
        -Warning ($responseTime -ge 3000 -and $responseTime -lt 5000) `
        -Message "Main page should load in under 3 seconds" `
        -ExpectedResult "< 3000 ms" `
        -ActualResult "$responseTime ms"
} catch {
    Log-TestResult -TestName "Main Page Accessibility" -Success $false `
        -Message "Failed to access the main page" `
        -ActualResult $_.Exception.Message
}

# Test 2: Check Market Update API
try {
    $test = Measure-ResponseTime { Invoke-RestMethod -Uri "$BaseUrl/api/mcp/content?type=market_update" -Method GET }
    $result = $test.Result
    $responseTime = $test.ElapsedMilliseconds
    
    Log-TestResult -TestName "Market Update API" -Success ($result.success -eq $true) `
        -Message "Market Update API should return successful response" `
        -ExpectedResult "success: true" `
        -ActualResult "success: $($result.success), Response Time: $responseTime ms"
    
    # Check if content is not empty
    Log-TestResult -TestName "Market Update Content" -Success (-not [string]::IsNullOrWhiteSpace($result.content)) `
        -Message "Market Update API should return non-empty content" `
        -ExpectedResult "Non-empty content" `
        -ActualResult "Content length: $($result.content.Length) characters"
    
    # Check response time as a separate test
    Log-TestResult -TestName "Market Update API Response Time" -Success ($responseTime -lt 1000) `
        -Warning ($responseTime -ge 1000) `
        -Message "Market Update API should respond quickly" `
        -ExpectedResult "< 1000 ms" `
        -ActualResult "$responseTime ms"
} catch {
    Log-TestResult -TestName "Market Update API" -Success $false `
        -Message "Failed to access the Market Update API" `
        -ActualResult $_.Exception.Message
}

# Test 3: Check Trending Coins API
try {
    $test = Measure-ResponseTime { Invoke-RestMethod -Uri "$BaseUrl/api/mcp/content?type=trending_coins" -Method GET }
    $result = $test.Result
    $responseTime = $test.ElapsedMilliseconds
    
    Log-TestResult -TestName "Trending Coins API" -Success ($result.success -eq $true) `
        -Message "Trending Coins API should return successful response" `
        -ExpectedResult "success: true" `
        -ActualResult "success: $($result.success), Response Time: $responseTime ms"
      # Check if content contains trending coins
    $hasTrendingCoins = $result.content -match "Trending Coins"
    Log-TestResult -TestName "Trending Coins Content" -Success $hasTrendingCoins `
        -Message "Trending Coins API should return content with trending coins" `
        -ExpectedResult "Content with 'Trending Coins'" `
        -ActualResult "Content $(if ($hasTrendingCoins) { 'contains' } else { 'does not contain' }) 'Trending Coins'"
} catch {
    Log-TestResult -TestName "Trending Coins API" -Success $false `
        -Message "Failed to access the Trending Coins API" `
        -ActualResult $_.Exception.Message
}

# Test 4: Check Price Alert API
try {
    $test = Measure-ResponseTime { Invoke-RestMethod -Uri "$BaseUrl/api/mcp/content?type=price_alert" -Method GET }
    $result = $test.Result
    $responseTime = $test.ElapsedMilliseconds
    
    Log-TestResult -TestName "Price Alert API" -Success ($result.success -eq $true) `
        -Message "Price Alert API should return successful response" `
        -ExpectedResult "success: true" `
        -ActualResult "success: $($result.success), Response Time: $responseTime ms"
      # Check if content contains price alert
    $hasPriceAlert = $result.content -match "Price Alert"
    Log-TestResult -TestName "Price Alert Content" -Success $hasPriceAlert `
        -Message "Price Alert API should return content with price alert" `
        -ExpectedResult "Content with 'Price Alert'" `
        -ActualResult "Content $(if ($hasPriceAlert) { 'contains' } else { 'does not contain' }) 'Price Alert'"
} catch {
    Log-TestResult -TestName "Price Alert API" -Success $false `
        -Message "Failed to access the Price Alert API" `
        -ActualResult $_.Exception.Message
}

# Test 5: Check RSS Feed
try {
    $test = Measure-ResponseTime { Invoke-RestMethod -Uri "$BaseUrl/api/rss" -Method GET }
    $result = $test.Result
    $responseTime = $test.ElapsedMilliseconds
    
    # Check if RSS feed has items
    $hasItems = $result -is [array] -and $result.Count -gt 0
    Log-TestResult -TestName "RSS Feed" -Success $hasItems `
        -Message "RSS Feed should return feed items" `
        -ExpectedResult "Array with items" `
        -ActualResult "Received $($result.Count) items, Response Time: $responseTime ms"
} catch {
    Log-TestResult -TestName "RSS Feed" -Success $false `
        -Message "Failed to access the RSS Feed" `
        -ActualResult $_.Exception.Message
}

# Test 6: Check Email Capture API
try {
    $body = @{
        email = "test@example.com"
        name = "Test User"
    } | ConvertTo-Json
    
    $test = Measure-ResponseTime { 
        Invoke-RestMethod -Uri "$BaseUrl/api/mcp/email-capture" -Method POST -Body $body -ContentType "application/json" 
    }
    $result = $test.Result
    $responseTime = $test.ElapsedMilliseconds
    
    Log-TestResult -TestName "Email Capture API" -Success ($result.success -eq $true) `
        -Message "Email Capture API should return successful response" `
        -ExpectedResult "success: true" `
        -ActualResult "success: $($result.success), Response Time: $responseTime ms"
} catch {
    Log-TestResult -TestName "Email Capture API" -Success $false `
        -Message "Failed to access the Email Capture API" `
        -ActualResult $_.Exception.Message
}

# Test 7: Check Analytics API (expected to fail based on validation results)
try {
    $body = @{
        event = "page_view"
        page = "/dashboard"
    } | ConvertTo-Json
    
    $test = Measure-ResponseTime { 
        Invoke-RestMethod -Uri "$BaseUrl/api/mcp/analytics" -Method POST -Body $body -ContentType "application/json" 
    }
    $result = $test.Result
    $responseTime = $test.ElapsedMilliseconds
    
    Log-TestResult -TestName "Analytics API" -Success ($result.success -eq $true) `
        -Message "Analytics API should return successful response" `
        -ExpectedResult "success: true" `
        -ActualResult "success: $($result.success), Response Time: $responseTime ms"
} catch {
    # We expect this to fail based on previous testing
    $statusCode = $_.Exception.Response.StatusCode.value__
    Log-TestResult -TestName "Analytics API" -Success $false `
        -Message "Analytics API returned an error (known issue)" `
        -ExpectedResult "success: true" `
        -ActualResult "HTTP $statusCode - $($_.Exception.Message)"
}

# Test 8: Check Dashboard Page
try {
    $test = Measure-ResponseTime { Invoke-WebRequest -Uri "$BaseUrl/dashboard" -UseBasicParsing }
    $statusCode = $test.Result.StatusCode
    $responseTime = $test.ElapsedMilliseconds
    
    Log-TestResult -TestName "Dashboard Page Accessibility" -Success ($statusCode -eq 200) `
        -Message "Dashboard page should return HTTP 200" `
        -ExpectedResult "HTTP 200" `
        -ActualResult "HTTP $statusCode (Response Time: $responseTime ms)"
} catch {
    Log-TestResult -TestName "Dashboard Page Accessibility" -Success $false `
        -Message "Failed to access the dashboard page" `
        -ActualResult $_.Exception.Message
}

# Test 9: Check Coin Detail Page (e.g., Bitcoin)
try {
    $test = Measure-ResponseTime { Invoke-WebRequest -Uri "$BaseUrl/coin/bitcoin" -UseBasicParsing }
    $statusCode = $test.Result.StatusCode
    $responseTime = $test.ElapsedMilliseconds
    
    Log-TestResult -TestName "Coin Detail Page Accessibility" -Success ($statusCode -eq 200) `
        -Message "Bitcoin detail page should return HTTP 200" `
        -ExpectedResult "HTTP 200" `
        -ActualResult "HTTP $statusCode (Response Time: $responseTime ms)"
} catch {
    Log-TestResult -TestName "Coin Detail Page Accessibility" -Success $false `
        -Message "Failed to access the Bitcoin detail page" `
        -ActualResult $_.Exception.Message
}

# Test 10: Check Premium Page
try {
    $test = Measure-ResponseTime { Invoke-WebRequest -Uri "$BaseUrl/premium" -UseBasicParsing }
    $statusCode = $test.Result.StatusCode
    $responseTime = $test.ElapsedMilliseconds
    
    Log-TestResult -TestName "Premium Page Accessibility" -Success ($statusCode -eq 200) `
        -Message "Premium page should return HTTP 200" `
        -ExpectedResult "HTTP 200" `
        -ActualResult "HTTP $statusCode (Response Time: $responseTime ms)"
} catch {
    Log-TestResult -TestName "Premium Page Accessibility" -Success $false `
        -Message "Failed to access the premium page" `
        -ActualResult $_.Exception.Message
}

# Display summary
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "                 Test Summary                          " -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "Total Tests: $($results.TotalTests)" -ForegroundColor White
Write-Host "Passed: $($results.Pass)" -ForegroundColor Green
Write-Host "Warnings: $($results.Warnings)" -ForegroundColor Yellow
Write-Host "Failed: $($results.Fail)" -ForegroundColor Red
Write-Host "Success Rate: $([math]::Round(($results.Pass / $results.TotalTests) * 100, 2))%" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "Finished at: $(Get-Date)" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

# Exit with status code based on test results
if ($results.Fail -gt 0) {
    Write-Host "⚠️ Deployment verification detected issues that need attention." -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "✅ Deployment verification completed successfully!" -ForegroundColor Green
    exit 0
}
