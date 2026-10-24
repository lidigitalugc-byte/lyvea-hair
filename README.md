# Lyvea Hair with Paystack

1. Create a Paystack account for Kenya (KES). In Settings > API Keys copy your TEST secret key. Turn on M-Pesa and card under Payment Channels.
2. Put this folder on GitHub, then import it into Vercel (free). Nothing to build.
3. In Vercel > Settings > Environment Variables add PAYSTACK_SECRET_KEY and SITE_URL (your site address, no trailing slash). Redeploy.
4. In Paystack > Settings > API Keys set the Webhook URL to https://YOUR-SITE/api/webhook
5. Supabase: create a free project. Open SQL Editor, paste the contents of supabase.sql and run it. Then in Settings > API copy the Project URL and the service_role key into Vercel as SUPABASE_URL and SUPABASE_SERVICE_KEY, and redeploy. Never put the service_role key in index.html.
6. Place a test order. Paid orders appear in Supabase > Table Editor > orders. When it works, finish Paystack's business verification, swap in the LIVE secret key (sk_live_...) and redeploy.
7. Optional: connect your domain (for example lyveahair.com) in Vercel.

Prices: if you change a price in index.html, change it in api/_catalog.js too. The server uses its own copy.
