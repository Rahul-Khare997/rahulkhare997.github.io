'use client';

import { useEffect, useRef, useState } from 'react';

const DURATION = 1100;

/**
 * Counts up once when scrolled into view.
 *
 * The displayed value starts at the REAL figure, not zero. A count-up that
 * begins at 0 and depends on an animation frame loop to reach its target will
 * show "0%" wherever "10%" belongs if that loop is throttled, backgrounded or
 * never starts — on a résumé that is worse than having no animation at all.
 * So the animation only ever runs downward-then-up from a confirmed live
 * frame, and a timeout guarantees the true value lands regardless.
 */
export function Counter({
  value,
  target,
  prefix = '',
  suffix = '',
}: {
  value: string;
  target?: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<string>(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || target === undefined) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let safety = 0;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();

        // Whatever happens to the frame loop, the true value lands.
        safety = window.setTimeout(() => {
          cancelAnimationFrame(raf);
          setDisplay(value);
        }, DURATION + 250);

        const start = performance.now();
        setDisplay(`${prefix}0${suffix}`);

        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION);
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          setDisplay(`${prefix}${Math.round(eased * target)}${suffix}`);
          if (t < 1) raf = requestAnimationFrame(tick);
          else setDisplay(value);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(safety);
    };
  }, [target, value, prefix, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}
