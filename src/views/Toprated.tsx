'use client';

import { Star, Trophy } from "lucide-react";
import React from "react";
import Link from "next/link";

const Toprated = () => {
  const movies = [
    {
      id: 1,
      title: "The Shawshank Redemption",
      rating: 9.3,
      image:
        "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?auto=format&fit=crop&w=800&q=80",
      year: 1994,
      votes: "2.8M",
      rank: 1,
    },
    {
      id: 2,
      title: "The Godfather",
      rating: 9.2,
      image:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
      year: 1972,
      votes: "2.1M",
      rank: 2,
    },
    {
      id: 3,
      title: "The Dark Knight",
      rating: 9.0,
      image:
        "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80",
      year: 2008,
      votes: "2.7M",
      rank: 3,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="w-8 h-8 text-yellow-500" />
        <h1 className="text-3xl font-bold text-white">Top Rated Movies</h1>
      </div>
      <div className="space-y-6">
        {movies.map((movie) => (
          <div key={movie.id}>
            <Link href={`/movie/${movie.id}`} className="block">
              <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-16 bg-yellow-500 flex items-center justify-center text-black font-bold text-xl py-2 sm:py-0">
                    #{movie.rank}
                  </div>
                  <div className="relative w-full sm:w-48 aspect-[2/3] sm:aspect-auto">
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2 sm:gap-0">
                      <h2 className="text-xl font-semibold text-white">
                        {movie.title}
                      </h2>
                      <div className="flex items-center gap-1 bg-zinc-800 px-2 py-1 rounded-full w-fit">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-white">
                          {movie.rating}
                        </span>
                      </div>
                    </div>
                    <div className="text-zinc-400">
                      <span>{movie.year}</span>
                      <span className="mx-2">•</span>
                      <span>{movie.votes} votes</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Toprated;
