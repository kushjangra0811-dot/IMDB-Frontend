import { get, set } from 'idb-keyval';
import { WatchlistItem, SyncPayload } from './schema';

const STORE_KEY = 'watchlist_items';
const SYNC_QUEUE_KEY = 'watchlist_sync_queue';

// Get all items (both active and soft-deleted)
export async function getAllItems(): Promise<Record<string, WatchlistItem>> {
  const items = await get<Record<string, WatchlistItem>>(STORE_KEY);
  return items || {};
}

// Get only active items for UI
export async function getActiveWatchlist(): Promise<WatchlistItem[]> {
  const items = await getAllItems();
  return Object.values(items).filter(item => !item.isDeleted);
}

// Add/Update item
export async function upsertWatchlistItem(item: Omit<WatchlistItem, 'updatedAt'>): Promise<WatchlistItem> {
  const items = await getAllItems();
  const newItem: WatchlistItem = {
    ...item,
    updatedAt: Date.now(),
  };
  
  items[item.id] = newItem;
  await set(STORE_KEY, items);
  await addToSyncQueue(newItem);
  
  return newItem;
}

// Remove item (Soft Delete)
export async function removeWatchlistItem(id: string): Promise<void> {
  const items = await getAllItems();
  if (items[id]) {
    items[id].isDeleted = true;
    items[id].updatedAt = Date.now();
    await set(STORE_KEY, items);
    await addToSyncQueue(items[id]);
  }
}

// Sync Queue Management
async function addToSyncQueue(item: WatchlistItem) {
  const queue = await get<Record<string, WatchlistItem>>(SYNC_QUEUE_KEY) || {};
  queue[item.id] = item;
  await set(SYNC_QUEUE_KEY, queue);
  
  attemptBackgroundSync();
}

async function attemptBackgroundSync() {
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      // @ts-ignore
      await registration.sync.register('watchlist-sync');
      return;
    } catch (err) {
      console.error('Background Sync failed to register:', err);
    }
  }
  
  // Fallback if Background Sync is not supported (e.g. Safari or Firefox)
  if (navigator.onLine) {
    flushSyncQueue().catch(console.error);
  }
}

// The function called by SW or fallback to flush data to server
export async function flushSyncQueue() {
  const queue = await get<Record<string, WatchlistItem>>(SYNC_QUEUE_KEY);
  if (!queue || Object.keys(queue).length === 0) return;

  const payload: SyncPayload = {
    items: Object.values(queue),
  };

  try {
    const res = await fetch('/api/watchlist/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Sync failed');

    const serverData = await res.json();
    await mergeServerState(serverData.items);

    // Clear the sync queue since it succeeded
    await set(SYNC_QUEUE_KEY, {});
    
    // Broadcast to other tabs that sync finished and data is merged
    const channel = new BroadcastChannel('watchlist-sync');
    channel.postMessage('sync-complete');
    
  } catch (err) {
    console.error('Failed to flush sync queue, will retry later:', err);
    throw err; // So SW can retry
  }
}

// Merge Server State into Local DB (LWW resolution)
export async function mergeServerState(serverItems: WatchlistItem[]) {
  const localItems = await getAllItems();
  let changed = false;

  for (const serverItem of serverItems) {
    const localItem = localItems[serverItem.id];
    // If server has a newer timestamp, or we don't have it, overwrite
    if (!localItem || serverItem.updatedAt > localItem.updatedAt) {
      localItems[serverItem.id] = serverItem;
      changed = true;
    }
  }

  if (changed) {
    await set(STORE_KEY, localItems);
  }
}

// Also hook up network listener for standard fallback
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    flushSyncQueue().catch(() => {});
  });
}
