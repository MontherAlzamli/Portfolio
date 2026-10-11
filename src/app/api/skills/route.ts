import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import logger from '@/lib/logger';
import { requireAdmin } from '@/lib/requireAdmin';
import { revalidatePath } from 'next/cache';

// Validation schemas
const SkillSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be less than 50 characters'),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category must be less than 50 characters'),
  level: z
    .number()
    .int()
    .min(1, 'Level must be at least 1')
    .max(5, 'Level must be at most 5'),
  iconUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  order: z
    .number()
    .int()
    .min(0, 'Order must be non-negative')
    .optional()
    .default(0),
});

const UpdateSkillSchema = SkillSchema.partial();

// GET /api/skills - List all skills with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (category) {
      where.category = category;
    }
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const [skills, total] = await Promise.all([
      prisma.skill.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
      }),
      prisma.skill.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: skills,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    logger.error('Error fetching skills:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

// POST /api/skills - Create new skill
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const validatedData = SkillSchema.parse(body);

    // Check if skill with same name already exists
    const existingSkill = await prisma.skill.findFirst({
      where: {
        name: validatedData.name,
        category: validatedData.category,
      },
    });

    if (existingSkill) {
      return NextResponse.json(
        {
          success: false,
          error: 'Skill with this name and category already exists',
        },
        { status: 400 }
      );
    }

    const skill = await prisma.skill.create({
      data: validatedData,
    });

    revalidatePath('/');

    return NextResponse.json(
      {
        success: true,
        data: skill,
        message: 'Skill created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    logger.error('Error creating skill:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create skill' },
      { status: 500 }
    );
  }
}
