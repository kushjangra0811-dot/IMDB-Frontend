import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getTrendingMovies } from '../../src/lib/api/tmdbClient';
import MovieListClient from '../../src/Pages/MovieList';
import { Suspense } from 'react';

export default async function MoviesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['trendingMovies'],
    queryFn: () => getTrendingMovies({ pageParam: 1 }, { next: { revalidate: 3600, tags: ['movies', 'popular'] } }),
    initialPageParam: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={null}>
        <MovieListClient />
      </Suspense>
    </HydrationBoundary>
  );
}
