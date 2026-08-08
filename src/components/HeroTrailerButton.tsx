'use client';

import React, { useState } from 'react';
import { Play } from 'lucide-react';
import AccessibleDialog from './AccessibleDialog';

interface HeroTrailerButtonProps {
  trailerUrl: string;
}

export default function HeroTrailerButton({ trailerUrl }: HeroTrailerButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/20"
      >
        <Play className="w-5 h-5 fill-current" />
        Watch Trailer
      </button>

      <AccessibleDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Watch Trailer"
      >
        <div className="aspect-video w-full bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${trailerUrl.split('v=')[1]?.split('&')[0] || trailerUrl.split('/').pop()}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
        </div>
      </AccessibleDialog>
    </>
  );
}
