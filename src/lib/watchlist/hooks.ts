import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getActiveWatchlist, upsertWatchlistItem, removeWatchlistItem } from './store';
import { WatchlistItem } from './schema';

export function useWatchlist() {
  return useQuery({
    queryKey: ['watchlist'],
    queryFn: async () => {
      return getActiveWatchlist();
    },
  });
}

export function useWatchlistMutations() {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: async (item: Omit<WatchlistItem, 'updatedAt' | 'isDeleted'>) => {
      return upsertWatchlistItem({ ...item, isDeleted: false });
    },
    onMutate: async (newItem) => {
      // Optimistic UI update
      await queryClient.cancelQueries({ queryKey: ['watchlist'] });
      const previous = queryClient.getQueryData<WatchlistItem[]>(['watchlist']);
      
      queryClient.setQueryData<WatchlistItem[]>(['watchlist'], (old = []) => {
        // Prevent duplicates in optimistic UI
        if (old.some(i => i.id === newItem.id)) return old;
        return [...old, { ...newItem, updatedAt: Date.now(), isDeleted: false }];
      });

      return { previous };
    },
    onError: (err, newItem, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['watchlist'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      broadcastChange();
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      return removeWatchlistItem(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['watchlist'] });
      const previous = queryClient.getQueryData<WatchlistItem[]>(['watchlist']);
      
      queryClient.setQueryData<WatchlistItem[]>(['watchlist'], (old = []) => 
        old.filter(item => item.id !== id)
      );

      return { previous };
    },
    onError: (err, id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['watchlist'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      broadcastChange();
    },
  });

  return { addMutation, removeMutation };
}

// Cross-tab synchronization
function broadcastChange() {
  if (typeof BroadcastChannel !== 'undefined') {
    const channel = new BroadcastChannel('watchlist-sync');
    channel.postMessage('watchlist-updated');
  }
}

export function useCrossTabSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;

    const channel = new BroadcastChannel('watchlist-sync');
    const handleMessage = (event: MessageEvent) => {
      // Refresh the query when another tab updates the watchlist or SW finishes sync
      if (event.data === 'watchlist-updated' || event.data === 'sync-complete' || (event.data && event.data.type === 'SYNC_COMPLETE')) {
        queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      }
    };

    channel.addEventListener('message', handleMessage);

    // Also listen for ServiceWorker messages
    const swHandler = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SYNC_COMPLETE') {
        queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      }
    };
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', swHandler);
    }

    return () => {
      channel.removeEventListener('message', handleMessage);
      channel.close();
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', swHandler);
      }
    };
  }, [queryClient]);
}
