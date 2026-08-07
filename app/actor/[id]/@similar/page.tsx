import Image from "next/image";
import Link from "next/link";
import { getActorDetails, ACTORS } from "../../../../src/lib/api/mockActorApi";

export default async function SimilarPanel({ params }: { params: { id: string } }) {
  // We use the mock API directly to find similar actors, excluding the current one
  const actor = await getActorDetails(params.id);
  const similarActors = ACTORS.filter(a => a.id.toString() !== params.id).slice(0, 3);
  
  if (similarActors.length === 0) return null;

  return (
    <section className="bg-gray-800 p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Similar Actors</h2>
      <div className="grid gap-4">
        {similarActors.map((similar) => (
          <Link key={similar.id} href={`/actor/${similar.id}`}>
            <div className="flex items-center gap-4 hover:bg-gray-700 p-3 rounded-lg transition-colors">
              <div className="w-12 h-12 relative rounded-full overflow-hidden shrink-0 border border-gray-600">
                <Image src={similar.image} alt={similar.name} fill className="object-cover" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-white truncate">{similar.name}</h3>
                <p className="text-sm text-gray-400 truncate">{similar.nationality}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
