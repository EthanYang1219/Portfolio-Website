# Ethan Yang — Engineering Portfolio

An editorial-grade, highly interactive portfolio website showcasing the intersection of mathematical physics modeling, real-time robotics controls (C++), mechanical chassis fabrication, and modern full-stack web architectures. 

Built from first principles utilizing **React 19**, **TypeScript**, **Tailwind CSS**, and **motion/react**, featuring live controls-engineering visualizations and hardware-accelerated animations.

---

## 🛠️ Performance Architecture & Features

This portfolio is built to reflect the high-precision mindset of **Mathematical Physics** and **Competitive VEX/Formula SAE engineering**. It replaces flat, generic layouts with live, mathematical mockups:

1. **100Hz PID Tuning Feedback Simulator**
   * Implemented a real-time Proportional-Integral-Derivative (PID) linear feedback controller. High-resolution math updates the correction loops dynamically.
   * Users can tap directly inside the graphical canvas to set a new variable destination setpoint ($r(t)$) and watch the simulated inertia settle with real-time derivative overshoot dampening.

2. **Damped Organic WebGL Shader Backdrop**
   * High-performance floating background utilizing custom, theme-aware Fragment and Vertex GLSL shaders.
   * Tracks cursors with heavy physical dampening for subtle particle attraction, capped at `DPR = 1.5` to maintain constant `60 FPS` rendering without high CPU overhead.

3. **Curriculum & Core Competency Timelines**
   * Dynamic coordinate mappings linking continuous technical lists (C++, Onshape, composite layup) to active simulators.
   * Interactive university academic profiles displaying honors calculus, vector manifolds, and linear factorization datasets.

4. **Elastic Custom Mouse Pointer Interface**
   * Low-inertia custom mouse cursor reflecting local hover states on high-utility components, fully respecting accessibility preferences (`prefers-reduced-motion`).

5. **Responsive Typography & Grids**
   * Pairing high-optical-contrast display typography (**Fraunces**) with versatile modern bodies (**Manrope**) and metadata modules (**JetBrains Mono**), styled within a warm ivory/charcoal paper palette.

---

## 📂 Project Directory Structure

```text
├── assets/                     # Optimization assets & visuals
├── src/
│   ├── components/
│   │   ├── About.tsx           # Academic curricula details & modules 
│   │   ├── Contact.tsx         # Email copy connections & socials 
│   │   ├── CustomCursor.tsx    # Low-inertia interactive focus mouse pointer
│   │   ├── Experience.tsx      # Chronological timelines (UWFE Formula & VEX)
│   │   ├── Footer.tsx          # Back-to-top controls & semantic attributes
│   │   ├── Header.tsx          # Scroll-docking navigation & theme controller
│   │   ├── Hero.tsx            # Giant displays, rotating tickers, & scroll tracking
│   │   ├── SelectedWork.tsx    # PID feedback loop & python shell simulators
│   │   ├── ShaderBackground.tsx# Custom low-level organic WebGL canvas renders
│   │   └── SkillsMarquee.tsx   # Seamless wrapping endless ticker row
│   ├── App.tsx                 # Core layout structures & routing intersection observers
│   ├── index.css               # Tailored Tailwind theme variables & custom utilities
│   ├── types.ts                # Strict types and data schemas for components
│   └── main.tsx                # Mounting entry point
├── package.json                # Dependencies configuration
└── vite.config.ts              # Bundler optimization setups
```

---

## 🚀 Local Implementation Guide

To preview the portfolio locally, you can compile and start the development server using:

```bash
# Install package dependencies
npm install

# Run live development server (Localhost bounds)
npm run dev

# Compile optimized static bundle
npm run build

# Audit code syntax and check TypeScript compiler
npm run lint
```

---

## 🔗 Syncing Code to Your GitHub Repository

Because the development environment runs on a secure container, you can sync these files to your external repository (e.g., `EthanYang1219/portfolio`) in two quick ways:

1. **Export to GitHub directly**:
   * Click on the **Settings Gear Icon** in the top right of the Google AI Studio UI.
   * Choose **Export** to connect yours with GitHub, which pushes the updated branch directly.
2. **Download as ZIP**:
   * Click on the **Settings Gear Icon** and download the entire workspace directory structure as a clean, structured `.zip` archive.
   * Extract the ZIP directly into your local Git workspace and push:
     ```bash
     git add .
     git commit -m "feat: migrate and upgrade portfolio to interactive React framework"
     git push origin main
     ```
