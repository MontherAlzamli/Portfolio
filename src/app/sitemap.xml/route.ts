import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import logger from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const baseUrl = 'https://monther-alzamli.com';

    // Get dynamic content from database
    const [projects, experiences] = await Promise.all([
      prisma.project.findMany({
        select: {
          slug: true,
          updatedAt: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      }),
      prisma.experience.findMany({
        select: {
          id: true,
        },
        orderBy: {
          order: 'asc',
        },
      }),
    ]);

    // Static pages
    const staticPages = [
      {
        url: '',
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 1.0,
      },
      {
        url: '/admin',
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.3,
      },
    ];

    // Dynamic project pages
    const projectPages = projects.map(project => ({
      url: `/projects/${project.slug}`,
      lastModified: project.updatedAt.toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }));

    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('')}
  ${projectPages
    .map(
      page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('')}
</urlset>`;

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    logger.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
