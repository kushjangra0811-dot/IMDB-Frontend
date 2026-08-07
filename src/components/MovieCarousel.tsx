'use client';

import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import MovieCard from "./MovieCard.tsx";
import { queryClient } from "../lib/queryClient";
import { getMovieDetails } from "../lib/api/tmdbClient";
import MovieCardSkeleton from "./skeletons/MovieCardSkeleton";

const MovieCarousel = ({ movies, isLoading = false }) => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleMovies = 4;

  const nextSlide = () => {
    if (!movies) return;
    setStartIndex((prev) =>
      prev + visibleMovies >= movies.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    if (!movies) return;
    setStartIndex((prev) =>
      prev === 0 ? Math.max(0, movies.length - visibleMovies) : prev - 1
    );
  };

  const handleMouseEnter = (id) => {
    queryClient.prefetchQuery({
      queryKey: ['movie', String(id)],
      queryFn: () => getMovieDetails(String(id)),
      staleTime: 1000 * 60 * 60, // 1 hour
    });
  };

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: visibleMovies }).map((_, i) => (
          <div key={i} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 p-2">
            <MovieCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (!movies || movies.length === 0) return null;

  return (
    <div className="relative group">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${startIndex * (100 / visibleMovies)}%)`,
          }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 p-2"
              onMouseEnter={() => handleMouseEnter(movie.id)}
            >
              <Link href={`/movie/${movie.id}`}>
                <MovieCard {...movie} />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {movies.length > visibleMovies && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  );
};

export default MovieCarousel;
