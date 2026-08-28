import type { ReactNode } from 'react';
import AnimatedBackground from './AnimatedBackground';

interface BackgroundWrapperProps {
  children: ReactNode;
}

/**
 * Drop this at the root of any subtree that should sit on top of the
 * premium animated deep-blue background. It renders no DOM box of its own
 * (a Fragment), so it never interferes with flex/height layout in the
 * component it wraps (e.g. Layout's `h-screen` chat page).
 *
 * Usage:
 *   <BackgroundWrapper>
 *     <div className="relative z-10"> ...existing app shell... </div>
 *   </BackgroundWrapper>
 */
export default function BackgroundWrapper({ children }: BackgroundWrapperProps) {
  return (
    <>
      <AnimatedBackground />
      {children}
    </>
  );
}
