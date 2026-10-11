'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    __revealReady?: boolean;
  }
}

// Marks [data-reveal] and [data-reveal-line] elements as visible when they
// enter the viewport. The styles live in globals.css.
export function RevealObserver() {
  useEffect(() => {
    window.__revealReady = true;
    document.documentElement.classList.add('js');

    const targets = document.querySelectorAll<HTMLElement>(
      '[data-reveal], [data-reveal-line]'
    );

    if (!('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );

    targets.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
