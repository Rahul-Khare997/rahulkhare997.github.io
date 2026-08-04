import type { ReactNode } from 'react';

/**
 * Section wrapper: a sticky frosted label on mobile (the one place
 * backdrop-blur earns its keep) and an oversized ghost numeral behind the
 * heading on desktop, carried over from the original site.
 */
export function Section({
  id,
  label,
  num,
  eyebrow,
  children,
}: {
  id: string;
  label: string;
  num: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative mb-20 scroll-mt-16 lg:mb-28" aria-label={label}>
      <span className="ghost-num hidden lg:block" aria-hidden>
        {num}
      </span>

      {/* Mobile: sticky frosted label. Desktop: a normal heading. */}
      <div className="sticky top-0 z-20 -mx-6 mb-6 w-screen border-b border-border bg-glass px-6 py-4 backdrop-blur-md lg:relative lg:top-auto lg:mx-0 lg:w-full lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
        {eyebrow && (
          <div className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-accent lg:mb-2 lg:block">
            {eyebrow}
          </div>
        )}
        <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-heading lg:font-serif lg:text-3xl lg:normal-case lg:tracking-tight">
          {label}
        </h2>
      </div>

      <div className="relative z-10">{children}</div>
    </section>
  );
}
