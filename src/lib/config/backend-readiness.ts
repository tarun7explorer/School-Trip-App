import "server-only";

function isConfiguredValue(value: string | undefined): boolean {
  if (!value?.trim()) return false;
  return !/^(?:your-|replace-with-|example)/i.test(value.trim()) && !/your-project\.supabase\.co/i.test(value);
}

export function getBackendReadiness() {
  const supabaseUrlConfigured = isConfiguredValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const publishableKeyConfigured = isConfiguredValue(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  const serviceRoleKeyConfigured = isConfiguredValue(process.env.SUPABASE_SERVICE_ROLE_KEY);

  return {
    adminAuth: supabaseUrlConfigured && publishableKeyConfigured,
    interestSubmission: supabaseUrlConfigured && serviceRoleKeyConfigured,
  };
}
