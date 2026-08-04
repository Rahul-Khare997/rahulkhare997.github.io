'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useRef, useState } from 'react';
import type { Role } from '@/lib/content';
import { Logo } from './logo';
import { Rich } from './rich';

/**
 * Tabbed role block, carried over from the original site: each role's work is
 * split into functional tracks so a reader can go straight to the one that
 * matches the req. Tab state is per-role, so switching a TD tab can never
 * disturb the Zenquip panels.
 *
 * Tabs implement the ARIA tablist keyboard contract: arrows move and activate,
 * Home/End jump to the ends, and only the active tab is in the tab order.
 */
export function ExperienceTabs({ role }: { role: Role }) {
  const [active, setActive] = useState(role.tracks[0].id);
  const reduced = useReducedMotion();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const track = role.tracks.find((t) => t.id === active) ?? role.tracks[0];

  function onKeyDown(e: React.KeyboardEvent) {
    const ids = role.tracks.map((t) => t.id);
    const i = ids.indexOf(active);
    let next: string | null = null;

    if (e.key === 'ArrowRight') next = ids[(i + 1) % ids.length];
    if (e.key === 'ArrowLeft') next = ids[(i - 1 + ids.length) % ids.length];
    if (e.key === 'Home') next = ids[0];
    if (e.key === 'End') next = ids[ids.length - 1];
    if (!next) return;

    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="relative">
      {/* Role header */}
      <div className="border-b border-border pb-5">
        <div className="flex items-start gap-3">
          <Logo logo={role.logo} size={48} alt={`${role.company} logo`} />
          <div className="min-w-0">
            <h3 className="text-lg font-bold leading-tight text-heading">{role.company}</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{role.companySub}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="rounded border border-border-bright px-2.5 py-1 font-mono text-[11px] text-accent-light">
            {role.role}
          </span>
          {role.metaRight.map((m) => (
            <span key={m} className="font-mono text-[11px] text-muted-foreground">
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* Track tabs */}
      <div
        role="tablist"
        aria-label={`${role.company} — areas of work`}
        onKeyDown={onKeyDown}
        className="scroll-fade-x no-scrollbar -mx-1 flex gap-1 overflow-x-auto border-b border-border px-1"
      >
        {role.tracks.map((t) => {
          const on = t.id === active;
          return (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[t.id] = el;
              }}
              id={`tab-${role.id}-${t.id}`}
              role="tab"
              aria-selected={on}
              aria-controls={`panel-${role.id}-${t.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(t.id)}
              className={[
                'relative shrink-0 whitespace-nowrap px-3 py-3 font-mono text-[11px] uppercase tracking-widest transition-colors duration-200',
                on ? 'text-accent' : 'text-muted-foreground hover:text-heading',
              ].join(' ')}
            >
              {t.label}
              {on && (
                <motion.span
                  layoutId={`tab-underline-${role.id}`}
                  data-motion
                  className="absolute inset-x-2 -bottom-px h-0.5 rounded bg-accent"
                  transition={
                    reduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }
                  }
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Track panel.
          Keyed remount rather than AnimatePresence: `mode="wait"` serialises
          exit before enter, and a stalled exit leaves the old panel mounted
          forever while the tab already reads as selected. A key change can't
          stall — React swaps the node and the new one animates in. */}
      <motion.div
        key={track.id}
        data-motion
        id={`panel-${role.id}-${track.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${role.id}-${track.id}`}
        initial={reduced ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.24, ease: [0.4, 0, 0.2, 1] }}
        className="pt-6"
      >
        <ul className="space-y-3">
          {track.bullets.map((b) => (
            <li key={b} className="flex gap-3 text-sm leading-relaxed">
              <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-accent/60" />
              <span>
                <Rich text={b} />
              </span>
            </li>
          ))}
        </ul>

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {track.highlights.map((h) => (
            <li key={h}>
              <span className="inline-block rounded border border-border bg-accent-muted px-2.5 py-1 font-mono text-[11px] text-accent-light">
                {h}
              </span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
