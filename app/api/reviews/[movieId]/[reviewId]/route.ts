import { NextResponse } from 'next/server';
import { updateReview, deleteReview, getReview } from '../../../../../src/lib/reviews/store';

const profaneWords = ['badword', 'abuse', 'spam']; // Simple mock filter
const isProfane = (text: string) => profaneWords.some(w => text.toLowerCase().includes(w));

export async function PUT(
  request: Request,
  { params }: { params: { movieId: string, reviewId: string } }
) {
  try {
    const body = await request.json();
    
    if (body.content && isProfane(body.content)) {
      return NextResponse.json({ error: 'Review contains inappropriate content' }, { status: 400 });
    }

    const updated = updateReview(params.movieId, params.reviewId, { content: body.content });
    if (!updated) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { movieId: string, reviewId: string } }
) {
  const success = deleteReview(params.movieId, params.reviewId);
  if (!success) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
