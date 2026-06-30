import { createHmac, timingSafeEqual } from "node:crypto";

export const adminSessionCookieName = "velomac_admin_session";

const sessionMaxAgeSeconds = 60 * 60 * 8;

export type AdminConfigStatus = {
  configured: boolean;
  missing: string[];
};

export function getAdminConfigStatus(): AdminConfigStatus {
  const missing = ["ADMIN_USERNAME", "ADMIN_PASSWORD"].filter((key) => !process.env[key]);

  return {
    configured: missing.length === 0,
    missing
  };
}

export function getAdminUsername() {
  return process.env.ADMIN_USERNAME || "";
}

export function getAdminSessionMaxAge() {
  return sessionMaxAgeSeconds;
}

export function validateAdminCredentials(username: string, password: string) {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    return false;
  }

  return safeEqual(username, expectedUsername) && safeEqual(password, expectedPassword);
}

export function createAdminSession(username: string) {
  const payload = Buffer.from(
    JSON.stringify({
      username,
      expiresAt: Date.now() + sessionMaxAgeSeconds * 1000
    }),
    "utf8"
  ).toString("base64url");
  const signature = signPayload(payload);

  return `${payload}.${signature}`;
}

export function verifyAdminSession(token: string | undefined) {
  if (!token) {
    return false;
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature || !safeEqual(signature, signPayload(payload))) {
    return false;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      username?: string;
      expiresAt?: number;
    };

    return (
      parsed.username === getAdminUsername() &&
      typeof parsed.expiresAt === "number" &&
      parsed.expiresAt > Date.now()
    );
  } catch {
    return false;
  }
}

export function getAdminAuthFailure() {
  const status = getAdminConfigStatus();

  if (!status.configured) {
    return {
      status: 503,
      message: `Admin login is not configured. Please set ${status.missing.join(", ")}.`
    };
  }

  return {
    status: 401,
    message: "Please log in before editing website content."
  };
}

function signPayload(payload: string) {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    return "";
  }

  return createHmac("sha256", password).update(payload).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}
