import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable on mobile/touch viewports or if prefers-reduced-motion is set
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!hasFinePointer || prefersReduced) return;

    setIsVisible(true);

    // Hide the native OS cursor while the custom dot is active. Scoped to a
    // class so touch / reduced-motion users (no dot) keep the normal cursor.
    document.documentElement.classList.add('native-cursor-off');

    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let targetX = currentX;
    let targetY = currentY;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    let animationId: number;
    const tick = () => {
      // 0.18 elastic tracking constant
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;

      // Read the ref every frame: the div mounts AFTER this effect runs
      // (isVisible starts false), so a captured const would stay null forever
      const dot = dotRef.current;
      if (dot) {
        dot.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
      }

      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);

    // Event delegation to catch dynamic layout hovers
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.closest('a') ||
          target.closest('button') ||
          target.hasAttribute('data-cursor') ||
          target.closest('[data-cursor]'))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mouseover', onMouseOver, { passive: true });

    return () => {
      document.documentElement.classList.remove('native-cursor-off');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(animationId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={dotRef}
      className={`cursor-dot fixed top-0 left-0 z-[9998] rounded-full pointer-events-none transition-[width,height,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none mix-blend-multiply dark:mix-blend-screen ${
        isHovered
          ? 'w-[44px] h-[44px] bg-[var(--accent-tint)] border border-accent/20'
          : 'w-2 h-2 bg-accent'
      }`}
      aria-hidden="true"
    />
  );
}
