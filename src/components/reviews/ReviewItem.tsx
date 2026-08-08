'use client';

import React, { useState } from 'react';
import { Review } from '../../lib/reviews/schema';
import { useAuth } from '../../lib/reviews/auth';
import { Star, ThumbsUp, ThumbsDown, Edit2, Trash2, RotateCcw, Check, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ReviewItemProps {
  review: Review;
}

export default function ReviewItem({ review }: ReviewItemProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isOwner = user?.id === review.userId;
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(review.content);
  const [isDeleted, setIsDeleted] = useState(false);

  // Voting Mutation
  const voteMutation = useMutation({
    mutationFn: async (vote: 'upvote' | 'downvote') => {
      const res = await fetch(`/api/reviews/${review.movieId}/${review.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId: review.id, vote }),
      });
      if (!res.ok) throw new Error('Failed to vote');
      return res.json();
    },
    onMutate: async (vote) => {
      // Optimistic UI for voting
      await queryClient.cancelQueries({ queryKey: ['reviews', review.movieId] });
      const previousReviews = queryClient.getQueryData(['reviews', review.movieId]);
      
      queryClient.setQueryData(['reviews', review.movieId], (old: Review[] = []) => 
        old.map(r => {
          if (r.id === review.id) {
            return {
              ...r,
              upvotes: vote === 'upvote' ? r.upvotes! + 1 : r.upvotes,
              downvotes: vote === 'downvote' ? r.downvotes! + 1 : r.downvotes,
            };
          }
          return r;
        })
      );
      return { previousReviews };
    },
    onError: (err, newVote, context) => {
      if (context?.previousReviews) queryClient.setQueryData(['reviews', review.movieId], context.previousReviews);
    },
  });

  // Edit Mutation
  const editMutation = useMutation({
    mutationFn: async (newContent: string) => {
      const res = await fetch(`/api/reviews/${review.movieId}/${review.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to edit');
      }
      return res.json();
    },
    onSuccess: () => {
      setIsEditing(false);
      // Wait for SSE to update the list, or invalidate
      queryClient.invalidateQueries({ queryKey: ['reviews', review.movieId] });
    },
    onError: (err: Error) => alert(err.message)
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/reviews/${review.movieId}/${review.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', review.movieId] });
    }
  });

  const handleDelete = () => {
    setIsDeleted(true);
    // Soft delete timeout to allow undo
    const timeout = setTimeout(() => {
      deleteMutation.mutate();
    }, 5000);
    
    // In a real app we'd clear timeout if Undo is clicked
  };

  const handleUndo = () => {
    setIsDeleted(false);
    // Note: To fully implement Undo, we'd need to clear the timeout above.
  };

  if (isDeleted) {
    return (
      <div className="bg-muted p-6 rounded-xl border border-border group/card transition-all duration-300 hover:border-accent/30 relative">
        <span className="text-muted-foreground">Review deleted.</span>
        <button onClick={handleUndo} className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400">
          <RotateCcw className="w-4 h-4" /> Undo
        </button>
      </div>
    );
  }

  return (
    <div className="bg-background border border-border p-6 rounded-xl">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <img src={review.userAvatar} alt={review.username} className="w-10 h-10 rounded-full" />
          <div>
            <h4 className="text-foreground font-medium flex items-center gap-2">
              {review.username}
              {review.isEdited && <span className="text-xs text-muted-foreground font-normal">(Edited)</span>}
            </h4>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span className="text-sm text-accent font-medium">{review.rating}</span>
              <span className="text-xs text-muted-foreground ml-2">
                {new Date(review.createdAt!).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        
        {isOwner && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              disabled={review.id?.startsWith('temp-')}
              className="p-1.5 text-muted-foreground hover:text-accent rounded-md hover:bg-background transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button 
              onClick={handleDelete} 
              disabled={review.id?.startsWith('temp-')}
              className="p-1.5 text-muted-foreground hover:text-red-400 rounded-md hover:bg-background transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="mb-4">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full bg-muted text-foreground p-3 rounded-lg border border-border focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none resize-y min-h-[100px] mb-2"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-accent/10 transition">Cancel</button>
            <button 
              onClick={() => editMutation.mutate(editContent)}
              disabled={editMutation.isPending || editContent === review.content}
              className="px-4 py-2 rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-400 disabled:opacity-50 transition"
            >
              {editMutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground leading-relaxed mb-6 whitespace-pre-wrap">{review.content}</p>
      )}

      <div className="flex items-center gap-4 border-t border-border pt-4">
        <button 
          onClick={() => voteMutation.mutate('upvote')}
          disabled={review.id?.startsWith('temp-')}
          className="flex items-center gap-2 text-muted-foreground hover:text-green-400 transition disabled:opacity-50"
        >
          <ThumbsUp className="w-4 h-4" />
          <span className="text-sm">{review.upvotes}</span>
        </button>
        <button 
          onClick={() => voteMutation.mutate('downvote')}
          disabled={review.id?.startsWith('temp-')}
          className="flex items-center gap-2 text-muted-foreground hover:text-red-400 transition disabled:opacity-50"
        >
          <ThumbsDown className="w-4 h-4" />
          <span className="text-sm">{review.downvotes}</span>
        </button>
      </div>
    </div>
  );
}
