import { z } from 'zod';

export const ReviewSchema = z.object({
  id: z.string().uuid().optional(),
  movieId: z.string(),
  content: z.string().min(10, 'Review must be at least 10 characters').max(2000, 'Review cannot exceed 2000 characters'),
  rating: z.number().min(0).max(10).optional(), // 0 to 10 scale
  idempotencyKey: z.string().uuid(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  isEdited: z.boolean().optional(),
  upvotes: z.number().int().nonnegative().optional().default(0),
  downvotes: z.number().int().nonnegative().optional().default(0),
  userId: z.string(),
  username: z.string(),
  userAvatar: z.string().optional(),
  wilsonScore: z.number().optional().default(0),
});

export type Review = z.infer<typeof ReviewSchema>;

export const VoteSchema = z.object({
  reviewId: z.string().uuid(),
  vote: z.enum(['upvote', 'downvote', 'none']),
});
