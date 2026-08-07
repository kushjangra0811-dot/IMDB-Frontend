'use client';

import { Play, Star, Info, SlidersHorizontal } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import MovieCard from "../components/MovieCard";
import { useSearchParams } from "next/navigation";
import { useTrendingMovies } from "../hooks/useMovies";
import { ErrorBoundary } from "../components/ErrorBoundary";
import MovieCardSkeleton from "../components/skeletons/MovieCardSkeleton";
import { queryClient } from "../lib/queryClient";
import { getMovieDetails } from "../lib/api/tmdbClient";

const MovieList = () => {
  const searchParams = useSearchParams();
  const search = searchParams?.get("search");

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useTrendingMovies(); // Using trending as popular movies for now

  const handleMouseEnter = (id) => {
    queryClient.prefetchQuery({
      queryKey: ['movie', String(id)],
      queryFn: () => getMovieDetails(String(id)),
      staleTime: 1000 * 60 * 60,
    });
  };

  return (
    <div className="container mx-auto px-5 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {search ? `Search Results for "${search}"` : "Popular Movies"}
        </h1>
        <button className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-xl hover:bg-gray-900 transition-colors">
          <SlidersHorizontal /> Filters
        </button>
      </div>

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

export default MovieList;
