"use client";

import { useEffect } from "react";

// Fades in any element with class "rv" once it enters the viewport. Reduced
// motion is handled purely in CSS (.rv stays visible), so no check needed here.
export function ScrollReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll(".rv");
    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
