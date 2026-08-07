'use client';

import { Star, Award } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTopRatedMovies } from "../hooks/useMovies";
import { ErrorBoundary } from "../components/ErrorBoundary";
import MovieCardSkeleton from "../components/skeletons/MovieCardSkeleton";
import { queryClient } from "../lib/queryClient";
import { getMovieDetails } from "../lib/api/tmdbClient";

const Awards = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useTopRatedMovies(); // Using TopRated as a proxy for Awards per plan

  const handleMouseEnter = (id: number) => {
    queryClient.prefetchQuery({
      queryKey: ['movie', String(id)],
      queryFn: () => getMovieDetails(String(id)),
      staleTime: 1000 * 60 * 60,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-8"
      >
        <Award className="w-8 h-8 text-red-500" />
        <h1 className="text-3xl font-bold">Award-Winning Movies</h1>
      </motion.div>

      <ErrorBoundary>
        {isError && (
          <div className="text-red-500 mb-8">Failed to load movies. Please try again.</div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <MovieCardSkeleton key={i} />)
          ) : (
            data?.pages.flatMap((page, pageIndex) => 
              page.results.map((movie) => (
                <Link 
                  key={`${pageIndex}-${movie.id}`} 
                  href={`/movie/${movie.id}`}
                  onMouseEnter={() => handleMouseEnter(movie.id)}
                >
                  <div className="bg-gray-900 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300">
                    <div className="relative aspect-video">
                      <img
                        src={movie.image}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-yellow-500 font-medium">
                          {movie.rating}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h2 className="text-xl font-semibold mb-2 truncate">
                        {movie.title}
                      </h2>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">{movie.year}</span>
                        <div className="flex gap-2">
                          {movie.genre.slice(0, 2).map((g) => (
                            <span key={g} className="text-xs px-2 py-1 bg-zinc-800 rounded-full text-zinc-300">
                              {g}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )
          )}
          {isFetchingNextPage && (
            Array.from({ length: 3 }).map((_, i) => <MovieCardSkeleton key={`loading-${i}`} />)
          )}
        </div>

        {hasNextPage && !isLoading && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              {isFetchingNextPage ? 'Loading more...' : 'Load More'}
            </button>
          </div>
        )}
      </ErrorBoundary>
    </div>
  );
};

export default Awards;
