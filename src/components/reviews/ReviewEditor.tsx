'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../lib/reviews/auth';
import { set, get, del } from 'idb-keyval';
import { v4 as uuidv4 } from 'uuid';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Review } from '../../lib/reviews/schema';
import { Star } from 'lucide-react';

interface ReviewEditorProps {
  movieId: string;
}

export default function ReviewEditor({ movieId }: ReviewEditorProps) {
  const { user, login } = useAuth();
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [idempotencyKey, setIdempotencyKey] = useState('');
  const queryClient = useQueryClient();
  const saveTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setIdempotencyKey(uuidv4());
    // Load draft
    get(`draft-${movieId}`).then((draft) => {
      if (draft) {
        setContent(draft.content || '');
        setRating(draft.rating || 0);
      }
    });
  }, [movieId]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    
    // Debounce autosave to IndexedDB
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      set(`draft-${movieId}`, { content: val, rating });
    }, 1000);
  };

  const submitMutation = useMutation({
    mutationFn: async (newReview: Partial<Review>) => {
      const res = await fetch(`/api/reviews/${movieId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to post review');
      }
      return res.json();
    },
    onMutate: async (newReview) => {
      // Optimistic Update
      await queryClient.cancelQueries({ queryKey: ['reviews', movieId] });
      const previousReviews = queryClient.getQueryData(['reviews', movieId]);
      
      const optimisticReview: Review = {
        id: 'temp-' + Date.now(),
        movieId,
        content: newReview.content!,
        rating: newReview.rating!,
        idempotencyKey: newReview.idempotencyKey!,
        userId: user!.id,
        username: user!.username,
        userAvatar: user!.avatar,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
        wilsonScore: 0,
      };

      queryClient.setQueryData(['reviews', movieId], (old: Review[] = []) => [optimisticReview, ...old]);
      return { previousReviews };
    },
    onError: (err, newReview, context) => {
      if (context?.previousReviews) {
        queryClient.setQueryData(['reviews', movieId], context.previousReviews);
      }
      alert(err.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', movieId] });
    },
    onSuccess: () => {
      setContent('');
      setRating(0);
      setIdempotencyKey(uuidv4());
      del(`draft-${movieId}`);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      login(); // Auto-login mock
      return;
    }
    if (content.length < 10) {
      alert("Review must be at least 10 characters");
      return;
    }
    submitMutation.mutate({
      movieId,
      content,
      rating,
      idempotencyKey,
      userId: user.id,
      username: user.username,
      userAvatar: user.avatar,
    });
  };

  if (!user) {
    return (
      <div className="bg-muted/50 p-6 rounded-xl text-center backdrop-blur-sm mb-8">
        <h3 className="text-xl font-semibold text-foreground mb-2">Write a Review</h3>
        <p className="text-muted-foreground mb-4">You must be logged in to share your thoughts.</p>
        <button 
          onClick={login}
          className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
        >
          Login to Review
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-muted/50 p-6 rounded-xl backdrop-blur-sm mb-8">
      <div className="flex items-center gap-4 mb-4">
        <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full" />
        <span className="text-foreground font-medium">{user.username}</span>
      </div>
      
      <div className="flex flex-wrap gap-1 mb-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="focus:outline-none"
          >
            <Star 
              className={`w-6 h-6 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-600'} transition-colors hover:text-yellow-400`}
            />
          </button>
        ))}
      </div>

      <textarea
        value={content}
        onChange={handleContentChange}
        placeholder="Write your review here... (At least 10 characters)"
        className="w-full bg-background/50 text-foreground p-4 rounded-lg border border-border focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none resize-y min-h-[120px] mb-4"
        disabled={submitMutation.isPending}
      />

      <div className="flex justify-between items-center">
        <span className="text-muted-foreground text-sm">
          {content.length > 0 && (saveTimeout.current ? 'Draft saved.' : 'Autosaving...')}
        </span>
        <button
          type="submit"
          disabled={submitMutation.isPending || content.length < 10}
          className="bg-yellow-500 text-black px-8 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition disabled:opacity-50"
        >
          {submitMutation.isPending ? 'Posting...' : 'Post Review'}
        </button>
      </div>
    </form>
  );
}
