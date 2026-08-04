'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

/**
 * Recruiter Q&A widget.
 *
 * Talks only to the Cloudflare Worker in ../worker, which holds the Gemini key
 * as a secret. No key is ever present in this bundle. With the proxy URL unset
 * the widget does not render, so there is never a chat button that fails.
 */
const PROXY = process.env.NEXT_PUBLIC_AI_PROXY_URL ?? '';

const CHIPS = [
  { label: 'Program mgr fit?', q: 'Is Rahul a good fit for a Program Manager role?' },
  { label: 'Zenquip role', q: 'What does Rahul do at Zenquip Healthcare?' },
  { label: 'Finance ops', q: 'What budget and finance operations experience does Rahul have?' },
  { label: 'Availability', q: "What is Rahul's notice period and where is he based?" },
  { label: 'TD Bank', q: "Tell me about Rahul's TD Bank experience" },
  { label: 'KPI dashboards', q: 'What KPI dashboards and reporting has Rahul built?' },
];

type Turn = { role: 'user' | 'model'; text: string };

export function AiChat() {
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [turns, busy]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  if (!PROXY) return null;

  async function send(text: string) {
    const msg = text.trim();
    if (!msg || busy) return;

    const history = turns.slice(-20);
    setTurns((t) => [...t, { role: 'user', text: msg }]);
    setValue('');
    setBusy(true);

    try {
      const res = await fetch(PROXY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history }),
      });
      const data = await res.json().catch(() => ({}));
      setTurns((t) => [
        ...t,
        {
          role: 'model',
          text: res.ok
            ? (data.reply ?? 'No answer came back.')
            : (data.error ?? 'Something went wrong. Email rahul.khare997@gmail.com.'),
        },
      ]);
    } catch {
      setTurns((t) => [
        ...t,
        { role: 'model', text: 'Could not reach the assistant. Email rahul.khare997@gmail.com.' },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="fixed bottom-6 left-6 z-40 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-lg transition-opacity hover:opacity-90 no-print"
      >
        <span aria-hidden>✦</span> Ask me anything
      </button>

      {open && (
        <motion.div
          data-motion
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-label="Ask about Rahul"
          className="fixed bottom-20 left-6 z-40 flex max-h-[70vh] w-[min(24rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-lg border border-border-bright bg-surface shadow-2xl no-print"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <div className="text-sm font-semibold text-heading">Ask about Rahul</div>
              <div className="font-mono text-[10px] text-muted-foreground">
                Answers come from his résumé
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-muted-foreground hover:text-heading"
            >
              ×
            </button>
          </div>

          <div ref={logRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {turns.length === 0 && (
              <p className="text-sm leading-relaxed text-muted-foreground">
                Ask about his program management work, budget and burn control, KPI reporting, TD
                Bank experience, or availability.
              </p>
            )}
            {turns.map((t, i) => (
              <div
                key={i}
                className={[
                  'max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed',
                  t.role === 'user'
                    ? 'ml-auto bg-accent-muted text-heading'
                    : 'border border-border bg-background',
                ].join(' ')}
              >
                {t.text}
              </div>
            ))}
            {busy && <div className="font-mono text-xs text-muted-foreground">thinking…</div>}
          </div>

          {turns.length === 0 && (
            <div className="scroll-fade-x no-scrollbar flex gap-1.5 overflow-x-auto px-4 pb-2">
              {CHIPS.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => send(c.q)}
                  className="shrink-0 whitespace-nowrap rounded-full border border-border px-3 py-1 font-mono text-[10px] text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(value);
            }}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              maxLength={1000}
              placeholder="Ask about Rahul…"
              aria-label="Your question"
              className="flex-1 bg-transparent text-sm text-heading outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={busy || !value.trim()}
              className="rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </motion.div>
      )}
    </>
  );
}
