'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Check } from 'lucide-react';
import { useWatchlist, useWatchlistMutations } from '../lib/watchlist/hooks';
import { WatchlistItem } from '../lib/watchlist/schema';

interface WatchlistButtonProps {
  movie: {
    id: string;
    title: string;
    image?: string;
  };
  compact?: boolean; // Icon-only mode for movie cards
}

export default function WatchlistButton({ movie, compact = false }: WatchlistButtonProps) {
  const { data: watchlist } = useWatchlist();
  const { addMutation, removeMutation } = useWatchlistMutations();
  
  const [ariaLiveMessage, setAriaLiveMessage] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // In compact mode, render a fixed-size placeholder immediately to prevent layout shift
  if (!isClient) {
    if (compact) {
      return (
        <div className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center">
          <Bookmark className="w-4 h-4 text-white/70" />
        </div>
      );
    }
    return null;
  }

  const inWatchlist = watchlist?.some(item => item.movieId === movie.id);

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWatchlist) {
      removeMutation.mutate(movie.id);
      setAriaLiveMessage(`Removed ${movie.title} from watchlist`);
    } else {
      const item: Omit<WatchlistItem, 'updatedAt' | 'isDeleted'> = {
        id: movie.id,
        movieId: movie.id,
        title: movie.title,
        image: movie.image,
      };
      addMutation.mutate(item);
      setAriaLiveMessage(`Added ${movie.title} to watchlist`);
    }
    
    setTimeout(() => setAriaLiveMessage(''), 3000);
  };

  // Compact icon-only variant for MovieCard overlays
  if (compact) {
    return (
      <>
        <div aria-live="polite" className="sr-only">
          {ariaLiveMessage}
        </div>
        <motion.button
          onClick={toggleWatchlist}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          transition={{ type: 'spring', stiffness: 600, damping: 20 }}
          className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
            inWatchlist
              ? 'bg-yellow-500 text-black'
              : 'bg-black/60 text-white/90 hover:bg-black/80'
          }`}
          aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
          aria-pressed={inWatchlist}
        >
          <motion.div
            key={inWatchlist ? "check" : "bookmark"}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 700, damping: 25 }}
          >
            {inWatchlist ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </motion.div>
        </motion.button>
      </>
    );
  }

  // Full variant for MovieDetails page
  return (
    <>
      <div aria-live="polite" className="sr-only">
        {ariaLiveMessage}
      </div>
      
      <motion.button
        onClick={toggleWatchlist}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 600, damping: 20 }}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors border ${
          inWatchlist 
            ? 'bg-accent/20 border-accent/50 text-accent hover:bg-accent/30' 
            : 'bg-background/80 border-border text-foreground hover:bg-muted'
        }`}
        aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
        aria-pressed={inWatchlist}
      >
        <motion.div
          key={inWatchlist ? "check" : "bookmark"}
          initial={{ scale: 0.5, rotate: inWatchlist ? -90 : 90, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        >
          {inWatchlist ? <Check className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
        </motion.div>
        
        <span>{inWatchlist ? 'Watchlisted' : 'Watchlist'}</span>
      </motion.button>
    </>
  );
}
