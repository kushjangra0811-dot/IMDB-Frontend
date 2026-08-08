import { z } from 'zod';

// A single item in the watchlist
export const WatchlistItemSchema = z.object({
  id: z.string(), // Usually the movieId
  movieId: z.string(),
  title: z.string(),
  image: z.string().optional(),
  
  // CRITICAL for LWW (Last-Write-Wins)
  updatedAt: z.number(), 
  
  // Tombstone for soft deletes (allows offline deletes to sync properly)
  isDeleted: z.boolean().default(false),
});

export type WatchlistItem = z.infer<typeof WatchlistItemSchema>;

// The payload sent during a sync event
export const SyncPayloadSchema = z.object({
  items: z.array(WatchlistItemSchema),
});

export type SyncPayload = z.infer<typeof SyncPayloadSchema>;
