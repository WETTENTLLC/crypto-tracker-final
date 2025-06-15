# Validate Real Data Implementation
# This script runs both validation scripts to verify the application is using real data

Write-Host "🔍 Running comprehensive validation of real data implementation..." -ForegroundColor Cyan
Write-Host "===================================================================" -ForegroundColor Cyan

# Run PayPal production environment validation
Write-Host "`n🔄 Validating PayPal production environment..." -ForegroundColor Cyan
& "$PSScriptRoot\verify-paypal-production.ps1"

# Run analytics real data validation
Write-Host "`n🔄 Validating real analytics data implementation..." -ForegroundColor Cyan
& "$PSScriptRoot\verify-real-analytics.ps1"

Write-Host "`n📋 Validation Summary:" -ForegroundColor Cyan
Write-Host "1. Check both validation reports for any issues that need addressing" -ForegroundColor White
Write-Host "2. Verify the PayPal production environment is properly configured" -ForegroundColor White
Write-Host "3. Ensure all analytics data is coming from real events, not simulated data" -ForegroundColor White
Write-Host "4. Review real_data_implementation.md for documentation of changes made" -ForegroundColor White

Write-Host "`n💡 For additional information, see post_deployment_guide.md" -ForegroundColor Cyan
