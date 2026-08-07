import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60 * 24, // 24 hours for garbage collection tuning (list vs detail can override this)
      refetchOnWindowFocus: true, // Intelligent refetch on tab/window focus
      refetchOnReconnect: true, // Intelligent refetch on network reconnect
      retry: false, // Let our custom rate limiter / circuit breaker handle retries
      refetchOnMount: false,
    },
  },
});
