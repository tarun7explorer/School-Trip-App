import { expect, test } from "@playwright/test";

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
  await submitButton.click();
  await started;
  await expect(page.getByRole("button", { name: "Submitting…" })).toBeDisabled();
  expect(actionRequests).toBe(1);
  releaseRequest?.();

  await expect(page.getByRole("alert")).toContainText("We couldn't submit your enquiry just now.");
  await expect(page.getByLabel("Teacher full name")).toHaveValue("Asha Rao");
  await expect(page.getByLabel("School or institution")).toHaveValue("Greenfield School");
  await expect(page.getByLabel("Phone number")).toHaveValue("+91 00987 654321");
  await expect(page.getByLabel("Selected destination")).toHaveValue("hyderabad-stem");
});
