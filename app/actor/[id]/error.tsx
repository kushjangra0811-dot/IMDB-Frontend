'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Actor Profile Error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[50vh] text-center">
      <AlertTriangle className="w-16 h-16 text-yellow-500 mb-6" />
      <h2 className="text-3xl font-bold text-foreground mb-4">Failed to load actor profile</h2>
      <p className="text-muted-foreground text-lg max-w-lg mb-8">
        We encountered an error while fetching the actor details. This could be due to a temporary network issue or the actor might not exist.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/20"
        >
          Try again
        </button>
        <Link
          href="/"
          className="bg-muted text-foreground px-6 py-3 rounded-lg font-semibold hover:bg-muted/80 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
