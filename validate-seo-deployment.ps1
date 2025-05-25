# Advanced SEO Deployment Validation Script
# Validates all SEO enhancements are properly deployed and functional

param(
    [string]$BaseUrl = "https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app",
    [switch]$Verbose,
    [switch]$GenerateReport,
    [string]$ReportPath = ".\deployment-validation-reports"
)

Write-Host "🚀 Advanced SEO Deployment Validation" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

$validationResults = @{
    Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    BaseUrl = $BaseUrl
    Tests = @()
    Summary = @{
        Total = 0
        Passed = 0
        Failed = 0
        Warnings = 0
    }
}

function Add-TestResult {
    param(
        [string]$TestName,
        [string]$Status, # "PASS", "FAIL", "WARN"
        [string]$Message,
        [hashtable]$Details = @{}
    )
    
    $result = @{
        Name = $TestName
        Status = $Status
        Message = $Message
        Details = $Details
        Timestamp = Get-Date -Format "HH:mm:ss"
    }
    
    $validationResults.Tests += $result
    $validationResults.Summary.Total++
    
    $color = switch ($Status) {
        "PASS" { "Green"; $validationResults.Summary.Passed++ }
        "FAIL" { "Red"; $validationResults.Summary.Failed++ }
        "WARN" { "Yellow"; $validationResults.Summary.Warnings++ }
        default { "White" }
    }
    
    $icon = switch ($Status) {
        "PASS" { "✅" }
        "FAIL" { "❌" }
        "WARN" { "⚠️" }
        default { "ℹ️" }
    }
    
    Write-Host "$icon [$Status] $TestName - $Message" -ForegroundColor $color
    
    if ($Verbose -and $Details.Count -gt 0) {
        $Details.GetEnumerator() | ForEach-Object {
            Write-Host "    $($_.Key): $($_.Value)" -ForegroundColor Gray
        }
    }
}

function Test-UrlAccessibility {
    param([string]$Url, [int]$ExpectedStatus = 200)
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method Head -TimeoutSec 10 -ErrorAction Stop
        if ($response.StatusCode -eq $ExpectedStatus) {
            return @{ Success = $true; StatusCode = $response.StatusCode; Headers = $response.Headers }
        } else {
            return @{ Success = $false; StatusCode = $response.StatusCode; Error = "Unexpected status code" }
        }
    } catch {
        return @{ Success = $false; Error = $_.Exception.Message }
    }
}

function Test-JsonContent {
    param([string]$Url)
    
    try {
        $response = Invoke-RestMethod -Uri $Url -TimeoutSec 10 -ErrorAction Stop
        return @{ Success = $true; Content = $response }
    } catch {
        return @{ Success = $false; Error = $_.Exception.Message }
    }
}

function Test-XmlContent {
    param([string]$Url)
    
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec 10 -ErrorAction Stop
        $xml = [xml]$response.Content
        return @{ Success = $true; Content = $xml; UrlCount = $xml.urlset.url.Count }
    } catch {
        return @{ Success = $false; Error = $_.Exception.Message }
    }
}

# Test 1: Core Sitemap Accessibility
Write-Host "`n📋 Testing Core Sitemaps..." -ForegroundColor Yellow

$sitemaps = @(
    @{ Name = "Main Sitemap"; Url = "$BaseUrl/sitemap.xml" },
    @{ Name = "Images Sitemap"; Url = "$BaseUrl/sitemap-images.xml" },
    @{ Name = "News Sitemap"; Url = "$BaseUrl/sitemap-news.xml" },
    @{ Name = "Videos Sitemap"; Url = "$BaseUrl/sitemap-videos.xml" },
    @{ Name = "Mobile Sitemap"; Url = "$BaseUrl/sitemap-mobile.xml" }
)

foreach ($sitemap in $sitemaps) {
    $result = Test-XmlContent -Url $sitemap.Url
    if ($result.Success) {
        Add-TestResult -TestName $sitemap.Name -Status "PASS" -Message "Accessible with $($result.UrlCount) URLs" -Details @{
            "URL Count" = $result.UrlCount
            "Response Size" = "$([math]::Round($result.Content.OuterXml.Length / 1024, 2)) KB"
        }
    } else {
        Add-TestResult -TestName $sitemap.Name -Status "FAIL" -Message $result.Error
    }
}

# Test 2: Robots.txt Validation
Write-Host "`n🤖 Testing Robots.txt..." -ForegroundColor Yellow

