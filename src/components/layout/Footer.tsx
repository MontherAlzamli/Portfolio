import { site } from '@/data/site';

export function Footer({ name }: { name: string }) {
  return (
    <footer className="border-t border-line py-8">
      <div className="wrap flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-sm text-muted">
          © {new Date().getFullYear()} {name}
        </p>

        <nav aria-label="Footer">
          <ul className="-mx-2 flex flex-wrap">
            {site.nav.map(item => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="inline-flex min-h-[2.75rem] items-center px-2 font-mono text-sm text-muted transition-colors duration-200 hover:text-fg"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
