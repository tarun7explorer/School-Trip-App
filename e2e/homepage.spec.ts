import { expect, test } from "@playwright/test";

test("homepage introduces the three illustrative destinations", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Learning lives beyond the classroom/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: "STEM & Innovation" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Heritage & Culture" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "History, Leadership & Institutions" })).toBeVisible();
});

test("destination detail explains that programme details are illustrative", async ({ page }) => {
  await page.goto("/trips/hyderabad-stem");
  await expect(page.getByRole("heading", { name: "STEM & Innovation" })).toBeVisible();
  await expect(page.getByText(/Dates, venues, itinerary, access and programme details have not been confirmed/)).toBeVisible();
});
