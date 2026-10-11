import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import logger from '@/lib/logger';
import { requireAdmin } from '@/lib/requireAdmin';

export const dynamic = 'force-dynamic';

// Validation schema for settings
const SettingsSchema = z.object({
  siteTitle: z.string().min(1, 'Site title is required').max(100),
  siteDescription: z.string().min(1, 'Site description is required').max(500),
  contactEmail: z.string().email('Must be a valid email'),
  maintenanceMode: z.boolean().optional().default(false),
  analyticsEnabled: z.boolean().optional().default(true),
  emailNotifications: z.boolean().optional().default(true),
  theme: z.enum(['light', 'dark']).optional().default('dark'),
});

// GET /api/settings - Get settings data
export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    // Get profile data for site settings
    const profile = await prisma.profile.findFirst();

    const settingsData = {
      siteTitle: profile?.name || 'Portfolio',
      siteDescription: profile?.bio || 'A modern portfolio website',
      contactEmail: profile?.email || 'contact@example.com',
      maintenanceMode: false,
      analyticsEnabled: true,
      emailNotifications: true,
      theme: 'dark',
    };

    return NextResponse.json({ success: true, data: settingsData });
  } catch (error) {
    logger.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Update settings
export async function PUT(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const validatedData = SettingsSchema.parse(body);

    // Update profile with new settings
    const profile = await prisma.profile.findFirst();
    if (profile) {
      await prisma.profile.update({
        where: { id: profile.id },
        data: {
          name: validatedData.siteTitle,
          bio: validatedData.siteDescription,
          email: validatedData.contactEmail,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: validatedData,
      message: 'Settings updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    logger.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
