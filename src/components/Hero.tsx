import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tagIdx, setTagIdx] = useState(0);

  const tags = ['Leading', 'Building', 'Coding', 'Creating', 'Learning'];

  // Infinite ticker for words
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const interval = setInterval(() => {
      setTagIdx((prev) => (prev + 1) % tags.length);
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  // Hardware-accelerated scroll tracking for name zoom/reveal
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  // Adjust transition ranges for scroll trigger
  const nameScale = useTransform(scrollYProgress, [0, 0.45], [1, 0.38]);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0.15]);
  const bottomTranslateY = useTransform(scrollYProgress, [0, 0.35], [0, 20]);
  const bottomOpacity = useTransform(scrollYProgress, [0, 0.30], [1, 0]);

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
      <div className="hero-sticky sticky top-0 h-[100svh] overflow-hidden grid grid-rows-[auto_1fr_auto] items-center gap-6 pt-28 pb-10 px-5 md:px-[var(--gutter)]">
        
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
          <p className="hero-tagline font-sans font-semibold text-2xl md:text-3xl tracking-wide uppercase text-ink-soft select-none flex items-center justify-center gap-2">
            I enjoy&nbsp;
            <span className="relative inline-block h-[1.3em] overflow-hidden align-middle w-[150px] md:w-[180px] text-left">
              {tags.map((tag, idx) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, y: '100%', rotateX: -60 }}
                  animate={
                    idx === tagIdx
                      ? { opacity: 1, y: 0, rotateX: 0 }
                      : idx < tagIdx || (tagIdx === 0 && idx === tags.length - 1)
                      ? { opacity: 0, y: '-100%', rotateX: 60 }
                      : { opacity: 0, y: '100%', rotateX: -60 }
                  }
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-0 top-0 w-full h-full text-accent font-bold italic block origin-left select-none"
                >
                  {tag}
                </motion.span>
              ))}
            </span>
          </p>
        </motion.div>

        {/* Center: Giant Display Name Parallax Zoom (Scroll Driven) */}
        <motion.div 
          style={{ opacity: nameOpacity, scale: nameScale }}
          className="hero-center relative z-10 flex items-center justify-center pointer-events-none"
        >
          <div className="hero-name-wrap select-none">
            <h1 className="hero-name font-display font-bold leading-[0.8] letter-spacing-tight uppercase text-center" aria-label="Ethan Yang">
              <span className="name-line block text-[4.8rem] sm:text-[8vw] md:text-[11vw] tracking-tight text-ink drop-shadow-[0_4px_24px_rgba(var(--paper-rgb),0.75)]">
                ETHAN
              </span>
              <span className="name-line accent block text-[4.8rem] sm:text-[8vw] md:text-[11vw] tracking-tight text-accent italic font-normal drop-shadow-[0_4px_24px_rgba(var(--paper-rgb),0.75)]">
                YANG
              </span>
            </h1>
          </div>
        </motion.div>

        {/* Bottom: Floating actions */}
        <motion.div 
          style={{ translateY: bottomTranslateY, opacity: bottomOpacity }}
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
        </motion.div>

      </div>
    </section>
  );
}
