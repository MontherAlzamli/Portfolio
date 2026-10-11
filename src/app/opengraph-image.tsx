import { ImageResponse } from 'next/og';
import { site } from '@/data/site';

export const alt = `${site.name}, ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const runtime = 'edge';

// Social sharing preview
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          backgroundColor: '#0f172a',
          backgroundImage:
            'linear-gradient(to right, rgba(51,65,85,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(51,65,85,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          color: '#f8fafc',
          fontFamily: 'monospace',
        }}
      >
        <div style={{ display: 'flex', fontSize: 30, color: '#22c55e' }}>
          {`> ${site.name}`}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: -2,
              maxWidth: 980,
            }}
          >
            {site.hero.headline}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 28,
              fontSize: 32,
              color: '#94a3b8',
            }}
          >
            {`${site.role} · React · Next.js · Node.js · TypeScript`}
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: 26, color: '#94a3b8' }}>
          {site.url.replace('https://', '')}
        </div>
      </div>
    ),
    size
  );
}
