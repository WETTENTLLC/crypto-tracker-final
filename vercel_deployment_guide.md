# Vercel Deployment Guide for CryptoTracker

## Prerequisites
- GitHub account connected to Vercel
- Vercel account (wettentllcs-projects)
- PayPal business account credentials
- CoinGecko API key

## Step 1: Prepare Environment Variables
Set up the following environment variables in your Vercel project:

```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AX_UCD0FG6LaVhl1smF44PQuxkRzoCNE_GreJfYg1DHycaE_IDKHrCJEhfcDWlK5sdVX44E8yBWnFns5
PAYPAL_SECRET=ELac9rsu8SC5C5pa04b3N2ywO9UAZ_s7p9eXl59E1-kryMttyJ-ndyLlHUqtT058pmMoP9aMEZEBnEUX
COINGECKO_API_KEY=CG-d43qzmJiMgUWSyPUnugQesvj
```

## Step 2: Push Code to GitHub
1. Create a new GitHub repository
2. Initialize Git in your project folder:
   ```bash
   cd /path/to/crypto-tracker
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/crypto-tracker.git
   git push -u origin main
   ```

## Step 3: Deploy to Vercel
1. Log in to your Vercel account (wettentllcs-projects)
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next
   - Install Command: `npm install`
5. Add the environment variables listed in Step 1
6. Click "Deploy"

## Step 4: Configure Custom Domain (Optional)
1. In your Vercel project settings, go to "Domains"
2. Add your custom domain
3. Follow the instructions to configure DNS settings

## Step 5: Set Up PayPal Webhook
1. Log in to the [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Navigate to your app
3. Go to "Webhooks"
4. Add a new webhook with the URL: `https://your-vercel-domain.vercel.app/api/webhooks/paypal`
5. Select the following events:
   - PAYMENT.SALE.COMPLETED
   - BILLING.SUBSCRIPTION.CREATED
   - BILLING.SUBSCRIPTION.CANCELLED
   - BILLING.SUBSCRIPTION.EXPIRED
   - PAYMENT.SALE.REFUNDED

## Step 6: Verify Deployment
1. Visit your deployed site
2. Test the following features:
   - Homepage loading with cryptocurrency data
   - User registration and login
   - Premium subscription flow with PayPal
   - Price alerts creation
   - Admin dashboard access

## Step 7: Access Admin Dashboard
1. Navigate to `https://your-vercel-domain.vercel.app/admin/login`
2. Log in with the following credentials:
   - Email: admin@cryptotracker.com
   - Password: admin123
3. Verify all admin features are working:
   - Analytics dashboard
   - User management
   - Payment management
   - Settings

## Step 8: Set Up Automated User Acquisition
1. Configure social media accounts for automated posting
2. Set up email marketing integration
3. Enable RSS feed for content syndication
4. Configure Google Analytics and Search Console

## Step 9: Monitor Performance
1. Set up monitoring for API rate limits
2. Monitor user acquisition metrics
3. Track conversion rates for premium subscriptions
4. Analyze user engagement and retention

## Troubleshooting
- If the site doesn't build, check the build logs in Vercel
- If API calls fail, verify environment variables are correctly set
- For PayPal integration issues, check webhook configuration
- For admin access issues, clear browser cache and try again
