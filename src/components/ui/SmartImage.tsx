import Image from 'next/image';

// Must match images.remotePatterns in next.config.js
const OPTIMIZED_HOSTS = [
  'res.cloudinary.com',
  'images.unsplash.com',
  'via.placeholder.com',
  'picsum.photos',
];

function canOptimize(src: string) {
  if (src.startsWith('/')) return true;
  try {
    return OPTIMIZED_HOSTS.includes(new URL(src).hostname);
  } catch {
    return false;
  }
}

type SmartImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

// Fills its positioned parent, which reserves the space. Images from hosts the
// optimizer does not allow fall back to a plain lazy-loaded <img>.
export function SmartImage({
  src,
  alt,
  sizes,
  className,
  priority = false,
}: SmartImageProps) {
  if (canOptimize(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={className}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={`absolute inset-0 h-full w-full ${className ?? ''}`}
    />
  );
}
