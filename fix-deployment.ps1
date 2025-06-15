# CryptoTracker Deployment Fix Script
# This script fixes deployment issues and redeploys to Vercel

param(
    [switch]$Force,
    [switch]$Verbose,
    [switch]$SkipBuild
)

Write-Host "🚀 CryptoTracker Deployment Fix Script" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
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
    try {
        $vercelConfig = Get-Content "vercel.json" | ConvertFrom-Json
        Write-Host "✅ vercel.json is valid JSON" -ForegroundColor Green
        
        # Check for required configurations
        if ($vercelConfig.framework -eq "nextjs") {
            Write-Host "✅ Framework set to Next.js" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Framework not set to Next.js" -ForegroundColor Yellow
        }
        
        if ($vercelConfig.functions) {
            Write-Host "✅ Functions configuration present" -ForegroundColor Green
        }
        
        if ($vercelConfig.routes) {
            Write-Host "✅ Routes configuration present" -ForegroundColor Green
        }
    } catch {
        Write-Host "❌ vercel.json contains invalid JSON" -ForegroundColor Red
        exit 1
    }
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
Write-Host "🏗️  Step 2: Building Application" -ForegroundColor Yellow

if (-not $SkipBuild) {
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

    # Validate build output
    Write-Host "🔍 Validating build output..." -ForegroundColor Cyan
    
    $buildDir = ".next"
    if (Test-Path $buildDir) {
        Write-Host "✅ .next directory exists" -ForegroundColor Green
        
        # Check for critical routes
        $serverAppDir = Join-Path $buildDir "server/app"
        if (Test-Path $serverAppDir) {
            Write-Host "✅ Server app directory exists" -ForegroundColor Green
            
            # Check for FAQ page
            $faqDir = Join-Path $serverAppDir "faq"
            if (Test-Path $faqDir) {
                Write-Host "✅ FAQ route built" -ForegroundColor Green
            } else {
                Write-Host "⚠️  FAQ route not found in build" -ForegroundColor Yellow
            }
            
            # Check for learn routes
            $learnDir = Join-Path $serverAppDir "learn"
            if (Test-Path $learnDir) {
                $learnPages = Get-ChildItem $learnDir -Directory
                Write-Host "✅ Learn routes built: $($learnPages.Count) pages" -ForegroundColor Green
                if ($Verbose) {
                    foreach ($page in $learnPages) {
                        Write-Host "   • $($page.Name)" -ForegroundColor Gray
                    }
                }
            } else {
                Write-Host "⚠️  Learn routes not found in build" -ForegroundColor Yellow
            }
        } else {
            Write-Host "⚠️  Server app directory not found" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Build directory not found" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "⏭️  Skipping build (--SkipBuild specified)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "☁️  Step 3: Deploying to Vercel" -ForegroundColor Yellow

# Login check
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

if ($Force) {
    Write-Host "⚡ Force deployment enabled" -ForegroundColor Yellow
    $deployArgs = "--force", "--yes"
} else {
    $deployArgs = "--yes"
}

if ($Verbose) {
    $deployArgs += "--debug"
}

try {
    $deployResult = vercel $deployArgs
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Deployment completed successfully" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌐 Deployment Details:" -ForegroundColor Cyan
        Write-Host $deployResult
        
        # Extract URL from deployment result
        $deployUrl = ($deployResult | Where-Object { $_ -match "https://" } | Select-Object -First 1)
        if ($deployUrl) {
            Write-Host ""
            Write-Host "🎯 Deployed URL: $deployUrl" -ForegroundColor Green
            
            # Save URL for validation
            $deployUrl | Out-File "latest-deployment-url.txt" -Encoding UTF8
        }
    } else {
        Write-Host "❌ Deployment failed" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Deployment error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Step 4: Post-Deployment Validation" -ForegroundColor Yellow

# Wait a moment for deployment to propagate
Write-Host "⏳ Waiting for deployment to propagate..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

# Run validation if we have the URL
if (Test-Path "latest-deployment-url.txt") {
    $deployedUrl = Get-Content "latest-deployment-url.txt" -Raw
    $deployedUrl = $deployedUrl.Trim()
    
    Write-Host "🧪 Running post-deployment validation..." -ForegroundColor Cyan
    
    # Test critical routes
    $testRoutes = @(
        "/",
        "/faq",
        "/learn/cryptocurrency-investing-guide",
        "/api/mcp/content?type=market_update"
    )
    
    $successCount = 0
    foreach ($route in $testRoutes) {
        try {
            $testUrl = "$deployedUrl$route"
            $response = Invoke-WebRequest -Uri $testUrl -Method GET -TimeoutSec 10 -UseBasicParsing
            if ($response.StatusCode -eq 200) {
                Write-Host "✅ $route - OK" -ForegroundColor Green
                $successCount++
            } else {
                Write-Host "❌ $route - $($response.StatusCode)" -ForegroundColor Red
            }
        } catch {
            Write-Host "❌ $route - ERROR" -ForegroundColor Red
        }
        Start-Sleep -Milliseconds 500
    }
    
    Write-Host ""
    Write-Host "📊 Validation Results: $successCount/$($testRoutes.Count) routes working" -ForegroundColor Cyan
    
    if ($successCount -eq $testRoutes.Count) {
        Write-Host "🎉 All critical routes are working!" -ForegroundColor Green
    } elseif ($successCount -gt 0) {
        Write-Host "⚠️  Some routes are working, but issues remain" -ForegroundColor Yellow
    } else {
        Write-Host "❌ No routes are working - deployment may have issues" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🏁 Deployment Fix Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Run comprehensive test suite: node comprehensive-test-script.js" -ForegroundColor White
Write-Host "2. Check deployment validation: node validate-deployment.js" -ForegroundColor White
Write-Host "3. Monitor analytics and error logs" -ForegroundColor White
Write-Host ""

if (Test-Path "latest-deployment-url.txt") {
    $finalUrl = Get-Content "latest-deployment-url.txt" -Raw
    Write-Host "🌐 Your deployed site: $($finalUrl.Trim())" -ForegroundColor Cyan
}
