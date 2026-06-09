import React from 'react';
import { ArrowUp } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer border-t border-hairline py-8 mt-12 bg-transparent select-none">
      <div className="w-full max-w-[var(--maxw)] mx-auto px-5 md:px-[var(--gutter)] flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-between font-mono text-[0.74rem] text-ink-faint tracking-wider uppercase">
        
        {/* Credits */}
        <span>
          © {currentYear} Ethan Yang — built from scratch, no templates, referencing{' '}
          <a
            href="https://21st.dev/community/components"
            target="_blank"
            rel="noopener"
            className="text-ink hover:text-accent font-semibold transition-colors decoration-hairline hover:decoration-accent underline underline-offset-3"
            data-cursor
          >
            21st.dev ↗
          </a>
        </span>

        {/* Anchor link */}
        <a
          href="#top"
          onClick={handleScrollToTop}
          className="to-top inline-flex items-center gap-1.5 text-ink hover:text-accent font-semibold transition-colors"
          data-cursor
        >
          Back to top <ArrowUp className="w-3.5 h-3.5" />
        </a>

      </div>
    </footer>
  );
}
