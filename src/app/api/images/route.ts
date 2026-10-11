import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import logger from '@/lib/logger';
import { requireAdmin } from '@/lib/requireAdmin';

// GET /api/images - List images from database
export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'portfolio';
    const maxResults = parseInt(searchParams.get('maxResults') || '50');

    // Fetch images from database
    const images = await prisma.image.findMany({
      where: {
        folder: folder,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: maxResults,
    });

    // Transform the result to match our interface
    const transformedImages = images.map(image => ({
      public_id: image.publicId,
      secure_url: image.secureUrl,
      width: image.width,
      height: image.height,
      format: image.format,
      bytes: image.bytes,
      created_at: image.createdAt.toISOString(),
      folder: image.folder,
    }));

    return NextResponse.json({
      success: true,
      data: transformedImages,
      total: images.length,
    });
  } catch (error) {
    logger.error('Error fetching images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}
