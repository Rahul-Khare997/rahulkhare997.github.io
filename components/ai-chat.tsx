'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Recruiter Q&A widget.
 *
 * Talks only to the Cloudflare Worker in ../worker, which holds the Gemini key
 * as a secret. No key is ever present in this bundle. With the proxy URL unset
 * the widget does not render, so there is never a chat button that fails.
 *
 * The conversation survives panel close and reload within the browser session
 * (sessionStorage), a failed send can be retried in place, and suggestion
 * chips retire once used. A one-time teaser bubble invites the first click.
 */
const PROXY = process.env.NEXT_PUBLIC_AI_PROXY_URL ?? '';

const GREETING =
  "Hi — I'm Rahul's AI assistant, answering from his résumé. Ask about his program delivery, budget and burn control, KPI reporting, TD Bank years, or availability.";

const CHIPS = [
  { label: 'Program mgr fit?', q: 'Is Rahul a good fit for a Program Manager role?' },
  { label: 'Zenquip role', q: 'What does Rahul do at Zenquip Healthcare?' },
  { label: 'Finance ops', q: 'What budget and finance operations experience does Rahul have?' },
  { label: 'Availability', q: "What is Rahul's notice period and where is he based?" },
  { label: 'TD Bank', q: "Tell me about Rahul's TD Bank experience" },
  { label: 'KPI dashboards', q: 'What KPI dashboards and reporting has Rahul built?' },
];

type Turn = { role: 'user' | 'model'; text: string; error?: boolean };

const STORE_TURNS = 'rk_chat_turns';
const STORE_TEASED = 'rk_chat_teased';

/**
 * Markdown-lite for model replies: **bold** in accent, "* " / "- " lines as a
 * bulleted list. Everything else is plain text — never raw HTML.
 */
function renderRich(text: string): ReactNode {
  const bold = (s: string, keyBase: string) =>
    s.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={`${keyBase}-${i}`} className="font-semibold text-accent-light">
          {part.slice(2, -2)}
        </strong>
      ) : (
        <span key={`${keyBase}-${i}`}>{part}</span>
      ),
    );

  const lines = text.split('\n');
  const out: ReactNode[] = [];
  let list: string[] = [];

  const flush = (key: string) => {
    if (!list.length) return;
    out.push(
      <ul key={key} className="my-1 space-y-1 pl-1">
        {list.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
            <span>{bold(item, `${key}-${i}`)}</span>
          </li>
        ))}
      </ul>,
    );
    list = [];
  };

  lines.forEach((line, i) => {
    const m = line.match(/^\s*[*-]\s+(.*)$/);
    if (m) {
      list.push(m[1]);
      return;
    }
    flush(`ul-${i}`);
    if (line.trim()) out.push(<p key={`p-${i}`}>{bold(line, `p-${i}`)}</p>);
  });
  flush('ul-end');
  return <div className="space-y-1.5">{out}</div>;
}

function Avatar({ size = 26 }: { size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center overflow-hidden rounded-full border border-border-bright bg-background"
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="assets/brand/rk-mark.png" alt="" className="h-[62%] w-auto" />
    </span>
  );
}

