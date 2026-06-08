# Pick a Shift — Audit Report

_Last updated: 2026-06-07_

Live: [pickashift.org](https://pickashift.org) · Repo: `main`

---

## Executive summary

The product moved from “prototype with gaps” to **credible closed-beta quality**. Core flows work, auth is solid, the public surface is polished, and launch blockers (trigger bug, seed data, legal, contact, OG) are addressed. Remaining work is mostly **interior UI**, **product features promised in copy**, and **defense-in-depth security** — not show-stoppers for a controlled beta.

**Overall soft-launch readiness: 7.5 / 10**

---

## Scorecard (out of 10)

| Aspect | Grade | One-line verdict |
|--------|-------|------------------|
| **Public UI / branding** | **8.0** | Red/navy palette, split hero, navy nav, legal pages — cohesive |
| **Auth & route protection** | **7.5** | Middleware + guards on all dashboards; a few action-level gaps |
| **Core marketplace flow** | **8.0** | Sign up → onboard → post/apply → accept → message → complete |
| **Dashboard UI (student/biz)** | **5.5** | Modern shell + home pages; most inner pages still legacy CSS |
| **Admin tooling** | **7.5** | Users, businesses, contact inbox — functional |
| **Data integrity** | **8.0** | Completion trigger fixed (005); seed data in prod |
| **SEO & social sharing** | **8.0** | `metadataBase`, OG/Twitter, `og-image.png` |
| **Legal & trust content** | **8.0** | Privacy, terms, help, FAQ, contact; copy mostly honest |
| **Email & comms** | **5.0** | Resend for contact only; no shift/application emails |
| **Notifications (in-app)** | **6.5** | Works via bell; no realtime; full-page list doesn’t mark read |
| **Mobile UX** | **7.0** | Responsive landing, `DashShell`, bottom nav |
| **Security (defense in depth)** | **6.0** | App-layer auth good; RLS permissive; 2 weak server actions |
| **DevOps / CI** | **8.0** | GitHub Actions lint+build; Vercel deploy |
| **i18n / locale** | **3.0** | English UI; metadata `es_ES` only |
| **Payments / earnings truth** | **4.0** | Earnings tracked in DB; no Stripe/payouts |
| **Product completeness** | **6.5** | Saved shifts stub, no withdraw, no-show unused |
| **Code maintainability** | **7.0** | Clear structure; dual CSS systems (Tailwind + legacy) |

### Grade summary

```
Public UI        ████████░░  8.0
Core flows       ████████░░  8.0
Auth             ███████▌░░  7.5
Data/DB          ████████░░  8.0
SEO/Legal        ████████░░  8.0
DevOps           ████████░░  8.0
Dashboard UI     █████▌░░░░  5.5
Email            █████░░░░░  5.0
Payments         ████░░░░░░  4.0
i18n             ███░░░░░░░  3.0
Security depth   ██████░░░░  6.0
─────────────────────────────────
Soft launch      ███████▌░░  7.5
Full public launch (estimate)  ██████░░░░  6.5  ← after Sprint C–D
```

---

## What we fixed (already done)

### Auth, security & routing

| Fix | Status |
|-----|--------|
| All student pages use `requireStudentProfile()` | ✅ |
| Business pages use `requireBusinessProfile()` | ✅ |
| Onboarding role bypass blocked in `proxy.ts` + actions | ✅ |
| Clerk webhook syncs `role`, `suspended`, `onboarding_complete` | ✅ |
| `middleware.ts` → `proxy.ts` (Next.js 16) | ✅ |
| Sign-out in `DashShell` | ✅ |
| Sign-in uses `/sign-in` link (not Clerk modal) | ✅ |

### Resilience & infra

| Fix | Status |
|-----|--------|
| Root `error.tsx` + `loading.tsx` | ✅ |
| `force-dynamic` removed from root layout | ✅ |
| `next.config.ts` Supabase image domains | ✅ |
| CI workflow (lint + build on `main`) | ✅ |
| `@supabase/ssr` dead dependency removed | ✅ |

### Public surface & marketing

| Fix | Status |
|-----|--------|
| Lovable landing (split hero, sections, footer links) | ✅ |
| `LandingNav` on browse, shift detail, legal pages | ✅ |
| `SiteHeader` removed from live routes | ✅ |
| OG / Twitter metadata + `og-image.png` | ✅ |
| Legal: `/privacy`, `/terms`, `/help`, `/faq`, `/contact` | ✅ |
| Contact form → Supabase + optional Resend notify | ✅ |
| Admin contact inbox `/admin/contact` | ✅ |
| Footer: Platform + Support only (no `#` company links) | ✅ |
| Emails → `@pickashift.org` in `lib/site.ts` | ✅ |
| Saved Shifts removed from student nav | ✅ |

### Sprint B + launch prep

| Fix | Status |
|-----|--------|
| Auth + onboarding Tailwind reskin | ✅ |
| Migration **004** contact submissions (prod) | ✅ |
| Migration **005** completion trigger fix (prod + repo) | ✅ |
| Demo seed: 5 businesses + 15 shifts (`supabase/seed_demo_shifts.sql`, prod) | ✅ |
| Help/FAQ reworded (no false withdraw/no-show promises) | ✅ |
| Resend env + domain verified (prod) | ✅ |

### Rebrand & UI fixes

| Fix | Status |
|-----|--------|
| Palette: red `#CC0000`, navy `#0A1628`, greys per design system | ✅ |
| Red = primary (hero business panel, CTAs); navy = secondary (nav, footer) | ✅ |
| Navy landing nav header | ✅ |
| Log in visible (outline button; fixed `color: inherit` on links) | ✅ |
| Onboarding buttons visible (removed global `button { background: none }` override) | ✅ |
| Updated logos + OG assets in `public/` | ✅ |

---

## Route inventory

| Area | Routes | Status |
|------|--------|--------|
| Public | `/`, `/browse`, `/shifts/[id]`, legal ×5 | **Full** |
| Auth | sign-in, sign-up, role picker, onboarding ×2 | **Full** (role picker still legacy CSS) |
| Student | 10 dashboard routes | **9 full**, 1 stub (`/dashboard/saved`) |
| Business | 12 `/biz/*` routes | **All functional** |
| Admin | 4 routes | **All functional** |

---

## What still needs implementation

### High priority (before broad launch)

| Item | Why it matters | Effort |
|------|----------------|--------|
| **Harden `createConversation`** | Any authed user can create conversations for arbitrary IDs (`lib/actions/messages.ts`) | Small |
| **Harden `createNotification`** | Same pattern; spam vector if exposed (`lib/actions/notifications.ts`) | Small |
| **`cancelShift` → update applications** | Students still see “accepted” after shift cancelled | Medium |
| **Contact form rate limiting** | Public endpoint, no throttle visible | Small |
| **Check `createNotification` return values** | Callers ignore `{ error }` — silent notification loss | Small |

### Medium priority (UX & trust)

| Item | Why it matters | Effort |
|------|----------------|--------|
| **Reskin `/sign-up/role`** | Last page on legacy `.auth-page` | Small |
| **Hide or build `/dashboard/saved`** | Orphan “Coming soon” route | Small |
| **Withdraw / cancel application actions** | Help says “contact us” — OK for beta; self-serve is better | Medium |
| **`no_show` status** | In schema/types, never set | Medium |
| **Applications “Completed” tab includes rejected** | Confusing grouping | Tiny |
| **Business messages empty-state copy** | Still uses student wording | Tiny |
| **Message list N+1** | One query per conversation preview | Medium |
| **Mark notifications read on full-page click** | Only bell dropdown marks read today | Small |
| **Reliability ranking copy vs query** | Biz shift detail says “ranked by reliability”; sorted by `applied_at` | Tiny |

### Lower priority (polish & scale)

| Item | Notes |
|------|--------|
| **Interior Tailwind migration** | ~15+ pages still `.content` / `.panel` inside `DashShell` |
| **Delete dead `SiteHeader.tsx`** | Unused in live routes |
| **Social icons in `SiteFooter`** | Still `#` |
| **Biz analytics charts** | Counters only |
| **Supabase Realtime** | Messages/notifications poll/refresh only |
| **`messages.read_at`** | Column never written |
| **Spanish UI** | Metadata locale only |
| **Stripe / payouts** | Schema hints; not built |
| **Auto business verification** | Admin verify queue mostly cosmetic |
| **Tighter RLS** | All reads `USING (true)`; service role everywhere |
| **E2E tests** | None visible |

---

## Security snapshot

**Strong**

- Clerk middleware (`proxy.ts`) with role gates and onboarding flow
- Page guards: `requireStudentProfile`, `requireBusinessProfile`, `requireRole(['admin'])`
- Most mutations check role + resource ownership
- Clerk webhook verified; lifecycle + metadata sync

**Weak spots**

- `createConversation` / `createNotification` — auth only, no participant/target validation
- RLS not relied on (by design); service role key leak = full DB access
- Storage policies use `auth.uid()` but app uses Clerk + signed URLs
- Admin can access `/dashboard/*` at middleware level (low risk)

---

## Recommended sprint order

### Sprint C — Hardening (1–2 days)

1. Restrict `createConversation` to accept-flow context (business owner + matching student/shift)
2. Make `createNotification` internal-only or validate `userId` against caller context
3. Cascade application status on `cancelShift`
4. Rate limit contact form (IP + honeypot or Upstash)

### Sprint D — UX truth (1–2 days)

5. Reskin role picker; hide `/dashboard/saved` or redirect to browse
6. Fix applications tab grouping + biz messages empty state
7. Batch message previews; notification read on page click

### Sprint E — Polish (ongoing)

8. Tailwind pass on biz/student inner pages + admin
9. Withdraw application action (pending-only for v1)
10. Email on apply/accept (extend Resend beyond contact)

### Sprint F — Growth (post-beta)

11. Spanish i18n
12. Decide verification model (keep auto-verify, update admin copy)
13. Seed refresh script / admin demo toggle

---

## Key file paths

| Area | Path |
|------|------|
| Middleware | `proxy.ts` |
| Auth core | `lib/auth.ts` |
| Guards | `lib/guards/student.ts`, `lib/guards/business.ts` |
| Server actions | `lib/actions/` |
| Clerk webhook | `app/api/webhooks/clerk/route.ts` |
| Design tokens | `app/globals.css` |
| Landing nav | `components/landing/LandingNav.tsx` |
| Migrations | `supabase/migrations/` (001–005) |
| Demo seed (not a migration) | `supabase/seed_demo_shifts.sql` |
| Site constants | `lib/site.ts` |
| CI | `.github/workflows/ci.yml` |

---

## Bottom line

**Good shape for a closed beta** with real students and businesses in Madrid: marketplace has content, flows work, legal/contact/admin exist, and the worst data bug is fixed.

**Not yet ready for** heavy marketing, Spanish-first audience, or payment promises — interior UI and Sprint C–D items should be closed first.

---

## Changelog vs previous audit (2026-06-07 morning)

| Previous finding | Now |
|------------------|-----|
| Empty DB / no seed | ✅ Demo seed in prod |
| OG image missing | ✅ Wired + assets updated |
| Footer `#` links | ✅ Real routes / trimmed columns |
| Saved Shifts in nav | ✅ Removed from nav |
| Auth pages legacy CSS | ✅ Reskinned (except role picker) |
| `requireStudentProfile` gaps | ✅ All dashboard pages |
| No error/loading boundaries | ✅ Added |
| Completion trigger bug | ✅ Migration 005 |
| Orange brand / inconsistent | ✅ Red/navy rebrand |
| Log in modal / invisible links | ✅ Fixed |
| Contact + admin inbox | ✅ Built |
| Help/FAQ overpromises | ✅ Reworded |
