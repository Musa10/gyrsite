import { Button } from "@/components/ui/button";

export function DeleteButton({
  action,
  id,
}: {
  action: (id: string) => Promise<void>;
  id: string;
}) {
  return (
    <form action={action.bind(null, id)}>
      <Button type="submit" variant="ghost" size="sm" className="text-red-600">
        Delete
      </Button>
    </form>
  );
}
