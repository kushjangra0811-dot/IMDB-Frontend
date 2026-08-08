// Background Sync Service Worker for Watchlist

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Listen for background sync events
self.addEventListener('sync', (event) => {
  if (event.tag === 'watchlist-sync') {
    event.waitUntil(flushWatchlistQueue());
  }
});

// Helper to open IndexedDB (matches idb-keyval default settings)
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('keyval-store');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      request.result.createObjectStore('keyval');
    };
  });
}

function getFromDB(db, key) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('keyval', 'readonly');
    const store = tx.objectStore('keyval');
    const request = store.get(key);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function setToDB(db, key, val) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('keyval', 'readwrite');
    const store = tx.objectStore('keyval');
    const request = store.put(val, key);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

async function flushWatchlistQueue() {
  try {
    const db = await openDB();
    const queue = await getFromDB(db, 'watchlist_sync_queue');
    
    if (!queue || Object.keys(queue).length === 0) return;

    const payload = {
      items: Object.values(queue),
    };

    const res = await fetch('/api/watchlist/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Background Sync failed');

    const serverData = await res.json();
    
    // Merge back into local DB
    const localItems = (await getFromDB(db, 'watchlist_items')) || {};
    let changed = false;

    for (const serverItem of serverData.items) {
      const localItem = localItems[serverItem.id];
      if (!localItem || serverItem.updatedAt > localItem.updatedAt) {
        localItems[serverItem.id] = serverItem;
        changed = true;
      }
    }

    if (changed) {
      await setToDB(db, 'watchlist_items', localItems);
    }

    // Clear queue
    await setToDB(db, 'watchlist_sync_queue', {});

    // Notify clients that sync is complete
    const clients = await self.clients.matchAll();
    clients.forEach(client => client.postMessage({ type: 'SYNC_COMPLETE' }));
    
  } catch (err) {
    console.error('Service Worker sync error:', err);
    throw err; // Throws so the browser will retry the sync later
  }
}
