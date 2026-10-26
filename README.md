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
3. The `trip_interests` table has RLS enabled. Anonymous users cannot read or write enquiry rows. Authenticated reads are restricted to users provisioned in `admin_users`. The server action uses a server-only service-role client for the single validated insert and supplies neither `id` nor `created_at`, which remain database-generated. The admin UI and user provisioning flow are not implemented yet.
4. In production, configure Upstash credentials to enable the shared 5-per-15-minute rate limit. Configure Resend only if confirmation emails are wanted; verify the sender address with Resend first.

## Deployment

Deploy to Vercel as a standard Next.js application. Set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS origin and configure the Supabase URL and publishable key in the deployment environment. Apply the SQL migration before enabling any future database-backed workflow. Review Supabase RLS and account provisioning before collecting teacher contact information.

## Current scope and next steps

The interest form is persisted through a server action, but requires a Supabase project, applied migrations and seeded trip rows to accept real submissions. Admin authentication/dashboard, administrator provisioning, CAPTCHA, analytics and confirmed programme content are not implemented. A distributed rate limit and confirmation emails are optional and require their documented providers. The form privacy notice explains that enquiry data is stored for authorized MB Learning administrators to review and respond.
