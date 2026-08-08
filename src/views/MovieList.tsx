'use client';

import React from "react";
import MovieCard from "../components/MovieCard";
import { useTrendingMovies } from "../hooks/useMovies";

const MovieList = () => {
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useTrendingMovies();
  const movies = data?.pages.flatMap(page => page.results) || [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Trending Movies</h1>
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">Error loading movies.</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
            {movies.map((movie) => (
              <div key={movie.id} className="h-full">
                <MovieCard {...movie} />
              </div>
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

export default MovieList;
