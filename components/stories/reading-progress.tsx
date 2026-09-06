"use client";

import { useEffect, useRef } from "react";

// Fills as the reader scrolls through the nearest <article>.
export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const article = document.querySelector("article");
    const bar = barRef.current;
    if (!article || !bar) return;

    const tick = () => {
      const rect = article.getBoundingClientRect();
      const scrollable = article.getBoundingClientRect().height - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
      bar.style.width = `${progress * 100}%`;
    };

    tick();
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    return () => {
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", tick);
    };
  }, []);

  return <div className="prog" ref={barRef} />;
}
