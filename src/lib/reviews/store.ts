import { Review } from './schema';
import { EventEmitter } from 'events';
// Removed fs and path imports

// Event emitter to handle SSE broadcast
export const reviewEvents = new EventEmitter();

// Use an in-memory store attached to globalThis so it persists across HMR in dev and works in Serverless
const getDb = (): Record<string, Review[]> => {
  const globalAny = globalThis as any;
  if (!globalAny.__reviewsDb) {
    globalAny.__reviewsDb = {};
  }
  return globalAny.__reviewsDb;
};

// Helper to read DB (now just returns the in-memory object)
const readDb = (): Record<string, Review[]> => {
  return getDb();
};

// Helper to write DB (no-op since we mutate the object directly)
const writeDb = (db: Record<string, Review[]>) => {
  // In-memory changes are already applied.
};

export const getReviews = (movieId: string): Review[] => {
  const db = readDb();
  return db[movieId] || [];
};

export const getReview = (movieId: string, reviewId: string): Review | undefined => {
  return getReviews(movieId).find(r => r.id === reviewId);
};

export const addReview = (review: Review): Review => {
  const db = readDb();
  if (!db[review.movieId]) {
    db[review.movieId] = [];
  }
  
  const exists = db[review.movieId].some(r => r.idempotencyKey === review.idempotencyKey);
  if (exists) {
    return db[review.movieId].find(r => r.idempotencyKey === review.idempotencyKey)!;
  }

  const newReview = {
    ...review,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  db[review.movieId].unshift(newReview);
  writeDb(db);
  reviewEvents.emit(`new-review-${review.movieId}`, newReview);
  return newReview;
};

export const updateReview = (movieId: string, reviewId: string, updates: Partial<Review>): Review | null => {
  const db = readDb();
  if (!db[movieId]) return null;
  
  const index = db[movieId].findIndex(r => r.id === reviewId);
  if (index === -1) return null;

  db[movieId][index] = {
    ...db[movieId][index],
    ...updates,
    updatedAt: new Date().toISOString(),
    isEdited: updates.content ? true : db[movieId][index].isEdited,
  };
  
  writeDb(db);
  reviewEvents.emit(`update-review-${movieId}`, db[movieId][index]);
  return db[movieId][index];
};

export const deleteReview = (movieId: string, reviewId: string): boolean => {
  const db = readDb();
  if (!db[movieId]) return false;
  
  const index = db[movieId].findIndex(r => r.id === reviewId);
  if (index === -1) return false;
  
  reviewEvents.emit(`delete-review-${movieId}`, { id: reviewId });
  
  db[movieId].splice(index, 1);
  writeDb(db);
  return true;
};
