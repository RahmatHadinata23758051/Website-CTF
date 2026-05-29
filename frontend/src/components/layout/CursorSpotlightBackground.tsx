import React from "react";

export function CursorSpotlightBackground() {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      // Set a static, subtle centered spotlight
      container.style.setProperty("--cursor-x", "50%");
      container.style.setProperty("--cursor-y", "50%");
      return;
    }

    // Set initial position to center
    container.style.setProperty("--cursor-x", `${window.innerWidth / 2}px`);
    container.style.setProperty("--cursor-y", `${window.innerHeight / 2}px`);

    const handlePointerMove = (e: PointerEvent) => {
      // Directly modify DOM style variables to bypass React rendering loops for 120 FPS performance
      container.style.setProperty("--cursor-x", `${e.clientX}px`);
      container.style.setProperty("--cursor-y", `${e.clientY}px`);
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-40 transition-opacity duration-500 hidden md:block"
      style={{
        background: `radial-gradient(circle 35rem at var(--cursor-x, 50%) var(--cursor-y, 50%), rgba(200, 255, 0, 0.08) 0%, rgba(200, 255, 0, 0.01) 50%, transparent 100%)`,
      }}
    />
  );
}
