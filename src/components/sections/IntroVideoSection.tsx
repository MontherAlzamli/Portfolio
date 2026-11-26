'use client';

import { useState } from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';

const reels = [
  {
    id: 'en',
    label: 'English',
    lang: 'en',
    src: '/videos/2-intro-en.mp4',
    poster: '/videos/4-intro-en.jpg',
  },
  {
    id: 'ar',
    label: 'العربية',
    lang: 'ar',
    src: '/videos/1-intro-ar.mp4',
    poster: '/videos/3-intro-ar.jpg',
  },
] as const;

export function IntroVideoSection() {
  const [active, setActive] = useState<(typeof reels)[number]['id']>('en');
  const reel = reels.find(item => item.id === active) ?? reels[0];

  return (
    <section id="intro" className="section border-t border-line">
      <div className="wrap">
        <SectionHeading
          index="00"
          label="intro"
          title="Watch my intro"
          description="A one-minute introduction, in English or Arabic."
        />

        <div className="mx-auto w-full max-w-sm" data-reveal>
          <div
            role="group"
            aria-label="Video language"
            className="mb-4 flex justify-center gap-2"
          >
            {reels.map(item => (
              <button
                key={item.id}
                type="button"
                lang={item.lang}
                aria-pressed={active === item.id}
                onClick={() => setActive(item.id)}
                className={`min-h-[2.75rem] rounded border px-4 font-mono text-sm transition-colors duration-200 ${
                  active === item.id
                    ? 'border-brand text-brand'
                    : 'border-line text-muted hover:text-fg'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="panel overflow-hidden">
            <video
              key={reel.id}
              controls
              playsInline
              preload="metadata"
              poster={reel.poster}
              className="aspect-[9/16] w-full bg-surface-2"
            >
              <source src={reel.src} type="video/mp4" />
              Your browser does not support video playback.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}
