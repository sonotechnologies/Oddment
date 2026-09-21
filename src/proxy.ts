import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE, readSessionToken } from "@/lib/session";

/**
 * Optimistic gate only — it keeps signed-out visitors off admin screens.
 * Authorisation itself is enforced again in every admin page and action.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await readSessionToken(
    request.cookies.get(SESSION_COOKIE)?.value,
  );

  if (pathname === "/admin/login") {
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    if (pathname !== "/admin") loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
