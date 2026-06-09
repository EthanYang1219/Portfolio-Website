import { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SelectedWork from './components/SelectedWork';
import Experience from './components/Experience';
import About from './components/About';
import SkillsMarquee from './components/SkillsMarquee';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ShaderBackground from './components/ShaderBackground';
import CustomCursor from './components/CustomCursor';

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

    window.addEventListener('scroll', handleScrollIntersection, { passive: true });
    handleScrollIntersection();

    return () => window.removeEventListener('scroll', handleScrollIntersection);
  }, []);

  // Connect Skills marquee triggers to relevant work portfolios
  const handleSkillClick = (skillName: string) => {
    setActiveFilteredSkill(skillName);
    
    // Find the relative portfolio element and click it
    setTimeout(() => {
      let targetProjIdx = 0; // default to python
      const normalName = skillName.toLowerCase();

      if (normalName.includes('cpp') || normalName.includes('pid') || normalName.includes('odometry')) {
        targetProjIdx = 2; // PID and Odometry
      } else if (normalName.includes('fusion') || normalName.includes('onshape') || normalName.includes('docs') || normalName.includes('notebook')) {
        targetProjIdx = 4; // VEX Engineering Notebook
      } else if (normalName.includes('resolve') || normalName.includes('davinci') || normalName.includes('video')) {
        targetProjIdx = 3; // F1 Safety Video
      } else if (normalName.includes('climb') || normalName.includes('delta') || normalName.includes('full-stack') || normalName.includes('python')) {
        targetProjIdx = 1; // DeltaV Climbing Companion
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

      {/* Inertia custom hover-receptive pointer cursor */}
      <CustomCursor />

      {/* Content wrapper with correct flow */}
      <Header currentSection={currentSection} />

      <main className="relative z-10 w-full flex flex-col overflow-x-hidden">
        {/* Landing viewport */}
        <Hero />

        {/* Selected Projects with real control theory simulations */}
        <SelectedWork filteredSkill={activeFilteredSkill} />

        {/* Technical timeline */}
        <Experience />

        {/* Biography spotlight with credentials curricula drawer */}
        <About />

        {/* Skills endless marquee (Positioned beautifully as a divider before finale) */}
        <SkillsMarquee onSkillClick={handleSkillClick} />

        {/* Contact sheet */}
        <Contact />
      </main>

      {/* Copyrights and Back-To-Top indicator */}
      <Footer />
    </>
  );
}
