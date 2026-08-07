import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getMovieDetails } from '../../../src/lib/api/tmdbClient';
import MovieDetailsClient from '../../../src/Pages/MovieDetails';

export default async function MoviePage({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();

  // Next.js server-side caching of the movie details
  await queryClient.prefetchQuery({
    queryKey: ['movie', params.id],
    queryFn: () => getMovieDetails(params.id, { next: { revalidate: 3600, tags: ['movie', params.id] } }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MovieDetailsClient />
    </HydrationBoundary>
  );
}
