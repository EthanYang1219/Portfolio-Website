import type { ReactElement } from 'react';
import { Quote, Linkedin } from 'lucide-react';

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  // Optional — a LinkedIn icon renders only when a URL is provided.
  linkedin?: string;
};

// ⚠️ Two of these are still PLACEHOLDERS — swap in real quotes (and add a
// `linkedin` URL to show the LinkedIn icon for that person).
const testimonials: Testimonial[] = [
  {
    quote:'For the eight years I have known Ethan, he has always been a diligent, outgoing, and personable friend whom I can depend on. I have many cherished memories together with him, but what stands out to me the most is his honesty and willingness to learn. While I may not necessarily see him in an academic/engineering context, his discipline, reliability, and curiosity make him a valued member of any team he is a part of.',
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
    quote: 'Working with Ethan has been a pleasure.',
    name: 'Jun Ma',
    role: 'Teammate, VEX Robotics Team 604X',
  },
];

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

const renderCard = (t: Testimonial, key: string, dup = false): ReactElement => (
  <figure
    key={key}
    aria-hidden={dup || undefined}
    className={`${dup ? 'tmarquee-dup ' : ''}flex flex-col gap-5 bg-paper-raised border border-hairline rounded-2xl p-6 md:p-7 shadow-[0_18px_40px_-26px_rgba(0,0,0,0.22)]`}
  >
    <Quote className="w-7 h-7 text-accent/70 fill-accent/10" aria-hidden="true" />
    <blockquote className="text-ink-soft text-[0.95rem] leading-relaxed font-sans">
      {t.quote}
    </blockquote>
    <figcaption className="flex items-center gap-3 pt-4 border-t border-hairline-soft">
      <span className="h-10 w-10 shrink-0 rounded-full bg-accent-tint border border-accent/25 text-accent font-display font-semibold text-sm flex items-center justify-center">
        {initials(t.name)}
      </span>
      <div className="flex flex-col min-w-0">
        <span className="font-display font-medium text-ink text-base leading-5 tracking-tight truncate">{t.name}</span>
        <span className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint truncate">{t.role}</span>
      </div>
      {t.linkedin && (
        <a
          href={t.linkedin}
          target="_blank"
          rel="noopener"
          aria-label={`${t.name} on LinkedIn`}
          className="ml-auto text-ink-faint hover:text-accent transition-colors"
          data-cursor
        >
          <Linkedin className="w-4 h-4" />
        </a>
      )}
    </figcaption>
  </figure>
);

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

        {/* Single auto-scrolling column — pauses on hover, fades top/bottom */}
        <div className="tmarquee-group tmarquee-mask relative mx-auto w-full max-w-sm max-h-[460px] overflow-hidden">
          <div className="tmarquee-track flex flex-col gap-6">
            {testimonials.map((t, i) => renderCard(t, `a-${i}`))}
            {testimonials.map((t, i) => renderCard(t, `b-${i}`, true))}
          </div>
        </div>

      </div>
    </section>
  );
}
