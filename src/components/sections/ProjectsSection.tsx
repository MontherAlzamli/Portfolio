import type { CSSProperties } from 'react';
import type { Project } from '@prisma/client';
import { ArrowUpRight, Github } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SmartImage } from '@/components/ui/SmartImage';

function ProjectCard({ project }: { project: Project }) {
  const tags = project.technologies
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean);
  const primaryUrl = project.link || project.githubUrl;

  return (
    <article className="panel group flex h-full flex-col overflow-hidden transition-[transform,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-brand/60 focus-within:border-brand/60">
      <div className="relative aspect-video overflow-hidden border-b border-line bg-surface-2">
        <SmartImage
          src={project.imageUrl}
          alt={`Screenshot of ${project.title}`}
          sizes="(min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {project.featured && (
          <span className="absolute left-3 top-3 rounded border border-term-line bg-term-bg px-2 py-1 font-mono text-xs text-term-accent">
            Featured
          </span>
        )}

        {/* Hover reveal for pointer devices; the same links are always in the card footer */}
        {primaryUrl && (
          <a
            href={primaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={-1}
            aria-hidden="true"
            className="absolute inset-0 flex items-end bg-gradient-to-t from-term-bg via-term-bg/60 to-transparent p-4 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
          >
            <span className="inline-flex translate-y-2 items-center gap-1 font-mono text-sm text-term-fg transition-transform duration-300 ease-out group-hover:translate-y-0">
              {project.link ? 'Open live site' : 'View source'}
              <ArrowUpRight className="h-4 w-4 text-term-accent" />
            </span>
          </a>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-mono text-lg font-semibold text-fg">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-3 leading-relaxed text-muted">
          {project.description}
        </p>

        {tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
            {tags.map(tag => (
              <li key={tag} className="chip">
                {tag}
              </li>
            ))}
          </ul>
        )}

        {(project.link || project.githubUrl) && (
          <div className="mt-auto flex flex-wrap gap-3 pt-6">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-accent flex-1"
                aria-label={`Live site for ${project.title} (opens in a new tab)`}
              >
                Live site
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline flex-1"
                aria-label={`Source code for ${project.title} on GitHub (opens in a new tab)`}
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                Code
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="section border-t border-line">
      <div className="wrap">
        <SectionHeading
          index="03"
          label="projects"
          title="Selected projects"
          description="Products I have designed, built and shipped."
        />

        {projects.length === 0 ? (
          <p className="panel p-6 text-muted">
            Projects will be listed here soon.
          </p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <li
                key={project.id}
                data-reveal
                style={{ '--i': i % 3 } as CSSProperties}
              >
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
