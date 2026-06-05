import { getTranslations } from "next-intl/server";
import { logout } from "@/server/auth-actions";
import { Button } from "@/components/ui/button";

export async function LogoutButton() {
  const t = await getTranslations("admin");
  return (
    <form action={logout}>
      <Button type="submit" variant="ghost" size="sm">
        {t("logout")}
      </Button>
    </form>
  );
}
