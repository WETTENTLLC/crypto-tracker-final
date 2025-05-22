This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

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
