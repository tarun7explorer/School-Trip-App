# Vercel production deployment

This guide prepares the application for Vercel. It does not deploy the site or apply database changes. Configure the Supabase schema and RLS policies in the intended project before enabling live submissions or admin access.

## 1. Prepare Supabase first

Use separate Supabase projects for Production and Preview/Staging. Do not point Preview deployments at the Production database or reuse its service-role key.

For each project:

1. Confirm the project reference in the Supabase Dashboard before applying migrations.
2. Apply all four files in `supabase/migrations/` in filename order. With the Supabase CLI, link to the intended project and run `npx supabase db push`. Review the pending migration list and project reference before confirming the command. Alternatively, run the migration SQL in the Supabase SQL Editor in order.
3. Apply `supabase/seed.sql` to create the three public trip catalogue rows. Verify all three slugs exist.
4. In Supabase Auth, enable Email/password sign-in and disable public sign-ups. Configure the production Site URL and approved redirect URLs for the production domain. Use the Preview domain only in the isolated Preview project.
5. Provision only approved admin identities in `public.admin_users` using the documented operator-only SQL in `README.md`. Confirm an ordinary authenticated account has no allowlist row.
6. Review `admin_users`, `trip_interests`, and the three dashboard RPCs in the Supabase policy/function dashboards. The migrations enable RLS, restrict table writes, and declare dashboard functions `SECURITY INVOKER`; do not replace them with service-role reads or security-definer functions.

Do not run these migration or seed commands against a project until its reference has been checked. They are not run as part of this guide.

## 2. Import the repository into Vercel

1. In Vercel, choose **Add New → Project**, connect the GitHub account, and import `tarun7explorer/School-Trip-App`.
2. Keep the repository root as the Root Directory. Vercel should detect Next.js automatically.
3. Use the repository scripts: install `npm install`, build `npm run build`, and output settings at their Next.js defaults. Do not set a static export output directory.
4. Set the Production Branch to `main` and connect the intended custom domain under **Settings → Domains**. Complete Vercel's DNS verification before using that domain as the canonical origin.
5. Configure environment variables before the first build. The Production value of `NEXT_PUBLIC_SITE_URL` must be the verified canonical HTTPS origin (for example, the actual `https://` domain assigned to MB Learning). Production builds fail if it is missing or invalid.
6. Deploy only after the intended Production Supabase project has the migrations, seed rows, Auth settings, and approved administrator allowlist entry.

## 3. Environment variables and deployment scopes

Set these in **Project → Settings → Environment Variables**. Use the exact values from the corresponding Supabase/provider dashboard; do not put secrets in Git or in a `NEXT_PUBLIC_` variable.

| Variable | Production | Preview/Staging | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Required; verified custom HTTPS domain | Optional; if omitted, the deployment's Vercel URL is used | Public, consumed while building canonical and social metadata. Scope a production domain value to Production only. |
| `NEXT_PUBLIC_SUPABASE_URL` | Production Supabase project URL | Isolated Preview/Staging project URL | Public project endpoint. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Production publishable key | Preview/Staging publishable key | Browser-safe; RLS remains the access boundary. |
| `SUPABASE_SERVICE_ROLE_KEY` | Production service-role key | Preview/Staging service-role key, only if testing actual submissions | Secret. Server-side only. Never share the Production value with Preview. |
| `UPSTASH_REDIS_REST_URL` | Optional Production Redis endpoint | Separate Preview endpoint or unset | Server-side rate limiting. |
| `UPSTASH_REDIS_REST_TOKEN` | Optional Production token | Separate Preview token or unset | Secret; if configured but unavailable, the limiter fails closed. |
| `RESEND_API_KEY` | Optional Production key | Omit or use an isolated/test provider | Secret. Omit to disable confirmation email. |
| `RESEND_FROM_EMAIL` | Optional verified Production sender | Omit or use a verified Preview sender | Do not send preview messages from the Production sender. |

