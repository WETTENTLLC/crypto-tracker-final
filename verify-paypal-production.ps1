# PayPal Production Environment Checker
# This script verifies that the real PayPal credentials are properly configured

param(
    [switch]$Verbose
)

$ErrorActionPreference = "Stop"

Write-Host "🔍 Checking PayPal production environment setup..." -ForegroundColor Cyan

# Check environment variables in .env.production
$EnvFilePath = Join-Path $PSScriptRoot ".env.production"
if (Test-Path $EnvFilePath) {
    $EnvContent = Get-Content $EnvFilePath -Raw
    
    Write-Host "Checking PayPal environment variables in .env.production..." -ForegroundColor Yellow
    
    $ClientIdPattern = "PAYPAL_CLIENT_ID=([^\r\n]*)"
    $ClientSecretPattern = "PAYPAL_CLIENT_SECRET=([^\r\n]*)"
    $WebhookIdPattern = "PAYPAL_WEBHOOK_ID=([^\r\n]*)"
    $PublicClientIdPattern = "NEXT_PUBLIC_PAYPAL_CLIENT_ID=([^\r\n]*)"
    
    $ClientId = if ($EnvContent -match $ClientIdPattern) { $matches[1] } else { $null }
    $ClientSecret = if ($EnvContent -match $ClientSecretPattern) { $matches[1] } else { $null }
    $WebhookId = if ($EnvContent -match $WebhookIdPattern) { $matches[1] } else { $null }
    $PublicClientId = if ($EnvContent -match $PublicClientIdPattern) { $matches[1] } else { $null }
    
    $Issues = @()
    
    # Check if variables are present but using placeholder values
    if ($ClientId -eq "YOUR_ACTUAL_PAYPAL_CLIENT_ID") {
        $Issues += "PAYPAL_CLIENT_ID is using a placeholder value"
    }
    
    if ($ClientSecret -eq "YOUR_ACTUAL_PAYPAL_CLIENT_SECRET") {
        $Issues += "PAYPAL_CLIENT_SECRET is using a placeholder value"
    }
    
    if ($WebhookId -eq "YOUR_ACTUAL_PAYPAL_WEBHOOK_ID") {
        $Issues += "PAYPAL_WEBHOOK_ID is using a placeholder value"
    }
    
    if ($PublicClientId -eq "YOUR_ACTUAL_PAYPAL_CLIENT_ID") {
        $Issues += "NEXT_PUBLIC_PAYPAL_CLIENT_ID is using a placeholder value"
    }
    
    # Check if variables are missing
    if (-not $ClientId) {
        $Issues += "PAYPAL_CLIENT_ID is missing"
    }
    
    if (-not $ClientSecret) {
        $Issues += "PAYPAL_CLIENT_SECRET is missing"
    }
    
    if (-not $WebhookId) {
        $Issues += "PAYPAL_WEBHOOK_ID is missing"
    }
    
    if (-not $PublicClientId) {
        $Issues += "NEXT_PUBLIC_PAYPAL_CLIENT_ID is missing"
    }
    
    # Report findings
    if ($Issues.Count -gt 0) {
        Write-Host "⚠️ Found issues with PayPal environment variables:" -ForegroundColor Yellow
        foreach ($Issue in $Issues) {
            Write-Host "   - $Issue" -ForegroundColor Yellow
        }
        Write-Host "`nPlease update .env.production with your actual PayPal business account credentials.`n" -ForegroundColor Yellow
    } else {
        Write-Host "✅ PayPal environment variables are properly configured." -ForegroundColor Green
    }
} else {
    Write-Host "❌ .env.production file not found!" -ForegroundColor Red
    Write-Host "Please create the file with proper PayPal credentials." -ForegroundColor Yellow
}

# Check PayPal API file for sandbox references
$PayPalApiPath = Join-Path $PSScriptRoot "src\app\api\paypal.ts"
if (Test-Path $PayPalApiPath) {
    $ApiContent = Get-Content $PayPalApiPath -Raw
    
    Write-Host "`nChecking PayPal API implementation..." -ForegroundColor Yellow
    
    $SandboxReferences = Select-String -Path $PayPalApiPath -Pattern "sandbox" -AllMatches
    
    if ($SandboxReferences.Matches.Count -gt 0) {
        Write-Host "⚠️ Found $($SandboxReferences.Matches.Count) references to 'sandbox' in the PayPal API file." -ForegroundColor Yellow
        Write-Host "   This may indicate the code is still using sandbox/test environment." -ForegroundColor Yellow
        
        if ($Verbose) {
            Write-Host "`nDetailed sandbox references:" -ForegroundColor Yellow
            $LineNumber = 0
            foreach ($Line in (Get-Content $PayPalApiPath)) {
                $LineNumber++
                if ($Line -match "sandbox") {
                    Write-Host "   Line $LineNumber: $Line" -ForegroundColor Yellow
                }
            }
        }
    } else {
        Write-Host "✅ No sandbox references found in PayPal API implementation." -ForegroundColor Green
    }
    
    # Check for production API base URL
    if ($ApiContent -match "PAYPAL_API_BASE = 'https://api-m.paypal.com'") {
        Write-Host "✅ PayPal API is configured to use production endpoints." -ForegroundColor Green
    } else {
        Write-Host "❌ PayPal API might not be using production endpoints!" -ForegroundColor Red
        Write-Host "   Please verify the PAYPAL_API_BASE variable is set to 'https://api-m.paypal.com'" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ PayPal API file not found at expected location: $PayPalApiPath" -ForegroundColor Red
}

Write-Host "`n📋 PayPal Integration Checklist:" -ForegroundColor Cyan
Write-Host "1. Update .env.production with real PayPal business account credentials" -ForegroundColor White
Write-Host "2. Create webhook in PayPal Developer Dashboard pointing to your API endpoint" -ForegroundColor White 
Write-Host "3. Update PAYPAL_WEBHOOK_ID with the ID from PayPal Developer Dashboard" -ForegroundColor White
Write-Host "4. Ensure NEXT_PUBLIC_PAYPAL_CLIENT_ID is set for the frontend" -ForegroundColor White
Write-Host "5. Verify PayPal API implementation uses only production endpoints" -ForegroundColor White

Write-Host "`n💡 For more information, see post_deployment_guide.md" -ForegroundColor Cyan
