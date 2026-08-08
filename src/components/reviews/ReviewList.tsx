'use client';

import React, { useRef } from 'react';
import { Review } from '../../lib/reviews/schema';
import ReviewItem from './ReviewItem';
import { motion, AnimatePresence } from 'framer-motion';
import { useVirtualizer } from '@tanstack/react-virtual';

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: reviews.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200, // estimated height of a review card
    overscan: 5,
  });

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No reviews yet. Be the first to share your thoughts!
      </div>
    );
  }

  // To support both AnimatePresence (layout animations) and Virtualization,
  // we combine them. Virtualization handles performance, Framer handles entry/exit.
  return (
    <div 
      ref={parentRef}
      className="max-h-[800px] overflow-y-auto pr-4 custom-scrollbar"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        <AnimatePresence initial={false}>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const review = reviews[virtualRow.index];
            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: virtualRow.start + 20 }}
                animate={{ opacity: 1, y: virtualRow.start }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                }}
              >
                <div className="pb-4">
                  <ReviewItem review={review} />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
