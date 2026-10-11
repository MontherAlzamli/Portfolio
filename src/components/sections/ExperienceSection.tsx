import type { Experience } from '@prisma/client';
import { SectionHeading } from '@/components/ui/SectionHeading';

const monthYear = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

const isoMonth = (date: Date) => date.toISOString().slice(0, 7);

export function ExperienceSection({
  experience,
}: {
  experience: Experience[];
}) {
  return (
    <section id="experience" className="section border-t border-line">
      <div className="wrap">
        <SectionHeading
          index="04"
          label="experience"
          title="Work experience"
          description="Where I have worked and what I did there."
        />

        {experience.length === 0 ? (
          <p className="panel p-6 text-muted">
            Experience will be listed here soon.
          </p>
        ) : (
          <div className="relative max-w-3xl">
            <div
              aria-hidden="true"
              data-reveal-line
              className="absolute bottom-2 left-[7px] top-2 w-px bg-line"
            />

            <ol className="space-y-8">
              {experience.map(item => (
                <li key={item.id} className="relative pl-10" data-reveal>
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-7 h-[15px] w-[15px] rounded-full border-2 bg-bg ${
                      item.current ? 'border-brand' : 'border-line-strong'
                    }`}
                  />

                  <article className="panel p-6">
                    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                      <div>
                        <h3 className="font-mono text-lg font-semibold text-fg">
                          {item.role}
                        </h3>
                        <p className="mt-1 font-medium text-brand">
                          {item.company}
                        </p>
                      </div>

                      {item.current && (
                        <span className="chip border-brand/50 text-brand">
                          <span
                            className="h-1.5 w-1.5 rounded-full bg-brand"
                            aria-hidden="true"
                          />
                          Current
                        </span>
                      )}
                    </div>

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

                    <p className="mt-4 whitespace-pre-line leading-relaxed text-muted">
                      {item.description}
                    </p>
                  </article>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
