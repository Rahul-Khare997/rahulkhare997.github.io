import Link from 'next/link';

/**
 * Served by GitHub Pages as 404.html for any unknown path. Assets use
 * absolute paths — this page can render from any URL depth.
 */
export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 font-sans">
      <div className="text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/brand/rk-mark.png"
          alt=""
          width={53}
          height={64}
          className="mx-auto h-16 w-auto opacity-90"
        />
        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
          404 — page not found
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-heading">
          Nothing at this address
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          The résumé, experience, projects and contact details all live on the home page.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-opacity duration-200 hover:opacity-90"
        >
          ← Back to the site
        </Link>
      </div>
    </main>
  );
}
