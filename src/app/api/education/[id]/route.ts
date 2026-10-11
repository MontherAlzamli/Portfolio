import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
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
  startDate: z.string().datetime('Must be a valid date'),
  endDate: z
    .string()
    .datetime('Must be a valid date')
    .optional()
    .or(z.literal('')),
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

// GET /api/education/[id] - Get single education
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const education = await prisma.education.findUnique({
      where: { id: params.id },
    });

    if (!education) {
      return NextResponse.json(
        { success: false, error: 'Education not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: education });
  } catch (error) {
    console.error('Error fetching education:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch education' },
      { status: 500 }
    );
  }
}

// PUT /api/education/[id] - Update education
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const validatedData = UpdateEducationSchema.parse(body);

    // Check if education exists
    const existingEducation = await prisma.education.findUnique({
      where: { id: params.id },
    });

    if (!existingEducation) {
      return NextResponse.json(
        { success: false, error: 'Education not found' },
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
    const startDate = dataWithDates.startDate || existingEducation.startDate;
    const endDate = dataWithDates.endDate || existingEducation.endDate;
    const current =
      dataWithDates.current !== undefined
        ? dataWithDates.current
        : existingEducation.current;

    if (endDate && endDate <= startDate) {
      return NextResponse.json(
        { success: false, error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    if (current && endDate) {
      return NextResponse.json(
        { success: false, error: 'Ongoing education cannot have an end date' },
        { status: 400 }
      );
    }

    const updatedEducation = await prisma.education.update({
      where: { id: params.id },
      data: dataWithDates,
    });

    revalidatePath('/');

    return NextResponse.json({
      success: true,
      data: updatedEducation,
      message: 'Education updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error updating education:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update education' },
      { status: 500 }
    );
  }
}

// DELETE /api/education/[id] - Delete education
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    // Check if education exists
    const existingEducation = await prisma.education.findUnique({
      where: { id: params.id },
    });

    if (!existingEducation) {
      return NextResponse.json(
        { success: false, error: 'Education not found' },
        { status: 404 }
      );
    }

    await prisma.education.delete({
      where: { id: params.id },
    });

    revalidatePath('/');

    return NextResponse.json({
      success: true,
      message: 'Education deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting education:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete education' },
      { status: 500 }
    );
  }
}
