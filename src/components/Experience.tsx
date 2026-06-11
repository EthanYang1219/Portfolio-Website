import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Calendar, Building, Landmark } from 'lucide-react';
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

export default function Experience({ filteredSkill, onClearFilter }: ExperienceProps) {
  const experiencesList: ExpType[] = [
    {
      id: 'uwfe',
      role: 'Formula Electric — Chassis & Carbon',
      org: 'University of Waterloo (UWFE)',
      when: 'Sept 2025 – Present',
      desc: 'Designing, modeling, and fabricating safety-critical chassis components and composite layups (carbon fiber reinforced polymer, CFRP) for Waterloo\'s Formula SAE electric vehicle. Integrating finite element analyses (FEA) to confirm stiffness ratios and coordinating dimensional limits across suspension configurations.'
    },
    {
      id: 'wpra',
      role: 'Robotics Control Systems Instructor',
      org: 'Western Pacific Robotics Academy',
      when: 'Sept 2023 – Present',
      desc: 'Coached and instructed junior and senior secondary high school groups in mechanical layout strategies and C++ firmware. Taught odometry, integrated PID tracking systems, and managed machine shop facilities, which successfully expanded active tournament enrollment by over 60%.'
    },
    {
      id: 'vex',
      role: 'Team Captain & Mechanical Lead',
      org: 'VEX Robotics · Teams 604X / 886W',
      when: '2019 – 2025',
      desc: 'Directed structural fabrication and firmware designs across 6 national and international seasons. Captured over 40 design and excellence accolades, finished as a 2020 VEX Worlds Division Semifinalist (top 6.4% of 20,000+ teams), and qualified for the World Championships in every active season.'
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

        {/* Timeline Stack */}
        <div className="relative border-l border-hairline pl-6 md:pl-10 space-y-12 select-none">
          {experiencesList.map((exp, idx) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '0px 0px -100px 0px' }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`relative group pr-4 transition-all duration-400 ${
                filteredSkill && expMatchesSkill && !(experienceSkills[exp.id] ?? []).includes(filteredSkill)
                  ? 'opacity-30 saturate-50'
                  : ''
              }`}
            >
              {/* Timeline Connector node indicator */}
              <span className="absolute -left-[31px] md:-left-[47px] top-1.5 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full bg-paper border-2 border-hairline group-hover:border-accent transition-colors duration-350 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-ink-faint group-hover:bg-accent transition-colors" />
              </span>

              {/* Box */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                  <h3 className="font-display font-medium text-xl md:text-2xl text-ink tracking-tight group-hover:text-accent transition-colors">
                    {exp.role}
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
