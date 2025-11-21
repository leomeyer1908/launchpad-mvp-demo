# Loom Script – LaunchPad MVP Demo (Case Study A)

**Target duration:** 2–3 minutes  
**Audience:** Indie SaaS founders, small teams, agencies who want a demo-ready MVP in ~5 days.

You don’t have to follow this word-for-word, but this is the spine.

---

## 1. Intro (10–15 seconds)

**Goal:** Establish who you are and what they’re about to see.

Key points to hit:

- Your name and role:
  - “Hey, I’m Leo Meyer, a freelance developer focused on fast SaaS MVPs and ops automations.”
- What this demo is:
  - “This is LaunchPad, a small SaaS MVP starter I built to show what you get from a 5-day MVP sprint.”
- Who it’s for:
  - “It’s designed for founders who need something real they can demo to users or investors in under a week.”

You can say something like:

> “Hey, I’m Leo. I build fast, production-ready SaaS MVPs and automations.  
> This is a quick walkthrough of LaunchPad — a small example app that shows what you get in a 5-day MVP sprint: sign up, subscribe, see a real project dashboard, and manage billing.”

---

## 2. Core Flow Demo (60–90 seconds)

**Goal:** Show that this is a *real* app — not just screenshots. Focus on the main path:

> sign in → dashboard → (optionally) subscribe → manage billing → new project

Suggested sequence:

1. **Sign in**

   - Show the sign-in page and mention it’s email magic-link based.
   - Use the demo user: `founder@example.com` (or whatever you seeded).
   - Narrate:
     - “I’ll sign in with email magic links — this is Auth.js under the hood, so we can lock this down for real users later.”

2. **Dashboard**

   - After signing in, go to `/dashboard`.
   - Point out:
     - Greeting: “Signed in as founder@example.com”
     - Summary metrics at the top:
       - Total MRR (e.g. `$2,100 MRR`)
       - Number of projects (e.g. `3 projects`)
       - (Optional) active projects
     - “Your Projects” list:
       - Show the three seeded projects and read one out.
   - Narrate:
     - “Right after login, founders land on a simple dashboard that answers: what’s my MRR, how many projects do I have, and what’s active vs paused.”

3. **New Project (optional but nice)**

   - Scroll to or open the **New Project** form.
   - Quickly create a fourth project with small numbers.
   - Show that:
     - The new project appears at the top of the list.
     - Metrics update.
   - Narrate:
     - “Founders can add new projects easily — in a real build, we’d swap ‘Projects’ for whatever your core entity is: campaigns, workspaces, bookings, etc.”

4. **Subscribe + Billing (optional but powerful)**

   - From the header, click **Subscribe**.
   - Show the Stripe Checkout page with the email pre-filled.
   - You don’t need to complete the payment every time; just show it once in the Loom (or use test card).
   - After success (if you go through it), mention the **Billing Portal**:
     - “There’s a Stripe customer portal wired up too, so users can update cards or cancel without tickets.”

Keep the narration focused on outcomes:

> “So in under a week, you’re not just looking at a Figma — you have a live app with sign-in, real Stripe subscription flow, a dashboard, and basic metrics.”

---

## 3. What a Real Client Gets in 5 Days (30–45 seconds)

**Goal:** Translate the demo into a concrete 5-day offer.

Shift the language from “this demo” to “your product”:

Hit points like:

- Day 1–2: scope + wireframes + setup.
- Day 3: auth + payments.
- Day 4: dashboard + metrics.
- Day 5: polish, docs, handover.

Example wording:

> “For a real engagement, this maps to a 5-day MVP sprint.  
> Day 1 and 2 we scope your core flows, set up auth, database, and your Stripe products.  
> Day 3 is payments and webhooks.  
> Day 4 is your dashboard and basic analytics.  
> Day 5 is polish, docs, and handover, so you can actually share a link with investors or early users.”

Reinforce that this is **customizable**:

> “Instead of ‘Projects’, this could be bookings, campaigns, workspaces — whatever your core entity is. The layout stays similar, the domain changes to your idea.”

---

## 4. Next Steps / CTA (10–20 seconds)

**Goal:** Tell them exactly what to do if they like what they saw.

You can tie directly into your Calendly + offer menu:

- Mention the **15-minute fit call**.
- Mention your **offer menu** page.

Example script:

> “If you’d like something like this tailored to your product in about a week,  
> you can book a 15-minute fit call with me — the link’s below.  
> There’s also a short offer menu that breaks down pricing and what’s included.”

Internal links for you to reference when sharing the Loom:

- Calendly: `https://calendly.com/leomeyerbiz/15-minute-meeting`
- Offer menu: your Notion page (e.g.  
  `https://concise-bluebell-ffc.notion.site/Ship-in-5-Days-Leo-Meyer-Software-Contractor-2abf5e1c5dff806aa3a2c4f1c0e84242`)

(You don’t have to read the URLs out loud — just say “link below” and put them in the description.)

---

## Recording Notes (for you)

- Aim for **2–3 minutes** total, don’t over-explain every button.
- Prioritize:
  - Sign-in → dashboard → quick explanation of metrics.
  - Optional: new project.
  - Optional: quick checkout / billing portal glimpse.
- Energy: calm, confident, “I do this all the time,” not salesy.

