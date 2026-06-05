import NextAuth from "next-auth";
import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { authConfig } from "@/auth.config";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);
const { auth } = NextAuth(authConfig);

// Auth.js wrapper: once a request is allowed by the `authorized` callback,
// hand off to next-intl for locale finalization.
const authMiddleware = auth((req) => intlMiddleware(req));

const LOCALE_PREFIX = /^\/(en|ar)(?=\/|$)/;

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // localePrefix: "always" — every page URL must carry a locale. Redirect any
  // unprefixed path to the default locale (e.g. `/` → `/en`, `/blog` → `/en/blog`).
  if (!LOCALE_PREFIX.test(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = `/${routing.defaultLocale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  // Locale-prefixed admin (except the login page): gate via Auth.js.
  const path = pathname.replace(LOCALE_PREFIX, "") || "/";
  if (path.startsWith("/admin") && path !== "/admin/login") {
    return (authMiddleware as unknown as (r: NextRequest) => Response)(req);
  }

  // Locale-prefixed public route: let next-intl finalize locale handling.
  return intlMiddleware(req);
}

export const config = {
  // Run on the root and all pages, excluding API, Next internals, and files.
  matcher: ["/", "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
