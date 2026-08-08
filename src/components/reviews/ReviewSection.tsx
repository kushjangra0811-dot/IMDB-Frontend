'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Review } from '../../lib/reviews/schema';
import ReviewEditor from './ReviewEditor';
import ReviewList from './ReviewList';
import { AuthProvider } from '../../lib/reviews/auth';
import { ArrowDownUp } from 'lucide-react';

interface ReviewSectionProps {
  movieId: string;
}

type SortOption = 'recent' | 'helpful' | 'controversial';

export default function ReviewSection({ movieId }: ReviewSectionProps) {
  const queryClient = useQueryClient();
  const [sort, setSort] = useState<SortOption>('helpful');

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', movieId],
    queryFn: async () => {
      const res = await fetch(`/api/reviews/${movieId}`);
      if (!res.ok) throw new Error('Failed to fetch reviews');
      return res.json() as Promise<Review[]>;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // SSE for Live Updates
  useEffect(() => {
    const eventSource = new EventSource(`/api/reviews/stream/${movieId}`);

    eventSource.addEventListener('new-review', (e) => {
      const newReview = JSON.parse(e.data);
      queryClient.setQueryData(['reviews', movieId], (old: Review[] = []) => {
        const existingIndex = old.findIndex(r => r.idempotencyKey === newReview.idempotencyKey);
        if (existingIndex !== -1) {
          const updated = [...old];
          updated[existingIndex] = newReview;
          return updated;
        }
        return [newReview, ...old];
      });
    });

    eventSource.addEventListener('update-review', (e) => {
      const updated = JSON.parse(e.data);
      queryClient.setQueryData(['reviews', movieId], (old: Review[] = []) => 
        old.map(r => r.id === updated.id ? updated : r)
      );
    });

    eventSource.addEventListener('delete-review', (e) => {
      const deleted = JSON.parse(e.data);
      queryClient.setQueryData(['reviews', movieId], (old: Review[] = []) => 
        old.filter(r => r.id !== deleted.id)
      );
    });

    return () => {
      eventSource.close();
    };
  }, [movieId, queryClient]);

  // Sorting Logic
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sort === 'recent') {
      return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
    }
    if (sort === 'helpful') {
      return (b.wilsonScore || 0) - (a.wilsonScore || 0);
    }
    if (sort === 'controversial') {
      // Controversial: high total votes, close ratio of up to down
      const aTotal = (a.upvotes || 0) + (a.downvotes || 0);
      const bTotal = (b.upvotes || 0) + (b.downvotes || 0);
      const aRatio = aTotal === 0 ? 0 : Math.min(a.upvotes || 0, a.downvotes || 0) / Math.max(a.upvotes || 0, a.downvotes || 0);
      const bRatio = bTotal === 0 ? 0 : Math.min(b.upvotes || 0, b.downvotes || 0) / Math.max(b.upvotes || 0, b.downvotes || 0);
      return (bTotal * bRatio) - (aTotal * aRatio);
    }
    return 0;
  });

  return (
    <AuthProvider>
      <section className="mt-16 pt-8 border-t border-border">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-foreground">Community Reviews</h2>
          
          <div className="flex items-center gap-2">
            <ArrowDownUp className="w-5 h-5 text-muted-foreground" />
            <select 
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="bg-muted text-foreground border border-border rounded-lg px-3 py-2 outline-none focus:border-yellow-500"
            >
              <option value="helpful">Most Helpful</option>
              <option value="recent">Most Recent</option>
              <option value="controversial">Most Controversial</option>
            </select>
          </div>
        </div>

        <ReviewEditor movieId={movieId} />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <ReviewList reviews={sortedReviews} />
        )}
      </section>
    </AuthProvider>
  );
}
