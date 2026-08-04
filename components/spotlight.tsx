'use client';

import { useEffect, useRef } from 'react';

/**
 * A single fixed overlay carrying a radial gradient that follows the cursor
 * (brittanychiang.com). Written straight to a CSS custom property via a ref so
 * it never triggers a React render on mousemove.
 *
 * Skipped entirely for touch/coarse pointers and reduced-motion users.
 */
export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia('(pointer: fine)').matches;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || still) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        el.style.setProperty('--x', `${e.clientX}px`);
        el.style.setProperty('--y', `${e.clientY}px`);
      });
    };

    el.style.opacity = '1';
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      id="spotlight"
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 opacity-0 transition-opacity duration-500 no-print"
      style={{
        background:
          'radial-gradient(600px at var(--x, 50%) var(--y, 0px), var(--spotlight), transparent 80%)',
      }}
    />
  );
}
