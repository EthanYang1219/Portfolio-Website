import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Play, Terminal, HelpCircle, Code, Settings, Sparkles, BookOpen, Clock, Activity, Target } from 'lucide-react';
import { Project } from '../types';
import workF1Jpg from '../assets/images/work-f1.jpg';

interface SelectedWorkProps {
  filteredSkill: string | null;
}

export default function SelectedWork({ filteredSkill }: SelectedWorkProps) {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // PID Simulator States
  const [pidSetpoint, setPidSetpoint] = useState<number>(50);
  const [pidCurrent, setPidCurrent] = useState<number>(100);
  const [pidPlotData, setPidPlotData] = useState<number[]>(new Array(60).fill(100));
  const pidStateRef = useRef({ current: 100, errorSum: 0, lastError: 0 });

  // Python Terminal States
  const [terminalLines, setTerminalLines] = useState<string[]>([
    '>>> import vex_control',
    '>>> robot = vex_control.OdomChassis()',
    '>>> robot.get_coordinates()',
    'Chassis positioned at (0.00, 0.00), angular error = 0.00rad'
  ]);
  const [isCompiling, setIsCompiling] = useState(false);

  // DeltaV climbing routes
  const [climbingHolds, setClimbingHolds] = useState<[number, number][]>([
    [25, 85], [45, 70], [30, 50], [60, 35], [50, 15]
  ]);
  const [aiSequence, setAiSequence] = useState<number[]>([0, 1, 2, 3, 4]);

  const projects: Project[] = [
    {
      id: 'python',
      title: 'Python Projects',
      meta: 'Python · GitHub Sandbox',
      url: 'https://github.com/EthanYang1219/Python-Projects',
      description: "A growing collection of small Python scripts and sandbox experiments. Built to prototype complex math systems rapidly and maintain speed and fluency.",
      gradient: 'linear-gradient(140deg, #c9a06a, #7a4f2a)',
      type: 'code',
      details: {
        role: 'Solo Developer & Author',
        overview: 'A dedicated test sandbox containing modular tools, file systems, graph sorting trees, and experimental control theory loops. Used to validate mechanical calculations before C++ implementation.',
        challenges: 'Designing custom utilities without bloated external dependencies. Solved by writing raw linear algebraic solvers, array manipulations, and terminal animation engines from first-principles.',
        highlights: [
          'Linear algebra and matrix transformations from scratch',
          'Coordinate scaling algorithms for raw vector plotter feeds',
          'Mathematical physics gravity orbit modeling engines'
        ]
      }
    },
    {
      id: 'deltav',
      title: 'DeltaV',
      meta: 'Climbing Companion · full-stack + AI',
      url: '#',
      description: "A full-stack, AI-powered bouldering companion that logs training, maps hold layouts via computer vision, and outputs optimal topological climb plans.",
      gradient: 'linear-gradient(140deg, #e0b894, #b8431e)',
      type: 'phone',
      details: {
        role: 'Sole Architect / Developer',
        overview: 'DeltaV processes high-density training coordinates into actionable graphs. By mapping coordinates on a custom Canvas layout, it models hold vectors and advises resting pacing.',
        challenges: 'Translating noisy canvas touches into structured vector nodes that recommend relative body positions. Solved by fitting custom spline chains.',
        highlights: [
          'Real-time computer vision hold positioning engine',
          'Damped spring animations with motion/react structures',
          'Heuristic climbing node sorting and dynamic pacing'
        ]
      }
    },
    {
      id: 'pid',
      title: 'PID & Odometry',
      meta: 'C++ · controls — 2024 VEX Worlds',
      url: '#',
      description: "A highly-tuned proportional-integral-derivative C++ positioning chassis tracking real-time field coordinates utilizing dual-wheel odometry.",
      gradient: 'linear-gradient(140deg, #7a7060, #352d20)',
      type: 'plot',
      details: {
        role: 'Lead Programmer & Control Systems Engineer',
        overview: 'Implemented dual-encoder odometry that constantly integrates wheel encoder ticks to compute absolute position (X, Y) and theta heading orientations at 100Hz on VEX processors.',
        challenges: 'Accounting for severe wheel-skid and drift errors during fast accelerations. Solved by implementing dual tracking omnicourses and PID heading dampening hooks.',
        highlights: [
          'Sub-millimeter tracking accuracy across complex auto paths',
          'Proportional, Integral, Derivative loop driving 4 motor groupings',
          'Odometry angle resolution resolving local heading errors'
        ]
      }
    },
    {
      id: 'f1',
      title: 'F1 Safety Video',
      meta: 'Resolve · Documentary editing',
      url: 'https://www.youtube.com/watch?v=qGy1c3SvTlU',
      description: "A professional documentary-style piece explaining the evolution of mechanical active safety systems inside F1 cockpits, edited in DaVinci Resolve.",
      gradient: 'linear-gradient(140deg, #d2632e, #4a2c1a)',
      type: 'image',
      details: {
        role: 'Content Producer, Scriptwriter & Sound Editor',
        overview: 'Researched, scripted, tracked, and mastered sound editing for a high-intensity documentary investigating survivability limits in high-speed crashes (from Monza structure failures to modern halos).',
        challenges: 'Pacing technical engineering concepts alongside fast-action raw race audio elements. Solved by executing sub-frame multi-cam sequences, custom keyframe transitions, and audio filters.',
        highlights: [
          'DaVinci Resolve color sweeps and multitrack mixing',
          'Deep forensic safety systems timeline research documentation',
          '38k+ views validating digital narrative engagement strategies'
        ]
      }
    },
    {
      id: 'docs',
      title: 'VEX Notebook',
      meta: 'Engineering management · 300pg logs',
      url: 'https://docs.google.com/presentation/d/1X4aPTVQ4PRyfuGO5HmuRzZQHJE9-RQF6r9ISsCX0SpE/edit?usp=sharing',
      description: "A 300+ page design diary detailing architectural iterations, budget sheets, and structural calculus that secured numerous Excellence and Design accolades.",
      gradient: 'linear-gradient(140deg, #5a4f40, #17140d)',
      type: 'doc',
      details: {
        role: 'Chief Documentarian & Project Manager',
        overview: 'Directed the structural process logs from initial prototyping phases, detailed matrix trade-off arrays, through continuous pathing iterations. Adhered strictly to aerospace design guidelines.',
        challenges: 'Maintaining rigorous records across dynamic 6-month mechanical development sprints. Solved by establishing strict weekly Git-like documentation frameworks.',
        highlights: [
          'Aerospace-standard design trade matrix frameworks',
          'Comprehensive budgeting sheets mapping cost-to-performance ratio',
          '40+ design, construction, and overall tournament excellence titles'
        ]
      }
    }
  ];

  // PID feedback loop logic
  useEffect(() => {
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
  }, [pidSetpoint]);

  // Click handler inside the interactive plot to set standard setpoint
  const handlePlotClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const percentage = 100 - (clickY / rect.height) * 100;
    
    // Clamp setpoint between 10% and 90%
    const clampedY = Math.max(10, Math.min(90, percentage));
    setPidSetpoint(clampedY);
  };

  // Compile Python console simulator
  const runPythonCompiler = () => {
    if (isCompiling) return;
    setIsCompiling(true);
    
    const consoleCommands = [
      '>>> robot.drive_to_point(45.0, 120.5)',
      'Running 2D PID driving controllers...',
      'Tick 01: delta=128.5cm, correcting angles...',
      'Tick 12: delta=14.2cm, heading stabilized',
      'Tick 24: delta=0.04cm, target converged!',
      '>>> robot.log_data()',
      'Log saved: current(45.0, 120.5), heading=1.21rad'
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < consoleCommands.length) {
        setTerminalLines(prev => [...prev, consoleCommands[i]]);
        i++;
      } else {
        clearInterval(interval);
        setIsCompiling(false);
      }
    }, 450);
  };

  // Toggle climber hold AI sequencers
  const handleHoldClick = (holdIdx: number) => {
    setClimbingHolds(prev => {
      const next = [...prev];
      // Randomly offset click coordinates slightly
      next[holdIdx] = [
        next[holdIdx][0] + (Math.random() - 0.5) * 6,
        next[holdIdx][1] + (Math.random() - 0.5) * 6
      ];
      return next;
    });
  };

  return (
    <section className="section" id="work">
      <div className="w-full max-w-[var(--maxw)] mx-auto px-5 md:px-[var(--gutter)]">
        
        {/* Header */}
        <div className="section-head reveal">
          <span className="section-no">01 — Selected work</span>
          <h2 className="h2 font-display text-[2.7rem] leading-none tracking-tight">
            Things I've <span className="text-accent italic font-normal">designed, broken,</span> and created.
          </h2>
        </div>

        {/* Dashboard Grid */}
        <div className="hw-grid mt-12 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-[4.5rem] items-start">
          
          {/* Left panel: List of project headers */}
          <div className="hw-col flex flex-col border-t border-hairline">
            {projects.map((proj, idx) => (
              <div 
                key={proj.id} 
                className={`hw-item border-b border-hairline group cursor-pointer transition-colors duration-400 ${
                  activeIdx === idx ? 'bg-accent-tint/5' : ''
                }`}
                onMouseEnter={() => setActiveIdx(idx)}
              >
                <div 
                  className="hw-link grid grid-cols-[1fr_auto] items-center gap-4 py-8 px-4 cursor-pointer select-none"
                  onClick={() => setSelectedProject(proj)}
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

                {/* Inline description (collapsible/expandable dynamically based on active selection) */}
                <AnimatePresence initial={false}>
                  {activeIdx === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden px-4 pb-6"
                    >
                      <p className="text-ink-soft text-[0.95rem] leading-relaxed max-w-[50ch] mb-4">
                        {proj.description}
                      </p>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setSelectedProject(proj)}
                          className="flex items-center gap-1.5 font-mono text-xs tracking-wider uppercase text-accent font-semibold hover:text-accent-deep transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" /> Read Case Studies
                        </button>
                        {proj.url !== '#' && (
                          <a 
                            href={proj.url}
                            target="_blank"
                            rel="noopener"
                            className="flex items-center gap-1 font-mono text-xs tracking-wider uppercase text-ink-soft hover:text-ink transition-colors"
                          >
                            Source Link ↗
                          </a>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right panel: Live Interactive Illustrators/Simulators! */}
          <div className="hw-panel-col flex flex-col lg:items-end gap-6 select-none">
            
            {/* Simulation Card Wrapper */}
            <div className="hw-panel w-full max-w-[480px] aspect-[4/3] rounded-3xl border border-hairline bg-paper-raised p-5 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.15)] dark:shadow-[0_24px_50px_-20px_rgba(0,0,0,0.5)] overflow-hidden relative">
              
              <div 
                className="absolute inset-0 w-full h-full opacity-10 pointer-events-none -z-10"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='h'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23h)'/%3E%3C/svg%3E")` }}
              />

              {/* SIMULATOR 1️⃣: python compiler / sandbox */}
              {activeIdx === 0 && (
                <div className="w-full h-full flex flex-col bg-ink text-[#f3eee2] rounded-2xl border border-white/5 font-mono p-4 text-[0.72rem] md:text-xs relative">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                    <span className="flex items-center gap-1.5 text-accent font-bold">
                      <Terminal className="w-3.5 h-3.5 animate-pulse" /> shell.py
                    </span>
                    <button 
                      onClick={runPythonCompiler}
                      disabled={isCompiling}
                      className="px-3 py-1 rounded bg-[#3c2912] hover:bg-[#52381a] border border-accent/20 hover:border-accent text-accent font-semibold flex items-center gap-1 cursor-pointer transition-all disabled:opacity-50 select-none text-[0.62rem]"
                    >
                      <Play className="w-2.5 h-2.5" /> {isCompiling ? 'Running' : 'Run Vector Sandbox'}
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-1.5 leading-relaxed scroller max-h-[160px]">
                    {terminalLines.map((line, lidx) => (
                      <p 
                        key={lidx} 
                        className={line.startsWith('>>>') ? 'text-[#e2dccb]' : line.startsWith('Tick') ? 'text-accent-text/80' : 'text-[#8a8170]'}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                  <span className="absolute bottom-2 right-3 text-[0.55rem] text-[#6e6557]">Python 3.11</span>
                </div>
              )}

              {/* SIMULATOR 2️⃣: DeltaV climbing routing UI */}
              {activeIdx === 1 && (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1c140c] to-[#0a0703] rounded-2xl relative p-3">
                  <div className="absolute top-3 left-4 flex items-center gap-1 text-[0.65rem] font-mono text-amber-500/80 bg-amber-950/40 border border-amber-900/30 rounded py-0.5 px-2">
                    <Sparkles className="w-3 h-3 animate-pulse" /> Climber Plan AI Loop
                  </div>

                  {/* Wireframe Phone Mock */}
                  <div className="w-[120px] md:w-[130px] h-[210px] bg-ink border border-white/15 rounded-[22px] relative p-3 flex flex-col gap-2.5 shadow-[0_12px_24px_rgba(0,0,0,0.4)]">
                    <span className="w-10 h-1.5 bg-white/20 rounded-full mx-auto" />
                    
                    {/* Bouldering Canvas Wall */}
                    <div className="flex-1 border border-white/5 bg-[#201812] rounded-xl relative overflow-hidden">
                      {/* Climbing joints vector connections */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <polyline
                          points={aiSequence.map(i => `${climbingHolds[i][0]}%,${climbingHolds[i][1]}%`).join(' ')}
                          fill="none"
                          stroke="#ffb366"
                          strokeWidth="2.5"
                          strokeDasharray="4 3"
                        />
                      </svg>

                      {/* Holds */}
                      {climbingHolds.map((hold, hidx) => (
                        <button
                          key={hidx}
                          onClick={() => handleHoldClick(hidx)}
                          className="absolute w-3.5 h-3.5 -translate-x-[7px] -translate-y-[7px] rounded-full border border-[rgb(255,164,104)] cursor-pointer hover:scale-125 transition-transform duration-200"
                          style={{ left: `${hold[0]}%`, top: `${hold[1]}%`, backgroundColor: hidx === 4 ? '#e85d2c' : '#2a1a0e' }}
                        >
                          <span className="absolute inset-0.5 rounded-full bg-[rgb(255,179,104)] animate-ping opacity-25" />
                        </button>
                      ))}
                    </div>
                    <span className="font-mono text-[0.48rem] text-center text-ink-faint">AI ROUTE: V5 COMPLETED</span>
                  </div>
                </div>
              )}

              {/* SIMULATOR 3️⃣: Mathematical PID controller visualizer */}
              {activeIdx === 2 && (
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

              {/* SIMULATOR 4️⃣: multimedia F1 poster graphic */}
              {activeIdx === 3 && (
                <div className="w-full h-full rounded-2xl overflow-hidden relative group">
                  <div className="absolute inset-0 bg-ink-faint flex flex-col justify-center items-center">
                    {/* Background silhouette fallback gradient of high-intensity speed */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-950/40 via-transparent to-red-900/10" />
                    
                    {/* Direct image rendering (gracefully handles errors) */}
                    <img
                      src={workF1Jpg}
                      alt="F1 crash safety analysis"
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

              {/* SIMULATOR 5️⃣: Gantt Engineering Documentation Diagram */}
              {activeIdx === 4 && (
                <div className="w-full h-full flex flex-col bg-white text-ink rounded-2xl p-4 shadow-sm border border-[#ebe6d8] font-sans">
                  <div className="flex items-center gap-1.5 border-b border-hairline pb-2.5 mb-3">
                    <span className="p-1 rounded-md bg-accent/10 border border-accent/20">
                      <Code className="w-4 h-4 text-accent" />
                    </span>
                    <div className="flex flex-col">
                      <h4 className="text-xs font-semibold leading-none text-ink">Notebook Timeline Planning</h4>
                      <span className="text-[0.62rem] text-ink-faint">Sprint 12 Schedule Matrix</span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-3">
                    {/* Row 1 */}
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[0.6rem] w-[70px] uppercase tracking-wider text-ink-faint">Odometry Math</span>
                      <div className="flex-1 h-3.5 bg-hairline rounded-sm relative overflow-hidden select-none">
                        <div className="absolute left-[5%] w-[45%] h-full bg-accent/80 hover:bg-accent rounded-sm transition-all" />
                      </div>
                    </div>
                    {/* Row 2 */}
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[0.6rem] w-[70px] uppercase tracking-wider text-ink-faint">PID Debugging</span>
                      <div className="flex-1 h-3.5 bg-hairline rounded-sm relative overflow-hidden select-none">
                        <div className="absolute left-[35%] w-[55%] h-full bg-accent-deep/80 hover:bg-accent-deep rounded-sm transition-all" />
                      </div>
                    </div>
                    {/* Row 3 */}
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[0.6rem] w-[70px] uppercase tracking-wider text-ink-faint">Documentation</span>
                      <div className="flex-1 h-3.5 bg-hairline rounded-sm relative overflow-hidden select-none">
                        <div className="absolute left-[15%] w-[75%] h-full bg-[#5b6b7b] hover:bg-[#485664] rounded-sm transition-all" />
                      </div>
                    </div>
                  </div>
                  <span className="text-[0.6rem] text-right text-ink-faint font-mono">Status: 100% Comprehensive Logged</span>
                </div>
              )}

            </div>

            {/* Description placeholder matching selected items */}
            <p className="text-ink-soft text-right text-[0.88rem] max-w-[480px] italic pr-2">
              {projects[activeIdx].title} — {projects[activeIdx].meta}
            </p>
          </div>

        </div>

      </div>

      {/* DETAILED CASE STUDY BOTTOM DRAWER (Slide in dynamically) */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#17140d]/40 backdrop-blur-md flex items-end justify-center py-0"
            role="dialog"
            aria-modal="true"
          >
            {/* Dark back-overlay trigger */}
            <div className="absolute inset-0" onClick={() => setSelectedProject(null)} />

            {/* Bottom Slider Drawer sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="relative w-full max-w-2xl bg-paper border-t border-hairline rounded-t-3xl p-6 md:p-8 shadow-[0_-20px_50px_rgba(0,0,0,0.15)] z-10 max-h-[85vh] overflow-y-auto scroller"
            >
              {/* Little drag handle bar */}
              <div className="w-12 h-1 bg-hairline-soft rounded-full mx-auto mb-6 cursor-pointer" onClick={() => setSelectedProject(null)} />

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
              <div className="mt-8 pt-4 border-t border-hairline flex flex-col sm:flex-row justify-between items-center gap-4">
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
                <button
                  onClick={() => setSelectedProject(null)}
                  className="font-mono text-xs uppercase tracking-wider text-ink-faint hover:text-ink transition-colors cursor-pointer"
                >
                  Dismiss Detailed sheet
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
