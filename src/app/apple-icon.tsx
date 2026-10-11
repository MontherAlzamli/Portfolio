import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';
export const runtime = 'edge';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1e293b',
          color: '#22c55e',
          fontFamily: 'monospace',
          fontSize: 92,
          fontWeight: 700,
        }}
      >
        {'>_'}
      </div>
    ),
    size
  );
}
