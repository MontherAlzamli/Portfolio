import { Clock, Github, Linkedin, Mail, MapPin } from 'lucide-react';
import { CvLink } from '@/components/ui/CvLink';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ContactForm } from '@/components/sections/ContactForm';
import { site } from '@/data/site';
import type { PublicProfile } from '@/lib/content';

export function ContactSection({ profile }: { profile: PublicProfile }) {
  const socials = [
    { label: 'GitHub', href: profile.github, Icon: Github },
    { label: 'LinkedIn', href: profile.linkedin, Icon: Linkedin },
  ].filter(item => item.href);

  return (
    <section id="contact" className="section border-t border-line">
      <div className="wrap">
        <SectionHeading
          index="06"
          label="contact"
          title="Let's work together"
          description={site.contact.intro}
        />

        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div data-reveal>
            <ul className="space-y-5">
              {profile.email && (
                <li className="flex items-start gap-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line bg-surface text-brand">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-muted">Email</p>
                    <a
                      href={`mailto:${profile.email}`}
                      className="link inline-flex min-h-[2.75rem] items-center break-all font-medium"
                    >
                      {profile.email}
                    </a>
                  </div>
                </li>
              )}
              {profile.location && (
                <li className="flex items-start gap-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line bg-surface text-brand">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-mono text-xs text-muted">Location</p>
                    <p className="mt-1 font-medium text-fg">
                      {profile.location}
                    </p>
                  </div>
                </li>
              )}
              <li className="flex items-start gap-4">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line bg-surface text-brand">
                  <Clock className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-mono text-xs text-muted">Response time</p>
                  <p className="mt-1 font-medium text-fg">
                    {site.contact.responseTime}
                  </p>
                </div>
              </li>
            </ul>

            {(socials.length > 0 || profile.cvUrl) && (
              <div className="mt-8 border-t border-line pt-6">
                <p className="mb-3 font-mono text-xs text-muted">
                  Find me online
                </p>
                <ul className="flex flex-wrap gap-2">
                  {socials.map(({ label, href, Icon }) => (
                    <li key={label}>
                      <a
                        href={href as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                        aria-label={`${label} (opens in a new tab)`}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {label}
                      </a>
                    </li>
                  ))}
                  {profile.cvUrl && (
                    <li>
                      <CvLink href={profile.cvUrl} />
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          <div data-reveal>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
