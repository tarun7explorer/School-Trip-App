import { expect, test } from "@playwright/test";
import { createInterestSubmissionService } from "@/lib/interest/submission-service";

const validSubmission = {
  teacherName: "Asha Rao",
  schoolName: "Greenfield School",
  email: "ASHA@SCHOOL.EDU",
  phone: "+91 00987 654321",
  tripSlug: "hyderabad-stem",
  studentCount: 32,
  website: "",
};

function makeService(overrides: Partial<Parameters<typeof createInterestSubmissionService>[0]> = {}) {
  return createInterestSubmissionService({
    rateLimit: async () => ({ allowed: true, configured: false }),
    persist: async () => true,
    ...overrides,
  });
}

test("server validation rejects missing fields before persistence", async () => {
  let insertCalled = false;
  const submit = makeService({ persist: async () => { insertCalled = true; return true; } });
  const result = await submit({});
  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.fieldErrors?.teacherName).toBeTruthy();
    expect(result.fieldErrors?.schoolName).toBeTruthy();
    expect(result.fieldErrors?.email).toBeTruthy();
    expect(result.fieldErrors?.phone).toBeTruthy();
    expect(result.fieldErrors?.tripSlug).toBeTruthy();
    expect(result.fieldErrors?.studentCount).toBeTruthy();
  }
  expect(insertCalled).toBe(false);
});

test("server validation rejects invalid email, destination and student counts", async () => {
  const submit = makeService();
  for (const input of [
    { ...validSubmission, email: "not-an-email" },
    { ...validSubmission, tripSlug: "unlisted-destination" },
    { ...validSubmission, studentCount: 0 },
    { ...validSubmission, studentCount: 301 },
    { ...validSubmission, studentCount: 4.5 },
  ]) {
    const result = await submit(input);
    expect(result.success).toBe(false);
  }
});

test("success is returned only after the persistence adapter confirms a save", async () => {
  let inserted: Record<string, unknown> | undefined;
  const submit = makeService({
    persist: async (values) => { inserted = values; return true; },
  });
  const result = await submit(validSubmission);
  expect(result).toEqual({ success: true });
  expect(inserted?.phone).toBe("+91 00987 654321");
  expect(inserted?.email).toBe("asha@school.edu");
});

test("database failure remains recoverable and does not send confirmation email", async () => {
  let emailCalled = false;
  const submit = makeService({
    persist: async () => false,
    sendConfirmation: async () => { emailCalled = true; },
  });
  const result = await submit(validSubmission);
  expect(result.success).toBe(false);
  expect(emailCalled).toBe(false);
});

test("email failure cannot reverse a confirmed database insert", async () => {
  const submit = makeService({
    persist: async () => true,
    sendConfirmation: async () => { throw new Error("provider unavailable"); },
  });
  const result = await submit(validSubmission);
  expect(result).toEqual({ success: true });
});

test("honeypot submissions are rejected without database writes", async () => {
  let insertCalled = false;
  const submit = makeService({ persist: async () => { insertCalled = true; return true; } });
  const result = await submit({ ...validSubmission, website: "bot-filled-this" });
  expect(result.success).toBe(false);
  expect(insertCalled).toBe(false);
});
