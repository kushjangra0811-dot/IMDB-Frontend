'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';
import { ThemeProvider, Theme } from '../src/components/ThemeProvider';
import { useCrossTabSync } from '../src/lib/watchlist/hooks';

function WatchlistSync() {
  useCrossTabSync();
  return null;
}

export default function Providers({ 
  children,
  initialTheme 
}: { 
  children: React.ReactNode;
  initialTheme?: string;
}) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
        refetchOnWindowFocus: true, // Intelligent refetch on tab focus
        refetchOnReconnect: true, // Intelligent refetch on network reconnect
        retry: false, // Let rate limiter handle retries
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider initialTheme={initialTheme as Theme}>
        <WatchlistSync />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
