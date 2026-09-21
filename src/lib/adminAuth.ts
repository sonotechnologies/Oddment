import "server-only";

import { scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  type AdminSession,
  SESSION_COOKIE,
  readSessionToken,
} from "@/lib/session";

const scryptAsync = promisify(scrypt);

/**
 * Format: scrypt:<salt base64url>:<hash base64url>
 * Colons, not dollars — Next.js expands `$NAME` inside .env files, which
 * would silently eat part of the hash.
 */
export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [scheme, saltPart, hashPart] = stored.split(":");
  if (scheme !== "scrypt" || !saltPart || !hashPart) return false;

  const salt = Buffer.from(saltPart, "base64url");
  const expected = Buffer.from(hashPart, "base64url");
  const actual = (await scryptAsync(password, salt, expected.length)) as Buffer;

  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function checkCredentials(
  email: string,
  password: string,
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminHash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminEmail || !adminHash) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD_HASH must be set.");
  }

  // Always run the hash so a wrong email and a wrong password take the
  // same amount of time.
  const passwordOk = await verifyPassword(password, adminHash);
  const emailOk =
    email.trim().toLowerCase() === adminEmail.trim().toLowerCase();

  return passwordOk && emailOk;
}

export async function getSession(): Promise<AdminSession | null> {
  const store = await cookies();
  return readSessionToken(store.get(SESSION_COOKIE)?.value);
}

/**
 * The real gate. The proxy redirect is only an optimisation — every admin
 * page and every admin action calls this before touching data.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}
