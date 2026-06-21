# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install deps
npm run dev          # Vite dev server on :3000, served at /Portfolio-Website/ (see base, below)
npm run build        # production build -> dist/
npm run lint         # type-check only: tsc --noEmit  (there is NO ESLint and NO test runner)
```

There are no automated tests in this repo. "Verification" means `npm run lint` + `npm run build`, and—when behavior is visual/animation-driven—driving a real browser (the preview environment freezes rAF/IntersectionObserver). A headless-Chrome + `puppeteer-core` setup is used for that; Edge fails to launch here.

## Big picture

Single-page marketing/portfolio site. **Vite 6 + React 19 + TypeScript + Tailwind CSS v4 (`@tailwindcss/vite`) + `motion` (motion/react).** No router, no backend — `src/App.tsx` stacks section components (`Hero`, `SelectedWork`, `Experience`, `About`, `Testimonials`, `SkillsMarquee`, `Contact`, `Footer`) inside `motion.div` scroll-reveal wrappers; `main.tsx` mounts `App`. Path alias `@` → repo root (`vite.config.ts`); `src/lib/utils.ts` exports `cn()` (clsx + tailwind-merge).

### Theming (dark-only)
The site is **dark-only**: `index.html` hardcodes `<html lang="en" class="dark">` with no toggle and no theme-init script. Design tokens are CSS custom properties defined in `src/index.css` (under `html.dark`) and exposed to Tailwind via the v4 `@theme` block (e.g. `--color-accent`, `--color-paper`, `--color-ink`). Use the Tailwind token classes (`bg-paper`, `text-ink`, `text-accent`, `border-hairline`, …) rather than raw hex. Accent is the warm burnt-orange `#ff5e26`; fonts are Fraunces (display) / Manrope (sans) / JetBrains Mono (mono). Note: `bg-ink` resolves to the *light* cream color (ink is the text color in dark mode), so dark surfaces use explicit values like `bg-[#14110b]`.

### Deployment & the sub-path invariant (read before touching config)
Pushing to `main` deploys to GitHub Pages via `.github/workflows/deploy.yml` (build → upload `dist/` → deploy). The site is a **project page under a sub-path**, so two things must stay in sync or assets 404:
- `vite.config.ts` must keep `base: '/Portfolio-Website/'`.
- All images/assets are **ES-module imports** from `src/assets/images/` (Vite rewrites them with the base automatically) — don't hardcode `/asset` URLs; `public/` files must be referenced via `import.meta.env.BASE_URL`.

Verify a deploy with `gh run watch <id> --exit-status` then `gh run view <id> --json conclusion` — do **not** grep `gh run watch` text (it prints "Complete job" even on failure). The live URL is https://ethanyang1219.github.io/Portfolio-Website/.

### Co-authored with Google AI Studio — expect drift
This repo is also edited in Google AI Studio (UI is built there, then synced/pushed). Consequences to watch for:
- AI Studio pushes can **revert deploy config** (drop the vite `base`, corrupt `deploy.yml`) and re-introduce removed bloat. Always `git fetch` / diff after a parallel push; rebasing your commit onto theirs is normal.
- `vite.config.ts` has `DISABLE_HMR`-gated `server.hmr`/`watch` settings for the AI Studio container — leave them.
- `express`, `dotenv`, `@google/genai` in `package.json` are **unused but intentionally kept** (AI Studio expects them). Don't prune.

### Interactive set pieces (where the complexity lives)
- **`SelectedWork.tsx`** — each project has a bespoke live simulator in the right panel, selected by project **`id`** (not array index), so reordering the project list is safe; `App.tsx`'s `handleSkillClick` routing indices must be kept in sync with that order. Includes a real PID feedback-loop canvas. Project data is hoisted to module scope; the PID loop is gated to run only when its card is active **and** on-screen (IntersectionObserver `simVisible`) to avoid re-rendering the section continuously.
- **`DeltaVRibbon.tsx`** — a 2D-canvas perspective "ribbon" path visualizer (auto-orbit, drag-to-rotate, FPS-capped) ported from the DeltaV climbing app; `paused` prop stops its rAF when offscreen.
- **`ShaderBackground.tsx`** — full-page WebGL backdrop. ⚠️ It must **re-upload its palette/resolution uniforms every frame**; a "only on change" micro-opt left a stale palette on real GPUs.
- **`Testimonials.tsx` + `components/ui/scroll-reel-testimonials.tsx`** — a counter-rotating "scroll-reel" carousel. Reel geometry is driven by the `CELL`/`STEP` constants (tile size); the card height is locked to the tallest quote (all quotes stacked invisibly in one CSS-grid cell) so it never jumps. Anonymous-fallback avatars are SVGs in `src/assets/images/`.

### Cross-cutting conventions
- **Performance:** live canvases/loops pause when scrolled offscreen (IntersectionObserver); the global scroll handler in `App.tsx` is rAF-throttled.
- **Reduced motion:** honor `prefers-reduced-motion` everywhere — `App.tsx` wraps the tree in `<MotionConfig reducedMotion="user">`, components use `useReducedMotion()`, and `index.css` near-zeroes CSS animation durations under the reduced-motion media query.
- **Fixed overlays must be portaled to `document.body`.** Section components are wrapped in transformed (`whileInView`) `motion.div`s, and a transformed ancestor makes `position:fixed` resolve against it, not the viewport — so modals/lightboxes use `createPortal`.
- Body uses `overflow-x: clip` (not `hidden`) so it doesn't create a scroll container that would break `position: sticky`.
