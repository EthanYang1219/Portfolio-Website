import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Award, Compass, ArrowRight, Database, Code, Target, Landmark, Quote } from 'lucide-react';
import profileImg from '../assets/images/profile.jpg';

export default function About() {
  const [showModules, setShowModules] = useState(false);
  const [activeTab, setActiveTab] = useState<'physics' | 'robotics'>('physics');

  const physicsModules = [
    { code: 'MATH 137/138', title: 'Calculus I & II for Honors', desc: 'Vector slopes, integration limits, taylor approximations, sequences.' },
    { code: 'PHYS 121/122', title: 'Honors Mechanics & Electromagnetism', desc: 'Newtonian systems, simple harmonic motion, Maxwell\'s equations in vector profiles.' },
    { code: 'MATH 235', title: 'Honors Linear Algebra I', desc: 'Eigenvalues, vector spaces, matrix factorization, transformations.' },
    { code: 'MATH 237', title: 'Honors Calculus III (Vector Calculus)', desc: 'Partial differentials, line/surface integrals, Stokes\' and Green\'s theorems.' },
    { code: 'AMATH 250', title: 'Honors Ordinary Differential Equations', desc: 'First/second-order systems, laplace matrices, modeling dynamical engineering loops.' }
  ];

  const roboticsFrameworks = [
    { title: 'Controls Theory', desc: 'Proportional-Integral-Derivative (PID) correction loops, encoder feedback odometry models, acceleration profiles.' },
    { title: 'CAD Modeling', desc: 'Autodesk Fusion 360, Onshape, SolidWorks. Mechanical stresses, assembly mates, tolerancing for composite layouts.' },
    { title: 'Advanced Machining', desc: 'Manual mills, lathes, composite layups (Carbon CFRP), vacuum bagging, 3D printing configurations.' },
    { title: 'Mentorship Strategy', desc: 'Guided 30+ regional youths in structural debugging, logical loops, and digital tournament documentation.' }
  ];

  return (
    <section className="section bg-transparent" id="about">
      <div className="w-full max-w-[var(--maxw)] mx-auto px-5 md:px-[var(--gutter)]">
        
        {/* Header */}
        <div className="section-head reveal">
          <span className="section-no">03 — About</span>
        </div>

        {/* Modular Grid */}
        <div className="about-min-grid grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-[5rem] items-center">
          
          {/* Left panel: Floating Profile photo over sienna-colored circular frame */}
          <div className="about-portrait relative flex items-center justify-center min-h-[340px] md:min-h-[460px] select-none">
            {/* Soft terracotta circular framework backdrop */}
            <div 
              className="about-circle absolute w-[240px] sm:w-[320px] md:w-[410px] aspect-square rounded-full bg-[#C85A32] shadow-[inset_0_4px_30px_rgba(0,0,0,0.15)] -z-10"
              aria-hidden="true"
            />
            
            {/* Floating Photo Container with rounded corners */}
            <div className="about-photo w-[200px] sm:w-[260px] md:w-[320px] aspect-[4/5] rounded-3xl overflow-hidden border border-hairline bg-paper shadow-[0_30px_60px_-24px_rgba(0,0,0,0.3)] transition-all duration-500 hover:scale-[1.02]">
              <img 
                src={profileImg}
                alt="Ethan Yang portrait"
                className="w-full h-full object-cover object-center scale-102"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Gracefully swap to an elegant monogram graphic if the image is missing
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.classList.add('flex', 'items-center', 'justify-center', 'bg-gradient-to-br', 'from-paper-raised', 'to-hairline');
                    const textNode = document.createElement('div');
                    textNode.className = 'font-display italic text-8xl text-ink font-semibold opacity-30';
                    textNode.textContent = 'EY';
                    parent.appendChild(textNode);
                  }
                }}
              />
            </div>
          </div>

          {/* Right panel: Information details */}
          <div className="about-text flex flex-col items-start gap-5 font-sans">
            <div className="flex flex-col gap-1.5">
              <h3 className="about-id-name font-display font-medium text-3xl sm:text-4.5xl text-ink tracking-tight">
                Ethan Yang
              </h3>
              <span className="font-mono text-xs uppercase tracking-widest text-[#8a8170] flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-accent" /> 2nd-Yr Mathematical Physics · University of Waterloo
              </span>
            </div>

            {/* Custom quote block */}
            <p className="about-lead font-display font-light text-2xl md:text-[1.95rem] leading-snug tracking-tight text-ink max-w-[28ch] border-l-2 border-accent pl-4 py-1 italic select-none">
              I'm happiest with{' '}
              <span className="text-accent font-normal">
                a half-finished idea
              </span>{' '}
              and a deadline I set too optimistically.
            </p>

            <div className="about-body space-y-4 text-ink-soft text-[0.96rem] leading-relaxed max-w-[62ch]">
              <p>
                I'm a second-year Mathematical Physics student at the University of Waterloo. After spending six years immersed in competitive robotics, moving from VEX team captain to coaching the next generation of competitors, I'm now contributing as part of Waterloo's Formula Electric chassis team.
              </p>
              <p>
                I thrive on multi-disciplinary projects — bridging the gap between software optimization, dynamic physics hardware, and technical communication. To me, great engineering means sweating the fine details and enjoying the problem-solving cycle just as much as the end-product.
              </p>
            </div>

            {/* Academic curriculum drawer toggle trigger (Vastly improves Point of View) */}
            <button
              onClick={() => setShowModules(!showModules)}
              className="about-readmore inline-flex items-center gap-2 mt-[1rem] font-mono text-[0.82rem] tracking-wider uppercase text-ink hover:text-accent border-b border-accent pb-1 font-semibold transition-all cursor-pointer select-none"
              data-cursor
            >
              {showModules ? 'Hide curriculum profiles' : 'View curriculum modules'} <ArrowRight className={`w-3.5 h-3.5 transition-transform ${showModules ? 'rotate-90' : 'rotate-0'}`} />
            </button>

            {/* Interactive Module Accordions */}
            <AnimatePresence>
              {showModules && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full max-w-[560px] overflow-hidden mt-4 border border-hairline rounded-2xl bg-paper-raised p-4 md:p-5 shadow-sm"
                >
                  <div className="flex border-b border-hairline pb-3 mb-4 gap-4">
                    <button
                      onClick={() => setActiveTab('physics')}
                      className={`font-mono text-xs uppercase tracking-wider pb-1 cursor-pointer transition-colors ${
                        activeTab === 'physics' ? 'text-accent border-b-2 border-accent font-bold' : 'text-ink-faint hover:text-ink'
                      }`}
                    >
                      University Modules
                    </button>
                    <button
                      onClick={() => setActiveTab('robotics')}
                      className={`font-mono text-xs uppercase tracking-wider pb-1 cursor-pointer transition-colors ${
                        activeTab === 'robotics' ? 'text-accent border-b-2 border-accent font-bold' : 'text-ink-faint hover:text-ink'
                      }`}
                    >
                      Technical Skillsets
                    </button>
                  </div>

                  <div className="space-y-3.5 max-h-[240px] overflow-y-auto scroller pr-1 leading-relaxed">
                    {activeTab === 'physics'
                      ? physicsModules.map((mod) => (
                          <div key={mod.code} className="group border-b border-hairline-soft pb-2.5 last:border-0">
                            <span className="font-mono text-[0.68rem] font-medium text-accent tracking-widest uppercase block">{mod.code}</span>
                            <h4 className="text-xs font-semibold text-ink tracking-tight mt-0.5">{mod.title}</h4>
                            <p className="text-[0.82rem] text-ink-soft mt-1 leading-relaxed">{mod.desc}</p>
                          </div>
                        ))
                      : roboticsFrameworks.map((mod) => (
                          <div key={mod.title} className="group border-b border-hairline-soft pb-2.5 last:border-0">
                            <h4 className="text-xs font-semibold text-ink tracking-tight">{mod.title}</h4>
                            <p className="text-[0.82rem] text-ink-soft mt-1 leading-relaxed">{mod.desc}</p>
                          </div>
                        ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>
    </section>
  );
}
