import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:3100";
const useConfiguredSupabase = process.env.PLAYWRIGHT_USE_CONFIGURED_SUPABASE === "1";
const supabaseUrl = useConfiguredSupabase ? process.env.NEXT_PUBLIC_SUPABASE_URL : "http://127.0.0.1:54329";
const supabasePublishableKey = useConfiguredSupabase ? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY : "playwright-test-only-publishable-key";

if (useConfiguredSupabase && (!supabaseUrl || !supabasePublishableKey)) {
  throw new Error("Configured Supabase Playwright mode requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
}

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
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
      SUPABASE_SERVICE_ROLE_KEY: "",
      UPSTASH_REDIS_REST_URL: "",
      UPSTASH_REDIS_REST_TOKEN: "",
      RESEND_API_KEY: "",
      RESEND_FROM_EMAIL: "",
    },
  },
});
