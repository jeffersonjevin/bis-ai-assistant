import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Wraps routed page content with a fade + slide crossfade on navigation.
 * - Keyed by pathname so AnimatePresence knows when to transition.
 * - `mode="wait"` avoids two full-height pages briefly overlapping in the
 *   document flow (which would otherwise cause a scrollbar/height jump).
 * - Durations are kept short (<=300ms) so the transition never reads as lag.
 * - No scroll manipulation is added here — browser/router scroll behavior
 *   is left exactly as it already is.
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
