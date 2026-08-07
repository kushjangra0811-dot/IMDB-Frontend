import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getTrendingMovies, getUpcomingMovies } from '../src/lib/api/tmdbClient';
import HomeClient from '../src/views/Home';

export default async function HomePage() {
  const queryClient = new QueryClient();

  // Server-side fetching using Next.js cache and our rate limiter
  await Promise.all([
    queryClient.prefetchInfiniteQuery({
      queryKey: ['trendingMovies'],
      queryFn: () => getTrendingMovies({ pageParam: 1 }, { next: { revalidate: 3600, tags: ['movies', 'trending'] } }),
      initialPageParam: 1,
    }),
    queryClient.prefetchInfiniteQuery({
      queryKey: ['upcomingMovies'],
      queryFn: () => getUpcomingMovies({ pageParam: 1 }, { next: { revalidate: 3600, tags: ['movies', 'upcoming'] } }),
      initialPageParam: 1,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeClient />
    </HydrationBoundary>
  );
}
