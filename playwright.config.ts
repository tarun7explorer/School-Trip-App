import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:3100";
const useConfiguredSupabase = process.env.PLAYWRIGHT_USE_CONFIGURED_SUPABASE === "1";
const missingSupabase = process.env.PLAYWRIGHT_MISSING_SUPABASE === "1";
const supabaseUrl = missingSupabase ? "" : useConfiguredSupabase ? process.env.NEXT_PUBLIC_SUPABASE_URL : "http://127.0.0.1:54329";
const supabasePublishableKey = missingSupabase ? "" : useConfiguredSupabase ? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY : "playwright-test-only-publishable-key";
const allowDatabaseFixtures = process.env.E2E_ALLOW_DATABASE_FIXTURES === "1";
const supabaseHostname = supabaseUrl ? new URL(supabaseUrl).hostname : "";
const isLocalSupabase = ["localhost", "127.0.0.1", "::1"].includes(supabaseHostname);
const testServiceRoleKey = allowDatabaseFixtures && useConfiguredSupabase && isLocalSupabase
  ? process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
  : "";

if (useConfiguredSupabase && (!supabaseUrl || !supabasePublishableKey)) {
  throw new Error("Configured Supabase Playwright mode requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
}
if (allowDatabaseFixtures && (!useConfiguredSupabase || !isLocalSupabase || !testServiceRoleKey)) {
  throw new Error("Database fixtures are only allowed with PLAYWRIGHT_USE_CONFIGURED_SUPABASE=1, a local Supabase URL, and a test-only SUPABASE_SERVICE_ROLE_KEY.");
}

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  workers: 1,
  reporter: "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev -- --port 3100",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      NEXT_PUBLIC_SITE_URL: baseURL,
      NEXT_PUBLIC_SUPABASE_URL: supabaseUrl!,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: supabasePublishableKey!,
      SUPABASE_SERVICE_ROLE_KEY: testServiceRoleKey,
      UPSTASH_REDIS_REST_URL: "",
      UPSTASH_REDIS_REST_TOKEN: "",
      RESEND_API_KEY: "",
      RESEND_FROM_EMAIL: "",
    },
  },
});
