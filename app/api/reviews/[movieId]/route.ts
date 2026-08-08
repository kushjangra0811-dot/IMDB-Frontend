import { NextResponse } from 'next/server';
import { ReviewSchema } from '../../../../src/lib/reviews/schema';
import { getReviews, addReview, updateReview, deleteReview } from '../../../../src/lib/reviews/store';

const profaneWords = ['badword', 'abuse', 'spam'];
const isProfane = (text: string) => profaneWords.some(w => text.toLowerCase().includes(w));

// Extremely simple in-memory rate limiter for demo purposes
const rateLimitCache = new Map<string, { count: number; timestamp: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitCache.get(ip);
  if (!record) {
    rateLimitCache.set(ip, { count: 1, timestamp: now });
    return false;
  }
  if (now - record.timestamp > 60000) { // 1 minute window
    rateLimitCache.set(ip, { count: 1, timestamp: now });
    return false;
  }
  if (record.count >= 10) { // 10 requests per minute
    return true;
  }
  record.count += 1;
  return false;
}

export async function GET(
  request: Request,
  { params }: { params: { movieId: string } }
) {
  const { movieId } = params;
  const reviews = getReviews(movieId);
  return NextResponse.json(reviews);
}

export async function POST(
  request: Request,
  { params }: { params: { movieId: string } }
) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const result = ReviewSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid review data', details: result.error.flatten() }, { status: 400 });
    }

    const reviewData = result.data;
    
    // Profanity filter moderation hook
    if (isProfane(reviewData.content)) {
      return NextResponse.json({ error: 'Review contains inappropriate content' }, { status: 400 });
    }

    const savedReview = addReview(reviewData);
    return NextResponse.json(savedReview, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
