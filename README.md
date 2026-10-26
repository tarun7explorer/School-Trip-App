# MB Learning School Trip Interest Platform

A Next.js application for MB Learning's school trip discovery and interest platform. It provides the public homepage, illustrative trip themes and details for Hyderabad, Jaipur and Delhi, and a teacher interest form that writes enquiries to Supabase. Trip details are intentionally labeled as illustrative; dates, venues, confirmed itineraries, prices and partner access are not represented as facts.

## Requirements

- Node.js 20.9 or newer
- npm
- A Supabase project for the database work in later phases (the public pages run without Supabase credentials)

## Local setup

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open <http://localhost:3000>. `.env.local` may be left with the safe placeholders while developing the public shell. Configure real Supabase values only in your local ignored `.env.local` or deployment secret settings.

## Environment variables

| Variable | Use | Exposure |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site base URL for metadata, sitemap and robots | Public |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Public |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser-safe Supabase publishable key, protected by RLS | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key used by the interest submission action to insert after validation | **Secret** |
| `UPSTASH_REDIS_REST_URL` | Optional shared rate-limit store endpoint | Server only |
| `UPSTASH_REDIS_REST_TOKEN` | Optional Upstash credential for the distributed limiter | Server only |
| `RESEND_API_KEY` | Optional confirmation email provider key | Server only |
| `RESEND_FROM_EMAIL` | Optional verified sender configured in Resend | Server only |

Never put service-role keys, database passwords, or private API credentials in a `NEXT_PUBLIC_` variable. The service-role key is read only by `src/lib/supabase/admin.ts`, which is guarded by `server-only`; it is never sent to browser code. `.env.local` and other environment files are ignored by Git; `.env.example` contains placeholders only.

Supabase URL, publishable key and server-only service-role key are required for real submissions. Without the optional Upstash integration, no distributed rate limiter is active; the app does not substitute an in-memory limiter. When both Upstash variables are configured, the server permits five submissions per client-address key per 15-minute window and fails closed if Redis is unavailable. A honeypot is checked on every submission. Turnstile is not enabled or assumed to have passed. Without both Resend variables, no confirmation email is attempted; a mail failure after a successful insert does not change the submission result.

The student-count limit is 1–300 per enquiry. Phone numbers are stored as text so leading zeros, country codes and formatting are retained.

## Scripts

```bash
npm run dev        # local development server
npm run build      # optimized production build
npm run start      # serve the production build
npm run lint       # ESLint
npm run typecheck  # strict TypeScript check
npm run test:e2e   # Playwright browser tests
```

Administrator sign-in uses Supabase email/password authentication with server-managed SSR cookies. The `admin_users` table is an explicit allowlist; ordinary authenticated accounts have no access to private enquiries. Configure Supabase Auth's Email provider and disable public sign-ups (invite-only provisioning). The optional Upstash integration also limits admin login attempts; without it, Supabase Auth's own rate limits apply, and the app does not claim to provide a distributed limiter.

Playwright uses Chromium and starts the local development server automatically. Install its browser once with `npx playwright install chromium` if the browser is not present.

## Architecture

- `src/app/`: App Router pages, layout, metadata, sitemap and robots rules.
- `src/components/layout/`, `trips/`, `ui/`: reusable page chrome and accessible UI primitives.
- `src/data/trips.ts`: typed illustrative catalogue for the three destinations.
- `src/lib/validations/`: shared Zod input schema, ready for client and server form validation.
- `src/lib/actions/interest-actions.ts`: server action validates, rate-checks and persists interest submissions.
- `src/components/forms/interest-form.tsx`: accessible React Hook Form with inline Zod feedback and post-insert success state.
- `src/lib/security/` and `src/lib/email/`: optional distributed rate limiter and server-only confirmation email integration.
- `src/lib/supabase/client.ts`: browser-safe Supabase client using only the publishable key.
- `src/lib/supabase/server.ts`: server-only Supabase client with cookie session support.
- `src/types/`: trip, interest and database types.
- `supabase/migrations/`: PostgreSQL schema, constraints and Row Level Security policies.
- `e2e/`: Playwright smoke coverage.

## Supabase setup

1. Create a Supabase project and add its URL and publishable key to `.env.local`.
2. Apply the migrations and catalogue seed with the Supabase CLI:

   ```bash
   npx supabase link --project-ref YOUR_PROJECT_REF
   npx supabase db push
   npx supabase db query --file supabase/seed.sql
   ```

   Alternatively, run the migration and `supabase/seed.sql` in the Supabase SQL Editor.
3. The `trip_interests` table has RLS enabled. Anonymous users cannot read or write enquiry rows. Authenticated reads are restricted to users provisioned in `admin_users`. The server action uses a server-only service-role client for the single validated insert and supplies neither `id` nor `created_at`, which remain database-generated. Admin enquiry reads use the signed-in SSR client and are independently checked by server-side allowlist authorization.
4. Provision the first administrator through a trusted operator account: create or invite the person in **Supabase Dashboard → Authentication → Users**, require a strong unique password (or use the invite flow), then add that exact Auth user to the allowlist in the SQL Editor:

   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users
   where email = lower('replace-with-approved-admin-email@example.com')
   on conflict (user_id) do nothing;
   ```

   Verify that one row was inserted. Do not expose the SQL Editor or service-role credentials to administrators using the app. To revoke an administrator, delete their row from `public.admin_users`; deleting their Auth user also cascades to the row. Only trusted operators may change membership. Keep email/password sign-in enabled and public sign-ups disabled in Supabase Auth settings.
5. In production, configure Upstash credentials to enable the shared login and enquiry rate limits. Configure Resend only if confirmation emails are wanted; verify the sender address with Resend first.

## Deployment

Deploy to Vercel as a standard Next.js application. Set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS origin and configure the Supabase URL, publishable key and server-only service-role key in the deployment environment. Apply all SQL migrations before accepting enquiries or granting admin access. The admin session cookie is HttpOnly, SameSite=Lax, and Secure in production; admin pages and private API responses are marked no-store. Review Supabase RLS and account provisioning before collecting teacher contact information.

## Current scope and next steps

The interest form is persisted through a server action, but requires a Supabase project, applied migrations and seeded trip rows to accept real submissions. Admin access requires the migrations, configured Supabase email/password auth and an explicitly provisioned allowlist row. CAPTCHA, analytics and confirmed programme content are not implemented. A distributed rate limit and confirmation emails are optional and require their documented providers. The form privacy notice explains that enquiry data is stored for authorized MB Learning administrators to review and respond.
