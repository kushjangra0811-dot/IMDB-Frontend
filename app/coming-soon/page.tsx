import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getUpcomingMovies } from '../../src/lib/api/tmdbClient';
import ComingSoonClient from '../../src/views/ComingSoon';
import { Suspense } from 'react';

export default async function ComingSoonPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['movies', 'upcoming'],
    queryFn: () => getUpcomingMovies({ pageParam: 1 }, { next: { revalidate: 3600, tags: ['movies', 'upcoming'] } }),
    initialPageParam: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={null}>
        <ComingSoonClient />
      </Suspense>
    </HydrationBoundary>
  );
}
