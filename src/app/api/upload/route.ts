import { NextRequest, NextResponse } from 'next/server';
import { uploadImage, deleteImage, getImageInfo } from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';
import logger from '@/lib/logger';
import { requireAdmin } from '@/lib/requireAdmin';

// Vercel rejects request bodies over 4.5MB
const MAX_FILE_SIZE = 4 * 1024 * 1024;

// POST /api/upload - Upload image to Cloudinary
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'portfolio';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Image must be smaller than 4MB' },
        { status: 413 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await uploadImage(buffer, {
      folder,
      public_id: `${folder}/${Date.now()}-${file.name.split('.')[0]}`,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    // Save image metadata to database
    try {
      if (result.data) {
        await prisma.image.create({
          data: {
            publicId: result.data.public_id,
            secureUrl: result.data.secure_url,
            width: result.data.width,
            height: result.data.height,
            format: result.data.format,
            bytes: result.data.bytes,
            folder: folder,
          },
        });
      }
    } catch (dbError) {
      logger.error('Error saving image metadata to database:', dbError);
      // Continue even if database save fails
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    logger.error('Upload API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

// DELETE /api/upload - Delete image from Cloudinary
export async function DELETE(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json(
        { success: false, error: 'No public ID provided' },
        { status: 400 }
      );
    }

    const result = await deleteImage(publicId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    // Remove from database
    try {
      await prisma.image.delete({
        where: { publicId: publicId },
      });
    } catch (dbError) {
      logger.error('Error removing image from database:', dbError);
      // Continue even if database delete fails
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    logger.error('Delete API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}

// GET /api/upload - Get image info
export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json(
        { success: false, error: 'No public ID provided' },
        { status: 400 }
      );
    }

    const result = await getImageInfo(publicId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    logger.error('Get image info API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get image info' },
      { status: 500 }
    );
  }
}
