'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { site } from '@/data/site';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export function Navigation({ name }: { name: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // The active section is the one crossing the middle of the viewport
  useEffect(() => {
    const sections = site.nav
      .map(item => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const handle = name.split(' ')[0].toLowerCase();

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || isOpen
          ? 'border-line bg-bg/90 backdrop-blur'
          : 'border-transparent bg-transparent'
      }`}
    >
      <nav className="wrap" aria-label="Main">
        <div className="flex h-16 items-center justify-between gap-4">
          <a
            href="#home"
            className="-ml-2 inline-flex min-h-[2.75rem] items-center rounded px-2 font-mono text-base font-semibold text-fg"
            aria-label={`${name}, back to top`}
          >
            <span className="text-brand" aria-hidden="true">
              ~/
            </span>
            {handle}
          </a>

          <div className="flex items-center gap-2">
            <ul className="hidden items-center md:flex">
              {site.nav.map(item => {
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      aria-current={isActive ? 'location' : undefined}
                      className={`relative inline-flex min-h-[2.75rem] items-center rounded px-3 font-mono text-sm transition-colors duration-200 ${
                        isActive ? 'text-fg' : 'text-muted hover:text-fg'
                      }`}
                    >
                      {item.name}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-3 bottom-2 h-0.5 origin-left rounded-full bg-brand transition-transform duration-300 ease-out ${
                          isActive ? 'scale-x-100' : 'scale-x-0'
                        }`}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>

            <ThemeToggle />

            <button
              type="button"
              onClick={() => setIsOpen(open => !open)}
              className="icon-btn md:hidden"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Stays in the DOM so it can animate; `invisible` removes it from tab order */}
        <div
          id="mobile-menu"
          className={`absolute inset-x-0 top-16 border-b border-line bg-bg transition-[opacity,transform,visibility] duration-200 ease-out md:hidden ${
            isOpen
              ? 'visible translate-y-0 opacity-100'
              : 'invisible -translate-y-2 opacity-0'
          }`}
        >
          <ul className="wrap py-3">
            {site.nav.map(item => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setIsOpen(false)}
                    aria-current={isActive ? 'location' : undefined}
                    className={`flex min-h-[2.75rem] items-center gap-3 rounded px-2 font-mono text-base transition-colors duration-200 ${
                      isActive ? 'text-fg' : 'text-muted'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={isActive ? 'text-brand' : 'text-transparent'}
                    >
                      &gt;
                    </span>
                    {item.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}
