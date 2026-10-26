export function getClientAddress(requestHeaders: Pick<Headers, "get">): string {
  const trustedAddress = requestHeaders.get("x-real-ip")?.trim();
  if (trustedAddress) return trustedAddress;
  // X-Forwarded-For is client-controllable unless the deployment proxy
  // sanitizes it. Use a stable shared bucket instead of trusting spoofable IPs.
  return "unknown";
}
