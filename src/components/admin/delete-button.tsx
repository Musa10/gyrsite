import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";

export async function DeleteButton({
  action,
  id,
}: {
  action: (id: string) => Promise<void>;
  id: string;
}) {
  const t = await getTranslations("admin");
  return (
    <form action={action.bind(null, id)}>
      <Button type="submit" variant="ghost" size="sm" className="text-red-600">
        {t("delete")}
      </Button>
    </form>
  );
}
