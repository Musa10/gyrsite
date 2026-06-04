import Image from "next/image";
import { getPublishedTeam } from "@/server/public-content";

export default async function TeamPage() {
  const team = await getPublishedTeam();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Team</h1>
      {team.length === 0 && (
        <p className="text-muted-foreground">No team members yet.</p>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {team.map((m) => (
          <div key={m.id} className="space-y-2 text-center">
            {m.photo && (
              <Image
                src={m.photo.url}
                alt={m.photo.alt ?? m.name}
                width={160}
                height={160}
                className="mx-auto h-40 w-40 rounded-full object-cover"
              />
            )}
            <h2 className="text-lg font-semibold">{m.name}</h2>
            <p className="text-sm text-muted-foreground">{m.role}</p>
            {m.bio && <p className="text-sm">{m.bio}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
