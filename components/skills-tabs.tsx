'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import { skillPanels } from '@/lib/content';
import { Rich } from './rich';

/** Competency areas as a vertical rail on desktop, scrolling chips on mobile. */
export function SkillsTabs() {
  const [active, setActive] = useState(skillPanels[0].id);
  const reduced = useReducedMotion();
  const panel = skillPanels.find((p) => p.id === active) ?? skillPanels[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,15rem)_1fr] lg:gap-8">
      <div
        role="tablist"
        aria-label="Competency areas"
        className="scroll-fade-x no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0"
      >
        {skillPanels.map((p) => {
          const on = p.id === active;
          return (
            <button
              key={p.id}
              role="tab"
              aria-selected={on}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(p.id)}
              className={[
                'relative shrink-0 rounded-md px-3 py-2.5 text-left transition-colors duration-200 lg:w-full',
                on ? 'bg-accent-muted text-heading' : 'text-muted-foreground hover:text-heading',
              ].join(' ')}
            >
              {on && (
                <motion.span
                  layoutId="skill-rail"
                  data-motion
                  aria-hidden
                  className="absolute inset-y-1 left-0 hidden w-0.5 rounded bg-accent lg:block"
                  transition={
                    reduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }
                  }
                />
              )}
              <span className="block whitespace-nowrap text-[13px] font-semibold lg:whitespace-normal">
                {p.name}
              </span>
              <span className="hidden text-[11px] text-muted-foreground lg:block">{p.desc}</span>
            </button>
          );
        })}
      </div>

      {/* Keyed remount, not AnimatePresence — see experience-tabs.tsx. */}
      <motion.div
        key={panel.id}
        data-motion
        role="tabpanel"
        initial={reduced ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.24, ease: [0.4, 0, 0.2, 1] }}
      >
        <ul className="space-y-3">
          {panel.bullets.map((b) => (
            <li key={b} className="flex gap-3 text-sm leading-relaxed">
              <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-accent/60" />
              <span>
                <Rich text={b} />
              </span>
            </li>
          ))}
        </ul>
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {panel.chips.map((c) => (
            <li key={c.label}>
              <span
                className={[
                  'inline-block rounded border px-2.5 py-1 font-mono text-[11px]',
                  c.hi
                    ? 'border-border-bright bg-accent-muted text-accent-light'
                    : 'border-border text-muted-foreground',
                ].join(' ')}
              >
                {c.label}
              </span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
