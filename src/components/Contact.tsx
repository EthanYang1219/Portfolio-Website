import { motion } from 'motion/react';
import { Mail, Github, Linkedin, ArrowUpRight } from 'lucide-react';

export default function Contact() {
  const socials = [
    { label: 'GitHub', href: 'https://github.com/EthanYang1219', icon: <Github className="w-3.5 h-3.5" /> },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ethan-yang-9a29a633a/', icon: <Linkedin className="w-3.5 h-3.5" /> }
  ];

  return (
    <section className="finale pt-48 pb-28 text-center bg-transparent relative overflow-hidden" id="contact">
      {/* Dynamic Background Circle Accent */}
      <div 
        className="absolute -right-40 -bottom-40 w-96 h-96 rounded-full bg-accent-tint/10 blur-[80px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="w-full max-w-[var(--maxw)] mx-auto px-5 md:px-[var(--gutter)] flex flex-col items-center">
        
        {/* Dynamic Display Header */}
        <motion.h2 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -100px 0px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="h2 font-display text-[2.8rem] sm:text-[4.5vw] md:text-[5.4rem] leading-[1.05] tracking-tight text-ink max-w-[15ch] text-center select-none"
        >
          Let's make <em>something</em>{' '}
          <span className="text-accent block italic">
            SPECIAL
          </span>
        </motion.h2>

        <div className="finale-contact mt-10 md:mt-16 flex flex-col items-center gap-6">
          {/* Highlighted copy email click link */}
          <motion.a 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            href="mailto:e99yang@uwaterloo.ca" 
            className="contact-mail font-display text-2xl sm:text-[4vw] md:text-[3.2rem] text-ink hover:text-accent font-semibold tracking-tight relative pb-1 overflow-hidden select-all after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:scale-x-0 hover:after:scale-x-100 after:h-[2px] after:bg-accent after:transition-all after:duration-400"
            data-cursor
          >
            e99yang@uwaterloo.ca
          </motion.a>

          {/* Social media connections */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="socials flex flex-wrap gap-4 justify-center items-center mt-6"
          >
            {socials.map((soc) => (
              <a
                key={soc.label}
                href={soc.href}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-ink-soft hover:text-accent transition-colors py-2 px-4 border border-hairline hover:border-accent rounded-full bg-paper"
                data-cursor
              >
                {soc.icon}
                <span>{soc.label}</span>
                <ArrowUpRight className="w-3 h-3 text-ink-faint group-hover:text-accent" />
              </a>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
