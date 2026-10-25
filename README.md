<div align="center">

<a href="https://getassure.vercel.app">
  <img src="public/logo.png" alt="Assure" height="64">
</a>

<h1>Assure</h1>

### Every warranty. Assured.

Assure keeps every warranty you own in one place. It tracks what is covered, counts down to what is expiring, and helps you make a claim before it is too late.

[**Open Assure**](https://getassure.vercel.app) · [Pricing](https://getassure.vercel.app/pricing) · [Privacy Policy](https://getassure.vercel.app/privacy) · [How it works](#how-it-works) · [Run it locally](#run-it-locally)

![Next.js 16](https://img.shields.io/badge/Next.js-16-0a0a0a?logo=nextdotjs&logoColor=white)
![React 19](https://img.shields.io/badge/React-19-333333?logo=react&logoColor=white)
![Neon Postgres](https://img.shields.io/badge/Neon-Postgres%20%2B%20Auth-333333?logo=postgresql&logoColor=white)
![Vercel Blob](https://img.shields.io/badge/Vercel-Blob%20%2B%20AI%20Gateway-333333?logo=vercel&logoColor=white)
![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-0a0a0a?logo=vercel&logoColor=white)

</div>

---

## Features

- **Every warranty in one place**, with the product, retailer, purchase date and expiry date
- **Expiry countdown** so you see what is about to run out first
- **AI receipt scan**: photograph a receipt and Assure fills in the warranty for you
- **Receipts kept with the warranty**, stored privately and shown only to you
- **AI claim help**: a guided conversation that walks you through filing a claim for a specific product
- **Private by default**: your warranties and receipts are never sold or shared

## How it works

1. **Create an account** with email and password.
2. **Add a warranty** by hand, or scan the receipt and let Assure read it.
3. **Watch the countdown.** The dashboard sorts by what is expiring soonest.
4. **Make a claim** with the claim assistant when something breaks while still covered.

## Plans

| | Free trial | Assure+ |
| --- | --- | --- |
| Price | $0 | $5 / month |
| Warranties | 5 | 100 |
| AI receipt scans | 1 | 50 per month |
| AI claim sessions | 1 (up to 10 messages) | 25 per month (up to 10 messages each) |

Limits live in [`lib/plans.js`](lib/plans.js), the single source for the API routes, the pricing page and the dashboard meters. Billing is not live yet, so every account currently uses the free trial.

## Built with

| Layer | Technology |
| --- | --- |
| Web app | Next.js 16 (App Router), React 19, Tailwind CSS v4 |
| Database | Neon Postgres through `pg`, one pooled connection per warm instance |
| Accounts | Neon Auth (managed Better Auth), with the dashboard protected in `proxy.js` |
| Receipts | Vercel Blob, private access, served through an authenticated route |
| AI | Vercel AI Gateway (`openai/gpt-6-luna`) for receipt reading and claim chat |
| Hosting | Vercel (Fluid Compute) |

## Repository layout

```
app/              Pages: landing, login, dashboard, pricing, privacy, terms
app/api/          Route handlers: auth, warranties, receipt upload and image, receipt scan, claim chat, profile
lib/              Database pool, auth, session, warranties, claims, plan limits and usage metering
components/       Shared UI (plan cards)
proxy.js          Redirects signed-out visitors away from /app
brand/            Logo master
public/           Icons and the web app manifest
```

## Run it locally

Requires Node 20.9+ and a Neon project with Neon Auth enabled.

```bash
npm install
```

Create `.env.local`:

```bash
DATABASE_URL=postgres://...           # Neon pooled connection string
NEON_AUTH_BASE_URL=...
NEON_AUTH_COOKIE_SECRET=...           # openssl rand -base64 36
AI_GATEWAY_API_KEY=...                # receipt scans and claim chat
BLOB_READ_WRITE_TOKEN=...             # receipt uploads (vercel env pull provides it)
```

Then start the app:

```bash
npm run dev                           # http://localhost:3000
```

## Deploying

Pushes to `main` deploy to production on Vercel. Set the variables above in the Vercel project, connect a Blob store, and add the production URL as a trusted domain in Neon Auth so sign-in can redirect back to it.
