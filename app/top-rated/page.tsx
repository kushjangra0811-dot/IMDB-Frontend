import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getTopRatedMovies } from '../../src/lib/api/tmdbClient';
import TopratedClient from '../../src/views/Toprated';
import { Suspense } from 'react';

export default async function TopRatedPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['movies', 'topRated'],
    queryFn: () => getTopRatedMovies({ pageParam: 1 }, { next: { revalidate: 3600, tags: ['movies', 'top-rated'] } }),
    initialPageParam: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={null}>
        <TopratedClient />
      </Suspense>
    </HydrationBoundary>
  );
}
