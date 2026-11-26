# AfterAdmit — Pending Features & Service Recommendations

**Purpose:** Inventory of what’s still mock, partial, or unwired, plus practical **free / open-source / free-to-start** options for each gap.

**Status key**

| Label | Meaning |
|---|---|
| **MOCK** | UI only (toast / static data); no real backend |
| **PARTIAL** | Some Supabase wiring; gaps remain |
| **MISSING** | Feature needed; no integration yet |
| **PIPELINE** | Rows/RPCs exist (e.g. `pending_checkout`); no external provider |

**How to read “Recommended”:** Prefer free tier or OSS first; note when you must pay later at scale.

---

## 1. Payments & billing

| Pending item | Status | What’s missing |
|---|---|---|
| Student plan checkout / card | PIPELINE | `request_plan_checkout` → `pending_checkout` only |
| Partner plan checkout | PIPELINE | Same pattern for `partner_org` |
| University school contract payment | PIPELINE | Contract rows; no charge flow |
| Real invoices / receipts / refunds | PARTIAL | DB invoices; client CSV, not payment-provider invoices |
| Partner monthly spend cap enforcement | MOCK | Local React state |

### Recommended services

| Need | Best free-to-start | Notes / alternatives |
|---|---|---|
| Cards, subscriptions, invoices | **[Stripe](https://stripe.com)** | Industry default; pay-as-you-go (no monthly fee). Test mode free. |
| Lower-fee / global wallets | **[Lemon Squeezy](https://www.lemonsqueezy.com)** or **[Paddle](https://www.paddle.com)** | Merchant-of-record (tax handled); fees higher; good for digital. |
| India-first / UPI | **[Razorpay](https://razorpay.com)** | Strong if many India payers; freemium-ish (txn fees). |
| OSS self-host billing | **[Kill Bill](https://killbill.io)** / **[Solidus](https://solidus.io)** | Heavy ops; rarely worth it early. |
| “Invoice offline” MVP | **None** | Keep `pending_checkout` + manual bank/ACH; add Stripe when revenue exists. |

**Suggestion for AfterAdmit:** Stay on Stripe (test → live). Keep current pipeline; add a webhook Edge Function later. Don’t build custom payment rails.

---

## 2. Transactional & marketing email

| Pending item | Status | What’s missing |
|---|---|---|
| Student invite send / resend / remind | MISSING | Tokens + copy-link only |
| Bounce / open tracking | PARTIAL | Status labels; no ESP webhooks |
| Password reset polish | PARTIAL | Supabase Auth email (configure SMTP/custom) |
| Contact form | MOCK | Toast only |
| Newsletter / blog subscribe | MOCK | Toast only |

### Recommended services

| Need | Best free-to-start | Notes / alternatives |
|---|---|---|
| Transactional (invites, resets) | **[Resend](https://resend.com)** | Generous free tier; great DX with Next.js. |
| Same | **[Amazon SES](https://aws.amazon.com/ses/)** | Cheapest at scale; more setup (SPF/DKIM). |
| Same | **[Postmark](https://postmarkapp.com)** | Excellent deliverability; free trial then paid. |
| OSS self-host | **[Postal](https://docs.postalserver.io/)** / **[Mailu](https://mailu.io)** | You own reputation; hard for cold domains. |
| Marketing / newsletter | **[Loops](https://loops.so)** or **[Buttondown](https://buttondown.com)** | Simple; free tiers. |
| Marketing at scale | **[Brevo](https://www.brevo.com)** (ex-Sendinblue) | Free tier for small lists. |
| Forms → email/CRM | **[Formspree](https://formspree.io)** / **[Getform](https://getform.io)** | Fast for contact; free tiers. |
| Auth emails only | **Supabase Auth + custom SMTP** | Point Supabase at Resend/SES SMTP. |

**Suggestion:** Resend for invites + contact; Supabase SMTP → Resend for auth mail. Add bounce webhooks into `invites.status` later.

---

## 3. Student app

| Pending item | Status | What’s missing |
|---|---|---|
| Community post detail route | MOCK | Still seed data; feed is live |
| Community space detail route | MOCK | Same |
| Post image upload | PARTIAL | Object URLs; `uploadCommunityImage` unused |
| Create-post space picker from DB | PARTIAL | Seed communities |
| Draft posts | MOCK | Toast only |
| “Was this helpful?” → DB | MOCK | Never writes `milestone_feedback` |
| Milestone **catalog** in DB | PARTIAL | Template in `@/lib/data`; progress live |
| Shell notifications | MOCK | Static |
| Unread DM badge | PARTIAL | Hard-coded / not tied to messages |
| Profile password / 2FA / sessions | MOCK | No Auth admin APIs |
| Notification prefs persistence | MOCK | UI toggles only |
| OAuth (Google, LinkedIn) | MISSING | Email/password only |
| GDPR export / account delete | MOCK | Demo toasts |
| Command palette search | MOCK | Indexes static libs |

### Recommended services

| Need | Best free-to-start | Notes |
|---|---|---|
| Image / file storage | **[Supabase Storage](https://supabase.com/storage)** (already in stack) | Stay here; wire uploads. |
| CDN / image transform | **Supabase Image Transformation** or **[Cloudinary](https://cloudinary.com)** free tier | Optional polish. |
| Realtime unread / notifs | **Supabase Realtime** | Already available on project. |
| Push notifications (later) | **[OneSignal](https://onesignal.com)** free tier | Mobile/web push. |
| OAuth | **Supabase Auth providers** | Google free; LinkedIn via OAuth app. |
| Password breach check | **[Have I Been Pwned range API](https://haveibeenpwned.com/API/v3)** | Free for k-anonymity hash prefix. |
| 2FA | **Supabase MFA** (TOTP) | Built-in; no extra vendor. |
| Full-text search | **Postgres `tsvector` / Supabase** | Avoid Algolia until needed. |
| Hosted search (later) | **[Typesense Cloud](https://typesense.org)** or **Meilisearch** | OSS + free tiers. |

**Suggestion:** No new vendors for most of this — finish Supabase wiring (routes, storage, feedback insert, Realtime). Add HIBP + Google OAuth when hardening auth.

---

## 4. University admin

| Pending item | Status | What’s missing |
|---|---|---|
| Invite email delivery | MISSING | Same as §2 |
| Invite admin via FormSheet | MOCK | Toast / local |
| Contract payment | PIPELINE | See §1 |

### Recommended services

Same as **email (§2)** and **payments (§1)**. No university-specific SaaS required beyond that.

---

## 5. Partner app

| Pending item | Status | What’s missing |
|---|---|---|
| Listing photos → storage | MISSING | Local object URLs |
| Full listing fields on save | PARTIAL | Often only name/category |
| Placements model | PARTIAL / MOCK | UI checkboxes; weak persistence |
| Review / approval workflow | MOCK | “In review” UX; admin approve toast |
| Lead CSV export | MOCK | Toast without file |
| Spend cap | MOCK | Local state |
| Partner checkout | PIPELINE | See §1 |

### Recommended services

| Need | Best free-to-start | Notes |
|---|---|---|
| Listing images | **Supabase Storage** | Mirror student avatars pattern. |
| Export CSV | **In-app** (`downloadFile` / `toCsv` already exist) | No vendor. |
| Analytics on leads (later) | **[PostHog](https://posthog.com)** free tier | Product analytics; optional. |

---

## 6. AfterAdmit admin (ops)

| Pending item | Status | What’s missing |
|---|---|---|
| Roadmap template editor | MOCK | Entirely `@/lib/data`; saves are toasts |
| Provider create/edit upsert | MOCK | FormSheet toast |
| Listing approval queue | MOCK | Hard-coded card |
| Archive university | MOCK | Local state |
| Push template to schools | MOCK | Toast |
| Manage terms / invite school admin | MOCK | FormSheet toast |
| Overview stage-completion chart | MOCK | `ops-data` |
| Overview date-range filter | MOCK | UI only |
| Feedback / leads “export” | MOCK | Toast only |
| Support agent replies | PARTIAL | Status RPC; replies in-memory |
| Team invites | MOCK | Local array |
| Platform defaults save | MOCK | Toast |

### Recommended services

| Need | Best free-to-start | Notes |
|---|---|---|
| Milestone/roadmap as data | **Supabase Postgres tables + RPCs** | Best fit; no CMS needed. |
| Ops audit log (later) | Postgres table | Avoid Datadog until scale. |
| Support helpdesk (optional) | **[Plain](https://www.plain.com)** / **[Crisp](https://crisp.chat)** free tier / **[Chatwoot](https://www.chatwoot.com)** OSS | Only if in-app tickets aren’t enough. |
| Feature flags (later) | **[GrowthBook](https://www.growthbook.io)** OSS / free | Optional. |

**Suggestion:** Prefer first-party Supabase for roadmap + support replies. Don’t buy Zendesk until ticket volume hurts.

---

## 7. Marketplace

| Pending item | Status | What’s missing |
|---|---|---|
| `/go/[id]` offer landing | MOCK | Static providers; form toast |
| Fallback to static providers | PARTIAL | Live list with `@/lib/data` fallback |

### Recommended services

None required — finish Supabase reads/writes. Optional later: **PostHog** for funnel on `/go`.

---

## 8. Support & help

| Pending item | Status | What’s missing |
|---|---|---|
| Student “My requests” create | MOCK | In-memory `support-store` |
| Admin reply persistence | PARTIAL | No message thread table/RPC |
| Helpful feedback in help sheet | MOCK | Toast |
| Help center content | MOCK | Static `help-data` |

### Recommended services

| Need | Best free-to-start | Notes |
|---|---|---|
| Tickets | **Supabase tables** (extend `support_tickets` + messages) | Matches current direction. |
| Hosted helpdesk | **Chatwoot** (OSS) or **Crisp** | If you want chat widget. |
| Docs / help CMS | **[Mintlify](https://mintlify.com)** free hobby / **[Nextra](https://nextra.site)** OSS | Or keep MD in repo. |

---

## 9. Auth & security

| Pending item | Status | What’s missing |
|---|---|---|
| Google / SSO | MISSING | No `signInWithOAuth` |
| Have I Been Pwned | MISSING | Local password rules only |
| Session management UI | MOCK | Demo |
| MFA | MISSING | Not exposed in UI |

### Recommended services

| Need | Best free-to-start | Notes |
|---|---|---|
| Auth core | **Supabase Auth** (current) | Keep. |
| Google OAuth | Google Cloud OAuth client + Supabase provider | Free. |
| University SSO (later) | **[WorkOS](https://workos.com)** free tier or Supabase SAML (paid plans) | Only when enterprise schools demand it. |
| Breach passwords | **HIBP Pwned Passwords API** | Free. |
| Bot / abuse | **[Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/)** | Free CAPTCHA alternative. |
| WAF / DDoS | **Cloudflare** (site already relevant) | Free plan often enough early. |

---

## 10. Marketing site & content

| Pending item | Status | What’s missing |
|---|---|---|
| Contact / newsletter / blog subscribe | MOCK | Toasts |
| Blog / careers / legal | MOCK | Static TS modules |
| Demo booking | PARTIAL | Links to contact |

### Recommended services

| Need | Best free-to-start | Notes |
|---|---|---|
| Forms | **Resend** + Edge Function, or **Formspree** | See §2. |
| Scheduling demos | **[Cal.com](https://cal.com)** (OSS + free cloud) | Better than “email us”. |
| CMS (later) | **[Sanity](https://www.sanity.io)** free tier / **[Payload](https://payloadcms.com)** OSS | Only if non-devs edit often. |
| Analytics | **[Vercel Analytics](https://vercel.com/analytics)** (already added) + **[Plausible](https://plausible.io)** or **[Umami](https://umami.is)** OSS | Privacy-friendly. |
| SEO crawl data | Keep current SEO tooling; no blocker. |

---

## 11. Cross-cutting / infra

| Pending item | Status | What’s missing |
|---|---|---|
| Demo tour | MOCK | Local/session only (OK for marketing) |
| Shared seed libs (`data`, `ops-data`, `community-data`) | MOCK | Still feed many screens |
| Error monitoring | Likely MISSING | Not called out as wired |
| Uptime | — | Ops hygiene |

### Recommended services

| Need | Best free-to-start | Notes |
|---|---|---|
| Errors / performance | **[Sentry](https://sentry.io)** free tier | Best default. |
| Uptime | **[Better Stack](https://betterstack.com)** or **[UptimeRobot](https://uptimerobot.com)** | Free monitors. |
| Logs | **Supabase Logs** + Vercel | Enough early. |
| Secrets | Vercel env + Supabase secrets | Already the pattern. |
| Background jobs (invite batches, Stripe sync) | **[Trigger.dev](https://trigger.dev)** free tier / **Supabase Edge + cron** / **[Inngest](https://www.inngest.com)** | Pick one when email/Stripe land. |

---

## Priority order (recommended)

If the goal is “real users can use the product,” do this order:

1. **Invite email (Resend + Supabase)** — universities can’t operate without it  
2. **Finish student community detail/space + feedback write** — core daily use  
3. **Support ticket create + admin reply in DB** — ops trust  
4. **Admin roadmap in Postgres** — stop shipping code to change milestones  
5. **Stripe** — when you’re ready to charge; until then keep pipeline + manual  
6. **Partner/community images in Storage** — polish  
7. **Google OAuth + HIBP + MFA** — hardening  
8. **Marketing forms + Cal.com** — growth, not blockers for admitted students  

---

## Vendor cheat-sheet (stack-friendly)

| Domain | Pick | Cost model |
|---|---|---|
| DB / Auth / Storage / Realtime | **Supabase** (current) | Free → Pro |
| Hosting | **Vercel** (current) | Free → Pro |
| Analytics | **Vercel Analytics + Speed Insights** (done) | Included / plan |
| Payments | **Stripe** | % + fee |
| Email | **Resend** (or SES at scale) | Free tier → usage |
| Password breaches | **HIBP API** | Free |
| Bot protection | **Cloudflare Turnstile** | Free |
| Errors | **Sentry** | Free tier |
| Demo booking | **Cal.com** | Free / OSS |
| Push (later) | **OneSignal** | Free tier |
| Search (later) | Postgres FTS → Typesense/Meilisearch | Free → paid |

---

## Explicitly out of scope for “new SaaS”

These should stay **in-house on Supabase**, not new vendors:

- Milestone catalog & roadmap template  
- Partner listings CRUD & leads  
- Marketplace clicks  
- DMs / community posts (finish routes)  
- Admin school upsert / invite tokens  
- Notification preference JSON on `profiles`  

---

## Launch & domain tasks

- [ ] **Attach `afteradmit.com` to the live Vercel project.** The domain is currently on another Vercel account. Either transfer the project into the personal account, or remove the domain from the old account and add it to this project. Namecheap DNS needs no change.
- [ ] **Switch Supabase Site URL to `https://afteradmit.com`** once the domain is valid in Vercel. Keep `https://afteradmit.vercel.app/**` and `http://localhost:3000/**` in Redirect URLs.
- [ ] **Build all email links from the current site URL**, not a hardcoded domain, so invites work on either domain.
- [ ] **Transfer the Vercel project to a company/team account later** (Project Settings → Advanced → Transfer). Domains and env vars move with it.
- [ ] **Enable 2FA** on the Vercel account.

---

*Generated for discussion only. No implementation implied by this document.*
