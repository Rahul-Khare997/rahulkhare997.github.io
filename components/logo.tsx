export type LogoSpec = {
  /** Path under public/, e.g. "assets/logos/zenquip.png". Omit for a text mark. */
  src?: string;
  /** Fallback monogram, used when `src` is absent. */
  text: string;
  color: string;
  bg: string;
};

/**
 * Company mark. Renders the real logo when one has been dropped into
 * public/assets/logos and referenced from lib/content.ts; otherwise a
 * brand-coloured monogram tile, so a missing asset degrades to something
 * deliberate rather than a broken image.
 */
export function Logo({ logo, size = 44, alt }: { logo: LogoSpec; size?: number; alt: string }) {
  if (logo.src) {
    return (
      <div
        className="flex shrink-0 items-center justify-center overflow-hidden rounded-md p-1"
        style={{ background: logo.bg, width: size, height: size }}
      >
        {/* Static export: no image optimisation server, so a plain <img>.
            max-* rather than h-full/w-full: a logo with a non-square aspect
            ratio (TD is 90x96) overflows a square tile when both dimensions
            are forced, because the intrinsic ratio wins over a percentage
            height. Constraining both maxima lets object-contain fit it.
            Not lazy — these are a few KB each and lazy-loading defers the
            below-the-fold ones indefinitely in a backgrounded tab. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo.src}
          alt={alt}
          className="max-h-full max-w-full object-contain"
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div
      className="grid shrink-0 place-items-center rounded-md"
      style={{ background: logo.bg, width: size, height: size }}
      aria-hidden
    >
      <span
        className="font-mono font-bold"
        style={{ color: logo.color, fontSize: Math.round(size * 0.29) }}
      >
        {logo.text}
      </span>
    </div>
  );
}
