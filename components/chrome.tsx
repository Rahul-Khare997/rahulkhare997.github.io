'use client';

import { motion, useScroll, useSpring } from 'motion/react';
import { useEffect, useState } from 'react';
import { profile, ticker } from '@/lib/content';
import { useUiMode } from './ui-mode';

/** Thin progress rule pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 260, damping: 40, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-px origin-left bg-accent no-print"
      style={{ scaleX }}
    />
  );
}

/** Marquee of competencies, duplicated once so the loop is seamless. */
export function Ticker() {
  const items = [...ticker, ...ticker];
  return (
    <div className="ticker-wrap overflow-hidden border-y border-border bg-surface/40 py-2.5 no-print">
      <div className="ticker-track flex w-max items-center gap-6 whitespace-nowrap">
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {t}
            </span>
            <span className="text-accent/40">&bull;</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Appears after a screenful of scrolling. */
export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className={[
        'fixed bottom-6 right-6 z-40 grid h-10 w-10 place-items-center rounded-full border border-border-bright bg-surface text-accent transition-all duration-200 hover:bg-accent hover:text-accent-foreground no-print',
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
      ].join(' ')}
    >
      ↑
    </button>
  );
}

/** Theme + recruiter-mode controls. Rendered in the sidebar. */
export function ModeControls() {
  const { light, recruiter, toggleTheme, toggleRecruiter } = useUiMode();

  return (
    <div className="flex flex-wrap items-center gap-2 no-print">
      <button
        type="button"
        onClick={toggleRecruiter}
        aria-pressed={recruiter}
        title="A clean, animation-free, high-contrast view"
        className={[
          'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors duration-200',
          recruiter
            ? 'border-accent bg-accent text-accent-foreground'
            : 'border-border-bright text-muted-foreground hover:text-heading',
        ].join(' ')}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${recruiter ? 'bg-accent-foreground' : 'bg-accent'}`}
        />
        Recruiter Mode
      </button>

      <button
        type="button"
        onClick={toggleTheme}
        aria-pressed={light}
        aria-label="Toggle light and dark theme"
        title="Light / dark"
        className="grid h-8 w-8 place-items-center rounded-full border border-border-bright text-muted-foreground transition-colors duration-200 hover:text-heading"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
          {light ? (
            <path d="M12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10m0-12a1 1 0 0 1-1-1V2a1 1 0 0 1 2 0v2a1 1 0 0 1-1 1m0 18a1 1 0 0 1-1-1v-2a1 1 0 0 1 2 0v2a1 1 0 0 1-1 1M4 13H2a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2m18 0h-2a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2M5.6 6.99a1 1 0 0 1-.7-.29l-1.4-1.4a1 1 0 0 1 1.4-1.42l1.42 1.42a1 1 0 0 1-.71 1.7m12.79 12.8a1 1 0 0 1-.7-.29l-1.4-1.42a1 1 0 0 1 1.4-1.4l1.42 1.4a1 1 0 0 1-.71 1.7m0-12.8a1 1 0 0 1-.71-1.7l1.41-1.42a1 1 0 1 1 1.42 1.42l-1.42 1.4a1 1 0 0 1-.7.3M4.2 19.79a1 1 0 0 1-.71-1.7l1.42-1.41a1 1 0 0 1 1.4 1.4L5.6 19.5a1 1 0 0 1-.7.29" />
          ) : (
            <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36A5.39 5.39 0 0 1 12 3" />
          )}
        </svg>
      </button>
    </div>
  );
}

/** Sticky bar shown only while recruiter mode is on. */
export function RecruiterBar() {
  const { recruiter } = useUiMode();
  if (!recruiter) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex flex-wrap items-center justify-between gap-3 border-t border-border-bright bg-surface px-5 py-3 no-print">
      <p className="text-xs text-foreground">
        <strong className="text-heading">Recruiter Mode.</strong> Clean, animation-free view ·
        Program Manager at Zenquip Healthcare · Ex-TD Bank Canada · Notice period: 2 weeks.
      </p>
      <a
        href={profile.resume}
        download
        className="rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground"
      >
        ↓ Download Résumé (PDF)
      </a>
    </div>
  );
}
