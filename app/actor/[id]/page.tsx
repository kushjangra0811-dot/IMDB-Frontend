import React, { Suspense } from 'react';
import { getActorDetails } from '../../../src/lib/api/tmdbClient';
import ActorProfileView from '../../../src/views/ActorProfileView';

export const revalidate = 3600; // ISR: revalidate every hour

async function ActorDetailsFetcher({ id }: { id: string }) {
  try {
    const actor = await getActorDetails(id);
    return <ActorProfileView actor={actor} />;
  } catch (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-red-500 flex-col gap-4">
        <h2 className="text-2xl font-bold">Failed to load actor details</h2>
        <p>The actor profile could not be found or our servers are experiencing issues.</p>
      </div>
    );
  }
}

export default function ActorDetailsPage({ params }: { params: { id: string } }) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Skeleton for actor page */}
          <div className="relative h-[400px] mb-8 rounded-xl overflow-hidden bg-muted animate-pulse" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="h-48 bg-muted rounded-xl animate-pulse" />
              <div className="h-32 bg-muted rounded-xl animate-pulse" />
            </div>
            <div className="md:col-span-2 space-y-4">
              <div className="h-8 w-48 bg-muted rounded animate-pulse" />
              <div className="h-4 w-full bg-muted rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      }
    >
      <ActorDetailsFetcher id={params.id} />
    </Suspense>
  );
}
