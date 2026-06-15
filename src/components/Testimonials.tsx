import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote:
      'A short, specific quote about working with Ethan goes here — what he built, how he led, and the impact it had. Two or three sentences keeps it punchy.',
    name: 'Their Name',
    role: 'Parent · WPRA',
  },
  {
    quote:
      'A teammate or Formula Electric lead on Ethan’s engineering — the problem, his contribution, and the result. Specific beats generic every time.',
    name: 'Their Name',
    role: 'Lead · Waterloo Formula Electric',
  },
  {
    quote:
      'Working with Ethan has been a pleasure. ',
    name: 'Jun Ma',
    role: 'Teammate · VEX Robotics Team 604X',
  },
];

export default function Testimonials() {
  return (
    <section className="section py-20 bg-transparent" id="testimonials">
      <div className="w-full max-w-[var(--maxw)] mx-auto px-5 md:px-[var(--gutter)]">

        {/* Header */}
        <div className="section-head reveal mb-12">
          <span className="section-no">04 — In their words</span>
          <h2 className="h2 font-display text-[2.7rem] leading-none tracking-tight">
            What others <span className="text-accent italic font-normal">say.</span>
          </h2>
        </div>

        {/* Quote cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, idx) => (
            <motion.figure
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -80px 0px' }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col gap-5 bg-paper-raised border border-hairline rounded-2xl p-6 md:p-7 shadow-[0_18px_40px_-26px_rgba(0,0,0,0.22)] hover:border-accent/40 transition-colors"
            >
              <Quote className="w-7 h-7 text-accent/70 fill-accent/10" aria-hidden="true" />
              <blockquote className="flex-1 text-ink-soft text-[0.97rem] leading-relaxed font-sans">
                {t.quote}
              </blockquote>
              <figcaption className="flex flex-col gap-0.5 pt-1 border-t border-hairline-soft">
                <span className="font-display font-medium text-ink text-lg tracking-tight mt-3">{t.name}</span>
                <span className="font-mono text-[0.66rem] uppercase tracking-widest text-ink-faint">{t.role}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>

      </div>
    </section>
  );
}
