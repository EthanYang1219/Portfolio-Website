import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Play, Terminal, Settings, BookOpen, Clock, Activity, Target } from 'lucide-react';
import { Project } from '../types';
import workF1Jpg from '../assets/images/work-f1.jpg';
import vexDrivetrain from '../assets/images/vex-drivetrain.png';
import DeltaVRibbon from './DeltaVRibbon';

interface SelectedWorkProps {
  filteredSkill: string | null;
  onClearFilter?: () => void;
}

// Which skills (from the SkillsMarquee ticker) each project demonstrates.
// Used to dim non-matching projects when a skill filter is active.
const projectSkills: Record<string, string[]> = {
  python: ['Python'],
  deltav: ['Python', '3D printing', 'Web development'],
  pid: ['C++'],
  f1: ['DaVinci Resolve'],
  docs: ['Fusion 360', 'Onshape', 'Engineering Docs'],
};

export default function SelectedWork({ filteredSkill, onClearFilter }: SelectedWorkProps) {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);

  // True when the active filter is a project skill (experience-only skills
  // like Composite layup / Mentorship are handled by the Experience section)
  const projectMatchesSkill = filteredSkill
    ? Object.values(projectSkills).some((skills) => skills.includes(filteredSkill))
    : false;

  // PID Simulator States
  const [pidSetpoint, setPidSetpoint] = useState<number>(50);
  const [pidCurrent, setPidCurrent] = useState<number>(100);
  const [pidPlotData, setPidPlotData] = useState<number[]>(new Array(60).fill(100));
  const pidStateRef = useRef({ current: 100, errorSum: 0, lastError: 0 });

  const projects: Project[] = [
  {
      id: 'deltav',
      title: 'DeltaV',
      meta: 'Climbing Companion · full-stack + AI',
      url: '#',
      description: "A full-stack bouldering companion app that tracks training metrics, logs hold layouts, and maps climber center-of-mass telemetry.",
      gradient: 'linear-gradient(140deg, #e0b894, #b8431e)',
      type: 'phone',
      details: {
        role: 'Front-End Developer',
        overview: 'DeltaV captures real-time climbing metrics by tracking a user\'s hip positioning—the critical baseline for calculating balance, wall proximity, and core stability during a dynamic climb.',
        challenges: 'Translating raw IMU sensor tracking and casual canvas screen touches into clean, reliable path data without over-complicating the user interface.',
        highlights: [
          'Prototyped a wearable hardware sensor to capture live hip stability and tracking telemetry',
          'Designed a clean, minimal interface featuring real-time data visualizers for tracking climbing routes',
          'Built standard climbing features including custom route logging, project status tags, and historical session tracking'
        ]
      }
    },
    {
      id: 'python',
      title: 'Python Projects',
      meta: 'Python · GitHub Sandbox',
      url: 'https://github.com/EthanYang1219/Python-Projects',
      description: "A growing repository of Python projects and foundational exercises developed throughout Summer 2026, currently focusing on Object-Oriented Programming (OOP) fundamentals.",
      gradient: 'linear-gradient(140deg, #c9a06a, #7a4f2a)',
      type: 'code',
      details: {
        role: 'Solo Developer',
        overview: 'A personal learning sandbox used to practice writing clean, organized Python code. Built to transition from basic scripting into structured, object-oriented applications.',
        challenges: 'Learning how to properly structure code into reusable classes and modules rather than writing everything in single, messy scripts.',
        highlights: [
          'Implementing core OOP concepts like classes, inheritance, and methods',
          'Breaking down larger logic into modular, organized file systems',
          'Building small, foundational console-based applications from scratch.'
        ]
      }
    },
    {
      id: 'pid',
          title: 'PID & Odometry',
          meta: 'C++ · LemLib — 2024 VEX Worlds',
          url: 'https://github.com/EthanYang1219/604X_Provies',
          description: "An autonomous tracking and positioning system configured in C++ utilizing LemLib's dual-wheel odometry and PID chassis controls.",
          gradient: 'linear-gradient(140deg, #7a7060, #352d20)',
          type: 'plot',
          details: {
            role: 'Lead Programmer & Control Systems Engineer',
            overview: 'Configured and tuned a dual-encoder LemLib tracking setup to calculate absolute coordinates (X, Y) and heading orientations in real-time during competitive matches.',
            challenges: 'Overcoming wheel slippage and drift caused by rapid acceleration profiles. Solved by tuning LemLib’s PID gains and adjusting mechanical tracking wheel geometry.',
            highlights: [
              'Tuned custom PID constants to optimize chassis acceleration and deceleration limits',
              'Built consistent autonomous routes using absolute field coordinate tracking',
              'Reduced positioning errors to keep the robot accurately aligned with match objectives'
        ]
      }
    },
    {
      id: 'f1',
      title: 'F1 Safety Video',
      meta: 'Resolve · Documentary Editing',
      url: 'https://www.youtube.com/watch?v=qGy1c3SvTlU',
      description: "A documentary-style video explaining the history and evolution of Formula 1 safety systems, edited in DaVinci Resolve.",
      gradient: 'linear-gradient(140deg, #d2632e, #4a2c1a)',
      type: 'image',
      details: {
        role: 'Content Producer, Scriptwriter & Editor',
        overview: 'Researched, scripted, and edited a video essay investigating how driver safety mechanics evolved across different eras of Formula 1.',
        challenges: 'Translating technical racing engineering into an engaging story for casual viewers, while sourcing copyright-compliant historical footage and keeping the pacing tight.',
        highlights: [
          'Hand-wrote and narrated a comprehensive 600+ word script designed for a general audience',
          'Conducted deep historical research into the evolution of racing safety devices and regulations',
          'Managed end-to-end video editing, including clip splicing, pacing, background music, and visual transitions'
        ]
      }
    },
    {
      id: 'docs',
      title: 'VEX Notebook',
      meta: 'Engineering management · 300pg logs',
      url: 'https://docs.google.com/presentation/d/1X4aPTVQ4PRyfuGO5HmuRzZQHJE9-RQF6r9ISsCX0SpE/edit?usp=sharing',
      description: "A comprehensive 300+ page engineering notebook documenting the iterative design, testing, and prototyping phases for each mechanical subsystem.",
      gradient: 'linear-gradient(140deg, #5a4f40, #17140d)',
      type: 'doc',
      details: {
        role: 'Mechanical Lead',
        overview: 'Managed the end-to-end engineering documentation, from initial prototyping and component trade-off analysis to final mechanism iterations, ensuring compliance with competition design standards.',
        challenges: 'Maintaining rigorous, consistent records across a dynamic 6-month build cycle. Solved by implementing a structured weekly logging system to keep all sub-team updates synchronized.',
        highlights: [
          'Data-driven design matrices evaluating reliability, weight, and performance trade-offs',
          'Detailed subsystem documentation tracking mechanical revisions and test results',
          'Contributed to winning over 40 technical design, construction, and tournament excellence awards'
        ]
      }
    }
  ];

  // Pause the live simulations while the work section is scrolled offscreen
  // so the 55ms PID loop doesn't re-render the section the whole session
  const [simVisible, setSimVisible] = useState(true);
  const sectionRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => setSimVisible(entry.isIntersecting),
      { rootMargin: '100px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Desktop-only: fade the right-hand mini window out as you scroll down past
  // the projects (instead of pinning it, which felt like it tracked the page).
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  // Anchor the fade to the section's absolute top, then drive it off raw window
  // scroll (useScroll target/offset progress is non-monotonic once the element
  // scrolls far past the viewport — same quirk hit in the hero).
  const [sectionTop, setSectionTop] = useState(0);
  useEffect(() => {
    const measure = () => {
      const el = sectionRef.current;
      if (el) setSectionTop(el.getBoundingClientRect().top + window.scrollY);
    };
    measure();
    window.addEventListener('resize', measure, { passive: true });
    const t = setTimeout(measure, 500); // re-measure once fonts/layout settle
    return () => {
      window.removeEventListener('resize', measure);
      clearTimeout(t);
    };
  }, []);
  const { scrollY } = useScroll();
  const panelFade = useTransform(scrollY, [sectionTop, sectionTop + 320], [1, 0]);
  const prefersReduced = useReducedMotion();

  // PID feedback loop logic
  useEffect(() => {
    if (!simVisible) return;
    const timer = setInterval(() => {
      const Kp = 0.12;
      const Ki = 0.003;
      const Kd = 0.35;

      const current = pidStateRef.current.current;
      const error = pidSetpoint - current;
      
      // Update variables
      pidStateRef.current.errorSum += error;
      const errorDiff = error - pidStateRef.current.lastError;
      pidStateRef.current.lastError = error;

      // PID Calculation
      const pTerm = Kp * error;
      const iTerm = Ki * pidStateRef.current.errorSum;
      const dTerm = Kd * errorDiff;

      const correction = pTerm + iTerm + dTerm;
      const updated = current + correction;

      pidStateRef.current.current = updated;
      setPidCurrent(updated);

      setPidPlotData((prev) => {
        const next = [...prev.slice(1), updated];
        return next;
      });
    }, 55);

    return () => clearInterval(timer);
  }, [pidSetpoint, simVisible]);

  // Click handler inside the interactive plot to set standard setpoint
  const handlePlotClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const percentage = 100 - (clickY / rect.height) * 100;
    
    // Clamp setpoint between 10% and 90%
    const clampedY = Math.max(10, Math.min(90, percentage));
    setPidSetpoint(clampedY);
  };

  return (
    <section className="section pt-[7vh] md:pt-[9vh]" id="work" ref={sectionRef}>
      <div className="w-full max-w-[var(--maxw)] mx-auto px-5 md:px-[var(--gutter)]">
        
        {/* Header */}
        <div className="section-head reveal">
          <span className="section-no">01 — Selected work</span>
          <h2 className="h2 font-display text-[2.7rem] leading-none tracking-tight">
            Things I've <span className="text-accent italic font-normal">designed, broken,</span> and created.
          </h2>
        </div>

        {/* Dashboard Grid */}
        <div className="hw-grid mt-12 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-[4.5rem] items-start">
          
          {/* Left panel: List of project headers */}
          <div className="hw-col flex flex-col">

            {/* Top divider matching the row separators */}
            <span aria-hidden className="block h-px bg-gradient-to-r from-transparent via-hairline to-transparent" />

            {/* Active skill filter chip */}
            <AnimatePresence>
              {filteredSkill && projectMatchesSkill && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-2.5 py-3 px-4 font-mono text-xs uppercase tracking-wider text-ink-soft border-b border-hairline"
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

            {projects.map((proj, idx) => (
              <div
                key={proj.id}
                className={`hw-item group cursor-pointer transition-all duration-400 ${
                  activeIdx === idx ? 'bg-accent-tint/5' : ''
                } ${
                  filteredSkill && projectMatchesSkill && !(projectSkills[proj.id] ?? []).includes(filteredSkill)
                    ? 'opacity-30 saturate-50'
                    : ''
                }`}
                onMouseEnter={() => setActiveIdx(idx)}
              >
                <div
                  className="hw-link grid grid-cols-[1fr_auto] items-center gap-4 py-7 px-4 cursor-pointer select-none rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                  role="button"
                  tabIndex={0}
                  aria-label={`Open ${proj.title} case study`}
                  onClick={() => setSelectedProject(proj)}
                  onFocus={() => setActiveIdx(idx)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedProject(proj);
                    }
                  }}
                >
                  <div className="flex flex-col gap-1.5">
                    <h3 className={`hw-title font-display font-medium text-2xl sm:text-3.5xl tracking-tight transition-colors duration-300 ${
                      activeIdx === idx ? 'text-accent' : 'text-ink'
                    }`}>
                      {proj.title}
                    </h3>
                    <span className="hw-meta font-mono text-xs tracking-wider uppercase text-ink-faint">
                      {proj.meta}
                    </span>
                  </div>

                  <div className={`hw-arrow text-accent text-2xl transition-all duration-300 ${
                    activeIdx === idx ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3 pointer-events-none'
                  }`}>
                    ↗
                  </div>
                </div>

                {/* Elegant divider — a hairline that dissolves at both ends */}
                <span aria-hidden className="block h-px bg-gradient-to-r from-transparent via-hairline to-transparent" />
              </div>
            ))}
          </div>

          {/* Right panel: Live Interactive Illustrators/Simulators!
              Not pinned — it fades out (desktop) as you scroll past the
              projects, like the hero intro, rather than tracking the page. */}
          <motion.div
            style={{ opacity: isDesktop && !prefersReduced ? panelFade : 1 }}
            className="hw-panel-col flex flex-col lg:items-end gap-6 select-none"
          >
            
            {/* Simulation Card Wrapper */}
            <div className="hw-panel w-full max-w-[560px] aspect-[4/3] rounded-3xl border border-hairline bg-paper-raised p-5 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.15)] dark:shadow-[0_24px_50px_-20px_rgba(0,0,0,0.5)] overflow-hidden relative">
              
              <div 
                className="absolute inset-0 w-full h-full opacity-10 pointer-events-none -z-10"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='h'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23h)'/%3E%3C/svg%3E")` }}
              />

              {/* SIMULATOR: Python — "Living Syntax" snake illustration */}
              {projects[activeIdx].id === 'python' && (
                <div className="w-full h-full flex flex-col bg-ink text-[#f3eee2] rounded-2xl border border-white/5 font-mono relative overflow-hidden">
                  {/* terminal chrome */}
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
                    <span className="flex items-center gap-1.5 text-accent font-bold text-xs">
                      <Terminal className="w-3.5 h-3.5" /> shell.py
                    </span>
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-white/15" />
                      <span className="w-2 h-2 rounded-full bg-white/15" />
                      <span className="w-2 h-2 rounded-full bg-accent/70" />
                    </div>
                  </div>

                  {/* snake illustration */}
                  <div className="flex-1 relative">
                    <div className="absolute top-3 left-4 leading-relaxed pointer-events-none">
                      <p className="text-[0.62rem] text-[#8a8170]">&gt;&gt;&gt; import this</p>
                      <p className="text-[0.62rem] font-sans italic text-[#6e6557]">Beautiful is better than ugly.</p>
                    </div>

                    <svg viewBox="0 0 400 230" className="w-full h-full" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                      <defs>
                        <linearGradient id="snakeBody" x1="0" y1="1" x2="1" y2="0">
                          <stop offset="0" stopColor="#7a2410" />
                          <stop offset="0.45" stopColor="#cc4b1e" />
                          <stop offset="0.8" stopColor="#ff5e26" />
                          <stop offset="1" stopColor="#e8a24e" />
                        </linearGradient>
                        <pattern id="snakeScales" width="12" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(6)">
                          <path d="M0 7 Q6 -1 12 7" fill="none" stroke="#e8c489" strokeWidth="1" />
                        </pattern>
                      </defs>

                      {/* body: gradient base, then gold scale texture, then a faint scute highlight */}
                      <path d="M 34 168 C 78 96, 120 220, 184 158 C 232 112, 268 210, 318 150 C 342 122, 356 150, 346 106"
                        stroke="url(#snakeBody)" strokeWidth="23" strokeLinecap="round" />
                      <path d="M 34 168 C 78 96, 120 220, 184 158 C 232 112, 268 210, 318 150 C 342 122, 356 150, 346 106"
                        stroke="url(#snakeScales)" strokeWidth="21" strokeLinecap="round" opacity="0.55" />
                      <path d="M 34 168 C 78 96, 120 220, 184 158 C 232 112, 268 210, 318 150 C 342 122, 356 150, 346 106"
                        stroke="#ffd9a8" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 13" opacity="0.5" />

                      {/* ornate head */}
                      <ellipse cx="346" cy="106" rx="17" ry="11.5" transform="rotate(-52 346 106)" fill="#cc4b1e" stroke="#e8c489" strokeWidth="1.4" />
                      <path d="M 337 99 Q 346 92 357 98" fill="none" stroke="#e8c489" strokeWidth="1.2" />
                      <ellipse cx="350" cy="101" rx="3.1" ry="2.2" transform="rotate(-52 350 101)" fill="#f4f1ea" stroke="#caa45f" strokeWidth="0.7" />
                      <circle cx="350.5" cy="100.5" r="1" fill="#1a120a" />
                      {/* forked tongue */}
                      <g stroke="#ff5e26" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M 356 92 L 362 78" />
                        <path d="M 362 78 L 366 71" />
                        <path d="M 362 78 L 359 70" />
                      </g>
                    </svg>

                    <span className="absolute bottom-3 left-4 font-display italic font-semibold text-2xl text-[#f3eee2]/90 select-none">Python</span>
                  </div>

                  <span className="absolute bottom-2 right-3 text-[0.55rem] text-[#6e6557] pointer-events-none">Python 3.11</span>
                </div>
              )}

              {/* SIMULATOR: DeltaV 3D Ribbon path visualizer (ported from the app) */}
              {projects[activeIdx].id === 'deltav' && (
                <DeltaVRibbon paused={!simVisible} />
              )}

              {/* SIMULATOR: Mathematical PID controller visualizer */}
              {projects[activeIdx].id === 'pid' && (
                <div className="w-full h-full flex flex-col bg-ink text-[#f3eee2] rounded-2xl border border-white/5 font-mono p-3 relative">
                  
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                    <span className="flex items-center gap-1.5 text-accent text-[0.72rem] font-bold">
                      <Activity className="w-3.5 h-3.5" /> 100Hz Real-Time PID Tuning Simulator
                    </span>
                    <span className="text-[0.62rem] text-[#8a8170]">Target Set: {pidSetpoint.toFixed(0)}%</span>
                  </div>

                  {/* SVG Plot Graph (Clickable) */}
                  <div className="flex-1 bg-[#14100c] border border-white/5 rounded-xl cursor-crosshair relative">
                    <svg 
                      className="w-full h-full" 
                      onClick={handlePlotClick}
                      viewBox="0 0 200 100" 
                      preserveAspectRatio="none"
                    >
                      {/* Grid rulers */}
                      <line x1="0" y1="25" x2="200" y2="25" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                      <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                      <line x1="0" y1="75" x2="200" y2="75" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />

                      {/* Setpoint Horiz Target Line */}
                      <line 
                        x1="0" 
                        y1={100 - pidSetpoint} 
                        x2="200" 
                        y2={100 - pidSetpoint} 
                        stroke="#e85d2c" 
                        strokeWidth="1" 
                        strokeDasharray="4 3" 
                        opacity="0.8"
                      />

                      {/* Scrolling dynamic feedback loop plot path */}
                      <path
                        d={`M 0 ${100 - pidPlotData[0]} ${pidPlotData.map((val, pidx) => `L ${(pidx / 59) * 200} ${100 - val}`).join(' ')}`}
                        fill="none"
                        stroke="#ffddb0"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />

                      {/* Robot position terminal coordinate particle dot */}
                      <circle
                        cx="200"
                        cy={100 - pidCurrent}
                        r="3.5"
                        fill="white"
                        stroke="#e85d2c"
                        strokeWidth="1.5"
                      />
                    </svg>
                    
                    <span className="absolute bottom-1.5 left-2.5 text-[0.45rem] tracking-wider text-ink-faint uppercase select-none">
                      🔍 Tap inside the graph plot grid to update destination setpoints
                    </span>
                  </div>
                </div>
              )}

              {/* SIMULATOR: F1 video poster — click to play in a lightbox */}
              {projects[activeIdx].id === 'f1' && (
                <div
                  className="w-full h-full rounded-2xl overflow-hidden relative group cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label="Play the F1 safety video"
                  onClick={() => setVideoOpen(true)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setVideoOpen(true); } }}
                  data-cursor
                >
                  <div className="absolute inset-0 bg-ink-faint flex flex-col justify-center items-center">
                    {/* Background silhouette fallback gradient of high-intensity speed */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-950/40 via-transparent to-red-900/10" />
                    
                    {/* Direct image rendering (gracefully handles errors) */}
                    <img
                      src={workF1Jpg}
                      alt="F1 crash safety analysis"
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                      referrerPolicy="no-referrer"
                      onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                    
                    {/* Overlay play button symbol */}
                    <div className="relative z-10 w-14 h-14 rounded-full bg-black/60 backdrop-blur-sm border border-white/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-white cursor-pointer shadow-lg">
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </div>
                    
                    <span className="absolute bottom-3 left-4 z-10 font-mono text-[0.58rem] tracking-widest text-[#f3eee2] uppercase bg-black/40 border border-white/10 px-2.5 py-1 rounded-md">
                      Safety Documentary
                    </span>
                  </div>
                </div>
              )}

              {/* SIMULATOR: stylized engineering-notebook page */}
              {projects[activeIdx].id === 'docs' && (
                <div
                  className="w-full h-full rounded-2xl overflow-hidden relative bg-[#f4f1ea] text-[#2a2620]"
                  style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 23px, rgba(60,80,90,0.09) 23px 24px), repeating-linear-gradient(90deg, transparent 0 23px, rgba(60,80,90,0.05) 23px 24px)' }}
                >
                  {/* red margin rule + punch holes */}
                  <div className="absolute left-9 top-0 bottom-0 w-px bg-[#d2734c]/45" />
                  <div className="absolute left-2.5 top-0 bottom-0 flex flex-col justify-around py-6 pointer-events-none">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#e7e1d2] border border-[#cfc8b6]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#e7e1d2] border border-[#cfc8b6]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#e7e1d2] border border-[#cfc8b6]" />
                  </div>

                  <div className="h-full pl-12 pr-4 py-3.5 flex flex-col">
                    {/* title block */}
                    <div className="flex items-end justify-between border-b border-[#cfc8b6] pb-2">
                      <div className="flex flex-col">
                        <h4 className="font-display font-semibold text-base leading-none">Engineering Notebook</h4>
                        <span className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-[#8a8170] mt-1">604X · VEX V5 · Design Log</span>
                      </div>
                      <span className="font-mono text-[0.55rem] text-[#8a8170]">PG&nbsp;147</span>
                    </div>

                    {/* annotated sketch + notes */}
                    <div className="flex-1 grid grid-cols-[1.15fr_1fr] gap-3 pt-2.5 min-h-0">
                      <div className="relative flex flex-col min-h-0">
                        {/* Real 604X drivetrain CAD drawing, multiply-blended so the
                            white background drops out and only the line art sits on the paper */}
                        <img
                          src={vexDrivetrain}
                          alt="Isometric CAD drawing of the 604X drivetrain"
                          loading="lazy"
                          decoding="async"
                          className="w-full flex-1 min-h-0 object-contain mix-blend-multiply"
                        />
                        <span className="font-mono text-[0.5rem] uppercase tracking-wider text-[#8a8170] mt-0.5">Fig. 12 — drivetrain (iso)</span>
                      </div>

                      <div className="flex flex-col gap-1.5 font-mono text-[0.6rem] text-[#4a463c] leading-snug min-w-0">
                        <span className="font-semibold text-[#2a2620] tracking-wide">Trade study</span>
                        <span className="flex items-start gap-1.5"><span className="text-[#2e7d5b]">✓</span> 6-motor, 600 rpm</span>
                        <span className="flex items-start gap-1.5"><span className="text-[#2e7d5b]">✓</span> CF baseplate</span>
                        <span className="flex items-start gap-1.5"><span className="text-[#2e7d5b]">✓</span> 2.75&quot; omni wheels</span>
                        <span className="flex items-start gap-1.5"><span className="text-[#d2734c]">→</span> retune odom offset</span>
                      </div>
                    </div>

                    <span className="font-mono text-[0.5rem] text-right tracking-[0.18em] uppercase text-[#8a8170] border-t border-[#cfc8b6] pt-1.5 mt-1">Design · Build · Test · Iterate</span>
                  </div>
                </div>
              )}

            </div>

            {/* Active project blurb + actions — moved out of the list so
                hovering a project updates this panel instead of expanding an
                inline row (which reflowed and snapped the list). Crossfades
                between projects. */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[560px] flex flex-col gap-3 lg:items-end lg:text-right"
              >
                <p className="text-ink-soft text-[0.92rem] leading-relaxed max-w-[48ch]">
                  {projects[activeIdx].description}
                </p>
                <div className="flex items-center gap-4 lg:justify-end">
                  <button
                    onClick={() => setSelectedProject(projects[activeIdx])}
                    className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wider uppercase text-accent font-semibold hover:text-accent-deep transition-colors cursor-pointer"
                    data-cursor
                  >
                    <BookOpen className="w-3.5 h-3.5" /> Read Case Studies
                  </button>
                  {projects[activeIdx].url !== '#' && (
                    <a
                      href={projects[activeIdx].url}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex items-center gap-1 font-mono text-xs tracking-wider uppercase text-ink-soft hover:text-ink transition-colors"
                      data-cursor
                    >
                      Source ↗
                    </a>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

        </div>

      </div>

      {/* DETAILED CASE STUDY POPOUT MODAL (centered, fully visible).
          Portaled to <body> so position:fixed always resolves against the
          viewport, never a transformed motion ancestor (which would offset it). */}
      {createPortal(
        <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#17140d]/40 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
          >
            {/* Dark back-overlay trigger */}
            <div className="absolute inset-0" onClick={() => setSelectedProject(null)} />

            {/* Centered popout window — floats with margin all around, scrolls
                internally so the whole card is always visible on screen */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-3xl bg-paper border border-hairline rounded-3xl p-6 md:p-8 shadow-[0_30px_80px_-24px_rgba(0,0,0,0.5)] z-10 max-h-[88vh] overflow-y-auto scroller"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col gap-1">
                  <h3 className="font-display text-3xl md:text-4xl text-ink tracking-tight font-medium">
                    {selectedProject.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                    <span className="font-mono text-xs tracking-wider uppercase text-accent font-semibold flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 animate-pulse" /> {selectedProject.meta}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-1 rounded-full text-ink-soft hover:text-ink hover:bg-hairline transition-colors cursor-pointer"
                  aria-label="Close detailed case study"
                >
                  ✕
                </button>
              </div>

              {/* Case study rich structural details */}
              {selectedProject.details && (
                <div className="space-y-6 text-sm text-ink-soft leading-relaxed font-sans">
                  
                  {/* Overview panel */}
                  <div className="space-y-2">
                    <h4 className="text-xl font-display font-medium text-ink tracking-tight flex items-center gap-1.5 border-b border-hairline pb-2">
                      <Target className="w-4 h-4 text-accent" /> Project Overview
                    </h4>
                    <p className="text-[0.95rem] leading-relaxed">
                      {selectedProject.details.overview}
                    </p>
                  </div>
                  
                  {/* Mathematical formulas conversion (Showcase "TASTE + Point of view" for Mathematical Physics!) */}
                  {selectedProject.id === 'pid' && (
                    <div className="p-4 bg-paper-raised border border-hairline rounded-xl font-mono leading-relaxed text-xs text-ink">
                      <p className="text-accent font-semibold mb-2">✦ 2D Encoder Heading Integration Trigonometry</p>
                      <p className="mb-1.5 font-sans leading-relaxed text-ink-soft">
                        Tracks local encoder changes (Δd_left, Δd_right) to resolve the chassis absolute heading orientation angle (θ):
                      </p>
                      <div className="flex flex-col gap-1 py-2 font-mono text-center text-ink bg-paper border border-hairline-soft rounded">
                        <span>Δθ = (Δd_left - Δd_right) / TrackWidth</span>
                        <span>Δx = 2 * sin(Δθ/2) * (Δd_right / Δθ + OuterRadius) * cos(θ + Δθ/2)</span>
                      </div>
                    </div>
                  )}

                  {/* Highlights Bullet Panel */}
                  <div className="space-y-2">
                    <h4 className="text-xl font-display font-medium text-ink tracking-tight flex items-center gap-1.5 border-b border-hairline pb-2">
                      <Clock className="w-4 h-4 text-accent" /> Technical Highlights
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {selectedProject.details.highlights.map((hlt, hidx) => (
                        <li key={hidx} className="flex items-start gap-2 bg-paper-raised border border-hairline-soft p-3 rounded-xl hover:border-accent/40 hover:-translate-y-0.5 transition-all">
                          <span className="text-accent font-bold">✓</span>
                          <span>{hlt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Operational Challenges */}
                  <div className="space-y-2">
                    <h4 className="text-xl font-display font-medium text-ink tracking-tight flex items-center gap-1.5 border-b border-hairline pb-2">
                      <Settings className="w-4 h-4 text-accent" /> Structural Challenges
                    </h4>
                    <p className="text-[0.95rem] leading-relaxed">
                      {selectedProject.details.challenges}
                    </p>
                  </div>

                  {/* Operational Role */}
                  <div className="flex items-center gap-3 bg-accent-tint/10 border border-accent/10 p-3.5 rounded-xl">
                    <span className="text-xs uppercase font-mono tracking-widest text-[#b84016] font-bold">My Core Role:</span>
                    <span className="text-xs tracking-wide text-ink font-semibold">{selectedProject.details.role}</span>
                  </div>

                </div>
              )}

              {/* Bottom footer links */}
              <div className="mt-8 pt-4 border-t border-hairline flex flex-col sm:flex-row justify-end items-center gap-4">
                {selectedProject.url !== '#' ? (
                  <a
                    href={selectedProject.url}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-1.5 justify-center font-mono text-xs uppercase tracking-wider font-bold bg-ink text-paper py-3 px-6 rounded-full hover:bg-accent-deep transition-all w-full sm:w-auto"
                    data-cursor
                  >
                    Explore Repository Source <ArrowUpRight className="w-4 h-4" />
                  </a>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedProject(null);
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 justify-center font-mono text-xs uppercase tracking-wider font-bold bg-accent text-white py-3 px-6 rounded-full hover:bg-accent-deep transition-all w-full sm:w-auto cursor-pointer"
                    data-cursor
                  >
                    Collaborate On DeltaV
                  </button>
                )}
              </div>

            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>,
        document.body
      )}

      {/* F1 video lightbox — portaled to body so position:fixed is viewport-anchored */}
      {createPortal(
        <AnimatePresence>
          {videoOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
              role="dialog"
              aria-modal="true"
              aria-label="F1 safety video"
              onClick={() => setVideoOpen(false)}
            >
              <button
                onClick={() => setVideoOpen(false)}
                aria-label="Close video"
                className="absolute top-5 right-6 text-white/70 hover:text-white text-3xl leading-none cursor-pointer"
                data-cursor
              >
                ✕
              </button>
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
                onClick={(e) => e.stopPropagation()}
              >
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube-nocookie.com/embed/qGy1c3SvTlU?autoplay=1&rel=0"
                  title="F1 Safety Video — Ethan Yang"
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
