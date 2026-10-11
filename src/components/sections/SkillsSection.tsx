import type { CSSProperties } from 'react';
import type { Skill } from '@prisma/client';
import {
  Cloud,
  Code2,
  Database,
  LayoutTemplate,
  Server,
  Smartphone,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { site } from '@/data/site';

// Picks a group icon from keywords in the category name
const groupIcons: [RegExp, LucideIcon][] = [
  [/front|ui|client|web/i, LayoutTemplate],
  [/back|server|api/i, Server],
  [/data|sql|storage/i, Database],
  [/devops|cloud|deploy|infra|hosting/i, Cloud],
  [/mobile|android|ios|native/i, Smartphone],
  [/tool|test|other|misc/i, Wrench],
];

function iconFor(category: string): LucideIcon {
  return groupIcons.find(([pattern]) => pattern.test(category))?.[1] ?? Code2;
}

function groupSkills(skills: Skill[]) {
  const groups = new Map<string, Skill[]>();
  skills.forEach(skill => {
    groups.set(skill.category, [...(groups.get(skill.category) ?? []), skill]);
  });

  const rank = (category: string) => {
    const i = site.skillGroupOrder.findIndex(
      name => name.toLowerCase() === category.toLowerCase()
    );
    return i === -1 ? site.skillGroupOrder.length : i;
  };

  return Array.from(groups.entries()).sort(
    ([a], [b]) => rank(a) - rank(b) || a.localeCompare(b)
  );
}

export function SkillsSection({ skills }: { skills: Skill[] }) {
  const groups = groupSkills(skills);

  return (
    <section id="skills" className="section border-t border-line">
      <div className="wrap">
        <SectionHeading
          index="02"
          label="skills"
          title="Skills and technologies"
          description="The tools I use to design, build and ship products."
        />

        {groups.length === 0 ? (
          <p className="panel p-6 text-muted">
            Skills will be listed here soon.
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {groups.map(([category, items], i) => {
              const Icon = iconFor(category);
              return (
                <section
                  key={category}
                  className="panel p-6"
                  data-reveal
                  style={{ '--i': i % 3 } as CSSProperties}
                  aria-labelledby={`skills-${i}`}
                >
                  <div className="mb-5 flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line bg-surface-2 text-brand">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3
                      id={`skills-${i}`}
                      className="font-mono text-base font-semibold text-fg"
                    >
                      {category}
                    </h3>
                  </div>

                  <ul className="flex flex-wrap gap-2">
                    {items.map(skill => (
                      <li key={skill.id} className="chip">
                        {skill.iconUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={skill.iconUrl}
                            alt=""
                            width={16}
                            height={16}
                            loading="lazy"
                            decoding="async"
                            className="h-4 w-4 shrink-0"
                          />
                        )}
                        {skill.name}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
