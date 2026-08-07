import { Award } from "lucide-react";
import { getActorDetails } from "../../../../src/lib/api/mockActorApi";

export default async function AwardsPanel({ params }: { params: { id: string } }) {
  const actor = await getActorDetails(params.id);
  
  return (
    <section className="bg-gray-800 p-6 rounded-xl h-full">
      <h2 className="text-2xl font-bold mb-4">Awards & Nominations</h2>
      <div className="grid gap-4">
        {actor.awards.map((award, index) => (
          <div key={index} className="flex items-center gap-3 bg-gray-900 p-4 rounded-xl">
            <Award className="w-5 h-5 text-yellow-500 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-white">{award.name}</span>
              <span className="mx-2 text-gray-500">|</span>
              <span className="text-gray-300">{award.year}</span>
              <p className="text-sm text-gray-400 truncate">
                {award.category} - {award.film}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
