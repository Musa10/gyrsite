import Link from "next/link";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/media", label: "Media" },
];

export function Sidebar() {
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
