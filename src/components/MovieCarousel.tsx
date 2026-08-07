'use client';

import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useRef } from "react";
import Link from "next/link";
import MovieCard from "./MovieCard";
import { queryClient } from "../lib/queryClient";
import { getMovieDetails } from "../lib/api/tmdbClient";
import MovieCardSkeleton from "./skeletons/MovieCardSkeleton";

const MovieCarousel = ({ movies, isLoading = false }: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (id: number) => {
    queryClient.prefetchQuery({
      queryKey: ['movie', String(id)],
      queryFn: () => getMovieDetails(String(id)),
      staleTime: 1000 * 60 * 60, // 1 hour
    });
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -scrollRef.current.offsetWidth : scrollRef.current.offsetWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-[85vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] flex-shrink-0 p-2">
            <MovieCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (!movies || movies.length === 0) return null;

  return (
    <div className="relative group">
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 scroll-smooth"
      >
        {movies.map((movie: any) => (
          <div
            key={movie.id}
            className="w-[85vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] flex-shrink-0 snap-start p-2"
            onMouseEnter={() => handleMouseEnter(movie.id)}
          >
            <Link href={`/movie/${movie.id}`}>
              <MovieCard {...movie} />
            </Link>
          </div>
        ))}
      </div>

      {movies.length > 4 && (
        <>
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:block hover:bg-black/80"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:block hover:bg-black/80"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}
    </div>
  );
};

export default MovieCarousel;
