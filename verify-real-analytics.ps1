# Analytics Real Data Validator
# This script checks that the application is using real analytics data instead of demo data

param(
    [switch]$Verbose
)

$ErrorActionPreference = "Stop"

Write-Host "🔍 Validating real analytics data implementation..." -ForegroundColor Cyan

# Array to track files checked
$FilesChecked = @()
$Issues = @()

# Function to check a file for demo/simulated data patterns
function Check-FileForDemoData {
    param (
        [string]$FilePath,
        [string[]]$Patterns
    )
    
    if (Test-Path $FilePath) {
        $FilesChecked += $FilePath
        $FileContent = Get-Content $FilePath -Raw
        
        foreach ($Pattern in $Patterns) {
            $Matches = Select-String -Path $FilePath -Pattern $Pattern -AllMatches
            
            if ($Matches.Matches.Count -gt 0) {
                $Issues += "Found potential demo data in $FilePath matching pattern: $Pattern"
                
                if ($Verbose) {
                    Write-Host "`nDetailed matches in $FilePath for pattern '$Pattern':" -ForegroundColor Yellow
                    $LineNumber = 0
                    foreach ($Line in (Get-Content $FilePath)) {
                        $LineNumber++
                        if ($Line -match $Pattern) {
                            Write-Host "   Line $LineNumber: $Line" -ForegroundColor Yellow
                        }
                    }
                }
            }
        }
    } else {
        Write-Host "⚠️ File not found: $FilePath" -ForegroundColor Yellow
    }
}

# Define patterns that might indicate demo/simulated data
$DemoDataPatterns = @(
    "(?<!\w)simulated?(?!\w)",
    "(?<!\w)mock(?!\w)",
    "(?<!\w)fake(?!\w)",
    "(?<!\w)dummy(?!\w)",
    "Math\.random\(\)",
    "(?<!\w)random(?!\w)",
    "demo.data",
    "hard-?coded",
    "placeholder",
    "sample.data"
)

# Check key files
$AdminDashboardPath = Join-Path $PSScriptRoot "src\app\admin\dashboard\page.tsx"
$AdminAnalyticsPath = Join-Path $PSScriptRoot "src\app\admin\analytics\page.tsx"
$RevenueTrackerPath = Join-Path $PSScriptRoot "revenue-tracker.js"
$AnalyticsApiPath = Join-Path $PSScriptRoot "src\app\api\mcp\analytics\route.ts"
$MCPConfigPath = Join-Path $PSScriptRoot "src\app\api\mcp\config.ts"
$MCPServicesPath = Join-Path $PSScriptRoot "src\app\api\mcp\services.ts"

Write-Host "Checking admin dashboard for demo data..." -ForegroundColor Yellow
Check-FileForDemoData -FilePath $AdminDashboardPath -Patterns $DemoDataPatterns

Write-Host "Checking admin analytics page for demo data..." -ForegroundColor Yellow
Check-FileForDemoData -FilePath $AdminAnalyticsPath -Patterns $DemoDataPatterns

Write-Host "Checking revenue tracker for demo data..." -ForegroundColor Yellow
Check-FileForDemoData -FilePath $RevenueTrackerPath -Patterns $DemoDataPatterns

Write-Host "Checking analytics API for demo data..." -ForegroundColor Yellow
Check-FileForDemoData -FilePath $AnalyticsApiPath -Patterns $DemoDataPatterns

Write-Host "Checking MCP config for demo settings..." -ForegroundColor Yellow
Check-FileForDemoData -FilePath $MCPConfigPath -Patterns $DemoDataPatterns

Write-Host "Checking MCP services for demo implementations..." -ForegroundColor Yellow
Check-FileForDemoData -FilePath $MCPServicesPath -Patterns $DemoDataPatterns

# Special check for in-memory storage in the analytics API
if (Test-Path $AnalyticsApiPath) {
    $AnalyticsApiContent = Get-Content $AnalyticsApiPath -Raw
    
    if ($AnalyticsApiContent -match "In-memory storage for analytics data") {
        $Issues += "Analytics API is using in-memory storage instead of a persistent database"
    }
}

# Check for hardcoded values in component state
if (Test-Path $AdminDashboardPath) {
    $DashboardContent = Get-Content $AdminDashboardPath -Raw
    
    if ($DashboardContent -match "useState\(\{\s*totalUsers:\s*\d+,") {
        $Issues += "Admin dashboard has hardcoded initial state values"
    }
}

# Report findings
Write-Host "`n📊 Analytics Validation Results:" -ForegroundColor Cyan
Write-Host "Checked $($FilesChecked.Count) files for demo/simulated data patterns." -ForegroundColor White

if ($Issues.Count -gt 0) {
    Write-Host "`n⚠️ Found $($Issues.Count) potential issues:" -ForegroundColor Yellow
    foreach ($Issue in $Issues) {
        Write-Host "   - $Issue" -ForegroundColor Yellow
    }
    
    Write-Host "`nRecommendations:" -ForegroundColor Cyan
    Write-Host "1. Replace any remaining hardcoded values with data from API calls" -ForegroundColor White
    Write-Host "2. Ensure analytics data is fetched from a persistent data store" -ForegroundColor White
    Write-Host "3. Remove any demo/simulated data generation code" -ForegroundColor White
    Write-Host "4. Update initial state values to start empty or with zero values" -ForegroundColor White
} else {
    Write-Host "`n✅ No demo data patterns detected in the checked files." -ForegroundColor Green
    Write-Host "The application appears to be using real analytics data throughout." -ForegroundColor Green
}

Write-Host "`n💡 Note: This script checks for common patterns but may not catch all instances of demo data." -ForegroundColor Cyan
Write-Host "For a complete validation, manual review of the code is still recommended." -ForegroundColor Cyan
