'use client';

import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Storage can be unavailable in private windows; the toggle still works
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="icon-btn"
      aria-label="Switch between dark and light theme"
    >
      {/* Both icons render; globals.css shows the one for the active theme */}
      <Sun className="theme-icon-light h-5 w-5" aria-hidden="true" />
      <Moon className="theme-icon-dark h-5 w-5" aria-hidden="true" />
    </button>
  );
}
