import { redirect } from "next/navigation";

// Single-page site for now: Contact lives as the closing section on Home. The
// route is kept so old links/bookmarks resolve — it redirects to the localized
// Home. Restore the full page from git history when it's needed.
export default async function ContactRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}`);
}
