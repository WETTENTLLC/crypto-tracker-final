# Deploy with Real PayPal Integration
Write-Host "🚀 Deploying CryptoTracker with Real PayPal Integration..." -ForegroundColor Green

# Set up PayPal subscription plans
Write-Host "📋 Setting up PayPal subscription plans..." -ForegroundColor Yellow
node setup-paypal-subscriptions.js

# Build and deploy
Write-Host "🔨 Building application..." -ForegroundColor Yellow
npm run build

# Deploy to Vercel with environment variables
Write-Host "🌐 Deploying to Vercel..." -ForegroundColor Yellow
vercel --prod

Write-Host "✅ Deployment complete! Your site now processes real PayPal payments." -ForegroundColor Green
Write-Host "💰 Revenue will now be tracked in your PayPal account." -ForegroundColor Green