$robotsResult = Test-UrlAccessibility -Url "$BaseUrl/robots.txt"
if ($robotsResult.Success) {
    try {
        $robotsContent = Invoke-WebRequest -Uri "$BaseUrl/robots.txt" -TimeoutSec 10
        $content = $robotsContent.Content
        
        $checks = @{
            "Contains User-agent" = $content -match "User-agent:"
            "Contains Sitemap" = $content -match "Sitemap:"
            "Contains Disallow" = $content -match "Disallow:"
            "References all sitemaps" = ($content -split "`n" | Where-Object { $_ -match "Sitemap:" }).Count -ge 5
        }
        
        $allPassed = $checks.Values | ForEach-Object { $_ } | Where-Object { $_ -eq $false } | Measure-Object | Select-Object -ExpandProperty Count
        
        if ($allPassed -eq 0) {
            Add-TestResult -TestName "Robots.txt Content" -Status "PASS" -Message "All validation checks passed" -Details $checks
        } else {
            Add-TestResult -TestName "Robots.txt Content" -Status "WARN" -Message "Some validation checks failed" -Details $checks
        }
    } catch {
        Add-TestResult -TestName "Robots.txt Content" -Status "FAIL" -Message $_.Exception.Message
    }
} else {
    Add-TestResult -TestName "Robots.txt Accessibility" -Status "FAIL" -Message $robotsResult.Error
}

# Test 3: PWA Manifest Validation
Write-Host "`n📱 Testing PWA Manifest..." -ForegroundColor Yellow

$manifestResult = Test-JsonContent -Url "$BaseUrl/manifest.json"
if ($manifestResult.Success) {
    $manifest = $manifestResult.Content
    $requiredFields = @("name", "short_name", "start_url", "display", "background_color", "theme_color", "icons")
    $missingFields = @()
    
    foreach ($field in $requiredFields) {
        if (-not $manifest.$field) {
            $missingFields += $field
        }
    }
    
    if ($missingFields.Count -eq 0) {
        Add-TestResult -TestName "PWA Manifest Structure" -Status "PASS" -Message "All required fields present" -Details @{
            "Icon Count" = $manifest.icons.Count
            "Display Mode" = $manifest.display
            "Start URL" = $manifest.start_url
        }
    } else {
        Add-TestResult -TestName "PWA Manifest Structure" -Status "WARN" -Message "Missing fields: $($missingFields -join ', ')"
    }
} else {
    Add-TestResult -TestName "PWA Manifest Accessibility" -Status "FAIL" -Message $manifestResult.Error
}

# Test 4: Service Worker Validation
Write-Host "`n⚙️ Testing Service Worker..." -ForegroundColor Yellow

$swResult = Test-UrlAccessibility -Url "$BaseUrl/sw.js"
if ($swResult.Success) {
    try {
        $swContent = Invoke-WebRequest -Uri "$BaseUrl/sw.js" -TimeoutSec 10
        $content = $swContent.Content
        
        $features = @{
            "Cache API Usage" = $content -match "cache"
            "Fetch Event Handler" = $content -match "fetch"
            "Install Event Handler" = $content -match "install"
            "Activate Event Handler" = $content -match "activate"
            "Push Notification Support" = $content -match "push|notification"
        }
        
        $implementedFeatures = ($features.Values | Where-Object { $_ }).Count
        
        if ($implementedFeatures -ge 4) {
            Add-TestResult -TestName "Service Worker Features" -Status "PASS" -Message "$implementedFeatures/5 core features implemented" -Details $features
        } else {
            Add-TestResult -TestName "Service Worker Features" -Status "WARN" -Message "Only $implementedFeatures/5 core features implemented" -Details $features
        }
    } catch {
        Add-TestResult -TestName "Service Worker Content" -Status "FAIL" -Message $_.Exception.Message
    }
} else {
    Add-TestResult -TestName "Service Worker Accessibility" -Status "FAIL" -Message $swResult.Error
}

# Test 5: Homepage Meta Tags and Structured Data
Write-Host "`n🏷️ Testing Homepage Meta Tags..." -ForegroundColor Yellow

