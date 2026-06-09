import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  currentSection: string;
}

export default function Header({ currentSection }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Scroll detection
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Theme initialization
    const theme = localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    const darkState = theme === 'dark';
    setIsDark(darkState);
    if (darkState) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const navLinks = [
    { label: 'Home', href: '#top', idx: '00' },
    { label: 'Work', href: '#work', idx: '01' },
    { label: 'Experience', href: '#experience', idx: '02' },
    { label: 'About', href: '#about', idx: '03' },
    { label: 'Contact', href: '#contact', idx: '04' },
    { label: 'RÉSUMÉ', href: '#', isResume: true, idx: '05' },
  ];

  return (
    <>
      <header
        className={`nav fixed top-0 inset-x-0 z-50 transition-[background-color,border-color] duration-500 border-b ${
          isScrolled
            ? 'bg-paper/80 backdrop-blur-xl border-hairline'
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="w-full max-w-[var(--maxw)] mx-auto px-5 md:px-[var(--gutter)] py-4 flex items-center justify-between">
          
          {/* Menu button */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="icon-btn inline-flex items-center justify-center w-11 h-11 rounded-xl text-ink-soft hover:text-ink hover:bg-accent-tint transition-all cursor-pointer select-none"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMenuOpen}
              data-cursor
            >
              {isMenuOpen ? <X className="w-6 h-6 animate-in fade-in-50 duration-200" /> : <Menu className="w-6 h-6" />}
            </button>
            
            {/* Dropdown Menu Panel */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.nav
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-[calc(100%+0.5rem)] left-0 min-w-[240px] bg-paper-raised border border-hairline rounded-2xl p-2.5 shadow-[0_28px_60px_-26px_rgba(0,0,0,0.3)] dark:shadow-[0_28px_60px_-26px_rgba(0,0,0,0.7)] z-[120]"
                >
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => {
                        if (link.isResume) {
                          e.preventDefault();
                          const el = document.getElementById('contact');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }
                        setIsMenuOpen(false);
                      }}
                      className={`flex items-center gap-[0.9rem] font-display font-medium text-lg tracking-tight px-3 py-2 rounded-xl text-ink hover:text-accent hover:bg-accent-tint hover:pl-4 transition-all ${
                        currentSection === link.href.replace('#', '') ? 'text-accent' : ''
                      }`}
                      data-cursor
                    >
                      <span className="font-mono text-[0.6rem] text-ink-faint tracking-widest">{link.idx}</span>
                      {link.label}
                    </a>
                  ))}
                </motion.nav>
              )}
            </AnimatePresence>
          </div>

          {/* Signature Brand Centered */}
          <a
            href="#top"
            className="signature font-display italic font-semibold text-[1.65rem] tracking-tight text-ink hover:text-accent transition-colors"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            data-cursor
          >
            EY
          </a>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="theme-toggle relative w-[58px] h-[30px] rounded-full bg-hairline border border-hairline-soft cursor-pointer transition-colors"
            role="switch"
            aria-label="Toggle visual theme mode"
            aria-checked={isDark}
            data-cursor
          >
            <motion.span
              animate={{ x: isDark ? 28 : 2 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="absolute top-[2px] left-[2px] w-6 h-6 rounded-full bg-ink flex items-center justify-center shadow-sm"
            >
              {isDark ? (
                <Moon className="w-3.5 h-3.5 text-[#f4f0e6]" fill="currentColor" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-[#f4f0e6]" />
              )}
            </motion.span>
          </button>
        </div>
      </header>
    </>
  );
}
