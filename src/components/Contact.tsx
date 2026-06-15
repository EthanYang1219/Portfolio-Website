import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Github, Linkedin, ArrowUpRight, Send } from 'lucide-react';

// ⚠️ Get a free access key at https://web3forms.com (enter your email, no
// account needed) and paste it here. It's a public key — safe to commit.
const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus('submitting');
    setErrorMsg('');

    const data = new FormData(form);
    data.append('access_key', WEB3FORMS_ACCESS_KEY);
    data.append('subject', 'New message from your portfolio');
    data.append('from_name', 'Portfolio contact form');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      const json = await res.json();
      if (json.success) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
        setErrorMsg(json.message || 'Something went wrong — please email me directly.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error — please email me directly.');
    }
  };

  const socials = [
    { label: 'GitHub', href: 'https://github.com/EthanYang1219', icon: <Github className="w-3.5 h-3.5" /> },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ethan-yang-9a29a633a/', icon: <Linkedin className="w-3.5 h-3.5" /> }
  ];

  return (
    <section className="finale pt-48 md:pt-[50vh] pb-28 text-center bg-transparent relative overflow-hidden" id="contact">
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

          {/* Contact form (Web3Forms — static, no server) */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="contact-form w-full max-w-xl mx-auto mt-14 flex flex-col gap-4 text-left"
          >
            {/* honeypot — hidden from people, catches bots */}
            <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="cf-name" className="font-mono text-[0.66rem] uppercase tracking-widest text-ink-faint">Name</label>
                <input
                  id="cf-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Your name"
                  className="w-full bg-paper-raised border border-hairline focus:border-accent rounded-xl px-4 py-3 text-ink text-sm placeholder:text-ink-faint font-sans outline-none focus:ring-2 focus:ring-accent/25 transition-colors"
                  data-cursor
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="cf-email" className="font-mono text-[0.66rem] uppercase tracking-widest text-ink-faint">Email</label>
                <input
                  id="cf-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@email.com"
                  className="w-full bg-paper-raised border border-hairline focus:border-accent rounded-xl px-4 py-3 text-ink text-sm placeholder:text-ink-faint font-sans outline-none focus:ring-2 focus:ring-accent/25 transition-colors"
                  data-cursor
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="cf-message" className="font-mono text-[0.66rem] uppercase tracking-widest text-ink-faint">Message</label>
              <textarea
                id="cf-message"
                name="message"
                required
                rows={4}
                placeholder="What would you like to build, ask, or talk about?"
                className="w-full bg-paper-raised border border-hairline focus:border-accent rounded-xl px-4 py-3 text-ink text-sm placeholder:text-ink-faint font-sans outline-none focus:ring-2 focus:ring-accent/25 transition-colors resize-none"
                data-cursor
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-1">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="inline-flex items-center justify-center gap-2 bg-ink text-paper border border-ink py-3.5 px-7 rounded-full font-semibold text-[0.92rem] hover:bg-accent-deep hover:border-accent-deep hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait disabled:translate-y-0"
                data-cursor
              >
                {status === 'submitting' ? 'Sending…' : 'Send message'}
                <Send className="w-4 h-4" />
              </button>
              <p aria-live="polite" className="font-mono text-xs tracking-wide">
                {status === 'success' && (
                  <span className="text-accent font-semibold">Thanks — I'll get back to you soon.</span>
                )}
                {status === 'error' && <span className="text-[#c0392b]">{errorMsg}</span>}
              </p>
            </div>
          </motion.form>
        </div>

      </div>
    </section>
  );
}
