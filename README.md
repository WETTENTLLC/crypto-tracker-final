# CryptoTracker

CryptoTracker is a Next.js application for tracking cryptocurrency prices, managing a portfolio, and receiving price alerts. It includes premium subscription features via PayPal integration.

## Deployment

The application is deployed on Vercel at: [https://crypto-tracker-no-modules-pf3q6dusk-wettentllcs-projects.vercel.app](https://crypto-tracker-no-modules-pf3q6dusk-wettentllcs-projects.vercel.app)

### Deployment Documentation

The following documentation files are available to guide you through the deployment process:

- [Final Deployment Guide](./final_deployment_guide.md) - Comprehensive deployment instructions
- [Deployment Checklist](./complete_deployment_checklist.md) - Step-by-step checklist for deployment
- [Deployment Validation](./deployment_validation_instructions.md) - How to validate the deployment
- [Post-Deployment Guide](./post_deployment_guide.md) - Tasks to complete after deployment

### Verify Deployment

To verify that the deployment is working correctly, run:

```bash
node verify-deployment.js
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file for local development with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
COINGECKO_API_KEY=your_coingecko_api_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_WEBHOOK_ID=your_paypal_webhook_id
```

For production, these variables should be configured in the Vercel dashboard.

## Features

- Cryptocurrency price tracking
- Price alerts
- Portfolio management
- Premium subscription via PayPal
- User acquisition automation
- SEO optimizations

## Technologies

- Next.js with App Router
- TypeScript
- Tailwind CSS
- CoinGecko API
- PayPal API
- Recharts for visualizations

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Step-by-Step Deployment Guide

1. **Prerequisites**
   - Ensure you have a [GitHub](https://github.com) account.
   - [Create a Vercel account](https://vercel.com/signup) if you don't have one already.

2. **Prepare Your Project**
   - Push your project to a GitHub repository.
   - Ensure all dependencies are installed: `npm install`.
   - Verify the build works locally: `npm run build`.

3. **Deploy to Vercel**
   - Go to [Vercel New Project](https://vercel.com/new).
   - Import your GitHub repository.
   - Configure the project:
     - **Framework Preset**: Next.js (should be auto-detected)
     - **Build and Output Settings**: Use the defaults
     - **Environment Variables**: Add the variables from `.env.production`
       - NEXT_PUBLIC_API_URL
       - NEXT_PUBLIC_SITE_URL
       - COINGECKO_API_KEY
       - PAYPAL_CLIENT_ID
       - PAYPAL_CLIENT_SECRET
       - PAYPAL_WEBHOOK_ID
   - Click "Deploy".

4. **Custom Domain Setup (Optional)**
   - In your Vercel dashboard, navigate to your project.
   - Go to "Settings" > "Domains".
   - Add your custom domain and follow the DNS configuration instructions.

5. **Post-Deployment Verification**
   - Check that all pages and API routes are working.
   - Verify SEO elements (schema JSON, sitemap, etc.) are accessible.
   - Test premium features and payment workflows if applicable.

For more detailed information, check out our [Vercel Deployment Guide](vercel_deployment_guide.md) or the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

### Local Production Testing

To test the production build locally before deploying:

```bash
# Build the application
npm run build

# Start the production server
npm run start
```

Visit [http://localhost:3000](http://localhost:3000) to view the production build.
