import React from "react";

const MovieDetailSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="relative h-[90vh] bg-zinc-900">
        <div className="relative container mx-auto px-4 h-full flex items-end pb-12">
          <div className="grid md:grid-cols-3 gap-8 items-end w-full">
            <div className="hidden md:block">
              <div className="rounded-lg shadow-xl aspect-[2/3] bg-zinc-800" />
            </div>

            <div className="md:col-span-2 w-full">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="h-8 w-24 bg-zinc-800 rounded-full" />
                <div className="h-8 w-24 bg-zinc-800 rounded-full" />
                <div className="h-8 w-32 bg-zinc-800 rounded-full" />
              </div>

              <div className="h-16 bg-zinc-800 rounded mb-4 w-3/4" />

              <div className="flex flex-wrap gap-2 mb-6">
                <div className="h-6 w-20 bg-zinc-800 rounded-full" />
                <div className="h-6 w-20 bg-zinc-800 rounded-full" />
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="h-12 w-40 bg-zinc-800 rounded-lg" />
                <div className="h-12 w-48 bg-zinc-800 rounded-lg" />
                <div className="h-12 w-12 bg-zinc-800 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <section className="mb-12">
              <div className="h-8 w-32 bg-zinc-800 rounded mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-zinc-800 rounded w-full" />
                <div className="h-4 bg-zinc-800 rounded w-full" />
                <div className="h-4 bg-zinc-800 rounded w-3/4" />
              </div>
            </section>
          </div>
          <div>
            <div className="sticky top-24 space-y-6">
              <div className="bg-zinc-800/50 rounded-lg p-6 h-64" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MovieDetailSkeleton;
