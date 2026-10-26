import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { expect, test, type Page } from "@playwright/test";

const configured = process.env.PLAYWRIGHT_USE_CONFIGURED_SUPABASE === "1";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.E2E_AUTH_ADMIN_EMAIL;
const adminPassword = process.env.E2E_AUTH_ADMIN_PASSWORD;
const localHostname = supabaseUrl ? new URL(supabaseUrl).hostname : "";
const isLocalSupabase = ["localhost", "127.0.0.1", "::1"].includes(localHostname);
const allowFixtures = process.env.E2E_ALLOW_DATABASE_FIXTURES === "1";
const canUseFixtures = configured && isLocalSupabase && allowFixtures && Boolean(serviceRoleKey && adminEmail && adminPassword);
const fixturePrefix = `E2E Dashboard ${crypto.randomUUID()}`;
let adminDb: SupabaseClient | undefined;

test.describe("admin dashboard with isolated local Supabase fixtures", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeAll(async () => {
    test.skip(!canUseFixtures, "Requires local Supabase, an allowlisted test admin and explicit E2E_ALLOW_DATABASE_FIXTURES=1.");
    adminDb = createClient(supabaseUrl!, serviceRoleKey!, { auth: { persistSession: false, autoRefreshToken: false } });
    const fixtureRows = Array.from({ length: 21 }, (_, index) => ({
      teacher_name: `${fixturePrefix} ${String(index + 1).padStart(2, "0")}`,
      school_name: `Fixture School ${index + 1}`,
      email: `fixture-${index + 1}@example.invalid`,
      phone: `+910000000${String(index + 1).padStart(3, "0")}`,
      trip_slug: index % 3 === 0 ? "hyderabad-stem" : index % 3 === 1 ? "jaipur-heritage" : "delhi-discovery",
      student_count: index + 10,
    }));
    const { error } = await adminDb.from("trip_interests").insert(fixtureRows);
    if (error) throw new Error("Could not prepare isolated local dashboard fixtures.");
  });

  test.afterAll(async () => {
    if (adminDb) await adminDb.from("trip_interests").delete().like("teacher_name", `${fixturePrefix}%`);
  });

  test("filters destinations and computes all-time totals independently of the page", async ({ page }) => {
    await signIn(page);
    const api = await page.request.get(`/api/admin/enquiries?q=${encodeURIComponent(fixturePrefix)}`);
    expect(api.status()).toBe(200);
    const result = await api.json();
    expect(result.filteredCount).toBe(21);
    expect(result.enquiries).toHaveLength(20);

    const { data: allRows, error } = await adminDb!.from("trip_interests").select("trip_slug,student_count");
    expect(error).toBeNull();
    expect(result.totalEnquiries).toBe(allRows!.length);
    expect(result.totalStudents).toBe(allRows!.reduce((total, row) => total + row.student_count, 0));

    const destinationResponse = await page.request.get(`/api/admin/enquiries?trip=jaipur-heritage&q=${encodeURIComponent(fixturePrefix)}`);
    const destinationResult = await destinationResponse.json();
    expect(destinationResponse.status()).toBe(200);
    expect(destinationResult.filteredCount).toBe(7);
    expect(destinationResult.enquiries.every((row: { trip_slug: string }) => row.trip_slug === "jaipur-heritage")).toBe(true);
    expect(destinationResult.totalEnquiries).toBe(result.totalEnquiries);
  });

  test("paginates results, handles zero matches and stays within a mobile viewport", async ({ page }) => {
    await signIn(page);
    const secondPage = await page.request.get(`/api/admin/enquiries?q=${encodeURIComponent(fixturePrefix)}&page=2`);
    const secondPageData = await secondPage.json();
    expect(secondPage.status()).toBe(200);
    expect(secondPageData.enquiries).toHaveLength(1);
    expect(secondPageData.pageCount).toBe(2);
    expect(secondPageData.enquiries[0].teacher_name).toContain(fixturePrefix);

    const noMatchesQuery = `No Match ${crypto.randomUUID()}`;
    const noMatches = await page.request.get(`/api/admin/enquiries?q=${encodeURIComponent(noMatchesQuery)}`);
    expect(noMatches.status()).toBe(200);
    expect((await noMatches.json()).filteredCount).toBe(0);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/admin?q=${encodeURIComponent(noMatchesQuery)}`);
    await expect(page.getByRole("heading", { name: "No enquiries match these filters" })).toBeVisible();
    expect(await page.locator("body").evaluate((body) => body.scrollWidth <= window.innerWidth)).toBe(true);
  });

  test("invalid query values are rejected without constructing arbitrary database filters", async ({ page }) => {
    await signIn(page);
    expect((await page.request.get("/api/admin/enquiries?trip=bad%29%2Cor%28id.eq.1%29%26q=x")).status()).toBe(400);
    expect((await page.request.get(`/api/admin/enquiries?q=${"x".repeat(101)}`)).status()).toBe(400);
  });
});

async function signIn(page: Page) {
  await page.goto("/admin/login");
  await page.getByLabel("Email address").fill(adminEmail!);
  await page.getByLabel("Password").fill(adminPassword!);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: "Enquiry dashboard" })).toBeVisible();
}
