import { NextRequest, NextResponse } from "next/server";
import { parseSetCookie } from "cookie";
import { checkSession, getMe } from "@/lib/api/serverApi";

const privateRoutes = ["/notes", "/profile"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isPrivate = privateRoutes.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  const isPublic = publicRoutes.includes(pathname);
  const refreshedCookies: ReturnType<typeof parseSetCookie>[] = [];
  let authenticated = false;

  if (request.cookies.has("accessToken")) {
    try {
      await getMe(request.cookies.toString());
      authenticated = true;
    } catch {
      /* A refresh token may restore an expired access token below. */
    }
  }
  if (!authenticated && request.cookies.has("refreshToken")) {
    // The session route refreshes only when the expired access cookie is absent.
    request.cookies.delete("accessToken");
    try {
      const session = await checkSession(request.cookies.toString());
      if (session.data.success) {
        const raw = session.headers["set-cookie"];
        for (const value of raw ? (Array.isArray(raw) ? raw : [raw]) : []) {
          const parsed = parseSetCookie(value);
          if (parsed.value) {
            refreshedCookies.push(parsed);
            request.cookies.set(parsed.name, parsed.value);
          }
        }
        await getMe(request.cookies.toString());
        authenticated = true;
      }
    } catch {
      authenticated = false;
    }
  }

  const headers = new Headers(request.headers);
  headers.set("cookie", request.cookies.toString());
  let response: NextResponse;
  if (isPrivate && !authenticated)
    response = NextResponse.redirect(new URL("/sign-in", request.url));
  else if (isPublic && authenticated)
    response = NextResponse.redirect(new URL("/", request.url));
  else response = NextResponse.next({ request: { headers } });

  if (authenticated) {
    for (const parsed of refreshedCookies)
      response.cookies.set(parsed.name, parsed.value!, parsed);
  } else {
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
  }
  return response;
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};
