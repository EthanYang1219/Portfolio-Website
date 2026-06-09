import React from 'react';
import { Skill } from '../types';

interface SkillsMarqueeProps {
  onSkillClick?: (skillName: string) => void;
}

export default function SkillsMarquee({ onSkillClick }: SkillsMarqueeProps) {
  const skillsList: Skill[] = [
    { id: 'cpp', name: 'C++', category: 'Language', symbolId: 'ic-cpp' },
    { id: 'py', name: 'Python', category: 'Language', symbolId: 'ic-py' },
    { id: 'fusion', name: 'Fusion 360', category: 'CAD', symbolId: 'ic-fusion' },
    { id: 'onshape', name: 'Onshape', category: 'CAD', symbolId: 'ic-onshape' },
    { id: 'print3d', name: '3D printing', category: 'Fabrication', symbolId: 'ic-print3d' },
    { id: 'composite', name: 'Composite layup', category: 'Fabrication', symbolId: 'ic-composite' },
    { id: 'davinci', name: 'DaVinci Resolve', category: 'Video', symbolId: 'ic-davinci' },
    { id: 'docs', name: 'Engineering Docs', category: 'Docs', symbolId: 'ic-docs' },
    { id: 'mentor', name: 'Mentorship', category: 'Tooling', symbolId: 'ic-mentor' },
  ];

  const handleScrollToWork = (e: React.MouseEvent<HTMLAnchorElement>, skillName: string) => {
    e.preventDefault();
    if (onSkillClick) {
      onSkillClick(skillName);
    }
    const el = document.getElementById('work');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Inline vector logo definitions */}
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <symbol id="ic-cpp" viewBox="0 0 24 24">
            <rect width="24" height="24" rx="6" fill="#00599C" />
            <text x="12" y="15.6" textAnchor="middle" fontFamily="Arial,Helvetica,sans-serif" fontWeight="700" fontSize="7.4" fill="#fff">C++</text>
          </symbol>
          <symbol id="ic-py" viewBox="0 0 24 24">
            <rect width="24" height="24" rx="6" fill="#3776AB" />
            <text x="12" y="16" textAnchor="middle" fontFamily="Arial,Helvetica,sans-serif" fontWeight="700" fontSize="9.5" fill="#FFD43B">Py</text>
          </symbol>
          <symbol id="ic-fusion" viewBox="0 0 24 24">
            <rect width="24" height="24" rx="6" fill="#1A9E8F" />
            <g transform="translate(4.5 4.5) scale(.625)" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <path d="M3.3 7 12 12l8.7-5M12 22V12" />
            </g>
          </symbol>
          <symbol id="ic-onshape" viewBox="0 0 24 24">
            <rect width="24" height="24" rx="6" fill="#2A7DE1" />
            <g transform="translate(4.5 4.5) scale(.625)" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <path d="M3.3 7 12 12l8.7-5M12 22V12" />
            </g>
          </symbol>
          <symbol id="ic-print3d" viewBox="0 0 24 24">
            <rect width="24" height="24" rx="6" fill="#C85A32" />
            <g transform="translate(4.6 4.6) scale(.61)" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9V2h12v7" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </g>
          </symbol>
          <symbol id="ic-composite" viewBox="0 0 24 24">
            <rect width="24" height="24" rx="6" fill="#3A352E" />
            <g transform="translate(4.5 5) scale(.625)" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2 2 7l10 5 10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </g>
          </symbol>
          <symbol id="ic-davinci" viewBox="0 0 24 24">
            <rect width="24" height="24" rx="6" fill="#1B1B1F" />
            <circle cx="12" cy="12" r="6.4" fill="none" stroke="#16B7C9" strokeWidth="1.6" />
            <polygon points="10 8.6 16 12 10 15.4" fill="#F2792B" />
          </symbol>
          <symbol id="ic-docs" viewBox="0 0 24 24">
            <rect width="24" height="24" rx="6" fill="#5B6B7B" />
            <g transform="translate(4.8 4.5) scale(.62)" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path d="M9 13h6M9 17h6" />
            </g>
          </symbol>
          <symbol id="ic-mentor" viewBox="0 0 24 24">
            <rect width="24" height="24" rx="6" fill="#2E7D5B" />
            <g transform="translate(4.5 5.5) scale(.625)" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10 12 5 2 10l10 5 10-5z" />
              <path d="M6 12v5c3 2.5 9 2.5 12 0v-5" />
            </g>
          </symbol>
        </defs>
      </svg>

      <section className="pmarquee relative overflow-hidden py-10 border-t border-b border-hairline mt-12 bg-transparent select-none" aria-label="Skills ticker">
        <p className="pmarquee-label relative z-10 text-center mb-6 font-mono text-xs uppercase tracking-widest text-[#8a8170]">
          Skills · click to filter work dashboard <span className="text-accent ml-1 font-sans">↘</span>
        </p>
        
        {/* Infinite CSS row scrolling */}
        <div className="pmarquee-track flex gap-5 w-max">
          {/* First loop stack */}
          {skillsList.map((skill) => (
            <a
              key={skill.id}
              href="#work"
              onClick={(e) => handleScrollToWork(e, skill.name)}
              className="skill flex-none inline-flex items-center gap-3 py-3.5 px-6 border border-hairline rounded-full bg-paper hover:border-accent hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              data-cursor
            >
              <svg className="skill-ico w-5.5 h-5.5 flex-shrink-0" aria-hidden="true">
                <use href={`#${skill.symbolId}`} />
              </svg>
              <span className="skill-name font-display font-medium text-[1.2rem] text-ink leading-none">{skill.name}</span>
              <span className="skill-cat font-mono text-[0.62rem] uppercase tracking-widest text-ink-faint">{skill.category}</span>
            </a>
          ))}
          
          {/* Secondary duplicate copy stack for seamless wrapping loop */}
          {skillsList.map((skill) => (
            <a
              key={`${skill.id}-dup`}
              href="#work"
              onClick={(e) => handleScrollToWork(e, skill.name)}
              className="skill flex-none inline-flex items-center gap-3 py-3.5 px-6 border border-hairline rounded-full bg-paper hover:border-accent hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              aria-hidden="true"
              tabIndex={-1}
            >
              <svg className="skill-ico w-5.5 h-5.5 flex-shrink-0" aria-hidden="true">
                <use href={`#${skill.symbolId}`} />
              </svg>
              <span className="skill-name font-display font-medium text-[1.2rem] text-ink leading-none">{skill.name}</span>
              <span className="skill-cat font-mono text-[0.62rem] uppercase tracking-widest text-ink-faint">{skill.category}</span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
