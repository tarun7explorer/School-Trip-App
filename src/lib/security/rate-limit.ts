import "server-only";

import { createHmac } from "node:crypto";
import type { InterestRateLimit } from "@/lib/interest/submission-service";

const WINDOW_SECONDS = 15 * 60;
const MAX_SUBMISSIONS_PER_WINDOW = 5;
const INCREMENT_WINDOW_SCRIPT = [
  "local count = redis.call('INCR', KEYS[1])",
  "if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end",
  "return { count, redis.call('TTL', KEYS[1]) }",
].join("\n");

export async function checkInterestRateLimit(clientAddress: string): Promise<InterestRateLimit> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url && !token) return { allowed: true, configured: false };
  if (!url || !token) return { allowed: false, configured: true, retryAfterSeconds: 60 };

  const addressHash = createHmac("sha256", token).update(clientAddress || "unknown").digest("hex");
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(["EVAL", INCREMENT_WINDOW_SCRIPT, 1, `mb-learning:interest:${addressHash}`, WINDOW_SECONDS]),
      signal: AbortSignal.timeout(2500),
      cache: "no-store",
    });
    if (!response.ok) return { allowed: false, configured: true, retryAfterSeconds: 60 };

    const body: unknown = await response.json();
    if (!body || typeof body !== "object" || !("result" in body) || !Array.isArray(body.result)) {
      return { allowed: false, configured: true, retryAfterSeconds: 60 };
    }

    const [count, ttl] = body.result;
    if (typeof count !== "number" || typeof ttl !== "number") {
      return { allowed: false, configured: true, retryAfterSeconds: 60 };
    }
    return {
      allowed: count <= MAX_SUBMISSIONS_PER_WINDOW,
      configured: true,
      retryAfterSeconds: Math.max(1, ttl),
    };
  } catch {
    // Fail closed while a configured distributed limiter is unavailable.
    return { allowed: false, configured: true, retryAfterSeconds: 60 };
  }
}
