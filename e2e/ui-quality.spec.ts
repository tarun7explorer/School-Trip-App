import { expect, test } from "@playwright/test";

const publicRoutes = [
  { path: "/", canonical: "/", heading: "Learning Beyond the Classroom" },
  { path: "/trips/hyderabad-stem", canonical: "/trips/hyderabad-stem", heading: "A city built on bold ideas." },
  { path: "/trips/jaipur-heritage", canonical: "/trips/jaipur-heritage", heading: "Read a city through its design." },
  { path: "/trips/delhi-discovery", canonical: "/trips/delhi-discovery", heading: "Explore the stories behind a capital." },
  { path: "/interest", canonical: "/interest", heading: "Register your school's interest." },
];

test("public pages have route metadata, load local imagery and do not overflow common widths", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });

  for (const route of publicRoutes) {
    const response = await page.goto(route.path);
    expect(response?.status(), route.path).toBe(200);
    await expect(page.getByRole("heading", { name: route.heading, exact: false }).first()).toBeVisible();
    await expect(page).toHaveTitle(/.+\| MB Learning/);
    expect(await page.locator('meta[name="description"]').getAttribute("content")).toBeTruthy();
    expect(await page.locator('link[rel="canonical"]').getAttribute("href")).toContain(route.canonical);
    expect(await page.locator('meta[property="og:title"]').getAttribute("content")).toBeTruthy();

    await page.locator("img").evaluateAll((images) => images.forEach((image) => { (image as HTMLImageElement).loading = "eager"; }));
    await expect.poll(() => page.locator("img").evaluateAll((images) => images.every((image) => {
      const candidate = image as HTMLImageElement;
      return candidate.complete && candidate.naturalWidth > 0;
    }))).toBe(true);

    for (const width of [390, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(page.locator("body").evaluate((body) => body.scrollWidth <= window.innerWidth)).resolves.toBe(true);
    }
  }
  expect(consoleErrors).toEqual([]);
});

test("mobile navigation is keyboard operable and returns focus when dismissed", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open navigation menu" });
  await trigger.click();
  const panel = page.getByRole("dialog", { name: "Site navigation" });
  await expect(panel).toBeVisible();
  await expect(page.getByRole("link", { name: "Trips", exact: true })).toBeFocused();
  await expect(page.locator("main")).toHaveAttribute("inert", "");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open navigation menu" })).toBeFocused();
  await expect(page.locator("main")).not.toHaveAttribute("inert", "");
});

test("robots and sitemap expose only public destination pages", async ({ request }) => {
  const [robotsResponse, sitemapResponse] = await Promise.all([
    request.get("/robots.txt"), request.get("/sitemap.xml"),
  ]);
  expect(robotsResponse.ok()).toBeTruthy();
  expect(sitemapResponse.ok()).toBeTruthy();
  const robots = await robotsResponse.text();
  const sitemap = await sitemapResponse.text();
  expect(robots).toContain("/admin");
  expect(sitemap).toContain("/trips/hyderabad-stem");
  expect(sitemap).toContain("/trips/jaipur-heritage");
  expect(sitemap).toContain("/trips/delhi-discovery");
  expect(sitemap).not.toContain("/admin");
  expect(sitemap).not.toContain("/interest");
});

test("internal public navigation targets respond", async ({ request }) => {
  for (const path of ["/", "/trips/hyderabad-stem", "/trips/jaipur-heritage", "/trips/delhi-discovery", "/interest"]) {
    expect((await request.get(path)).status(), path).toBe(200);
  }
  expect((await request.get("/trips/not-a-destination")).status()).toBe(404);
});
