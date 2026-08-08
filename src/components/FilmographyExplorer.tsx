'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import Link from 'next/link';
import { Star } from 'lucide-react';

interface MovieCredit {
  id: number;
  title: string;
  role: string;
  year: number | string;
  rating: number;
  image: string;
  genre?: string[];
}

export default function FilmographyExplorer({ movies }: { movies: MovieCredit[] }) {
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState<'year' | 'rating'>('year');
  const [roleFilter, setRoleFilter] = useState('all');
  
  const parentRef = useRef<HTMLDivElement>(null);

  // Extract unique roles for faceted filtering
  const uniqueRoles = useMemo(() => {
    const roles = new Set<string>();
    movies.forEach(m => {
      if (m.role && m.role !== 'Unknown') roles.add(m.role);
    });
    return Array.from(roles).sort().slice(0, 20); // Top 20 roles
  }, [movies]);

  const filteredAndSorted = useMemo(() => {
    return movies
      .filter(m => {
        const matchesSearch = m.title.toLowerCase().includes(filter.toLowerCase()) || 
                              m.role.toLowerCase().includes(filter.toLowerCase());
        const matchesRole = roleFilter === 'all' || m.role === roleFilter;
        return matchesSearch && matchesRole;
      })
      .sort((a, b) => {
        if (sort === 'year') {
          const yearA = typeof a.year === 'number' ? a.year : 0;
          const yearB = typeof b.year === 'number' ? b.year : 0;
          return yearB - yearA;
        }
        return b.rating - a.rating;
      });
  }, [movies, filter, sort, roleFilter]);

  const rowVirtualizer = useVirtualizer({
    count: filteredAndSorted.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
  });

  return (
    <div className="bg-muted p-6 rounded-xl mt-12">
      <div className="flex flex-col gap-4 mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          Full Filmography ({movies.length} credits)
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search movies or roles..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-background text-foreground border border-border flex-1 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as 'year' | 'rating')}
            className="px-4 py-2 rounded-lg bg-background text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="year">Sort by Year</option>
            <option value="rating">Sort by Rating</option>
          </select>
          {uniqueRoles.length > 1 && (
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 rounded-lg bg-background text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="all">All Roles</option>
              {uniqueRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {filteredAndSorted.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No movies found matching your search.</div>
      ) : (
        <div 
          ref={parentRef} 
          className="h-[500px] overflow-auto border border-border rounded-lg bg-background"
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const movie = filteredAndSorted[virtualRow.index];
              return (
                <div
                  key={virtualRow.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <Link href={`/movie/${movie.id}`} className="flex items-center gap-4 px-4 h-full">
                    <img 
                      src={movie.image} 
                      alt={movie.title} 
                      className="w-10 h-14 object-cover rounded shadow-sm bg-muted shrink-0"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{movie.title}</h3>
                      <p className="text-muted-foreground text-sm truncate">as {movie.role}</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-muted-foreground text-sm font-mono">{movie.year}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                        <span className="text-foreground text-sm font-medium">{movie.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
