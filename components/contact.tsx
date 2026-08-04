'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import { languages, profile } from '@/lib/content';

/**
 * A static export has no server, so the page cannot send mail by itself.
 * If NEXT_PUBLIC_FORM_ENDPOINT is set at build time (Formspree, Web3Forms,
 * Getform — any endpoint that accepts a POST), the inline form submits to it
 * and mail arrives in Rahul's inbox. With it unset the form is not rendered
 * at all and the Google Form remains the route, so nothing can silently
 * swallow a message.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? '';

export function ContactForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const reduced = useReducedMotion();

  if (!ENDPOINT) return null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(e.currentTarget),
      });
      setState(res.ok ? 'sent' : 'error');
    } catch {
      setState('error');
    }
  }

  if (state === 'sent') {
    return (
      <motion.p
        data-motion
        initial={reduced ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-md border border-border-bright bg-accent-muted p-4 text-sm text-accent-light"
      >
        Thanks — your message is on its way. Rahul will reply to the address you gave.
      </motion.p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Your name
          </span>
          <input
            name="name"
            required
            autoComplete="name"
            className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-heading outline-none transition-colors focus:border-accent"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Your email
          </span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-heading outline-none transition-colors focus:border-accent"
          />
        </label>
      </div>
      <label className="grid gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Message
        </span>
        <textarea
          name="message"
          rows={4}
          required
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-heading outline-none transition-colors focus:border-accent"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={state === 'sending'}
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {state === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        {state === 'error' && (
          <span className="text-sm text-red-400">
            Couldn’t send. Email {profile.email} directly.
          </span>
        )}
      </div>
    </form>
  );
}

export function CopyEmail() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent no-print"
    >
      {copied ? 'copied' : 'copy'}
    </button>
  );
}

export function Availability() {
  return (
    <div className="grid gap-6">
      <div className="flex items-start gap-3 rounded-md border border-border-bright bg-accent-muted p-4">
        <span className="relative mt-1 flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
        </span>
        <div>
          <div className="text-sm font-semibold text-heading">{profile.notice}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            Zenquip Healthcare · Ex-TD Bank Canada · CIRO/SEC Registered · Night/rotational shifts OK
          </div>
        </div>
      </div>

      <Chips label="Open to relocate" items={[...profile.openTo]} firstHighlighted />
      <Chips label="Target roles" items={[...profile.targetRoles]} />

      <div>
        <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-accent">
          Languages
        </div>
        <ul className="flex flex-wrap gap-1.5">
          {languages.map((l) => (
            <li key={l.name}>
              <span
                className={[
                  'inline-block rounded border px-2.5 py-1 font-mono text-[11px]',
                  l.hi
                    ? 'border-border-bright text-accent-light'
                    : 'border-border text-muted-foreground',
                ].join(' ')}
              >
                {l.name} · {l.level}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Chips({
  label,
  items,
  firstHighlighted,
}: {
  label: string;
  items: string[];
  firstHighlighted?: boolean;
}) {
  return (
    <div>
      <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-accent">{label}</div>
      <ul className="flex flex-wrap gap-1.5">
        {items.map((c, i) => (
          <li key={c}>
            <span
              className={[
                'inline-block rounded border px-2.5 py-1 font-mono text-[11px]',
                firstHighlighted && i === 0
                  ? 'border-border-bright text-accent-light'
                  : 'border-border text-muted-foreground',
              ].join(' ')}
            >
              {c}
              {firstHighlighted && i === 0 ? ' · based' : ''}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
