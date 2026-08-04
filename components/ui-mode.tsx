'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Theme and recruiter mode live as classes on <html>, set pre-paint by the
 * inline boot script in layout.tsx.
 *
 * This is a module-level store rather than per-component state: several
 * components read the same flags (the controls, the recruiter bar, the
 * preloader), and independent useState copies would drift — toggling in one
 * would never notify the others.
 */
type Snapshot = { light: boolean; recruiter: boolean };

const listeners = new Set<() => void>();
let snapshot: Snapshot = { light: false, recruiter: false };

const SERVER_SNAPSHOT: Snapshot = { light: false, recruiter: false };

function read(): Snapshot {
  const c = document.documentElement.classList;
  return { light: c.contains('light'), recruiter: c.contains('recruiter') };
}

function sync() {
  const next = read();
  if (next.light === snapshot.light && next.recruiter === snapshot.recruiter) return;
  snapshot = next;
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  if (listeners.size === 0) snapshot = read();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  return snapshot;
}

export function useUiMode() {
  const state = useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);

  const toggleTheme = useCallback(() => {
    const d = document.documentElement;
    const next = !d.classList.contains('light');
    d.classList.toggle('light', next);
    d.classList.toggle('dark', !next);
    try {
      localStorage.setItem('theme', next ? 'light' : 'dark');
    } catch {
      /* private browsing — the choice just won't persist */
    }
    sync();
  }, []);

  const toggleRecruiter = useCallback(() => {
    const d = document.documentElement;
    const next = !d.classList.contains('recruiter');
    d.classList.toggle('recruiter', next);
    try {
      localStorage.setItem('recruiter', next ? '1' : '0');
    } catch {
      /* ignore */
    }
    sync();
  }, []);

  return { ...state, toggleTheme, toggleRecruiter };
}
