import { expect, test } from "@playwright/test";

test("public pages remain usable and backend-dependent flows explain missing Supabase setup", async ({ page, request }) => {
  test.skip(process.env.PLAYWRIGHT_MISSING_SUPABASE !== "1", "Run with PLAYWRIGHT_MISSING_SUPABASE=1 to verify missing backend configuration.");

  for (const path of ["/", "/trips/hyderabad-stem", "/trips/jaipur-heritage", "/trips/delhi-discovery"]) {
    expect((await request.get(path)).status(), path).toBe(200);
  }

  await page.goto("/interest?trip=jaipur-heritage");
  await expect(page.getByRole("status")).toContainText("Registration is in preview mode");
  await expect(page.getByLabel("Selected destination")).toHaveValue("jaipur-heritage");

  await page.goto("/admin/login");
  await expect(page.getByRole("heading", { name: "Administrator sign in" })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("Administrator sign-in is unavailable");
  await expect(page.getByRole("button", { name: "Sign in" })).toHaveCount(0);
});

test("teacher access is clear that private teacher accounts are not available", async ({ page }) => {
  await page.goto("/teacher/login");
  await expect(page.getByRole("heading", { name: "A place to start planning." })).toBeVisible();
  await expect(page.getByText(/Teacher accounts and a private teacher dashboard are not enabled/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore city themes" })).toHaveAttribute("href", "/#trips");
  await expect(page.getByRole("link", { name: "Register school interest" })).toHaveAttribute("href", "/interest");
});
