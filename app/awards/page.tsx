import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getTopRatedMovies } from '../../src/lib/api/tmdbClient';
import AwardsClient from '../../src/views/Awards';
import { Suspense } from 'react';

export default async function AwardsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['movies', 'topRated'],
    queryFn: () => getTopRatedMovies({ pageParam: 1 }, { next: { revalidate: 3600, tags: ['movies', 'topRated'] } }),
    initialPageParam: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={null}>
        <AwardsClient />
      </Suspense>
    </HydrationBoundary>
  );
}
