import { getActorDetails } from "../../../src/lib/api/mockActorApi";
import FilmographyExplorer from "../../../src/components/FilmographyExplorer";
import { Star, Award, Instagram, Twitter } from "lucide-react";

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
      <div className="container mx-auto px-4 py-8">
        <div className="relative h-[400px] mb-8 rounded-xl overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${actor.knownFor[0]?.image || actor.coverImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80" />
          </div>
          <div className="relative h-full container flex items-end pb-8">
            <div className="flex items-end gap-8">
              <img
                src={actor.image}
                alt={actor.name}
                className="w-48 h-48 rounded-xl object-cover border-4 border-gray-900"
              />
              <div>
                <h1 className="text-4xl font-bold mb-4">{actor.name}</h1>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span>{actor.stats.avgRating} Average Rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-500" />
                    <span>{actor.stats.totalAwards} Awards</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="sticky top-24 space-y-6">
              <div className="bg-gray-800 rounded-xl p-6">
                <h2 className="font-semibold mb-4">Personal Info</h2>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-gray-400">Born</dt>
                    <dd>{actor.birthDate}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-400">Place of Birth</dt>
                    <dd>{actor.birthPlace}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-400">Movies</dt>
                    <dd>{actor.stats.moviesCount} titles</dd>
                  </div>
                </dl>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="font-semibold mb-4">Social Media</h2>
                <div className="flex gap-4">
                  <a
                    href={actor.socialMedia.instagram}
                    className="text-gray-400 hover:text-white"
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                  <a
                    href={actor.socialMedia.twitter}
                    className="text-gray-400 hover:text-white"
                  >
                    <Twitter className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Biography</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {actor.biography}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Awards & Nominations</h2>
              <div className="grid gap-4">
                {actor.awards.map((award: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-gray-800 p-4 rounded-xl"
                  >
                    <Award className="w-5 h-5 text-yellow-500" />
                    <div>
                      <span className="font-semibold">{award.name}</span>
                      <span className="mx-2">|</span>
                      <span>{award.year}</span>
                      <p className="text-sm text-gray-400">
                        {award.category} - {award.film}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <FilmographyExplorer initialMovies={actor.knownFor} />
          </div>
        </div>
      </div>
    </>
  );
}
