'use client';

import { Star, Award } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import MovieCard from "../components/MovieCard";
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <MovieCardSkeleton key={i} />)
          ) : (
            data?.pages.flatMap((page, pageIndex) => 
              page.results.map((movie) => (
                <Link 
                  key={`${pageIndex}-${movie.id}`} 
                  href={`/movie/${movie.id}`}
                  onMouseEnter={() => handleMouseEnter(movie.id)}
                  className="block"
                >
                  <MovieCard {...movie} />
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
