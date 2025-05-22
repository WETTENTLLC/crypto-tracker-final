# Vercel Deployment Configuration

## Environment Variables
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AX_UCD0FG6LaVhl1smF44PQuxkRzoCNE_GreJfYg1DHycaE_IDKHrCJEhfcDWlK5sdVX44E8yBWnFns5
PAYPAL_SECRET=ELac9rsu8SC5C5pa04b3N2ywO9UAZ_s7p9eXl59E1-kryMttyJ-ndyLlHUqtT058pmMoP9aMEZEBnEUX
COINGECKO_API_KEY=CG-d43qzmJiMgUWSyPUnugQesvj
PAYPAL_WEBHOOK_SECRET=your_webhook_secret_here
```

## Build Settings
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`
- Development Command: `npm run dev`

## Deployment Instructions
1. Push code to GitHub repository
2. Connect repository to Vercel account (wettentllcs-projects)
3. Configure environment variables as listed above
4. Deploy the application
5. Set up PayPal webhook URL to point to `https://[your-vercel-domain]/api/webhooks/paypal`

## Post-Deployment Steps
1. Update PayPal webhook URL in PayPal Developer Dashboard
2. Test premium subscription flow in production
3. Verify admin dashboard access
4. Monitor initial transactions and user signups

## Security Notes
- Environment variables are automatically encrypted by Vercel
- API keys and secrets are never exposed to the client
- Webhook signature verification should be enabled in production
