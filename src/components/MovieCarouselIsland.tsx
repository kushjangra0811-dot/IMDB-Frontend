'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, PanInfo } from 'framer-motion';
import { Play } from 'lucide-react';
import AccessibleDialog from './AccessibleDialog';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  title?: string;
}

interface MovieCarouselIslandProps {
  media: MediaItem[];
}

export default function MovieCarouselIsland({ media }: MovieCarouselIslandProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const controls = useAnimation();

  // Autoplay functionality
  useEffect(() => {
    if (!isPlaying || isTrailerOpen) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % media.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, isTrailerOpen, media.length]);

  const handleDragEnd = (e: any, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    }
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    let nextIndex = currentIndex + newDirection;
    if (nextIndex < 0) nextIndex = media.length - 1;
    if (nextIndex >= media.length) nextIndex = 0;
    setCurrentIndex(nextIndex);
  };

  const handleOpenTrailer = (videoUrl: string) => {
    setActiveVideo(videoUrl);
    setIsTrailerOpen(true);
    setIsPlaying(false);
  };

  const handleCloseTrailer = () => {
    setIsTrailerOpen(false);
    setActiveVideo(null);
  };

  if (!media || media.length === 0) return null;

  return (
    <div 
      className="relative w-full aspect-video rounded-xl overflow-hidden bg-background group"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Movie media carousel"
    >
      <motion.div
        ref={containerRef}
        className="flex w-full h-full"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={{ x: `-${currentIndex * 100}%` }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ x }}
      >
        {media.map((item, idx) => (
          <div 
            key={item.id} 
            className="min-w-full h-full relative shrink-0 flex items-center justify-center"
            aria-hidden={currentIndex !== idx}
          >
            {/* Lazy loaded image */}
            <img
              src={item.type === 'video' ? (item.thumbnailUrl || item.url) : item.url}
              alt={item.title || 'Movie media'}
              className="w-full h-full object-cover"
              loading="lazy"
              draggable={false}
            />

            {item.type === 'video' && (
              <button
                onClick={() => handleOpenTrailer(item.url)}
                className="absolute inset-0 flex items-center justify-center group/play focus:outline-none"
                aria-label={`Play ${item.title || 'trailer'}`}
                tabIndex={currentIndex === idx ? 0 : -1}
              >
                <div className="w-20 h-20 bg-yellow-500/90 rounded-full flex items-center justify-center backdrop-blur-sm group-hover/play:scale-110 group-hover/play:bg-yellow-400 transition-all shadow-xl shadow-yellow-500/20">
                  <Play className="w-8 h-8 text-zinc-900 fill-zinc-900 ml-1" />
                </div>
              </button>
            )}
          </div>
        ))}
      </motion.div>

      {/* Navigation Indicators */}
      {media.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {media.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentIndex === idx ? 'bg-yellow-500 w-6' : 'bg-white/50 hover:bg-white'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={currentIndex === idx}
            />
          ))}
        </div>
      )}

      <AccessibleDialog
        isOpen={isTrailerOpen}
        onClose={handleCloseTrailer}
        title="Watch Trailer"
      >
        <div className="aspect-video w-full bg-black">
          {activeVideo && (
            <iframe
              src={activeVideo.replace('watch?v=', 'embed/')}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          )}
        </div>
      </AccessibleDialog>
    </div>
  );
}
