'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { profile } from '@/lib/content';

type Phase = 'hidden' | 'show' | 'fade';

/**
 * Launch screen. Shows once per browser session — a returning visitor
 * scrolling back should never sit through it twice.
 *
 * Dismissal is driven entirely by timers and unmounts unconditionally, never
 * by an animation-complete callback: this overlay covers the viewport and
 * locks body scroll, so an exit that failed to fire would leave the page
 * permanently unusable. The fade is a plain CSS transition for the same
 * reason. Body overflow is also restored in cleanup, so it cannot leak.
 */
export function Preloader() {
  const [phase, setPhase] = useState<Phase>('hidden');
  const reduced = useReducedMotion();

  useEffect(() => {
    let seen = false;
    try {
      seen = !!sessionStorage.getItem('rk_launched');
    } catch {
      seen = false;
    }
    if (seen || document.documentElement.classList.contains('recruiter')) {
      // Reset explicitly: under React Strict Mode the effect runs twice, and
      // the first run has already set the session flag and phase 'show' before
      // its cleanup cancelled the dismiss timers. Without this reset the
      // second run bails out here and the overlay is stuck on screen forever.
      setPhase('hidden');
      return;
    }

    try {
      sessionStorage.setItem('rk_launched', '1');
    } catch {
      /* ignore */
    }

    const hold = reduced ? 200 : 1800;
    setPhase('show');
    document.body.style.overflow = 'hidden';

    const t1 = setTimeout(() => setPhase('fade'), hold);
    const t2 = setTimeout(
      () => {
        setPhase('hidden');
        document.body.style.overflow = '';
      },
      hold + (reduced ? 0 : 550),
    );

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = '';
    };
  }, [reduced]);

  if (phase === 'hidden') return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[100] grid place-items-center bg-background no-print"
      style={{
        opacity: phase === 'fade' ? 0 : 1,
        transition: reduced ? 'none' : 'opacity 500ms cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <div className="w-full max-w-sm px-8 text-center">
        <motion.div
          className="flex justify-center"
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="assets/brand/rk-mark.png"
            alt=""
            width={66}
            height={80}
            className="h-20 w-auto"
          />
        </motion.div>

        <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          {profile.name}
        </div>

        <div className="mt-6 h-px w-full overflow-hidden bg-border">
          <motion.div
            className="h-full origin-left bg-accent"
            initial={reduced ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: reduced ? 0 : 1.5, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </div>
    </div>
  );
}
