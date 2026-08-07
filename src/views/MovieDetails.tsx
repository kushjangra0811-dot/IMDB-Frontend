'use client';

import {
  Award,
  BarChart3,
  Calendar,
  Clock,
  DollarSign,
  Globe,
  Heart,
  Play,
  Share2,
  Star,
} from "lucide-react";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMovieDetails } from "../hooks/useMovies";
import { ErrorBoundary } from "../components/ErrorBoundary";
import MovieDetailSkeleton from "../components/skeletons/MovieDetailSkeleton";

const MovieDetailsContent = ({ id }: { id: string }) => {
  const { data: movie, isLoading, isError } = useMovieDetails(id);

  if (isLoading) {
    return <MovieDetailSkeleton />;
  }

  if (isError || !movie) {
    throw new Error("Failed to load movie details");
  }

  return (
    <div>
      <div className="relative h-[90vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${movie.coverImage || movie.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-end pb-12">
          <div className="grid md:grid-cols-3 gap-8 items-end w-full">
            <div className="hidden md:block">
              <img
                src={movie.image}
                alt={movie.title}
                className="rounded-lg shadow-xl aspect-[2/3] object-cover"
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
                  <Clock className="w-5 h-5 text-zinc-400" />
                  <span className="text-zinc-300">{movie.duration}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
                  <Calendar className="w-5 h-5 text-zinc-400" />
                  <span className="text-zinc-300">{movie.year}</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                {movie.title}
              </h1>

              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genre.map((g: string) => (
                  <span
                    key={g}
                    className="px-3 py-1 bg-zinc-800/80 backdrop-blur-sm rounded-full text-sm text-white"
                  >
                    {g}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                {movie.trailer ? (
                  <a
                    href={movie.trailer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-yellow-400 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    Watch Trailer
                  </a>
                ) : (
                  <button disabled className="bg-zinc-700 text-zinc-400 px-8 py-3 rounded-lg font-semibold flex items-center gap-2 cursor-not-allowed">
                    <Play className="w-5 h-5" />
                    No Trailer
                  </button>
                )}
                <button className="bg-zinc-800/80 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-semibold hover:bg-zinc-700 transition-colors flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Add to Watchlist
                </button>
                <button className="bg-zinc-800/80 backdrop-blur-sm text-white px-4 py-3 rounded-lg hover:bg-zinc-700 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-white">Overview</h2>
              <p className="text-zinc-300 text-lg leading-relaxed">
                {movie.description || "No overview available."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 text-white">Top Cast</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {movie.cast.map((actor: any, index: number) => (
                  <div
                    key={index}
                    className="bg-zinc-800/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 flex gap-3 sm:gap-4"
                  >
                    <img
                      src={actor.image}
                      alt={actor.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-base sm:text-lg mb-1 text-white truncate" title={actor.name}>
                        {actor.name}
                      </h3>
                      <p className="text-zinc-400 text-sm sm:text-base truncate" title={actor.role}>{actor.role}</p>
                    </div>
                  </div>
                ))}
                {movie.cast.length === 0 && (
                  <p className="text-zinc-400 col-span-full">No cast information available.</p>
                )}
              </div>
            </section>
          </div>

          <div>
            <div className="sticky top-24 space-y-6">
              <div className="bg-zinc-800/50 backdrop-blur-sm rounded-lg p-6">
                <h3 className="font-semibold mb-4 text-white">Movie Info</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-zinc-400">Director</dt>
                    <dd className="text-white">{movie.director}</dd>
                  </div>
                  <div>
                    <dt className="text-zinc-400">Release Date</dt>
                    <dd className="text-white">{movie.year}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const MovieDetails = () => {
  const { id } = useParams();
  
  return (
    <ErrorBoundary fallback={
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Movie</h2>
        <p className="text-zinc-400 mb-8">We could not load the details for this movie.</p>
        <Link href="/" className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors">
          Return Home
        </Link>
      </div>
    }>
      <MovieDetailsContent id={id as string} />
    </ErrorBoundary>
  );
};

export default MovieDetails;
