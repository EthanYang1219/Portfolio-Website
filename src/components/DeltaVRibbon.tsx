import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

// Ported from the DeltaV climbing app's 3D "Ribbon" visualizer: a 2D-canvas
// perspective renderer that draws the climber's hip path as a stability-coloured
// ribbon (green→red) inside a wireframe wall volume with red origin axes.
// Auto-orbits, drag to rotate, Record re-rolls a fresh randomized climb.
// Keeps the app's authentic palette (signal red / chalk white on near-black).

type Pt = { x: number; y: number; z: number };

export default function DeltaVRibbon({ paused = false }: { paused?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [recording, setRecording] = useState(false);
  const prefersReduced = useReducedMotion();
  // mutable engine state, kept off React's render path
  const engine = useRef<any>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const R = {
      theta: Math.PI / 4, phi: Math.PI / 9, radius: 5.4,
      target: { x: 0, y: 1.2, z: 0 },
      points: [] as Pt[],
      mode: 'demo' as 'idle' | 'demo' | 'live',
      path: [] as Pt[], pathIdx: 0,
      frame: 0,
      W: 0, H: 0,
      dragging: false, lastX: 0, lastY: 0, autoOrbit: true,
      needsDraw: true,
      colorCache: {} as Record<number, string>,
      paused: false,
      startClimb: (_live: boolean) => {},
    };
    engine.current = R;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      R.W = rect.width; R.H = rect.height;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R.needsDraw = true;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // ── climb generation: drifting ascent with three crux shake zones ──
    const makeClimb = (randomize: boolean): Pt[] => {
      const N = 600;
      const cruxes = randomize
        ? [0, 1, 2].map((i) => ({ c: 0.16 + i * 0.28 + Math.random() * 0.14, w: 0.035 + Math.random() * 0.025, s: 0.8 + Math.random() * 1.1 }))
        : [{ c: 0.28, w: 0.055, s: 1.0 }, { c: 0.60, w: 0.050, s: 1.7 }, { c: 0.86, w: 0.040, s: 1.2 }];
      const pts: Pt[] = [];
      for (let i = 0; i < N; i++) {
        const t = i / (N - 1);
        const y = t * 2.6;
        let x = Math.sin(t * Math.PI * 2.2) * 0.45 + Math.sin(t * Math.PI * 5.0) * 0.10;
        let z = -1.1 + Math.sin(t * Math.PI * 1.3) * 0.16;
        for (const cx of cruxes) {
          const d = (t - cx.c) / cx.w;
          const env = Math.exp(-d * d);
          x += Math.sin(i * 0.9) * 0.045 * cx.s * env;
          z += Math.cos(i * 0.8) * 0.035 * cx.s * env;
        }
        pts.push({ x, y, z });
      }
      return pts;
    };

    const instability = (pts: Pt[]): number => {
      if (pts.length < 3) return 0;
      let total = 0, n = 0;
      for (let i = 1; i < pts.length - 1; i++) {
        const ax = pts[i].x - pts[i - 1].x, ay = pts[i].y - pts[i - 1].y, az = pts[i].z - pts[i - 1].z;
        const bx = pts[i + 1].x - pts[i].x, by = pts[i + 1].y - pts[i].y, bz = pts[i + 1].z - pts[i].z;
        const la = Math.hypot(ax, ay, az), lb = Math.hypot(bx, by, bz);
        if (la < 1e-6 || lb < 1e-6) continue;
        const cos = Math.min(1, Math.max(-1, (ax * bx + ay * by + az * bz) / (la * lb)));
        total += Math.acos(cos); n++;
      }
      return n ? Math.min(1, (total / n) / 0.45) : 0;
    };

    const stabColor = (t: number, alpha = 1): string => {
      const g = [48, 209, 88], y = [255, 214, 10], r = [255, 69, 58];
      let a, b, k;
      if (t < 0.5) { a = g; b = y; k = t * 2; } else { a = y; b = r; k = (t - 0.5) * 2; }
      const c = [0, 1, 2].map((i) => Math.round(a[i] + (b[i] - a[i]) * k));
      return `rgba(${c[0]},${c[1]},${c[2]},${alpha})`;
    };

    type Basis = { cam: Pt; f: number[]; r: number[]; u: number[] };
    const basis = (): Basis => {
      const cp = Math.cos(R.phi), sp = Math.sin(R.phi);
      const ct = Math.cos(R.theta), st = Math.sin(R.theta);
      const cam = { x: R.target.x + R.radius * cp * ct, y: R.target.y + R.radius * sp, z: R.target.z + R.radius * cp * st };
      let fx = R.target.x - cam.x, fy = R.target.y - cam.y, fz = R.target.z - cam.z;
      const fl = Math.hypot(fx, fy, fz); fx /= fl; fy /= fl; fz /= fl;
      let rx = -fz, ry = 0, rz = fx;
      const rl = Math.hypot(rx, ry, rz) || 1; rx /= rl; rz /= rl;
      const ux = ry * fz - rz * fy, uy = rz * fx - rx * fz, uz = rx * fy - ry * fx;
      return { cam, f: [fx, fy, fz], r: [rx, ry, rz], u: [ux, uy, uz] };
    };

    const project = (p: Pt, B: Basis) => {
      const dx = p.x - B.cam.x, dy = p.y - B.cam.y, dz = p.z - B.cam.z;
      const zc = dx * B.f[0] + dy * B.f[1] + dz * B.f[2];
      if (zc < 0.1) return null;
      const xc = dx * B.r[0] + dy * B.r[1] + dz * B.r[2];
      const yc = dx * B.u[0] + dy * B.u[1] + dz * B.u[2];
      const focal = R.H * 0.9;
      return { x: R.W / 2 + (xc * focal) / zc, y: R.H / 2 - (yc * focal) / zc, s: focal / zc };
    };

    const line = (B: Basis, a: Pt, b: Pt, style: string, width: number) => {
      const pa = project(a, B), pb = project(b, B);
      if (!pa || !pb) return;
      ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y);
      ctx.strokeStyle = style; ctx.lineWidth = width; ctx.stroke();
    };

    const drawGrid = (B: Basis) => {
      const W2 = 2, D2 = 1.5, Hh = 3, sp = 0.5;
      const faint = 'rgba(244,241,234,0.06)';
      const frame = 'rgba(244,241,234,0.18)';
      const axis = 'rgba(255,43,61,0.85)';
      for (let x = -W2; x <= W2 + 0.001; x += sp) line(B, { x, y: 0, z: -D2 }, { x, y: 0, z: D2 }, faint, 1);
      for (let z = -D2; z <= D2 + 0.001; z += sp) line(B, { x: -W2, y: 0, z }, { x: W2, y: 0, z }, faint, 1);
      for (let x = -W2; x <= W2 + 0.001; x += sp) line(B, { x, y: 0, z: -D2 }, { x, y: Hh, z: -D2 }, faint, 1);
      for (let y = 0; y <= Hh + 0.001; y += sp) line(B, { x: -W2, y, z: -D2 }, { x: W2, y, z: -D2 }, faint, 1);
      const c: [Pt, Pt][] = [
        [{ x: -W2, y: 0, z: -D2 }, { x: W2, y: 0, z: -D2 }], [{ x: W2, y: 0, z: -D2 }, { x: W2, y: 0, z: D2 }],
        [{ x: W2, y: 0, z: D2 }, { x: -W2, y: 0, z: D2 }], [{ x: -W2, y: 0, z: D2 }, { x: -W2, y: 0, z: -D2 }],
        [{ x: -W2, y: 0, z: -D2 }, { x: -W2, y: Hh, z: -D2 }], [{ x: W2, y: 0, z: -D2 }, { x: W2, y: Hh, z: -D2 }],
        [{ x: -W2, y: 0, z: D2 }, { x: -W2, y: Hh, z: D2 }], [{ x: W2, y: 0, z: D2 }, { x: W2, y: Hh, z: D2 }],
        [{ x: -W2, y: Hh, z: -D2 }, { x: W2, y: Hh, z: -D2 }], [{ x: W2, y: Hh, z: -D2 }, { x: W2, y: Hh, z: D2 }],
        [{ x: W2, y: Hh, z: D2 }, { x: -W2, y: Hh, z: D2 }], [{ x: -W2, y: Hh, z: D2 }, { x: -W2, y: Hh, z: -D2 }],
      ];
      for (const [a, b] of c) line(B, a, b, frame, 1.2);
      line(B, { x: 0, y: 0, z: 0 }, { x: 0.5, y: 0, z: 0 }, axis, 2);
      line(B, { x: 0, y: 0, z: 0 }, { x: 0, y: Hh, z: 0 }, axis, 2);
      line(B, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0.5 }, axis, 2);
    };

    const drawRibbon = (B: Basis) => {
      const pts = R.points;
      if (pts.length < 2) return;
      const SEG = 8;
      let i = 0;
      while (i < pts.length - 1) {
        const end = Math.min(i + SEG, pts.length);
        const chunk = pts.slice(i, end);
        if (chunk.length < 2) break;
        let color = R.colorCache[i];
        if (!color) {
          color = stabColor(instability(chunk));
          if (end - i === SEG) R.colorCache[i] = color;
        }
        ctx.beginPath();
        let started = false, sSum = 0, sN = 0;
        for (const p of chunk) {
          const q = project(p, B);
          if (!q) continue;
          sSum += q.s; sN++;
          if (!started) { ctx.moveTo(q.x, q.y); started = true; } else ctx.lineTo(q.x, q.y);
        }
        if (started && sN) {
          ctx.strokeStyle = color;
          ctx.lineWidth = Math.max(1.5, 0.045 * (sSum / sN));
          ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          ctx.shadowColor = color; ctx.shadowBlur = 7;
          ctx.stroke(); ctx.shadowBlur = 0;
        }
        i += SEG - 1;
      }
      const tip = project(pts[pts.length - 1], B);
      if (tip) {
        const rad = Math.max(3, 0.05 * tip.s);
        const grd = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, rad * 2.4);
        grd.addColorStop(0, 'rgba(244,241,234,0.95)');
        grd.addColorStop(0.4, 'rgba(244,241,234,0.5)');
        grd.addColorStop(1, 'rgba(244,241,234,0)');
        ctx.beginPath(); ctx.arc(tip.x, tip.y, rad * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = grd; ctx.fill();
      }
    };

    R.startClimb = (live: boolean) => {
      R.points = []; R.colorCache = {}; R.path = makeClimb(live); R.pathIdx = 0;
      R.mode = live ? 'live' : 'demo';
    };
    R.startClimb(false); // open with the demo climb
    if (prefersReduced) {
      // reduced motion: show the full ribbon at rest — no reveal, no auto-orbit
      R.points = [...R.path];
      R.pathIdx = R.path.length;
      R.mode = 'idle';
      R.autoOrbit = false;
      R.needsDraw = true;
    }

    // Cap at ~40fps — the auto-orbit redraws the wireframe + ribbon every frame
    // forever, so throttling cuts its GPU/CPU cost with no perceptible change.
    const FRAME_INTERVAL = 1000 / 40;
    let lastFrame = -Infinity;

    const loop = (now: number) => {
      R.frame = requestAnimationFrame(loop);
      if (now - lastFrame < FRAME_INTERVAL) return;
      lastFrame = now;
      if (!R.paused) {
        if (R.mode === 'demo' || R.mode === 'live') {
          const perFrame = R.mode === 'demo' ? 2 : 1;
          for (let k = 0; k < perFrame; k++) {
            if (R.pathIdx < R.path.length) R.points.push(R.path[R.pathIdx++]);
            else { R.mode = 'idle'; setRecording(false); R.needsDraw = true; break; }
          }
        }
        if (R.autoOrbit && !R.dragging) { R.theta += 0.0014; R.needsDraw = true; }
        if (R.needsDraw || R.mode !== 'idle' || R.dragging) {
          R.needsDraw = false;
          ctx.fillStyle = '#050506';
          ctx.fillRect(0, 0, R.W, R.H);
          const B = basis();
          drawGrid(B);
          drawRibbon(B);
        }
      }
    };
    R.frame = requestAnimationFrame(loop);

    const onDown = (e: PointerEvent) => { R.dragging = true; R.autoOrbit = false; R.lastX = e.clientX; R.lastY = e.clientY; canvas.setPointerCapture(e.pointerId); };
    const onMove = (e: PointerEvent) => {
      if (!R.dragging) return;
      const dx = e.clientX - R.lastX, dy = e.clientY - R.lastY;
      R.lastX = e.clientX; R.lastY = e.clientY;
      R.theta += dx * 0.006;
      R.phi = Math.max(-0.15, Math.min(1.45, R.phi + dy * 0.006));
      R.needsDraw = true;
    };
    const onUp = () => { R.dragging = false; };
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);

    return () => {
      cancelAnimationFrame(R.frame);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
    };
  }, [prefersReduced]);

  // keep the engine's pause flag in sync (pauses when the card is offscreen)
  useEffect(() => { if (engine.current) engine.current.paused = paused; }, [paused]);

  const handleRecord = () => {
    const R = engine.current;
    if (!R) return;
    if (R.mode === 'live') { R.mode = 'idle'; R.needsDraw = true; setRecording(false); return; }
    R.startClimb(true);
    R.autoOrbit = true;
    setRecording(true);
  };

  return (
    <div ref={wrapRef} className="w-full h-full rounded-2xl overflow-hidden relative bg-[#050506]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
      />

      {/* status pill */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 font-mono text-[0.6rem] tracking-widest uppercase text-[#f4f1ea]/70 bg-black/30 border border-white/10 rounded-full py-1 px-2.5 pointer-events-none">
        <span className={`h-1.5 w-1.5 rounded-full ${recording ? 'bg-[#ff2b3d] animate-pulse' : 'bg-[#30d158]'}`} />
        {recording ? 'Live' : '3D Ribbon'}
      </div>

      {/* label */}
      <span className="absolute top-3 right-3 font-mono text-[0.55rem] tracking-widest uppercase text-[#f4f1ea]/40 pointer-events-none">
        drag to orbit
      </span>

      {/* record button */}
      <button
        onClick={handleRecord}
        aria-label={recording ? 'Stop recording' : 'Record a new climb'}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-black/40 border border-white/15 backdrop-blur-sm flex items-center justify-center hover:border-[#ff2b3d]/70 transition-colors cursor-pointer"
        data-cursor
      >
        <span
          className={`bg-[#ff2b3d] transition-all duration-200 ${recording ? 'w-3.5 h-3.5 rounded-[3px]' : 'w-5 h-5 rounded-full'} ${recording ? 'shadow-[0_0_12px_rgba(255,43,61,0.7)]' : ''}`}
        />
      </button>
    </div>
  );
}
