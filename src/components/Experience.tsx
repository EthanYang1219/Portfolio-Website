import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Landmark, ArrowUpRight } from 'lucide-react';
import { Experience as ExpType } from '../types';

interface ExperienceProps {
  filteredSkill?: string | null;
  onClearFilter?: () => void;
}

// Skills from the ticker that map to experience entries rather than projects:
// composite layup / 3D printing come from Formula Electric, mentorship from WPRA
const experienceSkills: Record<string, string[]> = {
  uwfe: ['Composite layup', '3D printing'],
  wpra: ['Mentorship'],
  vex: [],
};

// Org websites — clicking a role title opens the team/program site in a new tab
const experienceLinks: Record<string, string> = {
  uwfe: 'https://www.uwfsae.ca/',
  wpra: 'https://orionwpra.ca/',
};

export default function Experience({ filteredSkill, onClearFilter }: ExperienceProps) {
  const experiencesList: ExpType[] = [
    {
      id: 'uwfe',
      role: 'Formula Electric — Chassis Subteam',
      org: 'University of Waterloo (UWFE)',
      when: 'Sept 2025 – Present',
      desc: 'Design, prototype, and fabricate safety-critical structural chassis components for the Formula SAE vehicle using CAD modelling, precision machining, and composite layup techniques. Collaborate cross-functionally with engineering leads across multiple subsystems to implement performance-driven design improvements and ensure track reliability'
    },
    {
      id: 'wpra',
      role: 'Robotics Instructor',
      org: 'Western Pacific Robotics Academy',
      when: 'Sept 2023 – Present',
      desc: 'Coached and mentored junior and senior high school competitors on core VEX robotics concepts, including CAD design, C++ programming, and control system troubleshooting. Managed workshop drop-in sessions and spearheaded parent/customer communications, driving a 60% increase in active membership enrollment.'
    },
    {
      id: 'vex',
      role: 'Team Captain & Mechanical Lead',
      org: 'VEX Robotics · Teams 604X / 886W',
      when: '2019 – 2025',
      desc: 'Captained a multidisciplinary team through 6 competitive seasons, directing the mechanical design, prototyping, and firmware layout for VEX V5 robots. Secured over 40 accolades for engineering excellence, and finished as a 2020 VEX Worlds Division Finalist (top 0.4% globally), and scaled WPRA into a top-ranked regional academy managing 15+ active teams.'
    }
  ];

  // True when the active filter is one of the experience-mapped skills
  const expMatchesSkill = filteredSkill
    ? Object.values(experienceSkills).some((skills) => skills.includes(filteredSkill))
    : false;

  return (
    <section className="section py-20 bg-transparent" id="experience">
      <div className="w-full max-w-[var(--maxw)] mx-auto px-5 md:px-[var(--gutter)]">

        {/* Shared column, left-aligned to the container edge so the section
            starts parallel with Selected Work */}
        <div className="max-w-3xl">

        {/* Header */}
        <div className="section-head reveal mb-16">
          <span className="section-no">02 — Experience</span>
          <h2 className="h2 font-display text-[2.7rem] leading-none tracking-tight">
            Where I've <span className="text-accent italic font-normal">built, led,</span> and taught.
          </h2>
        </div>

        {/* Active skill filter chip */}
        <AnimatePresence>
          {filteredSkill && expMatchesSkill && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2.5 mb-6 font-mono text-xs uppercase tracking-wider text-ink-soft"
            >
              Showing: <span className="text-accent font-semibold">{filteredSkill}</span>
              <button
                onClick={onClearFilter}
                className="inline-flex items-center gap-1 text-ink-faint hover:text-accent border border-hairline hover:border-accent rounded-full px-2.5 py-0.5 transition-colors cursor-pointer"
                data-cursor
              >
                ✕ clear
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timeline Stack — the left padding lives on each item (not the
            container) so the nodes, positioned relative to their item, land
            exactly on the rail. */}
        <div className="relative space-y-12 select-none">
          {/* Elegant vertical rail: a hairline that dissolves at both ends */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-[7px] md:left-[9px] top-1 bottom-1 w-px bg-gradient-to-b from-transparent via-hairline to-transparent"
          />
          {experiencesList.map((exp, idx) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '0px 0px -100px 0px' }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`relative group pl-8 md:pl-12 pr-4 transition-all duration-400 ${
                filteredSkill && expMatchesSkill && !(experienceSkills[exp.id] ?? []).includes(filteredSkill)
                  ? 'opacity-30 saturate-50'
                  : ''
              }`}
            >
              {/* Node — centered on the rail (left == rail x, -translate-x-1/2),
                  paper ring keeps a clean gap, fills with accent on hover */}
              <span className="absolute left-[7px] md:left-[9px] top-[0.55rem] -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-hairline ring-4 ring-paper group-hover:bg-accent group-hover:scale-110 transition-all duration-300" />

              {/* Box */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                  <h3 className="font-display font-medium text-xl md:text-2xl text-ink tracking-tight group-hover:text-accent transition-colors">
                    {experienceLinks[exp.id] ? (
                      <a
                        href={experienceLinks[exp.id]}
                        target="_blank"
                        rel="noopener"
                        className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
                        data-cursor
                      >
                        {exp.role}
                        <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </a>
                    ) : (
                      exp.role
                    )}
                  </h3>
                  <span className="font-mono text-xs text-ink-faint flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {exp.when}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs uppercase font-semibold text-accent-text tracking-wider mb-2">
                  <Landmark className="w-3.5 h-3.5" /> {exp.org}
                </div>

                <p className="text-ink-soft text-[0.93rem] leading-relaxed max-w-4xl font-sans">
                  {exp.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        </div>

      </div>
    </section>
  );
}
