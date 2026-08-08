import React from "react";

const MovieCardSkeleton = () => {
  return (
    <div className="bg-background/50 rounded-xl overflow-hidden movie-card-hover backdrop-blur-sm animate-pulse">
      <div className="relative aspect-[2/3] bg-muted">
        <div className="absolute top-4 right-4 bg-muted/60 w-12 h-6 rounded-md"></div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="h-6 bg-muted rounded w-2/3"></div>
          <div className="h-4 bg-muted rounded w-10"></div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <div className="h-6 bg-muted rounded-full w-16"></div>
          <div className="h-6 bg-muted rounded-full w-16"></div>
        </div>
      </div>
    </div>
  );
};

export default MovieCardSkeleton;
