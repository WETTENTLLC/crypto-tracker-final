# This script runs the revenue tracker Node.js script and generates a report

# Change to the project directory
$projectDir = "c:\Users\wette\Downloads\crypto-tracker-no-modules"
Set-Location -Path $projectDir

Write-Host "🚀 Running revenue-tracker.js to fetch and process real analytics data..." -ForegroundColor Cyan

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed or not in PATH. Please install Node.js to run this script." -ForegroundColor Red
    exit 1
}

# Check if the revenue tracker script exists
$TrackerPath = Join-Path $PSScriptRoot "revenue-tracker.js"
if (-not (Test-Path $TrackerPath)) {
    Write-Host "❌ Revenue tracker script not found at: $TrackerPath" -ForegroundColor Red
    exit 1
}

# Run the Node.js script
Write-Host "Executing: node $TrackerPath" -ForegroundColor Yellow
node $TrackerPath

# Check if script executed successfully
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Revenue tracking and report generation completed successfully!" -ForegroundColor Green
    Write-Host "Check the output above for the report details based on simulated raw data." -ForegroundColor Green
} else {
    Write-Host "`n❌ Revenue tracking failed with exit code: $LASTEXITCODE" -ForegroundColor Red
    Write-Host "Check the output above for error details. Ensure the Next.js server is running on http://localhost:3003." -ForegroundColor Red
}
