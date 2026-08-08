import fs from 'fs';
import path from 'path';
import { WatchlistItem, SyncPayloadSchema } from './schema';

const DB_PATH = path.join(process.cwd(), 'watchlist_db.json');

// Get all items from mock file DB
export function getServerWatchlist(): Record<string, WatchlistItem> {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({}));
  }
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data || '{}');
}

// Save all items to mock file DB
export function saveServerWatchlist(items: Record<string, WatchlistItem>) {
  fs.writeFileSync(DB_PATH, JSON.stringify(items, null, 2));
}

// Handle sync request (LWW Conflict Resolution)
export function processSync(clientItems: WatchlistItem[]): WatchlistItem[] {
  const serverItems = getServerWatchlist();
  
  for (const clientItem of clientItems) {
    const serverItem = serverItems[clientItem.id];
    
    // Last-Write-Wins (LWW)
    // If the server doesn't have it, or the client's update is newer, accept client's version.
    if (!serverItem || clientItem.updatedAt > serverItem.updatedAt) {
      serverItems[clientItem.id] = clientItem;
    }
  }

  saveServerWatchlist(serverItems);
  
  // Return the merged state so the client can update its local IndexedDB
  return Object.values(serverItems);
}