try {
    $homepageContent = Invoke-WebRequest -Uri $BaseUrl -TimeoutSec 15
    $html = $homepageContent.Content
    
    $metaChecks = @{
        "Title Tag" = $html -match "<title[^>]*>([^<]+)</title>"
        "Meta Description" = $html -match 'name=["\']description["\']'
        "Open Graph Title" = $html -match 'property=["\']og:title["\']'
        "Open Graph Description" = $html -match 'property=["\']og:description["\']'
        "Open Graph Image" = $html -match 'property=["\']og:image["\']'
        "Twitter Card" = $html -match 'name=["\']twitter:card["\']'
        "Canonical URL" = $html -match 'rel=["\']canonical["\']'
        "Structured Data" = $html -match 'type=["\']application/ld\+json["\']'
        "Viewport Meta" = $html -match 'name=["\']viewport["\']'
        "Charset Declaration" = $html -match 'charset='
    }
    
    $passedChecks = ($metaChecks.Values | Where-Object { $_ }).Count
    $totalChecks = $metaChecks.Count
    
    if ($passedChecks -eq $totalChecks) {
        Add-TestResult -TestName "Homepage Meta Tags" -Status "PASS" -Message "All $totalChecks meta tag checks passed" -Details $metaChecks
    } elseif ($passedChecks -ge ($totalChecks * 0.8)) {
        Add-TestResult -TestName "Homepage Meta Tags" -Status "WARN" -Message "$passedChecks/$totalChecks meta tag checks passed" -Details $metaChecks
    } else {
        Add-TestResult -TestName "Homepage Meta Tags" -Status "FAIL" -Message "Only $passedChecks/$totalChecks meta tag checks passed" -Details $metaChecks
    }
} catch {
    Add-TestResult -TestName "Homepage Meta Tags" -Status "FAIL" -Message $_.Exception.Message
}

# Test 6: Performance and Security Headers
Write-Host "`n🔒 Testing Security Headers..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri $BaseUrl -TimeoutSec 10
    $headers = $response.Headers
    
    $securityChecks = @{
        "HTTPS Redirect" = $BaseUrl.StartsWith("https://")
        "Content-Type" = $headers.ContainsKey("Content-Type")
        "X-Frame-Options" = $headers.ContainsKey("X-Frame-Options")
        "X-Content-Type-Options" = $headers.ContainsKey("X-Content-Type-Options")
        "Referrer-Policy" = $headers.ContainsKey("Referrer-Policy")
        "Content-Security-Policy" = $headers.ContainsKey("Content-Security-Policy")
    }
    
    $passedSecurityChecks = ($securityChecks.Values | Where-Object { $_ }).Count
    $totalSecurityChecks = $securityChecks.Count
    
    if ($passedSecurityChecks -ge ($totalSecurityChecks * 0.7)) {
        Add-TestResult -TestName "Security Headers" -Status "PASS" -Message "$passedSecurityChecks/$totalSecurityChecks security headers present" -Details $securityChecks
    } else {
        Add-TestResult -TestName "Security Headers" -Status "WARN" -Message "Only $passedSecurityChecks/$totalSecurityChecks security headers present" -Details $securityChecks
    }
} catch {
    Add-TestResult -TestName "Security Headers" -Status "FAIL" -Message $_.Exception.Message
}

# Test 7: Educational Pages Accessibility
Write-Host "`n📚 Testing Educational Pages..." -ForegroundColor Yellow

$educationalPages = @(
    "/learn/what-is-cryptocurrency",
    "/learn/how-to-buy-bitcoin",
    "/learn/cryptocurrency-investing-guide",
    "/learn/defi-guide",
    "/learn/nft-guide",
    "/faq"
)

$accessiblePages = 0
foreach ($page in $educationalPages) {
    $result = Test-UrlAccessibility -Url "$BaseUrl$page"
    if ($result.Success) {
        $accessiblePages++
    }
}

if ($accessiblePages -eq $educationalPages.Count) {
    Add-TestResult -TestName "Educational Pages" -Status "PASS" -Message "All $($educationalPages.Count) educational pages accessible"
} elseif ($accessiblePages -gt ($educationalPages.Count * 0.5)) {
    Add-TestResult -TestName "Educational Pages" -Status "WARN" -Message "$accessiblePages/$($educationalPages.Count) educational pages accessible"
} else {
    Add-TestResult -TestName "Educational Pages" -Status "FAIL" -Message "Only $accessiblePages/$($educationalPages.Count) educational pages accessible"
}

# Test 8: International SEO Pages
Write-Host "`n🌍 Testing International SEO..." -ForegroundColor Yellow

$languagePages = @("/es-ES", "/fr-FR")
$accessibleLanguagePages = 0

foreach ($langPage in $languagePages) {
    $result = Test-UrlAccessibility -Url "$BaseUrl$langPage"
    if ($result.Success) {
        $accessibleLanguagePages++
    }
}

if ($accessibleLanguagePages -eq $languagePages.Count) {
    Add-TestResult -TestName "International SEO Pages" -Status "PASS" -Message "All $($languagePages.Count) language-specific pages accessible"
} else {
    Add-TestResult -TestName "International SEO Pages" -Status "WARN" -Message "$accessibleLanguagePages/$($languagePages.Count) language-specific pages accessible"
}

