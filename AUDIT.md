# Pick a Shift — Audit Report
_Date: 2026-06-07_

---

## Website Findings (live: pick-a-shift.vercel.app)

### ✅ Working
- Landing page renders correctly with Lovable design (hero, how-it-works, testimonials, trust section)
- `/browse` loads, filters are present, map placeholder works (no shifts to show since DB is empty)
- `/sign-up/role` loads and shows the two-card role selection UI
- Auth redirects work: unauthenticated access to protected routes → `/sign-in?redirect_url=...`
- `/onboarding/student` correctly redirects unauthenticated users to sign-in

### ⚠️ Issues Found

**Brand name inconsistency (minor but visible)**
- `app/layout.tsx` metadata title: `"PickaShift — Pick up shifts across Madrid"`
- Landing hero (app/page.tsx): refers to **"Pick a Shift"**
- Footer: `© 2026 PickaShift S.L.`
- Old header (SiteHeader / browse logged-out): logo shows `"Pick aSHFT"` (old Logo component)
- Live `/browse` page shows `"Pick aSHFT"` in the header — the old SiteHeader component is still in use there for logged-out users. Landing shows the new LandingNav with the SVG logo correctly.

**Browse page split personality confirmed live**
- Logged-out `/browse` shows old `SiteHeader` ("Pick aSHFT") + old filter layout
- Logged-in students get `DashShell`. The logged-out experience uses legacy components.

**Sign-in modal loses redirect context**
- Both `LandingNav` and `SiteHeader` use `<SignInButton mode="modal">` — after signing in via modal, Clerk redirects to the default dashboard, not back to the page the user was on. The sign-up link was fixed to use `/sign-up?role=student`, but the log-in button was not.

**Zero content in DB (stats)**
- Landing shows `0+` for all stat counters (open shifts, active workers, verified businesses, shifts completed) — expected for dev/early stage, but worth noting for launch.
- Browse shows "0 open shifts in Madrid" — no seed data.

**Footer links are all `#`**
- All Platform/Company/Support footer links point to `#`. Not a blocker, but looks unfinished.

**Social preview**
- No Open Graph image configured. `<meta og:image>` is absent — link previews on WhatsApp/Twitter will be blank.

---

## Codebase Findings

### 🔴 Confirmed bugs / security gaps

**#1 — Student pages use `requireRole` instead of `requireStudentProfile`**

These 6 pages check Clerk JWT only (role = student) but do NOT verify the DB profile exists:
- `dashboard/profile/page.tsx`
- `dashboard/earnings/page.tsx`
- `dashboard/messages/page.tsx`
- `dashboard/messages/[id]/page.tsx`
- `dashboard/notifications/page.tsx`
- `dashboard/saved/page.tsx`

If the DB row is missing (e.g. Supabase insert failed during onboarding), these pages will crash or render broken. Should use `requireStudentProfile()` like `/dashboard`, `/dashboard/applications`, and `/dashboard/cv` already do.

Also: `dashboard/reviews/page.tsx` is a **binary file** (git corruption or encoding issue) — can't be read. Needs investigation.

**#2 — `isStudentRoute` in middleware is incomplete**

The middleware defines:
```ts
const isStudentRoute = createRouteMatcher([
  '/dashboard(.*)', '/applications(.*)', '/messages(.*)', '/profile(.*)', '/earnings(.*)',
]);
```
But only uses it to redirect businesses away. It does **not** gate admin users from hitting `/dashboard`. An admin with `onboardingComplete: true` who navigates to `/dashboard` will not be blocked at the middleware level (though `requireRole(['student'])` in the page would catch it). Low risk but inconsistent.

**#3 — Admin incomplete-onboarding bypass**

`onboardingPath()` in middleware correctly returns `/admin` for admin role — so an incomplete admin goes to `/admin`, not `/onboarding/student`. **This is already fixed.** Cursor's backlog item #3 is inaccurate.

**#4 — `verified: true` auto-set on business onboarding**

