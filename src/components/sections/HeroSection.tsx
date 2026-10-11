import type { CSSProperties } from 'react';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { site } from '@/data/site';
import type { PublicProfile } from '@/lib/content';
import { CvLink } from '@/components/ui/CvLink';
import { HeroTerminal } from '@/components/sections/HeroTerminal';

// Position in the page-load sequence
const step = (d: number) => ({ '--d': d }) as CSSProperties;

export function HeroSection({ profile }: { profile: PublicProfile }) {
  const { hero } = site;
  // Edited in the dashboard; the defaults in site.ts apply while a field is empty
  const headline = profile.heroHeadline?.trim() || hero.headline;
  const valueProp = profile.heroText?.trim() || hero.valueProp;
  const availability = profile.availability?.trim() || hero.availability;

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden pb-20 pt-28 lg:pb-28 lg:pt-40"
    >
      <div aria-hidden="true" className="hero-grid absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="hero-glow absolute -top-40 left-1/2 -z-10 h-[36rem] w-[36rem] -translate-x-1/2"
      />

      <div className="wrap grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div>
          <p
            className="hero-in mb-5 font-mono text-sm text-muted"
            style={step(0)}
          >
            <span className="text-brand" aria-hidden="true">
              &gt;{' '}
            </span>
            {profile.name}
            <span aria-hidden="true"> · </span>
            <span className="sr-only">, </span>
            {profile.title}
          </p>

          <h1
            className="hero-in font-mono text-display font-semibold text-fg text-balance"
            style={step(1)}
          >
            {headline}
          </h1>

          <p
            className="hero-in mt-6 max-w-xl text-lg leading-relaxed text-muted"
            style={step(2)}
          >
            {valueProp}
          </p>

          <div
            className="hero-in mt-8 flex flex-col gap-3 sm:flex-row"
            style={step(3)}
          >
            <a href="#projects" className="btn btn-accent group">
              View projects
              <ArrowDown
                className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-y-0.5"
                aria-hidden="true"
              />
            </a>
            <a href="#contact" className="btn btn-outline">
              Contact me
            </a>
            {profile.cvUrl && <CvLink href={profile.cvUrl} />}
          </div>

          <div
            className="hero-in mt-8 flex flex-wrap items-center gap-x-6 gap-y-4"
            style={step(4)}
          >
            <p className="inline-flex items-center gap-2 font-mono text-sm text-muted">
              <span
                className="h-2 w-2 rounded-full bg-brand"
                aria-hidden="true"
              />
              {availability}
            </p>

            <ul className="flex gap-2">
              {profile.github && (
                <li>
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-btn"
                    aria-label="GitHub profile (opens in a new tab)"
                  >
                    <Github className="h-5 w-5" aria-hidden="true" />
                  </a>
                </li>
              )}
              {profile.linkedin && (
                <li>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-btn"
                    aria-label="LinkedIn profile (opens in a new tab)"
                  >
                    <Linkedin className="h-5 w-5" aria-hidden="true" />
                  </a>
                </li>
              )}
              {profile.email && (
                <li>
                  <a
                    href={`mailto:${profile.email}`}
                    className="icon-btn"
                    aria-label={`Email ${profile.email}`}
                  >
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Decorative: repeats what the text beside it already says */}
        <div className="hero-in" style={step(3)} aria-hidden="true">
          <div className="overflow-hidden rounded-lg border border-term-line bg-term-bg shadow-lift">
            <div className="flex items-center gap-2 border-b border-term-line px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#f87171]" />
              <span className="h-3 w-3 rounded-full bg-[#fbbf24]" />
              <span className="h-3 w-3 rounded-full bg-[#4ade80]" />
              <span className="ml-3 truncate font-mono text-xs text-term-muted">
                {profile.name.split(' ')[0].toLowerCase()}@portfolio: ~
              </span>
            </div>

            <HeroTerminal
              name={profile.name}
              title={profile.title}
              stack={hero.stack}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
