import {
  Award,
  BarChart3,
  Calendar,
  Clock,
  DollarSign,
  Globe,
  Heart,
  Share2,
  Star,
  Play,
  BookmarkPlus,
} from "lucide-react";
import React from "react";
import Link from "next/link";
import MovieCarouselIsland from "../components/MovieCarouselIsland";
import HeroTrailerButton from "../components/HeroTrailerButton";
import ReviewSection from "../components/reviews/ReviewSection";
import WatchlistButton from "../components/WatchlistButton";

interface MovieDetailsProps {
  movie: any;
}

export default function MovieDetails({ movie }: MovieDetailsProps) {
  const media = [
    ...(movie.trailer ? [{ id: 'trailer', type: 'video' as const, url: movie.trailer, thumbnailUrl: movie.coverImage || movie.image, title: 'Trailer' }] : []),
    { id: 'cover', type: 'image' as const, url: movie.coverImage || movie.image, title: 'Backdrop' },
    { id: 'poster', type: 'image' as const, url: movie.image, title: 'Poster' }
  ];

  return (
    <div>
      <div className="relative h-[90vh] bg-zinc-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-top"
          style={{ backgroundImage: `url(${movie.coverImage || movie.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-end pb-12">
          <div className="grid md:grid-cols-3 gap-8 items-end">
            <div className="hidden md:block w-full max-w-sm shrink-0">
              <img
                src={movie.image}
                alt={movie.title}
                className="rounded-lg shadow-xl w-full h-auto object-contain bg-muted/50"
                loading="lazy"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="text-yellow-500 font-semibold">
                    {movie.rating} Rating
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span className="text-muted-foreground">{movie.duration}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <span className="text-muted-foreground">{movie.year}</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
                {movie.title}
              </h1>

              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genre?.map((g: string) => (
                  <span
                    key={g}
                    className="px-3 py-1 bg-muted/80 backdrop-blur-sm rounded-full text-sm text-foreground"
                  >
                    {g}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                {movie.trailer && <HeroTrailerButton trailerUrl={movie.trailer} />}
                <WatchlistButton movie={{ id: String(movie.id), title: movie.title, image: movie.image }} />
                <button className="bg-muted p-3 rounded-lg hover:bg-muted/80 transition-colors">
                  <Share2 className="w-5 h-5 text-foreground" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Media</h2>
              <MovieCarouselIsland media={media} />
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Overview</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {movie.description || "No overview available."}
              </p>
            </section>

            {movie.awards && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-foreground">Awards & Recognition</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {movie.awards.map((award: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-muted/50 backdrop-blur-sm p-4 rounded-lg"
                    >
                      <Award className="w-5 h-5 text-yellow-500" />
                      <span className="text-foreground">{award}</span>
                    </div>
                  ))}
                  {movie.metacriticScore && (
                    <div className="flex items-center gap-3 bg-muted/50 backdrop-blur-sm p-4 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-green-500" />
                      <span className="text-foreground">Metacritic: {movie.metacriticScore}/100</span>
                    </div>
                  )}
                  {movie.rottenTomatoesScore && (
                    <div className="flex items-center gap-3 bg-muted/50 backdrop-blur-sm p-4 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-red-500" />
                      <span className="text-foreground">Rotten Tomatoes: {movie.rottenTomatoesScore}%</span>
                    </div>
                  )}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-bold mb-6 text-foreground">Top Cast</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {movie.cast?.map((actor: any) => (
                  <Link href={`/actor/${actor.id}`} key={actor.id}>
                    <div className="flex items-center gap-4 bg-muted/30 rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer group">
                      <img
                        src={actor.image}
                        alt={actor.name}
                        className="w-16 h-16 rounded-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                      <div>
                        <h3 className="font-semibold text-lg mb-1 truncate text-foreground">
                          {actor.name}
                        </h3>
                        <p className="text-muted-foreground mb-2 truncate">{actor.role}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
            <ReviewSection movieId={movie.id.toString()} />
          </div>

          <div>
            <div className="sticky top-24 space-y-6">
              <div className="bg-muted/50 backdrop-blur-sm rounded-lg p-6">
                <h3 className="font-semibold mb-4 text-foreground">Movie Info</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-muted-foreground">Director</dt>
                    <dd className="text-foreground">{movie.director}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Production Company</dt>
                    <dd className="text-foreground">{movie.productionCompany}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <dt className="text-muted-foreground">Box Office</dt>
                    <dd className="flex items-center gap-1 text-foreground">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      {movie.boxOffice}
                    </dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <dt className="text-muted-foreground">Language</dt>
                    <dd className="flex items-center gap-1 text-foreground">
                      <Globe className="w-4 h-4 text-blue-500" />
                      {movie.language || 'English'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
