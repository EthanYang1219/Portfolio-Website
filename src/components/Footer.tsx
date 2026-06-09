import React from 'react';
import { ArrowUp, FileDown } from 'lucide-react';
import { generateResumePDF } from '../lib/pdfGenerator';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadPDF = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    generateResumePDF();
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

        {/* Dynamic PDF resume generator trigger */}
        <button
          onClick={handleDownloadPDF}
          className="resume-download inline-flex items-center gap-1.5 text-accent hover:text-accent-deep border border-accent/20 hover:border-accent/60 py-1.5 px-4 rounded-full font-mono text-[0.72rem] font-bold transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer select-none bg-paper/40 shadow-sm"
          data-cursor
          title="Generate print-ready resume PDF of Ethan Yang"
        >
          <FileDown className="w-3.5 h-3.5 animate-pulse" />
          <span>Download Resume</span>
        </button>

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
