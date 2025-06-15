# Simple Deployment Fix Script for CryptoTracker
# This script redeploys the site with updated configurations

Write-Host "CryptoTracker Deployment Fix" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the correct directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version 2>$null
    Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Vercel CLI" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "🔧 Step 1: Validating Configuration Files" -ForegroundColor Yellow

# Validate vercel.json
if (Test-Path "vercel.json") {
    Write-Host "✅ vercel.json exists" -ForegroundColor Green
} else {
    Write-Host "❌ vercel.json not found" -ForegroundColor Red
    exit 1
}

# Validate next.config.ts
if (Test-Path "next.config.ts") {
    Write-Host "✅ next.config.ts exists" -ForegroundColor Green
} else {
    Write-Host "❌ next.config.ts not found" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔨 Step 2: Building Application" -ForegroundColor Yellow

# Clean previous build
if (Test-Path ".next") {
    Write-Host "🧹 Cleaning previous build..." -ForegroundColor Cyan
    Remove-Item ".next" -Recurse -Force
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm ci
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Build the application
Write-Host "🔨 Building application..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completed successfully" -ForegroundColor Green

Write-Host ""
Write-Host "☁️ Step 3: Deploying to Vercel" -ForegroundColor Yellow

# Check Vercel login
Write-Host "🔐 Checking Vercel authentication..." -ForegroundColor Cyan
try {
    $whoami = vercel whoami 2>$null
    Write-Host "✅ Logged in as: $whoami" -ForegroundColor Green
} catch {
    Write-Host "❌ Not logged in to Vercel. Please run 'vercel login' first." -ForegroundColor Red
    exit 1
}

# Deploy
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Cyan
$deployOutput = vercel --prod --yes 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    
    # Extract deployment URL from output
    $deploymentUrl = ($deployOutput | Select-String "https://.*\.vercel\.app" | Select-Object -First 1).Matches.Value
    if ($deploymentUrl) {
        Write-Host "🌐 Deployed to: $deploymentUrl" -ForegroundColor Cyan
        $deploymentUrl | Out-File "latest-deployment-url.txt" -Encoding UTF8
    }
} else {
    Write-Host "❌ Deployment failed" -ForegroundColor Red
    Write-Host "Error output:" -ForegroundColor Red
    Write-Host $deployOutput -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Deployment Fix Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Wait 1-2 minutes for deployment to propagate" -ForegroundColor White
Write-Host "2. Run post-deployment validation tests" -ForegroundColor White
Write-Host "3. Monitor for any remaining 404 errors" -ForegroundColor White
Write-Host ""

if (Test-Path "latest-deployment-url.txt") {
    $finalUrl = Get-Content "latest-deployment-url.txt" -Raw
    $urlText = $finalUrl.Trim()
    Write-Host "Your deployed site: $urlText" -ForegroundColor Cyan
}
