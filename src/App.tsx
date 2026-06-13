import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import Header from './components/Header';
import Hero from './components/Hero';
import SelectedWork from './components/SelectedWork';
import Experience from './components/Experience';
import About from './components/About';
import SkillsMarquee from './components/SkillsMarquee';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ShaderBackground from './components/ShaderBackground';

export default function App() {
  const [currentSection, setCurrentSection] = useState('top');
  const [activeFilteredSkill, setActiveFilteredSkill] = useState<string | null>(null);

  // Monitor scrolling to highlight correct headers (Invisible expensive items - checklist 08)
  useEffect(() => {
    const handleScrollIntersection = () => {
      const sections = ['hero', 'work', 'experience', 'about', 'contact'];
      const viewportHeight = window.innerHeight;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Highlight section when it occupies the majority of the top viewport bounds
          if (rect.top <= viewportHeight * 0.4 && rect.bottom >= viewportHeight * 0.3) {
            setCurrentSection(sectionId);
            break;
          }
        }
      }
    };

    // rAF-throttle: the handler reads layout (getBoundingClientRect) for five
    // sections, so coalesce scroll events to at most one read per frame
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        handleScrollIntersection();
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScrollIntersection();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Skills that belong to the Experience timeline rather than a project
  // (Composite layup + Mentorship come from Formula Electric / WPRA work)
  const experienceOnlySkills = ['Composite layup', 'Mentorship'];

  // Connect Skills marquee triggers to the work dashboard or experience timeline
  const handleSkillClick = (skillName: string) => {
    // Clicking the active skill again clears the filter
    if (activeFilteredSkill === skillName) {
      setActiveFilteredSkill(null);
      return;
    }
    setActiveFilteredSkill(skillName);

    // Experience-only skills scroll to the timeline instead of the dashboard
    const targetSection = experienceOnlySkills.includes(skillName) ? 'experience' : 'work';
    document.getElementById(targetSection)?.scrollIntoView({ behavior: 'smooth' });
    if (targetSection === 'experience') return;

    // Open the matching project's inline description in SelectedWork
    setTimeout(() => {
      let targetProjIdx = 0; // default to python
      const normalName = skillName.toLowerCase();

      if (normalName.includes('cpp') || normalName.includes('c++') || normalName.includes('pid') || normalName.includes('odometry')) {
        targetProjIdx = 2; // PID and Odometry
      } else if (normalName.includes('fusion') || normalName.includes('onshape') || normalName.includes('docs') || normalName.includes('notebook')) {
        targetProjIdx = 4; // VEX Engineering Notebook
      } else if (normalName.includes('resolve') || normalName.includes('davinci') || normalName.includes('video')) {
        targetProjIdx = 3; // F1 Safety Video
      } else if (normalName.includes('climb') || normalName.includes('delta') || normalName.includes('full-stack') || normalName.includes('print')) {
        targetProjIdx = 1; // DeltaV Climbing Companion (also tagged 3D printing)
      }

      // Simulate hovering or tapping on list items inside SelectedWork
      const listItems = document.querySelectorAll('.hw-item');
      if (listItems && listItems[targetProjIdx]) {
        const link = listItems[targetProjIdx].querySelector('.hw-link') as HTMLElement;
        if (link) {
          link.click();
        }
      }
    }, 150);
  };

  return (
    <>
      {/* Full-Page Interactive WebGL shader (Behind all nodes) */}
      <ShaderBackground />

      {/* Content wrapper with correct flow */}
      <Header currentSection={currentSection} />

      <main className="relative z-10 w-full flex flex-col overflow-x-clip">
        {/* Landing viewport */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Hero />
        </motion.div>

        {/* Selected Projects with real control theory simulations */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <SelectedWork filteredSkill={activeFilteredSkill} onClearFilter={() => setActiveFilteredSkill(null)} />
        </motion.div>

        {/* Technical timeline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Experience filteredSkill={activeFilteredSkill} onClearFilter={() => setActiveFilteredSkill(null)} />
        </motion.div>

        {/* Biography spotlight with credentials curricula drawer */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <About />
        </motion.div>

        {/* Skills endless marquee (Positioned beautifully as a divider before finale) */}
        <SkillsMarquee onSkillClick={handleSkillClick} />

        {/* Contact sheet */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Contact />
        </motion.div>
      </main>

      {/* Global SVG filter definitions for the illuminated glow text effect */}
      <svg
        className="fixed opacity-0 pointer-events-none -z-50 h-0 w-0"
        width="0"
        height="0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter
            id="glow-4"
            colorInterpolationFilters="sRGB"
            x="-100%"
            y="-400%"
            width="300%"
            height="900%"
          >
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="4"
              result="blur4"
            />
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="19"
              result="blur19"
            />
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="9"
              result="blur9"
            />
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="30"
              result="blur30"
            />
            <feColorMatrix
              in="blur4"
              result="color-0-blur"
              type="matrix"
              values="1 0 0 0 0
                      0 0.9803921568627451 0 0 0
                      0 0 0.9647058823529412 0 0
                      0 0 0 0.20 0"
            />
            <feOffset
              in="color-0-blur"
              result="layer-0-offsetted"
              dx="0"
              dy="0"
            />
            <feColorMatrix
              in="blur19"
              result="color-1-blur"
              type="matrix"
              values="0.8156862745098039 0 0 0 0
                      0 0.49411764705882355 0 0 0
                      0 0 0.2627450980392157 0 0
                      0 0 0 0.12 0"
            />
            <feOffset
              in="color-1-blur"
              result="layer-1-offsetted"
              dx="0"
              dy="2"
            />
            <feColorMatrix
              in="blur9"
              result="color-2-blur"
              type="matrix"
              values="1 0 0 0 0
                      0 0.6666666666666666 0 0 0
                      0 0 0.36470588235294116 0 0
                      0 0 0 0.15 0"
            />
            <feOffset
              in="color-2-blur"
              result="layer-2-offsetted"
              dx="0"
              dy="2"
            />
            <feColorMatrix
              in="blur30"
              result="color-3-blur"
              type="matrix"
              values="1 0 0 0 0
                      0 0.611764705882353 0 0 0
                      0 0 0.39215686274509803 0 0
                      0 0 0 0.10 0"
            />
            <feOffset
              in="color-3-blur"
              result="layer-3-offsetted"
              dx="0"
              dy="2"
            />
            <feColorMatrix
              in="blur30"
              result="color-4-blur"
              type="matrix"
              values="0.4549019607843137 0 0 0 0
                      0 0.16470588235294117 0 0 0
                      0 0 0 0 0
                      0 0 0 0.08 0"
            />
            <feOffset
              in="color-4-blur"
              result="layer-4-offsetted"
              dx="0"
              dy="16"
            />
            <feColorMatrix
              in="blur30"
              result="color-5-blur"
              type="matrix"
              values="0.4235294117647059 0 0 0 0
                      0 0.19607843137254902 0 0 0
                      0 0 0.11372549019607843 0 0
                      0 0 0 0.04 0"
            />
            <feOffset
              in="color-5-blur"
              result="layer-5-offsetted"
              dx="0"
              dy="64"
            />
            <feColorMatrix
              in="blur30"
              result="color-6-blur"
              type="matrix"
              values="0.21176470588235294 0 0 0 0
                      0 0.10980392156862745 0 0 0
                      0 0 0.07450980392156863 0 0
                      0 0 0 0.04 0"
            />
            <feOffset
              in="color-6-blur"
              result="layer-6-offsetted"
              dx="0"
              dy="64"
            />
            <feColorMatrix
              in="blur30"
              result="color-7-blur"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0.02 0"
            />
            <feOffset
              in="color-7-blur"
              result="layer-7-offsetted"
              dx="0"
              dy="64"
            />
            <feMerge>
              <feMergeNode in="layer-0-offsetted" />
              <feMergeNode in="layer-1-offsetted" />
              <feMergeNode in="layer-2-offsetted" />
              <feMergeNode in="layer-3-offsetted" />
              <feMergeNode in="layer-4-offsetted" />
              <feMergeNode in="layer-5-offsetted" />
              <feMergeNode in="layer-6-offsetted" />
              <feMergeNode in="layer-7-offsetted" />
              <feMergeNode in="layer-0-offsetted" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Copyrights and Back-To-Top indicator */}
      <Footer />
    </>
  );
}
