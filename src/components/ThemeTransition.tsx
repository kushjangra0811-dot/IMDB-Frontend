'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { usePathname } from 'next/navigation';

export default function ThemeTransition({ children }: { children: React.ReactNode }) {
  const { activeTheme } = useTheme();
  const pathname = usePathname();

  // Apply per-route overrides if needed via ThemeProvider's routeOverride
  // For this example, we just pass the children and let the CSS transition or Framer Motion handle it.
  
  // To satisfy "Framer Motion cross-fades + springy color transitions",
  // we can wrap the main content block.
  
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full h-full min-h-screen"
    >
      {children}
    </motion.div>
  );
}