export function AiChat() {
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const openedOnce = useRef(false);
  const reduced = useReducedMotion();

  // Restore the session's conversation once, client-side only.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORE_TURNS);
      if (raw) setTurns(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  // Persist (capped) so closing the panel never loses the thread.
  useEffect(() => {
    try {
      sessionStorage.setItem(STORE_TURNS, JSON.stringify(turns.slice(-40)));
    } catch {
      /* ignore */
    }
  }, [turns]);

  // One-time teaser bubble, only until the chat has ever been opened.
  useEffect(() => {
    let teased = false;
    try {
      teased = !!sessionStorage.getItem(STORE_TEASED);
    } catch {
      /* ignore */
    }
    if (teased) return;
    const show = setTimeout(() => setTeaser(true), 4000);
    const hide = setTimeout(() => setTeaser(false), 16000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  function dismissTeaser() {
    setTeaser(false);
    try {
      sessionStorage.setItem(STORE_TEASED, '1');
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [turns, busy, open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Focus the input when the panel opens; hand focus back on close.
  useEffect(() => {
    if (open) {
      openedOnce.current = true;
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
    if (openedOnce.current) launcherRef.current?.focus();
  }, [open]);

  if (!PROXY) return null;

  async function send(text: string, isRetry = false) {
    const msg = text.trim();
    if (!msg || busy) return;

    // History = clean turns only; a failed exchange is not context.
    const history = turns.filter((t) => !t.error).slice(-20);

    if (isRetry) {
      setTurns((t) => t.filter((x) => !x.error));
    } else {
      setTurns((t) => [...t.filter((x) => !x.error), { role: 'user', text: msg }]);
    }
    setFailed(null);
    setValue('');
    setBusy(true);

    try {
      const res = await fetch(PROXY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setTurns((t) => [...t, { role: 'model', text: data.reply ?? 'No answer came back.' }]);
      } else {
        setFailed(msg);
        setTurns((t) => [
          ...t,
          {
            role: 'model',
            error: true,
            text: data.error ?? 'Something went wrong.',
          },
        ]);
      }
    } catch {
      setFailed(msg);
      setTurns((t) => [
        ...t,
        { role: 'model', error: true, text: 'Could not reach the assistant.' },
      ]);
    } finally {
      setBusy(false);
    }
  }

  const usedQuestions = new Set(turns.filter((t) => t.role === 'user').map((t) => t.text));
  const chips = CHIPS.filter((c) => !usedQuestions.has(c.q));

  return (
    <>
      {/* Teaser bubble — one per session, gone forever once chat is opened. */}
      {teaser && !open && (
        <motion.div
          data-motion
          initial={reduced ? false : { opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: reduced ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-[4.6rem] right-6 z-40 w-64 rounded-lg rounded-br-sm border border-border-bright bg-surface p-3 shadow-2xl no-print"
        >
          <button
            type="button"
            onClick={dismissTeaser}
            aria-label="Dismiss"
            className="absolute right-2 top-1.5 text-muted-foreground hover:text-heading"
          >
            ×
          </button>
          <button
            type="button"
            onClick={() => {
              dismissTeaser();
              setOpen(true);
            }}
            className="block text-left"
          >
            <span className="flex items-center gap-2">
              <Avatar size={22} />
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                AI assistant
              </span>
            </span>
            <span className="mt-1.5 block text-[13px] leading-snug text-heading">
              Hiring? Ask me anything about Rahul&rsquo;s experience — I answer from his résumé.
            </span>
          </button>
        </motion.div>
      )}

      <button
        ref={launcherRef}
        type="button"
        onClick={() => {
          dismissTeaser();
          setOpen((o) => !o);
        }}
        aria-expanded={open}
        aria-label={open ? 'Close AI chat' : 'Open AI chat — ask about Rahul'}
        className="group fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl no-print"
      >
        {/* Finite attention ring — a few pulses, then rest. */}
        <span aria-hidden className="chat-ping absolute inset-0 rounded-full bg-accent/60" />
        <span aria-hidden className="relative">
          ✦
        </span>
        <span className="relative">{open ? 'Close chat' : 'Ask me anything'}</span>
      </button>

      {open && (
        <motion.div
          data-motion
          initial={reduced ? false : { opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: reduced ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-label="Ask about Rahul"
          className="fixed bottom-20 right-6 z-40 flex max-h-[70vh] w-[min(24rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-xl border border-border-bright bg-surface shadow-2xl no-print"
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border bg-gradient-to-r from-accent-muted to-transparent px-4 py-3">
            <div className="relative">
              <Avatar size={34} />
              <span
                aria-hidden
                className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-emerald-400"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-heading">Rahul&rsquo;s AI Assistant</div>
              <div className="truncate font-mono text-[10px] text-muted-foreground">
                Online · answers from his résumé
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-heading"
            >
              ×
            </button>
          </div>

          {/* Log */}
          <div
            ref={logRef}
            aria-live="polite"
            className="flex-1 space-y-3 overflow-y-auto p-4"
          >
            <Bubble role="model" reduced={reduced}>
              {renderRich(GREETING)}
            </Bubble>

            {turns.map((t, i) =>
              t.error ? (
                <Bubble key={i} role="model" error reduced={reduced}>
                  <p>{t.text}</p>
                  {failed && (
                    <button
                      type="button"
                      onClick={() => send(failed, true)}
                      className="mt-2 rounded border border-border-bright px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-accent-light transition-colors hover:border-accent"
                    >
                      ↻ Retry
                    </button>
                  )}
                  <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                    Or email rahul.khare997@gmail.com
                  </p>
                </Bubble>
              ) : (
                <Bubble key={i} role={t.role} reduced={reduced}>
                  {t.role === 'model' ? renderRich(t.text) : t.text}
                </Bubble>
              ),
            )}

            {busy && (
              <div className="flex items-end gap-2">
                <Avatar size={22} />
                <div className="rounded-lg rounded-bl-sm border border-border bg-background px-3 py-2.5">
                  <span className="flex gap-1" aria-label="Assistant is typing">
                    <span className="chat-dot h-1.5 w-1.5 rounded-full bg-accent" />
                    <span className="chat-dot h-1.5 w-1.5 rounded-full bg-accent" />
                    <span className="chat-dot h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Suggestion chips — retire once asked. */}
          {chips.length > 0 && !busy && (
            <div className="scroll-fade-x no-scrollbar flex gap-1.5 overflow-x-auto px-4 pb-2">
              {chips.map((c) => (
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

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(value);
            }}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              maxLength={1000}
              placeholder="Ask about Rahul…"
              aria-label="Your question"
              className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm text-heading outline-none transition-colors placeholder:text-muted-foreground focus:border-accent"
            />
            <button
              type="submit"
              disabled={busy || !value.trim()}
              aria-label="Send"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              ↑
            </button>
          </form>
        </motion.div>
      )}
    </>
  );
}

function Bubble({
  role,
  error,
  reduced,
  children,
}: {
  role: 'user' | 'model';
  error?: boolean;
  reduced: boolean | null;
  children: ReactNode;
}) {
  const isUser = role === 'user';
  return (
    <motion.div
      data-motion
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
      className={['flex items-end gap-2', isUser ? 'justify-end' : ''].join(' ')}
    >
      {!isUser && <Avatar size={22} />}
      <div
        className={[
          'max-w-[85%] px-3 py-2 text-sm leading-relaxed',
          isUser
            ? 'rounded-lg rounded-br-sm bg-accent-muted text-heading'
            : error
              ? 'rounded-lg rounded-bl-sm border border-red-400/40 bg-background'
              : 'rounded-lg rounded-bl-sm border border-border bg-background',
        ].join(' ')}
      >
        {children}
      </div>
    </motion.div>
  );
}
