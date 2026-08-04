'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { nav, profile } from '@/lib/content';
import { ModeControls } from './chrome';

export function Sidebar() {
  const [active, setActive] = useState<string>(nav[0].id);

  useEffect(() => {
    const sections = nav
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -70% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  /* CSS-driven, not Motion-driven. The name, role, blurb and availability
     badge are the page's core identity: if a JS animation frame loop is
     throttled or never runs, a Motion `initial={{opacity:0}}` would leave them
     permanently invisible. A CSS animation gated on `.js` degrades to fully
     visible instead. */
  const stagger = (i: number) => ({
    className: 'hero-reveal',
    style: { animationDelay: `${60 * i}ms` },
  });

  return (
    <header className="no-scrollbar lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-[34%] lg:flex-col lg:justify-between lg:overflow-y-auto lg:pb-8 lg:pt-16">
      {/* max-h-screen + sticky means anything that doesn't fit the viewport
          is unreachable — it never scrolls into view. Rhythm below is sized
          to fit ~800px-tall laptops; overflow-y-auto is the fallback so the
          mode controls can never be lost on shorter screens. */}
      <div>
        <div {...stagger(0)} className="hero-reveal mb-6 flex items-center gap-4">
          <div className="relative shrink-0">
            <div
              aria-hidden
              className="absolute -inset-1 rounded-full border border-border-bright opacity-70"
            />
            {/* Static export: no image optimisation server, so a plain <img>. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.photo}
              alt={`${profile.name} — Program Manager`}
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover object-top"
              style={{ filter: 'grayscale(10%) contrast(1.04)' }}
            />
          </div>
          <div className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-muted-foreground">
            Zenquip Healthcare
            <br />
            <span className="text-accent">Ex-TD Bank Canada</span>
          </div>
        </div>

        <h1
          style={stagger(1).style}
          className="hero-reveal font-serif text-4xl font-bold leading-none tracking-tight text-heading sm:text-5xl"
        >
          <em className="not-italic text-accent">Rahul</em> Khare
        </h1>

        <p style={stagger(2).style} className="hero-reveal mt-3 text-lg font-medium tracking-tight text-heading">
          {profile.role}
        </p>

        <div style={stagger(3).style} className="hero-reveal mt-2 h-6 font-mono text-[13px] text-accent">
          <RotatingRole />
        </div>

        <p style={stagger(4).style} className="hero-reveal mt-4 max-w-xs leading-relaxed">
          {profile.blurb}
        </p>

        <div
          style={stagger(5).style}
          className="hero-reveal mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border-bright px-3 py-1 font-mono text-[11px]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            {profile.notice}
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">{profile.location}</span>
        </div>

        <nav className="hidden lg:mt-8 lg:block" aria-label="In-page">
          <ul className="w-max">
            {nav.map((item) => {
              const on = active === item.id;
              return (
                <li key={item.id}>
                  <a className="group flex items-center py-2" href={`#${item.id}`}>
                    <span
                      className={[
                        'mr-4 h-px transition-all duration-200 motion-reduce:transition-none',
                        on
                          ? 'w-16 bg-accent'
                          : 'w-8 bg-muted-foreground group-hover:w-16 group-hover:bg-heading',
                      ].join(' ')}
                    />
                    <span
                      className={[
                        'font-mono text-[11px] font-semibold uppercase tracking-widest transition-colors duration-200',
                        on ? 'text-accent' : 'text-muted-foreground group-hover:text-heading',
                      ].join(' ')}
                    >
                      {item.label}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div style={stagger(6).style} className="hero-reveal mt-10 space-y-3 lg:mt-6">
        <div className="flex items-center gap-4">
          <a
            href={profile.resume}
            download
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-opacity duration-200 hover:opacity-90"
          >
            ↓ Résumé
          </a>
          <Social href={profile.linkedin} label="LinkedIn">
            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13M7.12 20.45H3.56V9h3.56z" />
          </Social>
          <Social href={profile.github} label="GitHub">
            <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7 0-.7 0-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.3 2.8.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.1.9 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
          </Social>
          <Social href={`mailto:${profile.email}`} label="Email">
            <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 4-8 5-8-5V6l8 5 8-5z" />
          </Social>
        </div>

        {/* Mobile/tablet only — on lg the controls live in the fixed
            top-right cluster (page.tsx) so a short viewport can't hide them. */}
        <div className="lg:hidden">
          <ModeControls />
        </div>

        <p className="font-mono text-[10px] text-muted-foreground no-print">
          Press <kbd className="rounded border border-border px-1 text-accent">`</kbd> for the
          terminal
        </p>
      </div>
    </header>
  );
}

/** Cycles the headline disciplines. Replaces the old typewriter effect. */
function RotatingRole() {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setI((n) => (n + 1) % profile.typedRoles.length), 2600);
    return () => clearInterval(t);
  }, [reduced]);

  if (reduced) return <span>{profile.typedRoles.join(' · ')}</span>;

  return (
    <span className="flex items-center gap-1">
      {/* Keyed remount, no exit — a stalled exit would freeze the rotation. */}
      <motion.span
        key={i}
        data-motion
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      >
        {profile.typedRoles[i]}
      </motion.span>
      <span className="caret text-accent">_</span>
    </span>
  );
}

function Social({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const external = href.startsWith('http');
  return (
    <a
      href={href}
      aria-label={label}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="text-muted-foreground transition-colors duration-200 hover:text-accent"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
        {children}
      </svg>
    </a>
  );
}
