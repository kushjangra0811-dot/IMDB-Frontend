import React, { Suspense } from 'react';
import { getMovieDetails } from '../../../src/lib/api/tmdbClient';
import MovieDetails from '../../../src/views/MovieDetails';

export const revalidate = 3600; // revalidate every hour

async function MovieDetailsFetcher({ id }: { id: string }) {
  try {
    const movie = await getMovieDetails(id);
    return <MovieDetails movie={movie} />;
  } catch (error) {
    // Graceful degradation / Fallback for API failures
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-red-500 flex-col gap-4">
        <h2 className="text-2xl font-bold">Failed to load movie details</h2>
        <p>Our servers are experiencing issues. Please try again later.</p>
      </div>
    );
  }
}

export default function MoviePage({ params }: { params: { id: string } }) {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-[90vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        </div>
      }
    >
      <MovieDetailsFetcher id={params.id} />
    </Suspense>
  );
}
