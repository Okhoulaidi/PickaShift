# Pick a Shift — Setup Guide

Production Next.js app for the Madrid student shift marketplace. Follow these steps to go live.

## 1. Environment variables

Copy the example file and fill in your keys:

```bash
cp .env.local.example .env.local
```

| Variable | Where to get it |
|----------|-----------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | [Clerk Dashboard](https://dashboard.clerk.com) → API Keys |
| `CLERK_SECRET_KEY` | Clerk Dashboard → API Keys |
| `CLERK_WEBHOOK_SECRET` | Clerk Dashboard → Webhooks (see step 3) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (keep secret) |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | [Mapbox](https://account.mapbox.com) → Access tokens |

Add the same variables in **Vercel** → Project → Settings → Environment Variables.

## 2. Supabase database

Run the migration in the Supabase SQL Editor (Dashboard → SQL → New query):

Copy the full contents of `supabase/migrations/001_initial_schema.sql` and execute.

Or with Supabase CLI:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

## 3. Clerk configuration

### Session token (required for middleware)

Clerk Dashboard → **Configure** → **Sessions** → **Customize session token** → add:

```json
{
  "metadata": {
    "role": "{{user.public_metadata.role}}",
    "onboardingComplete": "{{user.public_metadata.onboardingComplete}}",
    "verified": "{{user.public_metadata.verified}}",
    "suspended": "{{user.public_metadata.suspended}}"
  }
}
```

Without this, role-based routing will not work until the user signs out and back in.

### Webhook

Clerk Dashboard → **Webhooks** → Add endpoint:

- **URL:** `https://your-domain.com/api/webhooks/clerk` (or `https://xxxx.ngrok.io/api/webhooks/clerk` for local dev)
- **Events:** `user.created`, `user.updated`, `user.deleted`
- Copy the signing secret → `CLERK_WEBHOOK_SECRET`

### OAuth providers (optional)

Enable Google / Apple under Clerk → **User & Authentication** → **Social connections**.

## 4. Create your admin account

1. Sign up at `/sign-up` and choose **Student** or **Business** (temporary).
2. In Supabase SQL Editor, promote your user:

```sql
UPDATE profiles SET role = 'admin', onboarding_complete = true WHERE email = 'your@email.com';
```

3. In Clerk Dashboard → Users → your user → **Public metadata**:

```json
{
  "role": "admin",
  "onboardingComplete": true
}
```

4. Sign out and sign back in → visit `/admin`.

## 5. Business verification flow

1. Business signs up → completes onboarding → status **pending**.
2. Admin opens `/admin/businesses` → **Verify**.
3. Verified businesses can post shifts visible to students.

## 6. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 7. Deploy to Vercel

1. Push this repo to GitHub.
2. Import in Vercel → link repo.
3. Add all env vars from `.env.local.example`.
4. Deploy.
5. Update Clerk webhook URL to your production domain.
6. Set Clerk allowed origins to your Vercel URL.

## App structure

| Route | Role |
|-------|------|
| `/` | Public landing |
| `/browse`, `/shifts/[id]` | Public shift discovery |
| `/dashboard/*` | Student |
| `/biz/*` | Business |
| `/admin/*` | Admin |

Original HTML prototype is preserved in `prototype/`.

## Making yourself a business (testing)

1. Sign up → choose **Business** at `/sign-up/role`.
2. Complete business onboarding.
3. As admin, verify the business at `/admin/businesses`.
4. Post shifts at `/biz/shifts/new`.

Students can then browse and apply at `/browse`.
