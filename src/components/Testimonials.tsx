import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote:'For the eight years I've known Ethan, he's always been a diligent, outgoing, and personable friend whom I can depend on. I have many cherished memories together with him, but what stands out to me the most is his honesty and willingness to learn. While I may not necessarily see him in an academic/engineering context, his discipline, reliability, and curiosity make him a valued member of any team he is a part of.',
    name: 'Raymond Feng',
    role: 'Undergraduate Anatomy and Cell Biology Student at McGill University',
  },
  {
    quote:
      'Never worked together, but I can tell that Ethan has a thing for seeing and expressing appreciation for the skills he sees in others. In a workplace that’ll translate to being very analytical. Also a goat.',
    name: 'Steven Zhang',
    role: 'Family Friend',
  },
  {
    quote:
      'Working with Ethan has been a pleasure. ',
    name: 'Jun Ma',
    role: 'Teammate, VEX Robotics Team 604X',
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
