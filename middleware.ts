import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// localePrefix: "always" — next-intl redirects unprefixed paths (`/` → `/en`)
// and finalizes the locale for prefixed ones. No auth: the site is fully static.
export default createMiddleware(routing);

export const config = {
  // Run on the root and all pages, excluding Next internals and files.
  matcher: ["/", "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
