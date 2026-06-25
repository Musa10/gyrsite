import { redirect } from "next/navigation";

// Single-page site for now: About / founder lives as a section on Home. The
// route is kept so old links/bookmarks resolve — it redirects to the localized
// Home. Restore the full page from git history when it's needed.
export default async function AboutRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}`);
}
