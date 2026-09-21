"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { checkCredentials } from "@/lib/adminAuth";
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/session";

export type LoginState = { error?: string };

/** Only ever redirect inside the admin area — never to a caller-supplied host. */
function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
}

export async function signIn(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const ok = await checkCredentials(email, password);
  if (!ok) {
    // Slow failures down a little so guessing is tedious.
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { error: "That email and password don't match." };
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, await createSessionToken(email), sessionCookieOptions);

  redirect(next);
}

export async function signOut() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/admin/login");
}
