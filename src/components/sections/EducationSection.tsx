import type { CSSProperties } from 'react';
import type { Education } from '@prisma/client';
import { GraduationCap } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';

const monthYear = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

const isoMonth = (date: Date) => date.toISOString().slice(0, 7);

// Renders nothing until at least one entry exists, so the page never shows an
// empty education block
export function EducationSection({ education }: { education: Education[] }) {
  if (education.length === 0) return null;

  return (
    <section id="education" className="section border-t border-line">
      <div className="wrap">
        <SectionHeading
          index="05"
          label="education"
          title="Education"
          description="Degrees and formal training behind the work."
        />

        <ul className="grid gap-6 md:grid-cols-2">
          {education.map((item, i) => (
            <li
              key={item.id}
              data-reveal
              style={{ '--i': i % 2 } as CSSProperties}
            >
              <article className="panel flex h-full gap-4 p-6">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line bg-surface-2 text-brand">
                  <GraduationCap className="h-5 w-5" aria-hidden="true" />
                </span>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                    <h3 className="font-mono text-lg font-semibold text-fg">
                      {item.degree}
                    </h3>
                    {item.current && (
                      <span className="chip border-brand/50 text-brand">
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-brand"
                          aria-hidden="true"
                        />
                        In progress
                      </span>
                    )}
                  </div>

                  <p className="mt-1 font-medium text-brand">
                    {item.institution}
                  </p>

                  <p className="mt-3 font-mono text-sm text-muted">
                    <time dateTime={isoMonth(item.startDate)}>
                      {monthYear.format(item.startDate)}
                    </time>
                    <span aria-hidden="true"> – </span>
                    <span className="sr-only"> to </span>
                    {item.current || !item.endDate ? (
                      'Present'
                    ) : (
                      <time dateTime={isoMonth(item.endDate)}>
                        {monthYear.format(item.endDate)}
                      </time>
                    )}
                  </p>

                  {item.description && (
                    <p className="mt-4 whitespace-pre-line leading-relaxed text-muted">
                      {item.description}
                    </p>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
