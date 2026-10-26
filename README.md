# MB Learning School Trip Interest Platform

A Next.js foundation for MB Learning's school trip discovery and interest platform. The current phase provides the public shell and illustrative trip themes for Hyderabad, Jaipur and Delhi. Trip details are intentionally labeled as illustrative; dates, venues, confirmed itineraries, prices and partner access are not represented as facts.

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

Never put service-role keys, database passwords, or private API credentials in a `NEXT_PUBLIC_` variable. No service-role key is used by this foundation. `.env.local` and other environment files are ignored by Git; `.env.example` contains placeholders only.

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
- `src/lib/supabase/client.ts`: browser-safe Supabase client using only the publishable key.
- `src/lib/supabase/server.ts`: server-only Supabase client with cookie session support.
- `src/types/`: trip, interest and database types.
- `supabase/migrations/`: PostgreSQL schema, constraints and Row Level Security policies.
- `e2e/`: Playwright smoke coverage.

## Supabase setup

1. Create a Supabase project and add its URL and publishable key to `.env.local`.
2. Apply the migration and catalogue seed with the Supabase CLI:

   ```bash
   npx supabase link --project-ref YOUR_PROJECT_REF
   npx supabase db push
   npx supabase db query --file supabase/seed.sql
   ```

   Alternatively, run the migration and `supabase/seed.sql` in the Supabase SQL Editor.
3. `trip_interests` has no public read or insert policy. Its rows are readable only by users explicitly provisioned in `admin_users`. No admin UI or enquiry write path is enabled yet; add a validated, abuse-protected server submission flow and provisioned admin access before collecting personal information.

## Deployment

Deploy to Vercel as a standard Next.js application. Set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS origin and configure the Supabase URL and publishable key in the deployment environment. Apply the SQL migration before enabling any future database-backed workflow. Review Supabase RLS and account provisioning before collecting teacher contact information.

## Current scope and next steps

This is the application foundation, not the complete product. The interest form submission, email acknowledgement, Supabase authentication flow, admin dashboard, rate limiting and CAPTCHA integration are not implemented yet. Next steps are a secure server-side enquiry action, admin identity provisioning and protected dashboard, followed by responsive and accessibility review against real content.
