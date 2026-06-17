import * as React from 'react';
import { Linkedin } from 'lucide-react';

/* ----------------------------------------------------------------
 * ScrollReelTestimonials
 *
 * Counter-rotating scroll reel: one testimonial featured at a time.
 * The middle column is a real vertical list of portraits that
 * translates by exactly one "pitch" per step and clicks into place;
 * the outer columns counter-rotate the opposite way. The quote +
 * author rise in character-by-character; the old block exits as a
 * whole before the new characters stagger in.
 *
 * Re-themed onto this site's warm paper/charcoal + sienna tokens
 * (no shadcn semantic colors), with an optional role line and a
 * LinkedIn icon that only renders when a real URL is supplied.
 * ---------------------------------------------------------------- */

export interface ScrollReelTestimonial {
  /** The quote text */
  quote: string;
  /** Author name shown below the quote */
  author: string;
  /** Optional role / affiliation line under the name */
  role?: string;
  /** Portrait image URL for the featured tile */
  image: string;
  /** Optional alt text for the portrait */
  alt?: string;
  /** Optional LinkedIn URL - renders a clickable icon when present */
  linkedin?: string;
}

export interface ScrollReelTestimonialsProps {
  /** Testimonials to cycle through (one featured tile per entry) */
  testimonials: ScrollReelTestimonial[];
  /** Per-character stagger in ms (default 6) */
  charStaggerMs?: number;
  /** Auto-advance through entries (ping-pongs between ends, pauses on hover/focus) */
  autoPlay?: boolean;
  /** Dwell time between auto-advances in ms (default 6000) */
  autoPlayMs?: number;
  /** Extra classes for the outer container */
  className?: string;
}

/* Geometry - middle column pitch between portrait centers:
 * 3 * (cell 121.33px + gap 8px) = 388px */
const CELL = 121.33;
const STEP = 3 * (CELL + 8);
const EXIT_MS = 240; // old text removed / new text mounted
const SLIDE_MS = 800; // column slide duration + interaction lock
const EASE_INOUT = 'cubic-bezier(0.65,0,0.35,1)';

const QUOTE_CLASSES =
  'm-0 font-display text-lg font-medium leading-[1.35] tracking-tight text-ink sm:text-[22px]';
const AUTHOR_CLASSES =
  'm-0 font-display text-[0.95rem] font-medium leading-tight tracking-tight text-ink';
const ROLE_CLASSES =
  'font-mono text-[0.6rem] uppercase tracking-widest leading-tight text-ink-faint';

const FEATURED_SHADOW =
  '0 1.008px 0.705px -0.563px rgba(0,0,0,0.35), 0 2.389px 1.672px -1.125px rgba(0,0,0,0.33), 0 4.357px 3.05px -1.688px rgba(0,0,0,0.32), 0 7.244px 5.07px -2.25px rgba(0,0,0,0.30), 0 11.698px 8.188px -2.813px rgba(0,0,0,0.27), 0 19.148px 13.404px -3.375px rgba(0,0,0,0.22), 0 32.972px 23.08px -3.938px rgba(0,0,0,0.14), 0 60px 42px -4.5px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.10)';

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

/* Blurred placeholder cell */
function Cell() {
  return (
    <div
      aria-hidden="true"
      className="shrink-0 rounded-xl border border-hairline bg-gradient-to-b from-paper-raised to-paper blur-[1px] shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]"
      style={{ width: CELL, height: CELL }}
    />
  );
}

