# Ethan Yang — Engineering Portfolio

An editorial, highly interactive portfolio at the intersection of mathematical-physics modeling, real-time robotics controls (C++), mechanical chassis fabrication, and modern full-stack web architecture.

Built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **motion/react**, featuring live controls-engineering visualizations and hardware-accelerated animation. The site is **dark-only** and warm-toned (Fraunces / Manrope / JetBrains Mono on a charcoal-and-ember palette).

**Live:** https://ethanyang1219.github.io/Portfolio-Website/

---

## ✨ Interactive features

1. **PID tuning simulator** — a real-time proportional-integral-derivative feedback loop rendered on a canvas in `SelectedWork`. Tap inside the plot to set a new setpoint and watch the simulated inertia settle with derivative overshoot damping. The loop pauses when scrolled offscreen.
2. **DeltaV "ribbon" visualizer** (`DeltaVRibbon.tsx`) — a 2D-canvas, 3D-perspective climb-path renderer ported from the DeltaV climbing app (auto-orbit, drag to rotate, record a new climb), used as the DeltaV project's live mockup.
3. **WebGL shader backdrop** (`ShaderBackground.tsx`) — a full-page, cursor-reactive GLSL background with a single warm dark palette, capped frame rate for low CPU.
4. **Scroll-reel testimonials** (`Testimonials.tsx` + `components/ui/scroll-reel-testimonials.tsx`) — a counter-rotating portrait reel with one quote featured at a time, auto-advance, and labeled LinkedIn links.
5. **Skills marquee + skill filter** — an endless ticker (`SkillsMarquee.tsx`) whose chips filter the work dashboard / experience timeline.
6. **Experience & About** — chronological timelines (UW Formula Electric, VEX) with role links, and academic detail modules.
7. **Custom CSS cursor & reduced-motion support** — a pure-CSS pointer (defined in `index.css`) and full `prefers-reduced-motion` handling across animations.

---

## 📂 Structure

```text
├── .github/workflows/deploy.yml   # GitHub Pages deploy (build → upload dist/ → deploy)
├── public/                        # static files served at the base path (og.png, 404.html, robots, sitemap, resume.pdf, icons)
├── src/
│   ├── components/
│   │   ├── ui/                    # reusable primitives (scroll-reel-testimonials, typewriter)
│   │   ├── Hero.tsx  SelectedWork.tsx  Experience.tsx  About.tsx
│   │   ├── Testimonials.tsx  SkillsMarquee.tsx  Contact.tsx
│   │   ├── Header.tsx  Footer.tsx
│   │   ├── ShaderBackground.tsx   # WebGL canvas backdrop
│   │   └── DeltaVRibbon.tsx       # 2D-canvas climb-path visualizer
│   ├── lib/utils.ts               # cn() — clsx + tailwind-merge
│   ├── index.css                  # Tailwind v4 theme tokens (@theme) + custom utilities & cursor
│   ├── types.ts                   # shared data schemas
│   ├── App.tsx                    # composes the page sections; scroll/skill-filter wiring
│   └── main.tsx                   # mount entry
└── vite.config.ts                 # base: '/Portfolio-Website/' (load-bearing for the sub-path deploy)
```

---

## 🚀 Local development

```bash
npm install      # install dependencies
npm run dev      # Vite dev server on :3000 (served at /Portfolio-Website/)
npm run build    # production build → dist/
npm run lint     # type-check (tsc --noEmit); no ESLint / test runner is configured
```

---

## 🌐 Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes `dist/` to **GitHub Pages**. Because the site lives under a project sub-path:

- `vite.config.ts` must keep `base: '/Portfolio-Website/'`, and
- assets are imported as ES modules from `src/assets/images/` so Vite rewrites their URLs with the base.

The UI is often authored in **Google AI Studio** and synced to this repo, so after an AI Studio push, diff `vite.config.ts` and `deploy.yml` — those have been reverted by syncs before.
