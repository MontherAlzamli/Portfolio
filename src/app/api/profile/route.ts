import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import logger from '@/lib/logger';
import { requireAdmin } from '@/lib/requireAdmin';

export const dynamic = 'force-dynamic';

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Validation schema for profile data
const ProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  bio: z
    .string()
    .min(1, 'Bio is required')
    .max(1000, 'Bio must be less than 1000 characters'),
  email: z.string().email('Must be a valid email'),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z
    .string()
    .optional()
    .refine(
      val => !val || val === '' || z.string().url().safeParse(val).success,
      {
        message: 'Must be a valid URL or empty',
      }
    ),
  github: z
    .string()
    .optional()
    .refine(
      val => !val || val === '' || z.string().url().safeParse(val).success,
      {
        message: 'Must be a valid URL or empty',
      }
    ),
  linkedin: z
    .string()
    .optional()
    .refine(
      val => !val || val === '' || z.string().url().safeParse(val).success,
      {
        message: 'Must be a valid URL or empty',
      }
    ),
  twitter: z
    .string()
    .optional()
    .refine(
      val => !val || val === '' || z.string().url().safeParse(val).success,
      {
        message: 'Must be a valid URL or empty',
      }
    ),
  profileImage: z
    .string()
    .optional()
    .refine(
      val =>
        !val ||
        val === '' ||
        z.string().url().safeParse(val).success ||
        val.startsWith('/'),
      {
        message: 'Must be a valid URL or relative path',
      }
    ),
});

// GET /api/profile - Get profile data from database (seed if missing)
export async function GET() {
  try {
    let profile = await prisma.profile.findFirst();

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          name: 'Monther Alzamli',
          title: 'Full Stack Developer & UI/UX Designer',
          bio: 'Passionate full-stack developer with 5+ years of experience building scalable web applications and mobile apps. I specialize in React, Next.js, Node.js, and modern cloud technologies. I love creating intuitive user experiences and solving complex technical challenges.',
          email: 'montherismail90@gmail.com',
          phone: '+970 59 123 4567',
          location: 'Palestine',
          website: 'https://montheralzamli.com',
          github: 'https://github.com/MontherIsmail',
          linkedin: 'https://linkedin.com/in/MontherAlzamli',
          twitter: 'https://twitter.com/MontherAlzamli',
          profileImage: '/profile-image.jpg',
        },
      });
    }

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    logger.error('Error fetching profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PUT /api/profile - Update profile data
export async function PUT(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const validatedData = ProfileSchema.parse(body);

    // Ensure a single row by upserting the first/only profile
    const existing = await prisma.profile.findFirst();
    const updated = await prisma.profile.upsert({
      where: { id: existing?.id ?? 'singleton-profile-id' },
      update: { ...validatedData },
      create: { ...validatedData },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    logger.error('Error updating profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
