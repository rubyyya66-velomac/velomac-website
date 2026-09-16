type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  allowed: boolean;
  retryAfter: number;
};

const rateLimitStore = globalThis as typeof globalThis & {
  __velomacRateLimits?: Map<string, RateLimitEntry>;
};

const entries = rateLimitStore.__velomacRateLimits ?? new Map<string, RateLimitEntry>();
rateLimitStore.__velomacRateLimits = entries;

export function consumeRateLimit(
  request: Request,
  scope: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const key = `${scope}:${getClientAddress(request)}`;
  const current = entries.get(key);

  if (!current || current.resetAt <= now) {
    entries.set(key, { count: 1, resetAt: now + windowMs });
    pruneExpiredEntries(now);
    return { allowed: true, retryAfter: 0 };
  }

  current.count += 1;
  entries.set(key, current);

  return {
    allowed: current.count <= limit,
    retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000))
  };
}

export function hasOversizedBody(request: Request, maxBytes: number) {
  const contentLength = Number(request.headers.get("content-length"));
  return Number.isFinite(contentLength) && contentLength > maxBytes;
}

export function isTrustedRequestOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    const originHost = new URL(origin).host.toLowerCase();
    const requestHost = (
      request.headers.get("x-forwarded-host") ||
      request.headers.get("host") ||
      new URL(request.url).host
    )
      .split(",")[0]
      .trim()
      .toLowerCase();

    return originHost === requestHost;
  } catch {
    return false;
  }
}

function getClientAddress(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

function pruneExpiredEntries(now: number) {
  if (entries.size < 500) return;
  entries.forEach((entry, key) => {
    if (entry.resetAt <= now) entries.delete(key);
  });
}