Vercel Preview deployments receive a per-deployment canonical origin from Vercel when `NEXT_PUBLIC_SITE_URL` is not configured in Preview. Preview builds emit `noindex` metadata and a `robots.txt` rule disallowing crawling. For a stable Preview alias, configure that Preview-only origin explicitly.

Do not configure Turnstile variables: Turnstile verification is not implemented. The existing honeypot is not a CAPTCHA. If Upstash is unset, the application does not claim to provide a distributed rate limit; ensure the deployment proxy supplies a trusted `x-real-ip` header for per-address buckets. Otherwise, requests share the `unknown` address bucket.

## 4. Build, routes, metadata, and caching

Vercel runs the Next.js App Router build. The public homepage and three canonical trip routes are `/`, `/trips/hyderabad-stem`, `/trips/jaipur-heritage`, and `/trips/delhi-discovery`. The interest form is `/interest`. Admin sign-in is `/admin/login`; the protected dashboard is `/admin`; its read-only data API is `/api/admin/enquiries`.

The site origin is validated during production build. Canonical links, sitemap URLs, robots sitemap URL, and Open Graph metadata derive from that origin. The sitemap includes only the homepage and trip details. `/interest` is noindex and excluded; admin and admin API paths are disallowed by `robots.txt` and the admin pages are noindex. Robots rules discourage crawling but do not provide authorization.

Local images use `next/image`; Next/Vercel serves optimized AVIF/WebP variants. The configuration sets a 30-day minimum image optimization cache lifetime. Public static pages and images can use Next/Vercel defaults. Admin routes are dynamic and marked `private, no-store`; the admin API returns the same cache directive on success and every error response. Middleware also marks admin responses no-store. Do not add a CDN rule that overrides private admin cache headers.

There are no custom redirects or rewrites in `next.config.ts`. Admin unauthenticated requests redirect to `/admin/login`; API requests return authorization status codes instead of exposing enquiry rows.

## 5. Post-deploy smoke checks

Run the full write-path checks against the isolated Preview/Staging Supabase project first. The automated database fixture tests are guarded to allow writes only when the test URL is local. Never point them at a Production project.

After the Production domain is live:

- Open the homepage and each of the three trip routes. Confirm images load, canonical links use the verified Production domain, and no page has a localhost URL.
- Open `/sitemap.xml` and `/robots.txt`. Confirm the sitemap contains only public routes and robots excludes `/admin` and `/api/admin`.
- Open `/admin` in a signed-out browser. Confirm it redirects to `/admin/login`; request `/api/admin/enquiries` without a session and confirm it returns an error with `Cache-Control: private, no-store` and no enquiry body.
- Sign in with the provisioned administrator, verify the dashboard totals and destination filters against the saved records, sign out, then verify a protected request is denied.
- Verify a non-admin authenticated account cannot open `/admin` or read `/api/admin/enquiries`.
- Verify the public interest form's destination preselection and validation. Verify actual database persistence in Preview/Staging using the guarded test fixture flow. In Production, only submit a real authorized enquiry as a live smoke check; do not insert synthetic test enquiries into the Production database.
- If confirmation email is enabled, verify the sender and delivery separately. A mail-provider failure must not turn a database-confirmed save into a failed registration response.
- Check the admin page and API response headers in the browser Network panel or with `curl -I`; private responses must not be publicly cacheable.

## 6. Deployment and runtime logs / recovery

In Vercel, open **Project → Deployments → deployment → Build Logs** for dependency, type-generation, and build failures. Use the deployment's **Runtime Logs** or **Observability → Logs** for server-action, middleware, route-handler, and Supabase connectivity failures. The application returns generic persistence/auth errors and intentionally does not log teacher contact details.

For a failed build, fix the code or missing environment value, push a new commit, and inspect the new deployment's Build Logs. For a runtime regression, use Vercel's deployment list to promote/roll back to the last known-good deployment, then fix the underlying issue and redeploy. Do not repair a failed deployment by changing Production secrets to Preview values or by weakening RLS. If Vercel CLI is installed and authenticated, `vercel logs <deployment-url>` can inspect deployment logs; do not include environment values or personal enquiry data in shared logs.
