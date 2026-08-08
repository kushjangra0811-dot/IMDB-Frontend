import { NextResponse } from 'next/server';
import { getReview, updateReview } from '../../../../../../src/lib/reviews/store';
import { wilsonScore } from '../../../../../../src/lib/reviews/wilsonScore';
import { VoteSchema } from '../../../../../../src/lib/reviews/schema';

export async function POST(
  request: Request,
  { params }: { params: { movieId: string, reviewId: string } }
) {
  try {
    const body = await request.json();
    const result = VoteSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid vote data' }, { status: 400 });
    }

    const review = getReview(params.movieId, params.reviewId);
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // In a real app, we'd check if the user already voted and adjust totals.
    // For this mock, we just increment/decrement based on the action.
    let upvotes = review.upvotes || 0;
    let downvotes = review.downvotes || 0;

    if (result.data.vote === 'upvote') {
      upvotes++;
    } else if (result.data.vote === 'downvote') {
      downvotes++;
    }

    // Recalculate Wilson Score
    const newScore = wilsonScore(upvotes, downvotes);

    const updated = updateReview(params.movieId, params.reviewId, {
      upvotes,
      downvotes,
      wilsonScore: newScore,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
