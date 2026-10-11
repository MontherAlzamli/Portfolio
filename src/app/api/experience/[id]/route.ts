import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { requireAdmin } from '@/lib/requireAdmin';

// Validation schemas
const ExperienceSchema = z.object({
  company: z
    .string()
    .min(1, 'Company is required')
    .max(100, 'Company must be less than 100 characters'),
  role: z
    .string()
    .min(1, 'Role is required')
    .max(100, 'Role must be less than 100 characters'),
  startDate: z.string().datetime('Must be a valid date'),
  endDate: z
    .string()
    .datetime('Must be a valid date')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be less than 1000 characters'),
  current: z.boolean().optional().default(false),
  order: z
    .number()
    .int()
    .min(0, 'Order must be non-negative')
    .optional()
    .default(0),
});

const UpdateExperienceSchema = ExperienceSchema.partial();

// GET /api/experience/[id] - Get single experience
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const experience = await prisma.experience.findUnique({
      where: { id: params.id },
    });

    if (!experience) {
      return NextResponse.json(
        { success: false, error: 'Experience not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: experience });
  } catch (error) {
    console.error('Error fetching experience:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch experience' },
      { status: 500 }
    );
  }
}

// PUT /api/experience/[id] - Update experience
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const validatedData = UpdateExperienceSchema.parse(body);

    // Check if experience exists
    const existingExperience = await prisma.experience.findUnique({
      where: { id: params.id },
    });

    if (!existingExperience) {
      return NextResponse.json(
        { success: false, error: 'Experience not found' },
        { status: 404 }
      );
    }

    // Convert string dates to Date objects if provided
    const dataWithDates: any = { ...validatedData };
    if (validatedData.startDate) {
      dataWithDates.startDate = new Date(validatedData.startDate);
    }
    if (validatedData.endDate) {
      dataWithDates.endDate = new Date(validatedData.endDate);
    }

    // Validate date logic
    const startDate = dataWithDates.startDate || existingExperience.startDate;
    const endDate = dataWithDates.endDate || existingExperience.endDate;
    const current =
      dataWithDates.current !== undefined
        ? dataWithDates.current
        : existingExperience.current;

    if (endDate && endDate <= startDate) {
      return NextResponse.json(
        { success: false, error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    if (current && endDate) {
      return NextResponse.json(
        { success: false, error: 'Current experience cannot have an end date' },
        { status: 400 }
      );
    }

    const updatedExperience = await prisma.experience.update({
      where: { id: params.id },
      data: dataWithDates,
    });

    return NextResponse.json({
      success: true,
      data: updatedExperience,
      message: 'Experience updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error updating experience:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update experience' },
      { status: 500 }
    );
  }
}

// DELETE /api/experience/[id] - Delete experience
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    // Check if experience exists
    const existingExperience = await prisma.experience.findUnique({
      where: { id: params.id },
    });

    if (!existingExperience) {
      return NextResponse.json(
        { success: false, error: 'Experience not found' },
        { status: 404 }
      );
    }

    await prisma.experience.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Experience deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting experience:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete experience' },
      { status: 500 }
    );
  }
}
