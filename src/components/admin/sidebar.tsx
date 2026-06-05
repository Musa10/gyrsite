import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function Sidebar() {
  const t = await getTranslations("admin");

  const links = [
    { href: "/admin", label: t("dashboard") },
    { href: "/admin/posts", label: t("posts") },
    { href: "/admin/pages", label: t("pages") },
    { href: "/admin/team", label: t("team") },
    { href: "/admin/media", label: t("media") },
  ];

  return (
    <nav className="flex flex-col gap-1 p-4">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="rounded px-3 py-2 text-sm hover:bg-muted"
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
