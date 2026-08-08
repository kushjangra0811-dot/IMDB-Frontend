'use client';

import React from "react";
import { useTopRatedMovies } from "../hooks/useMovies";
import { Star } from "lucide-react";
import Link from "next/link";

const TopRated = () => {
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useTopRatedMovies();
  const movies = data?.pages.flatMap(page => page.results) || [];

  const formatVotes = (votes: number) => {
    if (votes >= 1000000) {
      return (votes / 1000000).toFixed(1) + 'M votes';
    }
    if (votes >= 1000) {
      return (votes / 1000).toFixed(1) + 'K votes';
    }
    return votes + ' votes';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Top Rated</h1>
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">Error loading movies.</div>
      ) : (
        <>
          <div className="flex flex-col gap-4 mb-8">
            {movies.map((movie, index) => (
              <Link href={`/movie/${movie.id}`} key={movie.id} className="flex h-24 sm:h-32 bg-white rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] transition-transform duration-200">
                <div className="flex items-center justify-center w-12 sm:w-16 bg-[#f5c518] text-black font-bold text-lg sm:text-xl shrink-0">
                  #{index + 1}
                </div>
                <div className="w-16 sm:w-24 relative flex-shrink-0 bg-zinc-200">
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex flex-1 justify-between items-center px-4 sm:px-6 overflow-hidden">
                  <div className="flex flex-col justify-center min-w-0 flex-1">
                    <h2 className="text-base sm:text-lg font-bold text-black mb-0.5 truncate">{movie.title}</h2>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      {movie.year} • {formatVotes(movie.voteCount || 0)}
                    </p>
                  </div>
                  <div className="flex items-center ml-4 shrink-0">
                    <Star className="w-4 h-4 text-[#f5c518] fill-[#f5c518] mr-1.5" />
                    <span className="text-black font-bold text-sm sm:text-base">{(movie.rating || 0).toFixed(1)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {hasNextPage && (
            <div className="flex justify-center mt-8">
              <button
                className="bg-muted text-foreground px-8 py-3 rounded-lg font-semibold hover:bg-muted transition-colors disabled:opacity-50"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? 'Loading more...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TopRated;