/* Featured portrait tile with a warm sienna sheen overlay */
function Featured({ src, alt }: { src: string; alt?: string }) {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-xl bg-paper ring-1 ring-hairline"
      style={{ width: CELL, height: CELL, boxShadow: FEATURED_SHADOW }}
    >
      <img
        src={src}
        alt={alt ?? ''}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
      />
      {/* warm diagonal sheen - keeps the tile on the site's palette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[3] blur-[5px] mix-blend-overlay"
        style={{
          background:
            'linear-gradient(214deg, rgba(255,94,38,0) 34%, rgba(255,94,38,0.55) 47%, rgba(255,184,130,0.45) 54%, rgba(255,94,38,0) 70%)',
        }}
      />
      {/* crisp inner edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[4] rounded-xl ring-1 ring-inset ring-white/10"
      />
    </div>
  );
}

/* Per-character split. Spaces live between word spans as plain text
 * nodes so natural line-wrapping is preserved. */
function Chars({
  text,
  startIndex,
  staggerMs,
}: {
  text: string;
  startIndex: number;
  staggerMs: number;
}) {
  let idx = startIndex;
  const words = text.split(' ');
  return (
    <>
      {words.map((word, wi) => {
        const wordSpan = (
          <span className="inline-block whitespace-nowrap">
            {Array.from(word).map((ch, ci) => {
              const delay = idx * staggerMs;
              idx++;
              return (
                <span
                  key={ci}
                  className="scroll-reel-char"
                  style={{ animationDelay: `${delay}ms` }}
                >
                  {ch}
                </span>
              );
            })}
          </span>
        );
        if (wi < words.length - 1) idx++;
        return (
          <React.Fragment key={wi}>
            {wordSpan}
            {wi < words.length - 1 ? ' ' : null}
          </React.Fragment>
        );
      })}
    </>
  );
}

export function ScrollReelTestimonials({
  testimonials,
  charStaggerMs = 6,
  autoPlay = false,
  autoPlayMs = 6000,
  className,
}: ScrollReelTestimonialsProps) {
  const [index, setIndex] = React.useState(0);
  const [displayIndex, setDisplayIndex] = React.useState(0);
  const [exiting, setExiting] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const animating = React.useRef(false);
  const dirRef = React.useRef<1 | -1>(1);
  const timeouts = React.useRef<ReturnType<typeof setTimeout>[]>([]);
  const count = testimonials.length;

  React.useEffect(() => {
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setMounted(true))
    );
    const pending = timeouts.current;
    return () => {
      cancelAnimationFrame(raf);
      pending.forEach(clearTimeout);
    };
  }, []);

  const goTo = React.useCallback(
    (next: number) => {
      if (animating.current) return;
      if (next < 0 || next >= count || next === index) return;
      animating.current = true;
      setIndex(next);
      setExiting(true);
      timeouts.current.push(
        setTimeout(() => {
          setDisplayIndex(next);
          setExiting(false);
        }, EXIT_MS)
      );
      timeouts.current.push(
        setTimeout(() => {
          animating.current = false;
        }, SLIDE_MS)
      );
    },
    [index, count]
  );

  const paginate = React.useCallback((dir: 1 | -1) => goTo(index + dir), [goTo, index]);

  // Auto-advance: ping-pong between the two ends so every step is a single
  // pitch (never a long reverse jump). Re-arms on each index change for a
  // consistent dwell; pauses on hover/focus and respects reduced motion.
  React.useEffect(() => {
    if (!autoPlay || paused || count <= 1) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const id = setTimeout(() => {
      let dir = dirRef.current;
      if (index + dir > count - 1) dir = -1;
      else if (index + dir < 0) dir = 1;
      dirRef.current = dir;
      goTo(index + dir);
    }, autoPlayMs);
    return () => clearTimeout(id);
  }, [autoPlay, autoPlayMs, paused, count, index, goTo]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      paginate(1);
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      paginate(-1);
    }
  };

  const middleItems = React.useMemo(() => {
    const items: Array<{ type: 'cell' } | { type: 'featured'; i: number }> = [];
    for (let i = 0; i < 3; i++) items.push({ type: 'cell' });
    testimonials.forEach((_, i) => {
      items.push({ type: 'featured', i });
      if (i < count - 1) {
        items.push({ type: 'cell' }, { type: 'cell' });
      }
    });
    for (let i = 0; i < 3; i++) items.push({ type: 'cell' });
    return items;
  }, [testimonials, count]);

  const sideCellCount = 4 + 2 * count;
  const centerIdx = (count - 1) / 2;
  const middleY = (centerIdx - index) * STEP;
  const sideY = -middleY;

  const colStyle = (y: number): React.CSSProperties => ({
    transform: `translateY(${y}px)`,
    transition: mounted ? `transform ${SLIDE_MS}ms ${EASE_INOUT}` : 'none',
  });

  const current = testimonials[displayIndex];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Testimonials"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
      className={cn(
        'relative flex w-full max-w-[1060px] flex-col items-stretch gap-2.5 overflow-hidden rounded-2xl border border-hairline bg-paper-raised outline-none focus-visible:ring-2 focus-visible:ring-accent md:min-h-[320px] md:flex-row',
        className
      )}
    >
      {/* Reel section */}
      <div
        aria-hidden="true"
        className="relative h-56 w-full shrink-0 self-stretch overflow-hidden md:h-auto md:w-[380px]"
        style={{
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
          maskImage:
            'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
          WebkitMaskComposite: 'source-in',
          maskComposite: 'intersect',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center gap-2">
          {/* Left column */}
          <div
            className="flex shrink-0 flex-col gap-2 will-change-transform motion-reduce:[transition:none!important]"
            style={colStyle(sideY)}
          >
            {Array.from({ length: sideCellCount }).map((_, i) => (
              <Cell key={i} />
            ))}
          </div>
          {/* Middle column */}
          <div
            className="flex shrink-0 flex-col gap-2 will-change-transform motion-reduce:[transition:none!important]"
            style={colStyle(middleY)}
          >
            {middleItems.map((item, i) => (
              <React.Fragment key={i}>
                {item.type === 'featured' ? (
                  <Featured
                    src={testimonials[item.i].image}
                    alt={testimonials[item.i].alt}
                  />
                ) : (
                  <Cell />
                )}
              </React.Fragment>
            ))}
          </div>
          {/* Right column */}
          <div
            className="flex shrink-0 flex-col gap-2 will-change-transform motion-reduce:[transition:none!important]"
            style={colStyle(sideY)}
          >
            {Array.from({ length: sideCellCount }).map((_, i) => (
              <Cell key={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch px-5 py-7 md:py-10">
        <div className="flex flex-col gap-[9px]">
          <svg
            className="block h-10 w-10 text-accent/30"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M4.58 17.32C3.55 16.23 3 15 3 13.01c0-3.5 2.46-6.64 6.03-8.19l.9 1.38c-3.34 1.8-4 4.15-4.25 5.62.54-.28 1.24-.38 1.93-.31 1.8.17 3.23 1.65 3.23 3.49a3.5 3.5 0 0 1-3.5 3.5c-1.07 0-2.1-.49-2.75-1.18zm10 0C13.55 16.23 13 15 13 13.01c0-3.5 2.46-6.64 6.03-8.19l.9 1.38c-3.34 1.8-4 4.15-4.25 5.62.54-.28 1.24-.38 1.93-.31 1.8.17 3.23 1.65 3.23 3.49a3.5 3.5 0 0 1-3.5 3.5c-1.07 0-2.1-.49-2.75-1.18z" />
          </svg>

          {/* Text stage */}
          <div
            className="relative w-full max-w-[420px] overflow-hidden"
            aria-live="polite"
          >
            {/* Invisible in-flow copy sizes the stage to the current entry */}
            <div
              aria-hidden="true"
              className="invisible flex min-h-[150px] flex-col gap-[18px]"
            >
              <p className={QUOTE_CLASSES}>{current.quote}</p>
              <div className="flex min-h-9 flex-col justify-center gap-1">
                <p className={AUTHOR_CLASSES}>{current.author}</p>
                {current.role && <span className={ROLE_CLASSES}>{current.role}</span>}
              </div>
            </div>

            <div
              key={displayIndex}
              className={cn(
                'absolute inset-x-0 top-0 flex flex-col gap-[18px] will-change-[transform,opacity]',
                exiting && 'scroll-reel-exit'
              )}
            >
              <p className={QUOTE_CLASSES}>
                <Chars text={current.quote} startIndex={0} staggerMs={charStaggerMs} />
              </p>
              <div className="flex min-h-9 items-center gap-2.5">
                <div className="flex min-w-0 flex-col gap-1">
                  <p className={AUTHOR_CLASSES}>
                    <Chars
                      text={current.author}
                      startIndex={current.quote.length + 6}
                      staggerMs={charStaggerMs}
                    />
                  </p>
                  {current.role && <span className={ROLE_CLASSES}>{current.role}</span>}
                </div>
                <a
                  href={
                    current.linkedin ??
                    `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(current.author)}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${current.author} on LinkedIn`}
                  title="View on LinkedIn"
                  className="ml-auto grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/15 text-ink-soft transition-[color,border-color,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.08] hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  data-cursor
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center gap-1.5 md:mt-0">
          <button
            type="button"
            onClick={() => paginate(-1)}
            disabled={index === 0}
            aria-label="Previous testimonial"
            className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border border-ink/15 bg-transparent p-0 text-ink transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:enabled:scale-[1.08] hover:enabled:border-accent hover:enabled:text-accent active:enabled:scale-[0.94] disabled:cursor-default disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            data-cursor
          >
            <svg
              className="h-3 w-3 opacity-80"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7.5 2.5 3.5 6l4 3.5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => paginate(1)}
            disabled={index === count - 1}
            aria-label="Next testimonial"
            className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border border-ink/15 bg-transparent p-0 text-ink transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:enabled:scale-[1.08] hover:enabled:border-accent hover:enabled:text-accent active:enabled:scale-[0.94] disabled:cursor-default disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            data-cursor
          >
            <svg
              className="h-3 w-3 opacity-80"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m4.5 2.5 4 3.5-4 3.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScrollReelTestimonials;
