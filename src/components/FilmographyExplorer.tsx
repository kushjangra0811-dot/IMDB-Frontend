'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';

export default function FilmographyExplorer({ actorId, initialMovies }: { actorId: string, initialMovies: any[] }) {
  const [filterGenre, setFilterGenre] = useState('All');
  
  const filteredMovies = useMemo(() => {
    if (filterGenre === 'All') return initialMovies;
    return initialMovies.filter(m => m.genre.includes(filterGenre));
  }, [filterGenre, initialMovies]);

  const parentRef = useRef<HTMLDivElement>(null);
  
  const rowVirtualizer = useVirtualizer({
    count: filteredMovies.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 140, // Height of list item + margin
    overscan: 5,
  });

  const genres = ['All', ...Array.from(new Set(initialMovies.flatMap(m => m.genre)))];

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Filmography Explorer</h2>
        <select 
          value={filterGenre} 
          onChange={(e) => setFilterGenre(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg outline-none cursor-pointer hover:bg-gray-700 transition-colors"
        >
          {genres.map(g => <option key={g as string} value={g as string}>{g as string}</option>)}
        </select>
      </div>

      <div 
        ref={parentRef} 
        className="h-[500px] overflow-auto rounded-xl bg-gray-900/30 p-4"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const movie = filteredMovies[virtualItem.index];
            return (
              <div
                key={virtualItem.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <Link href={`/movie/${movie.id}`}>
                  <div className="flex gap-4 p-4 bg-gray-800/50 hover:bg-gray-700/80 rounded-lg transition-colors h-[120px] mb-[20px]">
                    <div className="w-16 h-24 relative rounded-md overflow-hidden shrink-0 border border-gray-700">
                      <Image src={movie.image} alt={movie.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate text-white">{movie.title}</h3>
                      <p className="text-gray-400 text-sm truncate">as {movie.role} ({movie.year})</p>
                      <div className="flex gap-2 mt-2">
                        {movie.genre.map((g: string) => (
                          <span key={g} className="text-xs px-2 py-1 bg-gray-900 rounded-full text-gray-300">{g}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-yellow-500 font-medium text-sm">{movie.rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
          {filteredMovies.length === 0 && (
            <div className="text-gray-500 text-center py-8">No movies found for this filter.</div>
          )}
        </div>
      </div>
    </section>
  );
}
