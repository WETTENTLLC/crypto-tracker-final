@echo off
echo CryptoTracker Deployment Fix
echo =============================
echo.

REM Check if we're in the correct directory
if not exist package.json (
    echo Error: package.json not found. Please run this script from the project root.
    exit /b 1
)

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    echo Vercel CLI not found. Installing...
    npm install -g vercel
    if errorlevel 1 (
        echo Failed to install Vercel CLI
        exit /b 1
    )
)

echo.
echo Step 1: Validating Configuration Files
echo.

REM Validate vercel.json
if exist vercel.json (
    echo vercel.json exists
) else (
    echo vercel.json not found
    exit /b 1
)

REM Validate next.config.ts
if exist next.config.ts (
    echo next.config.ts exists
) else (
    echo next.config.ts not found
    exit /b 1
)

echo.
echo Step 2: Building Application
echo.

REM Clean previous build
if exist .next (
    echo Cleaning previous build...
    rmdir /s /q .next
)

REM Install dependencies
echo Installing dependencies...
npm ci
if errorlevel 1 (
    echo Failed to install dependencies
    exit /b 1
)

REM Build the application
echo Building application...
npm run build
if errorlevel 1 (
    echo Build failed
    exit /b 1
)

echo Build completed successfully

echo.
echo Step 3: Deploying to Vercel
echo.

REM Check Vercel login
echo Checking Vercel authentication...
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo Not logged in to Vercel. Please run 'vercel login' first.
    exit /b 1
)

REM Deploy
echo Deploying to Vercel...
vercel --prod --yes > deployment-output.txt 2>&1
if errorlevel 1 (
    echo Deployment failed
    type deployment-output.txt
    exit /b 1
)

echo Deployment successful!

REM Extract deployment URL
findstr "https://.*\.vercel\.app" deployment-output.txt > latest-deployment-url.txt 2>nul

echo.
echo Deployment Fix Complete!
echo.
echo Next steps:
echo 1. Wait 1-2 minutes for deployment to propagate
echo 2. Run post-deployment validation tests
echo 3. Monitor for any remaining 404 errors
echo.

if exist latest-deployment-url.txt (
    echo Your deployed site:
    type latest-deployment-url.txt
)

pause