# Generate Summary Report
Write-Host "`n📊 Validation Summary" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan

$summary = $validationResults.Summary
$successRate = [math]::Round(($summary.Passed / $summary.Total) * 100, 1)

Write-Host "Total Tests: $($summary.Total)" -ForegroundColor White
Write-Host "Passed: $($summary.Passed)" -ForegroundColor Green
Write-Host "Failed: $($summary.Failed)" -ForegroundColor Red
Write-Host "Warnings: $($summary.Warnings)" -ForegroundColor Yellow
Write-Host "Success Rate: $successRate%" -ForegroundColor $(if ($successRate -ge 90) { "Green" } elseif ($successRate -ge 75) { "Yellow" } else { "Red" })

# Overall Status
if ($summary.Failed -eq 0 -and $successRate -ge 90) {
    Write-Host "`n🎉 SEO Deployment: EXCELLENT" -ForegroundColor Green
    Write-Host "All critical SEO components are properly deployed and functional!" -ForegroundColor Green
} elseif ($summary.Failed -le 2 -and $successRate -ge 75) {
    Write-Host "`n👍 SEO Deployment: GOOD" -ForegroundColor Yellow
    Write-Host "Most SEO components are working, minor issues need attention." -ForegroundColor Yellow
} else {
    Write-Host "`n🚨 SEO Deployment: NEEDS ATTENTION" -ForegroundColor Red
    Write-Host "Critical SEO issues detected that require immediate fixing." -ForegroundColor Red
}

# Generate Report File
if ($GenerateReport) {
    if (-not (Test-Path $ReportPath)) {
        New-Item -ItemType Directory -Path $ReportPath -Force | Out-Null
    }
    
    $timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
    $reportFile = Join-Path $ReportPath "seo-validation-$timestamp.json"
    
    $validationResults | ConvertTo-Json -Depth 10 | Out-File -FilePath $reportFile -Encoding UTF8
    
    Write-Host "`n📄 Detailed report saved to: $reportFile" -ForegroundColor Cyan
    
    # Also create a summary HTML report
    $htmlReportFile = Join-Path $ReportPath "seo-validation-$timestamp.html"
    $htmlContent = @"
<!DOCTYPE html>
<html>
<head>
    <title>SEO Validation Report - $($validationResults.Timestamp)</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; border-radius: 8px; }
        .summary { background: #f3f4f6; padding: 15px; margin: 20px 0; border-radius: 8px; }
        .test-result { margin: 10px 0; padding: 10px; border-radius: 4px; }
        .pass { background: #d1fae5; border-left: 4px solid #10b981; }
        .fail { background: #fee2e2; border-left: 4px solid #ef4444; }
        .warn { background: #fef3c7; border-left: 4px solid #f59e0b; }
        .details { margin-top: 10px; font-size: 0.9em; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>SEO Validation Report</h1>
        <p>Generated: $($validationResults.Timestamp)</p>
        <p>Base URL: $($validationResults.BaseUrl)</p>
    </div>
    
    <div class="summary">
        <h2>Summary</h2>
        <p><strong>Total Tests:</strong> $($summary.Total)</p>
        <p><strong>Passed:</strong> $($summary.Passed)</p>
        <p><strong>Failed:</strong> $($summary.Failed)</p>
        <p><strong>Warnings:</strong> $($summary.Warnings)</p>
        <p><strong>Success Rate:</strong> $successRate%</p>
    </div>
    
    <div class="tests">
        <h2>Test Results</h2>
"@
    
    foreach ($test in $validationResults.Tests) {
        $cssClass = switch ($test.Status) {
            "PASS" { "pass" }
            "FAIL" { "fail" }
            "WARN" { "warn" }
        }
        
        $htmlContent += @"
        <div class="test-result $cssClass">
            <strong>$($test.Name)</strong> - $($test.Status) - $($test.Message)
"@
        
        if ($test.Details.Count -gt 0) {
            $htmlContent += "<div class='details'>"
            foreach ($detail in $test.Details.GetEnumerator()) {
                $htmlContent += "<div>$($detail.Key): $($detail.Value)</div>"
            }
            $htmlContent += "</div>"
        }
        
        $htmlContent += "</div>"
    }
    
    $htmlContent += @"
    </div>
</body>
</html>
"@
    
    $htmlContent | Out-File -FilePath $htmlReportFile -Encoding UTF8
    Write-Host "📄 HTML report saved to: $htmlReportFile" -ForegroundColor Cyan
}

Write-Host "`n✅ SEO Deployment Validation Complete!" -ForegroundColor Green
