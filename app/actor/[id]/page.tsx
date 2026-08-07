import { getActorDetails } from "../../../src/lib/api/mockActorApi";
import FilmographyExplorer from "../../../src/components/FilmographyExplorer";
import Image from "next/image";
import { Star, Award as AwardIcon } from "lucide-react";

export const runtime = 'edge';
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { id: string } }) {
  const actor = await getActorDetails(params.id);
  return {
    title: `${actor.name} - IMDb Clone`,
    description: actor.biography.slice(0, 150) + '...',
  };
}

export default async function ActorPage({ params }: { params: { id: string } }) {
  const actor = await getActorDetails(params.id);
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": actor.name,
    "birthDate": actor.birthDate,
    "birthPlace": actor.birthPlace,
    "description": actor.biography,
    "image": actor.image,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="relative h-[400px] mb-8 overflow-hidden">
        <Image 
          src={actor.coverImage} 
          alt={`${actor.name} cover`} 
          fill 
          priority 
          className="object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        <div className="relative h-full container mx-auto px-4 flex items-end pb-8">
          <div className="flex flex-col sm:flex-row items-end gap-8">
            <div className="w-48 h-48 relative rounded-xl overflow-hidden border-4 border-gray-900 shrink-0">
              <Image src={actor.image} alt={actor.name} fill priority className="object-cover" />
            </div>
            <div className="pb-2">
              <h1 className="text-4xl font-bold mb-4">{actor.name}</h1>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span>{actor.stats.avgRating} Average Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <AwardIcon className="w-5 h-5 text-purple-500" />
                  <span>{actor.stats.totalAwards} Awards</span>
                </div>
                <div className="text-gray-400 border-l border-gray-700 pl-6">
                  {actor.birthPlace}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <section className="mb-12 max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">Biography</h2>
          <p className="text-gray-300 text-lg leading-relaxed">{actor.biography}</p>
        </section>
        
        {/* Filmography Explorer Component */}
        <FilmographyExplorer actorId={actor.id.toString()} initialMovies={actor.knownFor} />
      </div>
    </>
  );
}
