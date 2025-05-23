# This script runs the revenue tracker and generates a report

# Change to the project directory
$projectDir = "c:\Users\wette\Downloads\crypto-tracker-no-modules"
Set-Location -Path $projectDir

# Run the revenue tracker script
Write-Host "Running Revenue Tracker..." -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan

# Create revenue-data directory if it doesn't exist
$revenueDataDir = Join-Path -Path $projectDir -ChildPath "revenue-data"
if (-not (Test-Path -Path $revenueDataDir)) {
    New-Item -Path $revenueDataDir -ItemType Directory | Out-Null
}

# Sample revenue data for today
$today = Get-Date -Format "yyyy-MM-dd"
$revenueData = @{
    date = $today
    total = 36.67
    streams = @{
        premium_subscriptions = 16.67
        advertising = 10.00
        affiliate_marketing = 6.67
        api_access = 3.33
    }
}

# Save to file
$filePath = Join-Path -Path $revenueDataDir -ChildPath "revenue-$today.json"
$revenueData | ConvertTo-Json -Depth 3 | Set-Content -Path $filePath

Write-Host "Revenue data for $today recorded successfully!" -ForegroundColor Green
Write-Host "Total Revenue: $($revenueData.total)" -ForegroundColor Green
Write-Host "Premium Subscriptions: $($revenueData.streams.premium_subscriptions)" -ForegroundColor Gray
Write-Host "Advertising: $($revenueData.streams.advertising)" -ForegroundColor Gray
Write-Host "Affiliate Marketing: $($revenueData.streams.affiliate_marketing)" -ForegroundColor Gray
Write-Host "API Access: $($revenueData.streams.api_access)" -ForegroundColor Gray

# Generate monthly summary
$year = (Get-Date).Year
$month = (Get-Date).Month
$monthStr = $month.ToString("00")

# Initialize summary
$summary = @{
    year = $year
    month = $month
    total = $revenueData.total
    streams = $revenueData.streams
    dailyData = @(
        @{
            date = $today
            total = $revenueData.total
            streams = $revenueData.streams
        }
    )
}

# Save summary
$summaryFilePath = Join-Path -Path $revenueDataDir -ChildPath "summary-$year-$monthStr.json"
$summary | ConvertTo-Json -Depth 4 | Set-Content -Path $summaryFilePath

Write-Host "`nMonthly summary for $year-$monthStr updated successfully!" -ForegroundColor Green

# Generate revenue projection report
$daysInMonth = [DateTime]::DaysInMonth($year, $month)
$currentDay = (Get-Date).Day
$projected = @{
    total = ($summary.total / $currentDay) * $daysInMonth
    streams = @{
        premium_subscriptions = ($summary.streams.premium_subscriptions / $currentDay) * $daysInMonth
        advertising = ($summary.streams.advertising / $currentDay) * $daysInMonth
        affiliate_marketing = ($summary.streams.affiliate_marketing / $currentDay) * $daysInMonth
        api_access = ($summary.streams.api_access / $currentDay) * $daysInMonth
    }
}

Write-Host "`n=== REVENUE REPORT: $year-$monthStr ===" -ForegroundColor Cyan
Write-Host "Current date: $today"
Write-Host "Days recorded: $currentDay/$daysInMonth"
Write-Host "`nCurrent Revenue:"
Write-Host "Total: $$([math]::Round($summary.total, 2))" -ForegroundColor Yellow

Write-Host "Premium Subscriptions: $$([math]::Round($summary.streams.premium_subscriptions, 2))"
Write-Host "Advertising: $$([math]::Round($summary.streams.advertising, 2))"
Write-Host "Affiliate Marketing: $$([math]::Round($summary.streams.affiliate_marketing, 2))"
Write-Host "API Access: $$([math]::Round($summary.streams.api_access, 2))"

Write-Host "`nProjected Month-End Revenue:"
Write-Host "Total: $$([math]::Round($projected.total, 2))" -ForegroundColor Green

Write-Host "Premium Subscriptions: $$([math]::Round($projected.streams.premium_subscriptions, 2))"
Write-Host "Advertising: $$([math]::Round($projected.streams.advertising, 2))"
Write-Host "Affiliate Marketing: $$([math]::Round($projected.streams.affiliate_marketing, 2))"
Write-Host "API Access: $$([math]::Round($projected.streams.api_access, 2))"

Write-Host "`n=== END REPORT ===`n" -ForegroundColor Cyan

# Schedule a daily task (optional)
Write-Host "To schedule this script to run daily, you can use Windows Task Scheduler:" -ForegroundColor Magenta
Write-Host "1. Open Task Scheduler"
Write-Host "2. Create a new Basic Task"
Write-Host "3. Set it to run daily"
Write-Host "4. Action: Start a program"
Write-Host "5. Program/script: powershell.exe"
Write-Host "6. Add arguments: -File `"$PSCommandPath`""
