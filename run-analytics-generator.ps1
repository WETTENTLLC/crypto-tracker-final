# Run Analytics Data Generator
# This script runs the Node.js script to generate real analytics test data

Write-Host "🚀 Running analytics data generator..." -ForegroundColor Cyan

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed or not in PATH. Please install Node.js to run this script." -ForegroundColor Red
    exit 1
}

# Check if the generator script exists
$GeneratorPath = Join-Path $PSScriptRoot "generate-analytics-data.js"
if (-not (Test-Path $GeneratorPath)) {
    Write-Host "❌ Analytics data generator script not found at: $GeneratorPath" -ForegroundColor Red
    exit 1
}

# Run the Node.js script
Write-Host "Executing: node $GeneratorPath" -ForegroundColor Yellow
node $GeneratorPath

# Check if script executed successfully
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Analytics data generation completed successfully!" -ForegroundColor Green
    Write-Host "You can now view the generated data in the admin analytics dashboard." -ForegroundColor Green
    
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "1. Start your Next.js application with 'npm run dev'" -ForegroundColor White
    Write-Host "2. Navigate to /admin/analytics or /admin/dashboard to view the data" -ForegroundColor White
    Write-Host "3. Verify that all charts and metrics show real data" -ForegroundColor White
} else {
    Write-Host "`n❌ Analytics data generation failed with exit code: $LASTEXITCODE" -ForegroundColor Red
    Write-Host "Check the output above for error details." -ForegroundColor Red
}
