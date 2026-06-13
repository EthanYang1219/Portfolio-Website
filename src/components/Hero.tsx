import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Typewriter } from './ui/typewriter';

const tags = ['Leading', 'Building', 'Coding', 'Creating', 'Learning'];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Track viewport height so the fade range scales with the screen. The hero
  // inner panel pins for the first ~50svh; we finish the fade just before that.
  const [vh, setVh] = useState<number>(typeof window !== 'undefined' ? window.innerHeight : 800);
  useEffect(() => {
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Elegant scroll-linked fade (no zoom): the whole intro — badge, tagline,
  // name, and buttons — fades out together over the first ~0.42 of a screen
  // height, while the name is still pinned and centered, and fades back in on
  // scroll up. Driven off raw window scroll (px) because target/offset progress
  // is non-monotonic over the sticky child. Pure opacity, fully to 0.
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, vh * 0.42], [1, 0]);

  const handleWorkScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById('work');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      ref={containerRef}
      className="hero relative h-[150svh] text-center" 
      id="hero"
    >
      {/* No overflow-hidden here: the name's ambient halo paints past the
          container bottom, and clipping it leaves a hard horizontal edge
          below the CTA buttons. Horizontal overflow is guarded by body/main. */}
      <motion.div
        style={{ opacity: heroOpacity }}
        className="hero-sticky sticky top-0 h-[100svh] grid grid-rows-[auto_1fr_auto] items-center gap-6 pt-28 pb-10 px-5 md:px-[var(--gutter)]"
      >
        
        {/* Soft Warm Glow Backdrop (Fills space behind text softly) */}
        <div 
          className="absolute inset-0 top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[72vw] h-[72vw] max-w-[840px] max-h-[840px] bg-accent-tint/40 rounded-full blur-[72px] pointer-events-none -z-10"
          aria-hidden="true"
        />

        {/* Top: Status Badge + Tagline */}
        <motion.div 
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col items-center gap-4"
        >
          {/* Availability badge */}
          <span className="hero-status inline-flex items-center gap-2.5 font-mono text-xs md:text-sm tracking-wider uppercase text-ink-soft border border-hairline rounded-full py-2.5 px-5 bg-paper-raised">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            Open to internships &amp; collaborations
          </span>

          {/* Dynamic rotating subtitle tagline */}
          <div className="hero-tagline font-sans font-semibold text-2xl md:text-3xl lg:text-4xl tracking-wide uppercase text-ink-soft select-none flex flex-wrap items-center justify-center gap-x-3 gap-y-2 mt-2">
            <span>I enjoy</span>
            <Typewriter
              text={tags}
              speed={70}
              className="text-accent font-black italic tracking-wider text-center"
              waitTime={1500}
              deleteSpeed={40}
              cursorChar="_"
            />
          </div>
        </motion.div>

        {/* Center: Giant Display Name with Illuminated Glow Filter
            (fades with the rest of the intro via the parent's heroOpacity) */}
        <div
          className="hero-center relative z-10 flex items-center justify-center pointer-events-none"
        >
          <div className="hero-name-wrap select-none relative">
            {/* Ambient Background Glow for the main name display */}
            <div className="absolute inset-0 -z-10 w-full h-[150%] translate-y-[-25%] pointer-events-none">
              <div className="shadow-bgt absolute size-full translate-y-[-10%] scale-[1.2] animate-[onloadbgt_1s_ease-in-out_forwards] rounded-[100em] opacity-40 blur-[40px] bg-accent-tint" />
              <div className="shadow-bgb absolute size-full translate-y-[10%] scale-[1.2] animate-[onloadbgb_1s_ease-in-out_forwards] rounded-[100em] opacity-40 blur-[40px] bg-accent-tint" />
            </div>

            <h1 className="hero-name font-display font-bold leading-[0.8] letter-spacing-tight uppercase text-center" aria-label="Ethan Yang">
              <span 
                className="name-line block text-[4.8rem] sm:text-[8vw] md:text-[11vw] tracking-tight text-ink relative inline-block before:absolute before:animate-[onloadopacity_1s_ease-out_forwards] before:opacity-0 before:content-[attr(data-text)] before:bg-[linear-gradient(0deg,#dfe5ee_0%,#fffaf6_50%)] before:bg-clip-text before:text-[#fffaf6] filter-[url(#glow-4)]"
                data-text="ETHAN"
              >
                ETHAN
              </span>
              <span className="block h-2 sm:h-4" />
              <span 
                className="name-line accent block text-[4.8rem] sm:text-[8vw] md:text-[11vw] tracking-tight text-accent italic font-normal relative inline-block before:absolute before:animate-[onloadopacity_1s_ease-out_forwards] before:opacity-0 before:content-[attr(data-text)] before:text-accent filter-[url(#glow-4)]"
                data-text="YANG"
              >
                YANG
              </span>
            </h1>
          </div>
        </div>

        {/* Bottom: Floating actions (fade with the intro via parent heroOpacity) */}
        <div
          className="relative z-10 flex flex-col items-center gap-6"
        >
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center items-center">
            <a 
              href="#work" 
              onClick={handleWorkScroll}
              className="btn btn-primary inline-flex items-center gap-2 font-semibold text-[0.92rem] bg-ink text-paper border border-ink py-3.5 px-7 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-accent-deep hover:border-accent-deep hover:shadow-[0_12px_24px_-8px_var(--accent)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              data-cursor
            >
              View selected work 
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            
            <a 
              href="#contact" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-ghost font-semibold text-[0.92rem] text-ink relative py-2.5 px-4 cursor-pointer after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-ink after:-translate-x-1/2 after:transition-all after:duration-300"
              data-cursor
            >
              Get in touch
            </a>
          </div>
        </div>

      </motion.div>

      {/* Embedded SVG filter definitions for the illuminated glow text effect */}
      <svg
        className="absolute -z-10 h-0 w-0 pointer-events-none"
        width="1440px"
        height="300px"
        viewBox="0 0 1440 300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter
            id="glow-4"
            colorInterpolationFilters="sRGB"
            x="-100%"
            y="-400%"
            width="300%"
            height="900%"
          >
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="4"
              result="blur4"
            />
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="19"
              result="blur19"
            />
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="9"
              result="blur9"
            />
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="30"
              result="blur30"
            />
            <feColorMatrix
              in="blur4"
              result="color-0-blur"
              type="matrix"
              values="1 0 0 0 0
                      0 0.9803921568627451 0 0 0
                      0 0 0.9647058823529412 0 0
                      0 0 0 0.20 0"
            />
            <feOffset
              in="color-0-blur"
              result="layer-0-offsetted"
              dx="0"
              dy="0"
            />
            <feColorMatrix
              in="blur19"
              result="color-1-blur"
              type="matrix"
              values="0.8156862745098039 0 0 0 0
                      0 0.49411764705882355 0 0 0
                      0 0 0.2627450980392157 0 0
                      0 0 0 0.12 0"
            />
            <feOffset
              in="color-1-blur"
              result="layer-1-offsetted"
              dx="0"
              dy="2"
            />
            <feColorMatrix
              in="blur9"
              result="color-2-blur"
              type="matrix"
              values="1 0 0 0 0
                      0 0.6666666666666666 0 0 0
                      0 0 0.36470588235294116 0 0
                      0 0 0 0.15 0"
            />
            <feOffset
              in="color-2-blur"
              result="layer-2-offsetted"
              dx="0"
              dy="2"
            />
            <feColorMatrix
              in="blur30"
              result="color-3-blur"
              type="matrix"
              values="1 0 0 0 0
                      0 0.611764705882353 0 0 0
                      0 0 0.39215686274509803 0 0
                      0 0 0 0.10 0"
            />
            <feOffset
              in="color-3-blur"
              result="layer-3-offsetted"
              dx="0"
              dy="2"
            />
            <feColorMatrix
              in="blur30"
              result="color-4-blur"
              type="matrix"
              values="0.4549019607843137 0 0 0 0
                      0 0.16470588235294117 0 0 0
                      0 0 0 0 0
                      0 0 0 0.08 0"
            />
            <feOffset
              in="color-4-blur"
              result="layer-4-offsetted"
              dx="0"
              dy="16"
            />
            <feColorMatrix
              in="blur30"
              result="color-5-blur"
              type="matrix"
              values="0.4235294117647059 0 0 0 0
                      0 0.19607843137254902 0 0 0
                      0 0 0.11372549019607843 0 0
                      0 0 0 0.04 0"
            />
            <feOffset
              in="color-5-blur"
              result="layer-5-offsetted"
              dx="0"
              dy="64"
            />
            <feColorMatrix
              in="blur30"
              result="color-6-blur"
              type="matrix"
              values="0.21176470588235294 0 0 0 0
                      0 0.10980392156862745 0 0 0
                      0 0 0.07450980392156863 0 0
                      0 0 0 0.04 0"
            />
            <feOffset
              in="color-6-blur"
              result="layer-6-offsetted"
              dx="0"
              dy="64"
            />
            <feColorMatrix
              in="blur30"
              result="color-7-blur"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0.02 0"
            />
            <feOffset
              in="color-7-blur"
              result="layer-7-offsetted"
              dx="0"
              dy="64"
            />
            <feMerge>
              <feMergeNode in="layer-0-offsetted" />
              <feMergeNode in="layer-1-offsetted" />
              <feMergeNode in="layer-2-offsetted" />
              <feMergeNode in="layer-3-offsetted" />
              <feMergeNode in="layer-4-offsetted" />
              <feMergeNode in="layer-5-offsetted" />
              <feMergeNode in="layer-6-offsetted" />
              <feMergeNode in="layer-7-offsetted" />
              <feMergeNode in="layer-0-offsetted" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </section>
  );
}
