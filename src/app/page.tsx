import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

// The bare root `/` carries no locale. In production the middleware redirects
// it to a locale, but Turbopack `next dev` does not run middleware — so without
// this page `/` would 404 in dev. Redirect to the default locale here too, which
// works in both dev and production.
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
