import type { MetadataRoute } from 'next';
import { site } from '@/data/site';

// The public site is a single page
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
