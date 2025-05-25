# SEO Health Check Runner
# PowerShell script to run comprehensive SEO audits

param(
    [switch]$Detailed,
    [switch]$Monitor,
    [string]$OutputPath = ".\seo-reports",
    [int]$MonitorInterval = 3600 # 1 hour in seconds
)

Write-Host "🔍 CryptoTracker SEO Health Check" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Ensure Node.js is available
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Create output directory if it doesn't exist
if (-not (Test-Path $OutputPath)) {
    New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
    Write-Host "📁 Created output directory: $OutputPath" -ForegroundColor Green
}

function Run-SEOAudit {
    param([string]$ReportPath)
    
    Write-Host "`n🚀 Running SEO Health Check..." -ForegroundColor Yellow
    
    try {
        # Run the SEO health check
        $result = node "seo-health-check.js" | Tee-Object -Variable output
        
        # Check if the audit was successful
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ SEO Health Check completed successfully!" -ForegroundColor Green
            
            # Copy report to specified path if it exists
            if (Test-Path "seo-health-reports") {
                $latestReport = Get-ChildItem "seo-health-reports\*.json" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
                if ($latestReport) {
                    $timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
                    $destinationFile = Join-Path $ReportPath "seo-audit-$timestamp.json"
                    Copy-Item $latestReport.FullName $destinationFile
                    Write-Host "📊 Report saved to: $destinationFile" -ForegroundColor Green
                    
                    # Parse and display summary
                    $reportContent = Get-Content $destinationFile | ConvertFrom-Json
                    Write-Host "`n📈 SEO Health Summary:" -ForegroundColor Cyan
                    Write-Host "  Score: $($reportContent.summary.score)/100" -ForegroundColor $(if ($reportContent.summary.score -ge 80) { "Green" } elseif ($reportContent.summary.score -ge 60) { "Yellow" } else { "Red" })
                    Write-Host "  Errors: $($reportContent.summary.errors)" -ForegroundColor $(if ($reportContent.summary.errors -eq 0) { "Green" } else { "Red" })
                    Write-Host "  Warnings: $($reportContent.summary.warnings)" -ForegroundColor $(if ($reportContent.summary.warnings -eq 0) { "Green" } else { "Yellow" })
                    Write-Host "  Successes: $($reportContent.summary.successes)" -ForegroundColor Green
                }
            }
        } else {
            Write-Host "❌ SEO Health Check failed!" -ForegroundColor Red
            Write-Host $output -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Error running SEO Health Check: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Show-SEORecommendations {
    Write-Host "`n💡 SEO Optimization Recommendations:" -ForegroundColor Cyan
    Write-Host "=====================================" -ForegroundColor Cyan
    
    $recommendations = @(
        "✅ Verify all sitemaps are accessible and properly formatted",
        "✅ Check robots.txt contains all sitemap references",
        "✅ Ensure PWA manifest is complete with all required fields",
        "✅ Validate service worker implements caching and offline support",
        "✅ Confirm all pages have proper meta tags and structured data",
        "✅ Monitor Core Web Vitals scores regularly",
        "✅ Test mobile-first indexing compatibility",
        "✅ Verify international SEO with hreflang tags",
        "✅ Check security headers are properly configured",
        "✅ Monitor search console for crawl errors",
        "✅ Validate schema markup with Google's Rich Results Test",
        "✅ Ensure images have proper alt text and optimization"
    )
    
    foreach ($rec in $recommendations) {
        Write-Host "  $rec" -ForegroundColor White
    }
}

function Start-SEOMonitoring {
    param([int]$Interval, [string]$ReportPath)
    
    Write-Host "`n🔄 Starting continuous SEO monitoring..." -ForegroundColor Yellow
    Write-Host "Interval: $Interval seconds" -ForegroundColor Gray
    Write-Host "Press Ctrl+C to stop monitoring" -ForegroundColor Gray
    
    try {
        while ($true) {
            $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            Write-Host "`n[$timestamp] Running scheduled SEO audit..." -ForegroundColor Cyan
            
            Run-SEOAudit -ReportPath $ReportPath
            
            Write-Host "⏰ Next audit in $Interval seconds..." -ForegroundColor Gray
            Start-Sleep -Seconds $Interval
        }
    } catch [System.Management.Automation.ErrorRecord] {
        if ($_.Exception.Message -match "terminated by the user") {
            Write-Host "`n🛑 SEO monitoring stopped by user" -ForegroundColor Yellow
        } else {
            Write-Host "`n❌ SEO monitoring error: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

function Test-SEOComponents {
    Write-Host "`n🧪 Testing SEO Component Integration..." -ForegroundColor Yellow
    
    $components = @(
        "src\app\components\TechnicalSEOAutomation.tsx",
        "src\app\components\ContentMarketingAutomation.tsx",
        "src\app\components\EcommerceServiceSchema.tsx",
        "src\app\components\AdvancedSEOAnalyticsDashboard.tsx",
        "src\app\sitemap.ts",
        "src\app\sitemap-images.ts",
        "src\app\sitemap-news.ts",
        "src\app\sitemap-videos.ts",
        "src\app\sitemap-mobile.ts",
        "src\app\robots.ts"
    )
    
    foreach ($component in $components) {
        if (Test-Path $component) {
            Write-Host "  ✅ $component" -ForegroundColor Green
        } else {
            Write-Host "  ❌ $component" -ForegroundColor Red
        }
    }
}

# Main execution
Write-Host "📅 Started at: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray

if ($Detailed) {
    Test-SEOComponents
    Show-SEORecommendations
}

if ($Monitor) {
    Start-SEOMonitoring -Interval $MonitorInterval -ReportPath $OutputPath
} else {
    Run-SEOAudit -ReportPath $OutputPath
    
    if ($Detailed) {
        Show-SEORecommendations
    }
}

Write-Host "`n🎯 SEO Health Check completed!" -ForegroundColor Green
Write-Host "📊 Check $OutputPath for detailed reports" -ForegroundColor Gray
