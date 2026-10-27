import { expect, test } from "@playwright/test";

const destinations = [
  { slug: "hyderabad-stem", city: "Hyderabad", headline: "A city built on bold ideas." },
  { slug: "jaipur-heritage", city: "Jaipur", headline: "Read a city through its design." },
  { slug: "delhi-discovery", city: "Delhi", headline: "Explore the stories behind a capital." },
];

test("homepage cards link to all canonical trip routes", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  for (const destination of destinations) {
    await expect(page.getByRole("link", { name: new RegExp(`Explore ${destination.city}:`) })).toHaveAttribute("href", `/trips/${destination.slug}`);
  }
});

test("homepage mobile navigation opens and links to the trip section", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menuButton = page.getByRole("button", { name: "Open navigation menu" });
  await menuButton.click();
  await expect(page.getByRole("dialog", { name: "Site navigation" })).toBeVisible();
  await page.getByRole("link", { name: "Trips", exact: true }).click();
  await expect(page.getByRole("heading", { name: /A world of learning outside the classroom/i })).toBeInViewport();
  await expect(page.getByRole("dialog", { name: "Site navigation" })).toHaveCount(0);
});

for (const destination of destinations) {
  test(`${destination.city} trip page renders content, metadata and selected interest destination`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    const response = await page.goto(`/trips/${destination.slug}`);
    expect(response?.status()).toBe(200);

    await expect(page.getByRole("heading", { name: destination.headline, level: 1 })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: /All trips/ })).toHaveAttribute("href", "/#trips");
    await expect(page.getByRole("button", { name: "Back to all trips" })).toBeVisible();
    await expect(page.getByRole("heading", { name: `The story of ${destination.city}` })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Explore the city through six subjects." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Learning takeaways" })).toBeVisible();
    await expect(page.getByText(/All place and activity suggestions are illustrative/)).toBeVisible();
    await expect(page.getByRole("img", { name: /Illustrative/ }).first()).toBeVisible();
    await expect(page.locator(".place-card")).toHaveCount(5);
    const placeImages = page.locator(".place-card img");
    for (let index = 0; index < await placeImages.count(); index += 1) {
      const image = placeImages.nth(index);
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
    }
    const placeDetail = page.locator(".place-learning-detail").first();
    await placeDetail.locator("summary").click();
    await expect(placeDetail.locator("p")).toBeVisible();

    const categories = page.getByRole("navigation", { name: `${destination.city} learning categories` });
    await expect(categories.getByRole("link")).toHaveCount(6);
    await categories.getByRole("link", { name: "Science, technology and innovation" }).click();
    await expect(page).toHaveURL(/#science$/);
    await expect(page.locator("#science")).toBeInViewport();

    const canonical = new URL(await page.locator('link[rel="canonical"]').getAttribute("href") ?? "");
    expect(canonical.pathname).toBe(`/trips/${destination.slug}`);
    await expect(page.locator("title")).toContainText(destination.city);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", new RegExp(destination.city));
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", new RegExp(destination.city));
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", new RegExp(`/images/${destination.slug}\\.png`));
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");

    await page.locator(".trip-detail-intro").getByRole("link", { name: "Register Interest" }).click();
    await expect(page).toHaveURL(new RegExp(`/interest\\?trip=${destination.slug}`));
    await expect(page.getByLabel("Selected destination")).toHaveValue(destination.slug);
  });
}

test("destination back button uses browser history for internal visits", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Explore Hyderabad:/ }).click();
  await expect(page).toHaveURL(/\/trips\/hyderabad-stem$/);
  await page.getByRole("button", { name: "Back to all trips" }).click();
  await expect(page).toHaveURL(/\/#trips$/);
  await expect(page.getByRole("heading", { name: /Learning Beyond/ })).toBeVisible();
});

test("destination back button has a useful fallback on direct entry", async ({ page }) => {
  await page.goto("/trips/jaipur-heritage");
  await page.getByRole("button", { name: "Back to all trips" }).click();
  await expect(page).toHaveURL(/\/#trips$/);
  await expect(page.getByRole("heading", { name: /A world of learning outside the classroom/ })).toBeVisible();
});

test("unknown trip slugs render the 404 page", async ({ page }) => {
  const response = await page.goto("/trips/not-a-real-trip");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "That path wandered off." })).toBeVisible();
});

test("trip details remain readable without horizontal overflow on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/trips/delhi-discovery");
  await expect(page.getByRole("heading", { name: "Explore the stories behind a capital.", level: 1 })).toBeVisible();
  await expect(page.locator(".trip-detail-intro").getByRole("link", { name: "Register Interest" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Learning takeaways" })).toBeVisible();
  const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, page: document.documentElement.scrollWidth }));
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport);
  await page.screenshot({ path: "test-results/delhi-detail-mobile.png", fullPage: true });
});
