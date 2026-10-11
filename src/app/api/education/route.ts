import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import logger from '@/lib/logger';
import { requireAdmin } from '@/lib/requireAdmin';
import { revalidatePath } from 'next/cache';

// Validation schemas
const EducationSchema = z.object({
  institution: z
    .string()
    .min(1, 'Institution is required')
    .max(100, 'Institution must be less than 100 characters'),
  degree: z
    .string()
    .min(1, 'Degree is required')
    .max(100, 'Degree must be less than 100 characters'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().or(z.literal('')),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .default(''),
  current: z.boolean().optional().default(false),
  order: z
    .number()
    .int()
    .min(0, 'Order must be non-negative')
    .optional()
    .default(0),
});

const UpdateEducationSchema = EducationSchema.partial();

// GET /api/education - List all education with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const current = searchParams.get('current');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (current !== null) {
      where.current = current === 'true';
    }
    if (search) {
      where.OR = [
        { institution: { contains: search, mode: 'insensitive' } },
        { degree: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [educations, total] = await Promise.all([
      prisma.education.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ order: 'asc' }, { startDate: 'desc' }],
      }),
      prisma.education.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: educations,
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
    logger.error('Error fetching education:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch education' },
      { status: 500 }
    );
  }
}

// POST /api/education - Create new education
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const validatedData = EducationSchema.parse(body);

    // Convert string dates to Date objects
    const parseDate = (dateString: string) => {
      if (!dateString) return null;
      // Handle MM/DD/YYYY format
      if (dateString.includes('/')) {
        const [month, day, year] = dateString.split('/');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
      // Handle other formats
      return new Date(dateString);
    };

    const dataWithDates = {
      ...validatedData,
      startDate: parseDate(validatedData.startDate),
      endDate: validatedData.endDate ? parseDate(validatedData.endDate) : null,
    };

    // Validate date logic
    if (
      dataWithDates.endDate &&
      dataWithDates.startDate &&
      dataWithDates.endDate <= dataWithDates.startDate
    ) {
      return NextResponse.json(
        { success: false, error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    if (dataWithDates.current && dataWithDates.endDate) {
      return NextResponse.json(
        { success: false, error: 'Ongoing education cannot have an end date' },
        { status: 400 }
      );
    }

    const education = await prisma.education.create({
      data: {
        ...dataWithDates,
        startDate: dataWithDates.startDate!,
        endDate: dataWithDates.endDate,
      },
    });

    revalidatePath('/');

    return NextResponse.json(
      {
        success: true,
        data: education,
        message: 'Education created successfully',
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

    logger.error('Error creating education:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create education' },
      { status: 500 }
    );
  }
}
