'use client';

import { Star, Trophy } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import MovieCard from "../components/MovieCard";
import { useTopRatedMovies } from "../hooks/useMovies";
import { ErrorBoundary } from "../components/ErrorBoundary";
import MovieCardSkeleton from "../components/skeletons/MovieCardSkeleton";
import { queryClient } from "../lib/queryClient";
import { getMovieDetails } from "../lib/api/tmdbClient";

const Toprated = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useTopRatedMovies();

  const handleMouseEnter = (id: number) => {
    queryClient.prefetchQuery({
      queryKey: ['movie', String(id)],
      queryFn: () => getMovieDetails(String(id)),
      staleTime: 1000 * 60 * 60,
    });
  };

  return (
    <div className="container mx-auto px-5 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-8"
      >
        <Trophy className="w-8 h-8 text-yellow-500" />
        <h1 className="text-3xl font-bold">Top Rated Movies</h1>
      </motion.div>

      <ErrorBoundary>
        {isError && (
          <div className="text-red-500 mb-8">Failed to load top rated movies.</div>
        )}

        <div className="space-y-6 mb-8">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-zinc-900 rounded-xl h-48 w-full" />
            ))
          ) : (
            data?.pages.flatMap((page, pageIndex) => 
              page.results.map((movie, index) => (
                <div key={`${pageIndex}-${movie.id}`}>
                  <Link href={`/movie/${movie.id}`} onMouseEnter={() => handleMouseEnter(movie.id)}>
                    <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                      <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-16 bg-yellow-500 flex items-center justify-center text-black font-bold text-xl py-2 sm:py-0">
                          #{pageIndex * 20 + index + 1}
                        </div>
                        <div className="relative w-full sm:w-48 aspect-[2/3] sm:aspect-auto">
                          <img
                            src={movie.image}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1 p-4 sm:p-6 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2 sm:gap-0">
                            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white truncate">
                              {movie.title}
                            </h2>
                            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full w-fit">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium text-zinc-900 dark:text-white">
                                {movie.rating}
                              </span>
                            </div>
                          </div>
                          <div className="text-zinc-400 dark:text-zinc-400">
                            <span>{movie.year}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
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

export default Toprated;
