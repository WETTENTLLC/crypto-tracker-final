# Vercel Environment Variables Setup

Follow these steps to configure the environment variables in your Vercel project:

1. Go to your Vercel dashboard: https://vercel.com/wettentllcs-projects/crypto-tracker-no-modules/settings

2. Navigate to the "Environment Variables" section

3. Add the following environment variables:   | Name | Value | Environment |
   |------|-------|-------------|
   | `NEXT_PUBLIC_API_URL` | `https://crypto-tracker-no-modules-a2ol9kt2h-wettentllcs-projects.vercel.app/api` | Production |
   | `NEXT_PUBLIC_SITE_URL` | `https://crypto-tracker-no-modules-a2ol9kt2h-wettentllcs-projects.vercel.app` | Production |
   | `COINGECKO_API_KEY` | `CG-d43qzmJiMgUWSyPUnugQesvj` | Production |
   | `PAYPAL_CLIENT_ID` | `AX_UCD0FG6LaVhl1smF44PQuxkRzoCNE_GreJfYg1DHycaE_IDKHrCJEhfcDWlK5sdVX44E8yBWnFns5` | Production |
   | `PAYPAL_CLIENT_SECRET` | `ELac9rsu8SC5C5pa04b3N2ywO9UAZ_s7p9eXl59E1-kryMttyJ-ndyLlHUqtT058pmMoP9aMEZEBnEUX` | Production |
   | `PAYPAL_WEBHOOK_ID` | `your_paypal_webhook_id` (you'll update this after setting up the PayPal webhook) | Production |

4. After adding all variables, click "Save" to apply the changes

5. Once the environment variables are saved, redeploy your application by clicking "Redeploy" on the Deployments page

## Note About Webhook ID

You'll need to set up a PayPal webhook pointing to your deployed application's webhook endpoint:
`https://crypto-tracker-no-modules-a2ol9kt2h-wettentllcs-projects.vercel.app/api/webhooks/paypal`

After setting up the webhook in the PayPal Developer Dashboard, update the `PAYPAL_WEBHOOK_ID` environment variable with the actual webhook ID provided by PayPal.
