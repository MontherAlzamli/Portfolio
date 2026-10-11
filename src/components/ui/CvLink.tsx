import { Download } from 'lucide-react';

// A file hosted on this site downloads directly; an external link (Drive,
// Dropbox and so on) opens in a new tab, where the browser cannot force a download
export function CvLink({ href }: { href: string }) {
  const local = href.startsWith('/');

  return (
    <a
      href={href}
      className="btn btn-outline"
      {...(local
        ? { download: true }
        : { target: '_blank', rel: 'noopener noreferrer' })}
      aria-label={local ? 'Download CV' : 'Download CV (opens in a new tab)'}
    >
      <Download className="h-4 w-4" aria-hidden="true" />
      Download CV
    </a>
  );
}
