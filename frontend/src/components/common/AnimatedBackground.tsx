import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface Particle {
  id: number;
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  driftX: number;
}

// Deterministic pseudo-random generator so particle layout doesn't jump
// between re-renders (no Math.random() at render time).
function seededParticles(count: number): Particle[] {
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(rand() * 100).toFixed(2)}%`,
    top: `${(rand() * 100).toFixed(2)}%`,
    size: 1.5 + rand() * 2.2,
    duration: 10 + rand() * 14,
    delay: rand() * 10,
    opacity: 0.15 + rand() * 0.35,
    driftX: (rand() - 0.5) * 60,
  }));
}

/**
 * Fixed, viewport-pinned decorative background layer for the whole app shell.
 * - Never intercepts pointer events
 * - Sits behind all routed content (z-index handled by the caller)
 * - Animations are pure CSS (GPU-cheap) except for the initial fade-in,
 *   which uses Framer Motion per the brief.
 * - Fully inert under prefers-reduced-motion (handled globally in index.css,
 *   plus we skip the entrance fade here).
 */
export default function AnimatedBackground() {
  const reduceMotion = useReducedMotion();
  const particles = useMemo(() => seededParticles(36), []);

  return (
    <motion.div
      aria-hidden="true"
      initial={reduceMotion ? undefined : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.1, ease: 'easeOut' }}
      className="fixed inset-0 -z-50 overflow-hidden pointer-events-none select-none"
    >
      {/* 1. Animated mesh gradient base */}
      <div className="absolute inset-0 bg-mesh" />

      {/* 2. Soft glowing radial blobs */}
      <div
        className="bg-blob animate-blob-a"
        style={{ width: 520, height: 520, top: '-8%', left: '4%', background: '#1D4ED8' }}
      />
      <div
        className="bg-blob animate-blob-b"
        style={{ width: 460, height: 460, top: '18%', right: '-6%', background: '#3B82F6' }}
      />
      <div
        className="bg-blob animate-blob-c"
        style={{ width: 420, height: 420, bottom: '-10%', left: '32%', background: '#60A5FA', opacity: 0.35 }}
      />

      {/* 6. Aurora-style blue light streaks */}
      <div className="bg-aurora animate-aurora-a" style={{ width: '70%', top: '22%', left: '10%' }} />
      <div className="bg-aurora animate-aurora-b" style={{ width: '60%', top: '58%', left: '25%' }} />

      {/* 4. Subtle grid pattern (adds depth / technical GovTech texture) */}
      <div className="absolute inset-0 bg-grid" />

      {/* 3. Floating particles */}
      {!reduceMotion && (
        <div className="absolute inset-0">
          {particles.map((p) => (
            <span
              key={p.id}
              className="bg-particle"
              style={
                {
                  left: p.left,
                  top: p.top,
                  width: p.size,
                  height: p.size,
                  '--particle-duration': `${p.duration}s`,
                  '--particle-delay': `${p.delay}s`,
                  '--particle-opacity': p.opacity,
                  '--particle-drift-x': `${p.driftX}px`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}

      {/* 7. Depth: vignette to focus attention toward center/content */}
      <div className="absolute inset-0 bg-vignette" />
    </motion.div>
  );
}
