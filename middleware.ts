import NextAuth from "next-auth";
import createMiddleware from "next-intl/middleware";
import { authConfig } from "@/auth.config";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);
const { auth } = NextAuth(authConfig);

// Auth.js evaluates `authorized` first (redirecting unauthenticated admin
// requests to the login page); for everything it allows, we hand off to
// next-intl for locale detection, prefixing, and `/` → `/en` redirects.
export default auth((req) => {
  return intlMiddleware(req);
});

export const config = {
  // Run on everything except auth API, Next internals, and static files.
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
