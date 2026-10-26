import { expect, test } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

async function completeValidFields(page: import("@playwright/test").Page) {
  await page.getByLabel("Teacher full name").fill("Asha Rao");
  await page.getByLabel("School or institution").fill("Greenfield School");
  await page.getByLabel("Email address").fill("asha@school.edu");
  await page.getByLabel("Phone number").fill("+91 00987 654321");
  await page.getByLabel("Selected destination").selectOption("hyderabad-stem");
  await page.getByLabel("Interested students").fill("32");
}

test("empty and invalid form values show inline validation", async ({ page }) => {
  await page.goto("/interest");
  await page.getByRole("button", { name: "Submit interest" }).click();
  await expect(page.getByText("Enter the teacher's full name.")).toBeVisible();
  await expect(page.getByText("Enter the school or institution name.")).toBeVisible();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  await expect(page.getByText("Enter a valid phone number, including country code if needed.")).toBeVisible();
  await expect(page.getByText("Choose a destination.")).toBeVisible();
  await expect(page.getByText("Enter the number of interested students.")).toBeVisible();

  await completeValidFields(page);
  await page.getByLabel("Email address").fill("not-an-email");
  await page.getByLabel("Interested students").fill("301");
  await page.getByRole("button", { name: "Submit interest" }).click();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  await expect(page.getByText("Enter no more than 300 students.")).toBeVisible();
});

test("direct trip links preselect the destination", async ({ page }) => {
  await page.goto("/interest?trip=jaipur-heritage");
  await expect(page.getByLabel("Selected destination")).toHaveValue("jaipur-heritage");
});

test("database failure keeps entered details and repeated clicks are blocked while pending", async ({ page }) => {
  await page.goto("/interest?trip=hyderabad-stem");
  await completeValidFields(page);

  let releaseRequest: (() => void) | undefined;
  let requestStarted: (() => void) | undefined;
  let actionRequests = 0;
  const started = new Promise<void>((resolve) => { requestStarted = resolve; });

  await page.route("**/interest*", async (route) => {
    if (route.request().method() === "POST") {
      actionRequests += 1;
      requestStarted?.();
      await new Promise<void>((resolve) => { releaseRequest = resolve; });
    }
    await route.continue();
  });

  const submitButton = page.getByRole("button", { name: "Submit interest" });
  const interestForm = page.locator("form.interest-form");
  await submitButton.click();
  await started;
  await expect(page.getByRole("button", { name: "Submitting…" })).toBeDisabled();
  await interestForm.evaluate((form) => form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
  await interestForm.evaluate((form) => form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
  expect(actionRequests).toBe(1);
  releaseRequest?.();

  await expect(page.getByRole("alert")).toContainText("We couldn't submit your enquiry just now.");
  await expect(page.getByLabel("Teacher full name")).toHaveValue("Asha Rao");
  await expect(page.getByLabel("School or institution")).toHaveValue("Greenfield School");
  await expect(page.getByLabel("Phone number")).toHaveValue("+91 00987 654321");
  await expect(page.getByLabel("Selected destination")).toHaveValue("hyderabad-stem");
});

test("a configured local test submission persists exactly one enquiry", async ({ page }) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const hostname = supabaseUrl ? new URL(supabaseUrl).hostname : "";
  test.skip(
    process.env.PLAYWRIGHT_USE_CONFIGURED_SUPABASE !== "1" ||
      process.env.E2E_ALLOW_DATABASE_FIXTURES !== "1" ||
      !["localhost", "127.0.0.1", "::1"].includes(hostname) ||
      !serviceRoleKey,
    "Requires explicitly enabled local Supabase fixtures; production URLs are rejected.",
  );

  const teacherName = `E2E Registration ${crypto.randomUUID()}`;
  const testDb = createClient(supabaseUrl!, serviceRoleKey!, { auth: { persistSession: false, autoRefreshToken: false } });
  try {
    await page.goto("/interest?trip=hyderabad-stem");
    await page.getByLabel("Teacher full name").fill(teacherName);
    await page.getByLabel("School or institution").fill("Fixture School");
    await page.getByLabel("Email address").fill("e2e-registration@example.invalid");
    await page.getByLabel("Phone number").fill("+91 00987 654321");
    await page.getByLabel("Selected destination").selectOption("hyderabad-stem");
    await page.getByLabel("Interested students").fill("32");
    await page.getByRole("button", { name: "Submit interest" }).click();
    await expect(page.getByRole("status")).toContainText("ENQUIRY RECEIVED");

    const { data, error } = await testDb.from("trip_interests").select("id").eq("teacher_name", teacherName);
    expect(error).toBeNull();
    expect(data).toHaveLength(1);
  } finally {
    await testDb.from("trip_interests").delete().eq("teacher_name", teacherName);
  }
});
