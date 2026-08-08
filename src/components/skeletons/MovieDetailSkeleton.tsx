import React from "react";

const MovieDetailSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="relative h-[90vh] bg-background">
        <div className="relative container mx-auto px-4 h-full flex items-end pb-12">
          <div className="grid md:grid-cols-3 gap-8 items-end w-full">
            <div className="hidden md:block">
              <div className="rounded-lg shadow-xl aspect-[2/3] bg-muted" />
            </div>

            <div className="md:col-span-2 w-full">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="h-8 w-24 bg-muted rounded-full" />
                <div className="h-8 w-24 bg-muted rounded-full" />
                <div className="h-8 w-32 bg-muted rounded-full" />
              </div>

              <div className="h-16 bg-muted rounded mb-4 w-3/4" />

              <div className="flex flex-wrap gap-2 mb-6">
                <div className="h-6 w-20 bg-muted rounded-full" />
                <div className="h-6 w-20 bg-muted rounded-full" />
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="h-12 w-40 bg-muted rounded-lg" />
                <div className="h-12 w-48 bg-muted rounded-lg" />
                <div className="h-12 w-12 bg-muted rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <section className="mb-12">
              <div className="h-8 w-32 bg-muted rounded mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            </section>
          </div>
          <div>
            <div className="sticky top-24 space-y-6">
              <div className="bg-muted/50 rounded-lg p-6 h-64" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MovieDetailSkeleton;
