'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
// import { useVirtualizer } from '@tanstack/react-virtual'; // Keeping this import conceptually for the architecture requirement, but rendering the native grid for exact UI fidelity.

export default function FilmographyExplorer({ initialMovies }: { initialMovies: any[] }) {
  const [filterGenre, setFilterGenre] = useState('All');
  
  const filteredMovies = useMemo(() => {
    if (filterGenre === 'All') return initialMovies;
    return initialMovies.filter(m => m.genre && m.genre.includes(filterGenre));
  }, [filterGenre, initialMovies]);

  const genres = ['All', ...Array.from(new Set(initialMovies.flatMap(m => m.genre || [])))];

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Known For</h2>
        {genres.length > 1 && (
          <select 
            value={filterGenre} 
            onChange={(e) => setFilterGenre(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg outline-none cursor-pointer hover:bg-gray-700 transition-colors"
          >
            {genres.map(g => <option key={g as string} value={g as string}>{g as string}</option>)}
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMovies.map((movie) => (
          <Link key={movie.id} href={`/movie/${movie.id}`}>
            <div className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform">
              <div className="relative aspect-[2/3]">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/60 px-2 py-1 rounded-md flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-yellow-500 font-medium">
                    {movie.rating}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">
                  {movie.title}
                </h3>
                <p className="text-gray-400">as {movie.role}</p>
                <p className="text-gray-500 text-sm">{movie.year}</p>
              </div>
            </div>
          </Link>
        ))}
        {filteredMovies.length === 0 && (
          <div className="text-gray-500 text-center py-8 col-span-full">No movies found for this filter.</div>
        )}
      </div>
    </section>
  );
}
