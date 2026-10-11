import type { CSSProperties } from 'react';
import { Mail, MapPin } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SmartImage } from '@/components/ui/SmartImage';
import type { PublicProfile, SiteContent } from '@/lib/content';

type AboutSectionProps = {
  profile: PublicProfile;
  stats: SiteContent['stats'];
};

export function AboutSection({ profile, stats }: AboutSectionProps) {
  const numbers = [
    stats.years
      ? { value: `${stats.years}+`, label: 'Years of experience' }
      : null,
    stats.projects
      ? { value: `${stats.projects}`, label: 'Projects delivered' }
      : null,
    stats.skills
      ? { value: `${stats.skills}`, label: 'Technologies used' }
      : null,
  ].filter((item): item is { value: string; label: string } => item !== null);

  const paragraphs = profile.bio.split(/\n+/).filter(Boolean);

  return (
    <section id="about" className="section border-t border-line">
      <div className="wrap">
        <SectionHeading index="01" label="about" title="A bit about me" />

        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <figure
            className="panel mx-auto w-full max-w-sm overflow-hidden lg:mx-0"
            data-reveal
          >
            <div className="relative aspect-[4/5] bg-surface-2">
              <SmartImage
                src={profile.profileImage || '/profile-image.jpg'}
                alt={`Portrait of ${profile.name}`}
                sizes="(min-width: 1024px) 384px, (min-width: 640px) 384px, 90vw"
                className="object-cover object-top"
              />
            </div>
            <figcaption className="flex items-center justify-between gap-3 border-t border-line px-4 py-3 font-mono text-xs text-muted">
              <span className="truncate">{profile.name}</span>
              <span className="shrink-0 text-brand">{profile.title}</span>
            </figcaption>
          </figure>

          <div>
            <div
              className="space-y-4 text-lg leading-relaxed text-muted"
              data-reveal
            >
              {paragraphs.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </div>

            {numbers.length > 0 && (
              <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {numbers.map((item, i) => (
                  <div
                    key={item.label}
                    className="panel flex flex-col-reverse gap-1 p-5"
                    data-reveal
                    style={{ '--i': i } as CSSProperties}
                  >
                    <dt className="text-sm text-muted">{item.label}</dt>
                    <dd className="font-mono text-3xl font-semibold text-fg">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            <ul
              className="mt-8 flex flex-col gap-3 font-mono text-sm text-muted sm:flex-row sm:flex-wrap sm:gap-x-8"
              data-reveal
            >
              {profile.location && (
                <li className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand" aria-hidden="true" />
                  {profile.location}
                </li>
              )}
              {profile.email && (
                <li>
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex min-h-[2.75rem] items-center gap-2 transition-colors duration-200 hover:text-brand"
                  >
                    <Mail className="h-4 w-4 text-brand" aria-hidden="true" />
                    {profile.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