`lib/actions/onboarding.ts` (line 128) inserts `verified: true` and `verified_at` immediately on `completeBusinessOnboarding`. Clerk metadata also gets `verified: true`. There is no manual approval step anywhere in the flow. The admin `/businesses` page likely shows a "pending verifications" badge, but businesses are already auto-verified before an admin sees them. This is the contradiction Cursor flagged (#6) — **decide: keep auto-verify or add a pending state**.

**#5 — `@supabase/ssr` is a dead dependency**

`package.json` lists `@supabase/ssr: ^0.10.3`. Zero `.ts`/`.tsx` files import it (confirmed). Safe to remove.

**#6 — `force-dynamic` on root layout kills static optimization**

`app/layout.tsx` line 31: `export const dynamic = 'force-dynamic'`. This forces the entire app — including the landing page — to be server-rendered on every request. The landing has no dynamic data and should be static. Remove this from the root layout; add it only to pages that genuinely need it (dashboard, biz pages, etc.).

**#7 — No `error.tsx` or `loading.tsx` anywhere**

`find app -name "error.tsx"` → 0 results. `find app -name "loading.tsx"` → 0 results. Any server error or slow data fetch shows a blank Next.js crash screen with no recovery UI.

**#8 — `isStudentRoute` in middleware doesn't cover all student paths**

`/dashboard/saved`, `/dashboard/reviews`, `/dashboard/profile` match `/dashboard(.*)` so that's fine. But the matcher also includes `/applications(.*)`, `/messages(.*)`, `/profile(.*)`, `/earnings(.*)` as top-level routes — these don't exist in the app. Those entries are dead. Not a bug, just noise.

**#9 — `next.config.ts` is empty**

No image domains configured, no redirects, nothing. If you add Supabase storage image URLs or Mapbox, Next.js Image optimization will reject them unless domains are whitelisted.

### 🟠 Product logic gaps

**Verification is auto (confirmed)** — see #4 above. Admin panel has "pending verifications" counter but businesses are already verified before admin sees them.

**Payments are scaffolded, not real** — Supabase schema has Stripe fields, landing promises "paid within 24h", but there is no Stripe integration or payout logic anywhere in `lib/actions/`.

**Saved shifts is a stub** — `dashboard/saved/page.tsx` exists and has a role guard, but the page renders "coming soon". The nav item points to a non-functional page.

### 🟡 UI consistency

**Onboarding + auth pages: legacy styling**
`globals.css` still contains `.panel`, `.content`, `.dash-stats`, `.auth-page` legacy classes alongside the new Tailwind/Lovable tokens. The onboarding pages (`/onboarding/student`, `/onboarding/business`) and `/sign-in`/`/sign-up` still use the old `.auth-page` layout.

**Admin pages: legacy CSS inside new shell**
`app/admin/page.tsx` renders `<div className="content">` and `<div className="dash-stats">` — legacy classes. Same for admin/businesses and admin/users. The DashShell wrapper is new but the content inside is old.

**Two icon systems**
`components/ui/Icon.tsx` (legacy) + Lucide icons used in new Lovable pages. New pages use Lucide directly; old pages use `<Icon name="...">`. Not broken, but inconsistent.

**Log-in button is a Clerk modal**
Both `LandingNav` and `SiteHeader` use `<SignInButton mode="modal">`. After modal sign-in, Clerk redirects to the configured `afterSignInUrl` (default: `/`), not back to the intended page. Should be `<Link href="/sign-in">` with `?redirect_url` preserved, same as sign-up was fixed.

---

## Cursor Backlog — Accuracy Check

| # | Cursor's claim | Verified? |
|---|---|---|
| 1 | 6 student pages lack `requireStudentProfile()` | ✅ Confirmed — profile, earnings, messages, messages/[id], notifications, saved |
| 2 | Onboarding pages no role guard on client form | ✅ Layout has server guard; client form has no role check before submit |
| 3 | Admin users hit student onboarding path | ❌ **Not a bug** — `onboardingPath()` returns `/admin` for admin role |
| 4 | Test account cleanup | Can't verify from code — Supabase admin needed |
| 5 | Sign out/in after Clerk token change | Can't verify without test accounts |
| 6 | Business verification contradictory | ✅ Confirmed — auto-verified on onboarding |
| 7 | Payments marketing-only | ✅ Confirmed |
| 8 | Saved shifts stub | ✅ Confirmed |
| 9 | Biz inner pages legacy CSS | ✅ Confirmed (admin pages definitely; biz pages need visual check) |
| 10 | Onboarding + auth pages legacy | ✅ Confirmed |
| 11 | Browse split personality | ✅ Confirmed live |
| 12 | Two icon systems | ✅ Confirmed |
| 13 | Landing "Log in" modal | ✅ Confirmed — both LandingNav and SiteHeader |
| 14 | `a { color: inherit }` breaks button text | ✅ Fixed on landing with `!text-white`; may affect other pages |
| 17 | `force-dynamic` on root layout | ✅ Confirmed — `app/layout.tsx` line 31 |
| 18 | No `error.tsx`/`loading.tsx` | ✅ Confirmed — zero files found |
| 19 | `@supabase/ssr` unused | ✅ Confirmed — in package.json, imported nowhere |

---

## Recommended Sprint Order

### Sprint 1 — Auth correctness (1 day)
1. Upgrade the 6 student pages from `requireRole` to `requireStudentProfile`
2. Fix `LandingNav` + `SiteHeader` log-in: replace modal with `<Link href="/sign-in">` 
3. Remove `@supabase/ssr` from package.json
4. Fix `reviews/page.tsx` binary file issue

### Sprint 2 — Performance + resilience (half day)
5. Move `force-dynamic` off root layout → add to individual dashboard/biz pages only
6. Add a root `app/error.tsx` and `app/loading.tsx`
7. Add image domains to `next.config.ts` (Supabase storage URL)

### Sprint 3 — Product truth (1–2 days)
8. Decide verification model: either remove auto-`verified: true` and add admin approval flow, or remove the "pending verifications" counter from admin
9. Brand name: pick one — "Pick a Shift" or "PickaShift" — and standardize everywhere (layout metadata, landing, Logo component, footer)
10. Browse logged-out: replace `SiteHeader` with `LandingNav` for consistent branding

### Sprint 4 — UI phase 2 (2–3 days)
11. Reskin onboarding + auth pages to Lovable design system
12. Reskin admin inner pages (remove legacy `.content`/`.panel`/`.dash-stats` divs)
13. Unify icon system: migrate legacy `<Icon>` usages to Lucide
