# MB Learning School Trip Interest Platform

A responsive Next.js application for teachers to explore three illustrative educational trip themes and submit a school's interest. Approved MB Learning administrators can sign in and review the saved enquiries in a protected dashboard.

Trip descriptions and imagery are illustrative. The application does not advertise confirmed itineraries, dates, prices, venue access, university partnerships, or safety guarantees.

## Project status

- GitHub repository: [tarun7explorer/School-Trip-App](https://github.com/tarun7explorer/School-Trip-App)
- Production deployment: **not deployed or verified**; no deployed URL is available.
- Supabase production schema and RLS: **must be applied and verified manually** in the intended project before live collection or administrator access.
- Screenshots: no reviewed screenshots are checked in. Future screenshots belong in [`docs/screenshots/`](docs/screenshots/).

## Implemented features

### Public site

- Responsive homepage with destination discovery, enquiry-process information, educational context, and working internal navigation.
- Destination pages for Hyderabad STEM & Innovation, Jaipur Heritage & Culture, and Delhi History, Leadership & Institutions.
- Trip-specific canonical, Open Graph, and Twitter metadata; sitemap includes only the homepage and destination pages.
- Accessible teacher interest form with React Hook Form and Zod validation, trip preselection, pending/error/success states, honeypot, and server-side validation.
- Server-side Supabase persistence. Confirmation email is optional and cannot reverse a confirmed database insert.

### Administrator workflow

- Supabase email/password sign-in with server-managed SSR cookies.
- Explicit operator-managed `admin_users` allowlist. Sign-in by itself does not grant administrator access.
- Protected dashboard with all-time totals, per-destination totals, literal search, destination filters, newest-first sorting, and 20-row server-side pagination.
- Protected read-only enquiries API. Each private data-access path checks administrator authorization, and RLS remains enabled in PostgreSQL.
- Logout clears the local session cookies. Admin pages and API responses use `private, no-store` caching headers.

## Technology and architecture

- Next.js 15 App Router and React Server Components by default.
- TypeScript with strict checking.
- Tailwind CSS v4 is loaded; the visual system is primarily implemented in `src/app/globals.css`.
- React Hook Form and Zod for the public and admin forms.
- Supabase PostgreSQL, Auth, RLS, and `@supabase/ssr`.
- Lucide icons; reusable application UI primitives (no shadcn/ui or Radix dependency is currently installed).
- Playwright for browser and integration test coverage.
- Local destination images served through `next/image` and Next's image optimization.

```text
src/
  app/
    (public)/                 Public homepage, interest page, trip detail routes and layout
    admin/                    Admin login and protected dashboard routes
    api/admin/enquiries/       Protected read-only enquiries API
    globals.css                Public and admin visual system
    robots.ts, sitemap.ts      Crawler rules and public sitemap
  components/
    admin/                     Login and logout controls
    forms/                     Teacher interest form
    home/                      Homepage sections
    layout/                    Public navigation and footer
    trips/                     Destination cards and detail content
    ui/                        Reusable visual primitives
  data/trips.ts                Centralized illustrative destination catalogue
  lib/
    actions/                   Server actions for enquiries and admin auth
    admin/                     Server-only authorization and dashboard queries
    email/, interest/          Optional email and submission service
    security/                  Rate-limit and request-address helpers
    supabase/                  Browser-safe, SSR, and server-only clients
    validations/               Zod schemas
  types/                       Database and product types
public/images/                 Local illustrative PNG assets
supabase/
  migrations/                  Schema, constraints, RLS, and dashboard RPCs
  seed.sql                     Three public trip catalogue rows
e2e/                           Playwright tests and guarded local DB fixtures
DEPLOYMENT.md                  Detailed Vercel and Supabase deployment guide
```

## Prerequisites

- Node.js 20.9 or newer and npm.
- Chromium for Playwright browser tests.
- A Supabase project for actual enquiry persistence and administrator access.

The public pages can run without live Supabase credentials. Real interest submissions require the migrations, seed rows, and server-side service-role key. Admin access additionally requires email/password Auth and an operator-provisioned allowlist row.

## Local installation

```bash
npm ci
```

Copy the example environment file, then edit `.env.local` with local development values. On PowerShell:

```powershell
Copy-Item .env.example .env.local
npm run dev
```

On macOS/Linux:

```bash
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>. Public routes should render with the example placeholders, but real persistence and authentication will not work until valid values and the Supabase setup below are applied. Never commit `.env.local`.

For a local production build, provide an HTTPS origin (a reserved example domain is sufficient for build-time metadata validation) or set the actual deployment origin:

```powershell
$env:NEXT_PUBLIC_SITE_URL = "https://school-trips.example"
npm run build
```

## Environment variables

`.env.example` contains variable names and safe placeholders only. In Vercel, set Production and Preview values separately; do not share a Production service-role key with Preview.

| Variable | Required for | Client visible? | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production canonical metadata, sitemap, and robots | Yes | Production requires a valid HTTPS origin. Preview may omit it and uses Vercel's per-deployment URL. Local development defaults to `http://localhost:3000`. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Auth and data access | Yes | Project URL for the matching environment. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase Auth and browser client | Yes | Publishable key; RLS is the data security boundary. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side public enquiry insert | **No** | Privileged secret; only referenced by the `server-only` Supabase admin client. Never use a `NEXT_PUBLIC_` prefix. |
| `UPSTASH_REDIS_REST_URL` | Optional shared rate limiting | No | Configure together with the token. A partially configured or unavailable Upstash service fails closed. |
| `UPSTASH_REDIS_REST_TOKEN` | Optional shared rate limiting | **No** | Secret credential for Upstash. |
| `RESEND_API_KEY` | Optional confirmation email | **No** | Omit to disable confirmation mail. |
| `RESEND_FROM_EMAIL` | Optional confirmation email | No | Sender address verified with Resend. |

Vercel supplies `VERCEL_ENV` and `VERCEL_URL`; these are used to identify Preview and derive a Preview origin when needed. No Turnstile secret/site-key variables are used because CAPTCHA verification is not implemented.

The repository `.gitignore` excludes `.env` and `.env.*`, with `.env.example` as the only exception. The Supabase browser client uses only the URL and publishable key; service-role and email credentials are server-only. Do not paste secrets into issues, logs, analytics, or source files.

## Supabase project setup

Use separate Supabase projects for Production and Preview/Staging. Do not use Production data or credentials for Preview testing.

1. Create the intended project and copy its project reference, URL, publishable key, and server-side service-role key into that environment's secret manager.
2. Install and authenticate the Supabase CLI if using the CLI. Confirm the target project reference before applying anything:

   ```bash
   npx supabase login
   npx supabase link --project-ref YOUR_INTENDED_PROJECT_REF
   npx supabase migration list
   npx supabase db push
   ```

   The migration files are applied in order. Alternatively, review and run each SQL migration in the Supabase SQL Editor. Do not apply them to an unintended project.
3. Seed the destination catalogue:

   ```bash
   npx supabase db query --file supabase/seed.sql
   ```

   Or run `supabase/seed.sql` in that project's SQL Editor. Verify all three trip slugs exist before trying registration.
4. In Supabase Auth, enable Email/password sign-in and disable public sign-ups. Set the Site URL and allowed redirect URLs for that environment.
5. Verify RLS and table privileges for `trip_interests` and `admin_users`, and the invoker-security configuration for the dashboard RPCs. Anonymous users must not read enquiries; ordinary authenticated users must not read them or modify the admin allowlist.

The migrations define the `trips`, `admin_users`, and `trip_interests` tables, validation constraints and indexes; they enable RLS, restrict enquiry table writes, and add protected summary/count/page RPCs. The public server action inserts using the server-only service-role client. Admin reads use the authenticated SSR client and are independently authorized by the server helper and RLS.

## Secure administrator provisioning

An operator must create or invite an administrator in **Supabase Dashboard → Authentication → Users**, then explicitly insert that Auth user's UUID into `public.admin_users` from the SQL Editor:

```sql
insert into public.admin_users (user_id)
select id from auth.users
where email = lower('replace-with-approved-admin-email@example.com')
on conflict (user_id) do nothing;
```

Replace the example with the approved identity, verify the inserted user ID, and do not expose the SQL Editor or service-role key to dashboard users. Remove the allowlist row to revoke admin access. Authenticated accounts without a row remain non-admins. Do not enable public account registration for this prototype.

## Development, quality checks, and tests

```bash
npm run dev        # local Next.js development server
npm run lint       # ESLint
npm run typecheck  # strict TypeScript check
npm run build      # optimized Next.js production build
npm run start      # serve the production build locally
npm run test:e2e   # Playwright suite
```

Install Chromium once:

```bash
npx playwright install chromium
```

By default, Playwright starts its own development server on port 3100 with test-only Supabase settings and an empty service-role key. The tests cover public routes, form validation/error handling, navigation, metadata, responsive checks, and anonymous/private API behavior. Authenticated admin/non-admin tests require configured test users. The database-fixture tests require a **local-only** Supabase URL and explicit fixture opt-in; they reject non-local project hosts.

For the fixture-enabled run, use a throwaway local Supabase instance with migrations and seed rows applied. Set `PLAYWRIGHT_USE_CONFIGURED_SUPABASE=1`, local `NEXT_PUBLIC_SUPABASE_URL`, local publishable key, `SUPABASE_SERVICE_ROLE_KEY`, `E2E_ALLOW_DATABASE_FIXTURES=1`, and the `E2E_AUTH_ADMIN_EMAIL` / `E2E_AUTH_ADMIN_PASSWORD` and `E2E_AUTH_NON_ADMIN_EMAIL` / `E2E_AUTH_NON_ADMIN_PASSWORD` variables. The configured non-admin account must not be in `admin_users`. Never set the fixture flag with a Production or remote Supabase URL. When enabled, Playwright passes the local service-role key only to its isolated Next.js test server and test process, never to browser code.

No automated test run is a substitute for verifying the applied migrations and RLS in the intended Supabase project. The repository's test suite does not use production enquiry data.

## Vercel deployment

Follow [`DEPLOYMENT.md`](DEPLOYMENT.md) for repository import, environment scopes, Supabase preparation, caching, smoke tests, and failure recovery.

In summary: import this GitHub repository into Vercel, use the repository root and Next.js defaults, set `main` as the Production branch, configure the Production HTTPS `NEXT_PUBLIC_SITE_URL` and matching Supabase environment values, apply migrations/seed/admin provisioning to the intended Supabase project, then deploy from Vercel. Configure Preview with an isolated Supabase project and separate secrets. Preview builds default to the Vercel deployment URL and are marked noindex/disallowed. This repository has **not** been deployed; no production URL is known or claimed.

## Security controls and known limitations

- Admin access requires a verified Supabase claim and an explicit `admin_users` membership check in the layout, data-access helper, and API route. Middleware session refresh/redirects are convenience controls, not the sole authorization boundary.
- `trip_interests` is private under RLS; anonymous reads and writes are revoked. The allowlist has no app-user write policy. Dashboard RPCs use `SECURITY INVOKER` and fixed, validated parameters.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only and used for validated interest inserts only. Browser code gets only the publishable Supabase key.
- Admin sessions use HttpOnly, SameSite=Lax cookies, Secure in production, and logout clears the session cookie chunks. Admin pages/API responses are dynamic and `private, no-store`.
- Inputs are validated on the server and constrained in PostgreSQL. Search uses a parameterized RPC with literal substring matching; results are server-paginated.
- No contact details are sent to analytics, and this application does not include analytics. Contact details are used to review/respond to the enquiry; optional email acknowledgement uses the submitted address.
- Upstash rate limiting is optional. Without it, no distributed application limiter is active. The app trusts `x-real-ip`; if absent, clients share the `unknown` address bucket. Configure a trusted deployment proxy. Supabase Auth's own rate limits remain separate.
- A honeypot is present. Turnstile/CAPTCHA, idempotency keys, enquiry editing/deletion/status changes, CSV export, admin email alerts, and verified itinerary content are not implemented.
- Confirmation email via Resend is optional. A failed email does not undo a saved enquiry. No production migration application, live Supabase authorization test, or Vercel deployment is claimed in this repository documentation.

## Screenshots

No reviewed screenshots are currently checked in. The documented location is `docs/screenshots/`; only use non-sensitive pages or synthetic local test data. Playwright artifacts under `test-results/` are generated/ignored and are not committed.

## AI-tool disclosure

Codex assisted with project implementation, security review, regression-test authoring, deployment preparation, and this documentation. The repository contents, environment handling, migrations, and test configuration were inspected during this work. Production Supabase settings, migrations, Vercel environment values, live routes, and deployment must still be reviewed and verified by the project owner; no live deployment or production database operation was performed.
