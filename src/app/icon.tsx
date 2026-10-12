import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';
export const runtime = 'edge';

// PNG fallback for browsers that don't render the SVG favicon
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 7,
          backgroundImage: 'linear-gradient(135deg, #0b0f19, #1e293b)',
          color: '#38bdf8',
          fontSize: 17,
          fontWeight: 700,
        }}
      >
        MA
      </div>
    ),
    size
  );
}
