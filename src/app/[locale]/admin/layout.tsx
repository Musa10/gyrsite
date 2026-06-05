import { Sidebar } from "@/components/admin/sidebar";
import { LogoutButton } from "@/components/admin/logout-button";
import { auth } from "@/auth";
import { ThemeToggle } from "@/components/site/theme-toggle";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // The login page renders its own full-screen UI; when unauthenticated we
  // simply render children (the login page handles its own layout).
  if (!session?.user) return <>{children}</>;

  return (
    <div className="grid min-h-screen grid-cols-[220px_1fr]">
      <aside className="border-r bg-muted/20">
        <div className="flex h-14 items-center px-4 font-semibold">
          GYRsite CMS
        </div>
        <Sidebar />
      </aside>
      <div className="flex flex-col">
        <header className="flex h-14 items-center justify-between border-b px-6">
          <span className="text-sm text-muted-foreground">
            {session.user.email}
          </span>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
