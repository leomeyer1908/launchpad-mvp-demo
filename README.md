# LaunchPad – SaaS MVP Starter Demo

A small example SaaS MVP starter: **email sign-in → Stripe subscription → project dashboard → billing portal**, built with the same stack I use for 1-week “MVP Jumpstart” sprints.

> Demo repo for clients: “Here’s what I can put in your hands in 5 days.”

---

## Stack

- **Next.js (App Router) + TypeScript + Tailwind CSS**
- **Prisma** ORM
- **Supabase Postgres** (hosted Postgres)
- **Auth.js / NextAuth** (email magic links)
- **Stripe** Checkout + Billing Portal (subscriptions)
- **PostHog** (basic analytics)

---

## What this demo includes

**End-to-end flow:**

1. **Sign in with email**
   - Email address form at `/signin`.
   - In development, magic link is printed to the server logs (no need for a real mailbox while testing).

2. **Subscribe to a plan**
   - `/subscribe` starts a **Stripe Checkout** subscription flow for a single price ID.
   - Test card support (e.g., `4242 4242 4242 4242` in test mode).

3. **See a real dashboard**
   - `/dashboard` is **auth-protected**.
   - Shows a list of “Projects” for the logged-in user.
   - Includes summary metrics:
     - Total MRR (USD)
     - Number of projects
     - Number of active projects
   - Demo user (`founder@example.com`) is seeded with example projects so the UI looks alive on first login.

4. **Create a new project**
   - “New project” form at the bottom of `/dashboard`.
   - Fields: name, description, MRR, active users, status (ACTIVE / TRIALING / PAUSED / CANCELLED).
   - Submits via a **server action**, writes to Postgres via Prisma, and refreshes the dashboard.

5. **Manage billing**
   - After subscribing, you can open the **Stripe Billing Portal** via a “Manage billing” button.
   - Customers can update cards, cancel, or manage their subscription directly.

6. **Basic analytics**
   - PostHog snippet is wired so you can track page views and basic events.

This is intentionally small and opinionated: enough to demo a real SaaS flow, but easy to adapt for a specific product.

---

## Quickstart

### 1. Clone & install

```bash
git clone https://github.com/leomeyer1908/launchpad-mvp-demo.git
cd launchpad-mvp-demo
npm install
````

### 2. Environment variables

Copy the example env file:

```bash
cp .env.example .env
```

Fill in the following (you can reuse the same test keys you use in your boilerplate project):

```env
# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# Auth / NextAuth
AUTH_SECRET=your_long_random_secret
AUTH_TRUST_HOST=true
NEXTAUTH_URL=http://localhost:3000

# Supabase (for client access)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key

# Resend (for magic-link emails)
RESEND_API_KEY=re_xxx
EMAIL_FROM="Your Name <no-reply@yourdomain.com>"

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx   # from `stripe listen`
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
NEXT_PUBLIC_STRIPE_PRICE_ID=price_xxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

> For a quick demo on your own machine, you can literally copy-paste the same `.env` you already have working in your boilerplate project.

### 3. Migrate the database

Apply Prisma migrations:

```bash
npx prisma migrate dev
```

This will create/update the `User` and `Project` tables (and any existing models) in your Supabase Postgres database.

### 4. Seed the demo user & projects

If you’ve added a seed script (recommended):

```bash
npx prisma db seed
```

The seed should:

* Ensure a user with email: `founder@example.com` exists.
* Create 2–3 `Project` records linked to that user, e.g.:

  * “Analytics Dashboard” – $1,200 MRR, 85 active users, ACTIVE
  * “Internal Tools Revamp” – $600 MRR, 40 active users, TRIALING
  * “Client Portal (Legacy)” – $300 MRR, 20 active users, PAUSED

If you don’t have a seed script, you can create the records manually via `npx prisma studio`.

### 5. Run the dev server

```bash
npm run dev
```

Open `http://localhost:3000`.

---

## Demo flow

### Sign in

1. Go to `/signin`.
2. Enter the demo email: `founder@example.com`.
3. In development, check your dev server logs for the magic-link URL and open it in the browser.

You should land back in the app as a signed-in user.

### Subscribe

1. Visit `/subscribe`.
2. Start checkout, and use a Stripe **test card** (e.g. `4242 4242 4242 4242`, any future expiry, any CVC, any ZIP).
3. On success, you’ll land on `/success`.
4. Your test subscription appears in the Stripe dashboard.

### Dashboard

1. Visit `/dashboard` while signed in as `founder@example.com`.

2. You’ll see:

   * Total MRR (sum of your demo projects)
   * Project count
   * Active project count
   * A grid of project cards with:

     * Name
     * Description
     * MRR
     * Active users
     * Status pill (ACTIVE / TRIALING / PAUSED / CANCELLED)
     * Created date

3. Scroll to **New project** and create another project.

   * The dashboard and metrics update on submit.

### Billing portal

After you’ve created a test subscription:

1. Use the “Manage billing” button in the app.
2. You’ll be redirected to Stripe’s **Customer Portal** for that demo customer.
3. From there you can:

   * Cancel the subscription
   * Update payment methods
   * See billing history (in test mode)

---

## How this maps to real MVPs

This repo is meant as a **template for 1-week MVP sprints**. For a real client, I typically:

* **Customize the core entity model**

  * `Project` becomes `Workspace`, `Property`, `Store`, `Campaign`, etc.
  * Add the specific fields they care about (e.g., seats, plan tier, region).

* **Adapt billing**

  * Map Stripe products/plans to their actual pricing.
  * Add plan switching (upgrade/downgrade) and trials.
  * Optional seat-based or usage-based billing.

* **Wire analytics to real behavior**

  * Capture events around sign-ups, invites, and core product actions.
  * Build simple funnels to see where users drop off.

* **Harden auth / onboarding**

  * Add social login, invitations, team accounts, roles/permissions.
  * Add guided tours or checklists on the dashboard.

* **Deploy & hand over**

  * Deploy to Vercel (or client’s platform of choice).
  * Provide a short runbook (env vars, deploy steps, support checklist).
  * Record 2–3 Looms walking through code and ops.

This demo answers: **“Can you get me to a working SaaS with real payments and a dashboard in ~5 days?”**
For production clients, we scope exactly what fits into that initial sprint and then plan a next iteration.

---

## Who this is for

This LaunchPad demo is aimed at:

* **Indie SaaS founders**
  Who need a real, clickable, payment-enabled product for users, investors, or landing pages.

* **Small product teams / agencies**
  Who want a reliable dev partner to ship web features, MVPs, or Stripe integrations quickly.

* **Ops-heavy businesses**
  Who eventually want automations (bookings, CRM, notifications) layered on top of a simple SaaS base.

---

## Working with me

If you’d like a similar MVP tailored to your product:

* I run **1-week sprints** like this (auth + payments + dashboard + deploy).
* Fixed-scope offers:

  * **MVP Jumpstart** – landing, auth, Stripe, basic analytics, deploy.
  * **Bug Burner Week** – kill 10 bugs/perf issues with before/after metrics.
  * **Ops Automation Pack** – bookings/leads automations with human-readable dashboards.

To talk about a build:

* Book a 15-min fit call: `https://calendly.com/leomeyerbiz/15-minute-meeting`
* Or email: `leomeyerbiz@gmail.com`

