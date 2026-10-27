import { createServerClient } from "@supabase/ssr";
import { expect, test, type BrowserContext } from "@playwright/test";

const configured = process.env.PLAYWRIGHT_USE_CONFIGURED_SUPABASE === "1";
const adminEmail = process.env.E2E_AUTH_ADMIN_EMAIL;
const adminPassword = process.env.E2E_AUTH_ADMIN_PASSWORD;
const nonAdminEmail = process.env.E2E_AUTH_NON_ADMIN_EMAIL;
const nonAdminPassword = process.env.E2E_AUTH_NON_ADMIN_PASSWORD;

test("anonymous visitors are redirected from the dashboard and cannot read the private API", async ({ page, request }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);

  const response = await request.get("/api/admin/enquiries");
  expect(response.status()).toBe(401);
  expect(response.headers()["cache-control"]).toContain("no-store");
});

test("a malformed session cookie cannot authorize dashboard access", async ({ page, context }) => {
  await context.addCookies([{ name: "mb-learning-auth", value: "invalid-session", domain: "127.0.0.1", path: "/", httpOnly: true, secure: false, sameSite: "Lax" }]);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test("login validates fields and reports a generic authentication error", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  await expect(page.getByText("Enter your password.")).toBeVisible();

  await page.getByLabel("Email address").fill("nobody@example.invalid");
  await page.getByLabel("Password").fill("wrong-password-value");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.locator(".form-error-summary")).toContainText("Unable to sign in with those details");
});

test("administrator login keeps the shared navigation and highlighted back control", async ({ page }) => {
  await page.goto("/admin/login");
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Back to MB Learning" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Register Interest" })).toHaveAttribute("href", "/interest");
});

test("an approved administrator reads enquiries and loses access after logout", async ({ page }) => {
  test.skip(!configured || !adminEmail || !adminPassword, "Requires a configured approved Supabase administrator test account.");
  await page.goto("/admin/login");
  await page.getByLabel("Email address").fill(adminEmail!);
  await page.getByLabel("Password").fill(adminPassword!);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: "Enquiry dashboard" })).toBeVisible();

  const authorized = await page.request.get("/api/admin/enquiries");
  expect(authorized.status()).toBe(200);

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);
  expect((await page.request.get("/api/admin/enquiries")).status()).toBe(401);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test("an authenticated non-admin cannot read private enquiries", async ({ browser }) => {
  test.skip(!configured || !nonAdminEmail || !nonAdminPassword, "Requires a configured authenticated non-admin test account.");
  const context = await browser.newContext();
  await installSupabaseSession(context, nonAdminEmail!, nonAdminPassword!);
  const page = await context.newPage();
  const response = await page.request.get("http://127.0.0.1:3100/api/admin/enquiries");
  expect(response.status()).toBe(403);
  await page.goto("http://127.0.0.1:3100/admin");
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: "Enquiry dashboard" })).toHaveCount(0);
  await context.close();
});

test("anonymous REST access to enquiry rows is rejected by Supabase RLS", async ({ request }) => {
  test.skip(!configured || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, "Requires configured Supabase project credentials.");
  const response = await request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/trip_interests?select=id`, {
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`,
    },
  });
  expect([401, 403]).toContain(response.status());
});

async function installSupabaseSession(context: BrowserContext, email: string, password: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Configured Supabase credentials are required for this test.");
  const values = new Map<string, string>();
  const client = createServerClient(url, key, {
    cookieOptions: { name: "mb-learning-auth", path: "/", sameSite: "lax", httpOnly: true, secure: false },
    cookies: {
      getAll: () => [...values].map(([name, value]) => ({ name, value })),
      setAll: (cookies) => cookies.forEach(({ name, value }) => values.set(name, value)),
    },
  });
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw new Error("Could not establish the configured non-admin test session.");
  await context.addCookies([...values].map(([name, value]) => ({
    name, value, domain: "127.0.0.1", path: "/", httpOnly: true, secure: false, sameSite: "Lax" as const,
  })));
}
