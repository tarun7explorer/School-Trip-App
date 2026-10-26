import { expect, test } from "@playwright/test";

test("desktop homepage introduces the three illustrative destinations", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Learning Beyond the Classroom/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: "STEM & Innovation" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Heritage & Culture" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "History, Leadership & Institutions" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
  await page.screenshot({ path: "test-results/home-desktop.png", fullPage: true });
});

test("mobile navigation opens, supports keyboard use, and closes on navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menuButton = page.getByRole("button", { name: "Open navigation menu" });
  await menuButton.click();
  await expect(page.getByRole("dialog", { name: "Site navigation" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Trips", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open navigation menu" })).toBeFocused();
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await page.getByRole("link", { name: "Trips", exact: true }).click();
  await expect(page.getByRole("heading", { name: /A world of learning outside the classroom/i })).toBeInViewport();
  await expect(page.getByRole("dialog", { name: "Site navigation" })).toHaveCount(0);
  await page.screenshot({ path: "test-results/home-mobile.png", fullPage: true });
});

test("destination detail explains that programme details are illustrative", async ({ page }) => {
  await page.goto("/trips/hyderabad-stem");
  await expect(page.getByRole("heading", { name: "STEM & Innovation" })).toBeVisible();
  await expect(page.getByText(/Dates, venues, itinerary, access and programme details have not been confirmed/)).toBeVisible();
});
