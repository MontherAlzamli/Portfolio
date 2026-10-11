import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import logger from '@/lib/logger';
import { requireAdmin } from '@/lib/requireAdmin';

export const dynamic = 'force-dynamic';

// GET /api/analytics - Get analytics data
export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    // Get counts from database
    const [projectsCount, skillsCount, experienceCount, contactsCount] =
      await Promise.all([
        prisma.project.count(),
        prisma.skill.count(),
        prisma.experience.count(),
        prisma.contact.count(),
      ]);

    // Get featured projects
    const featuredProjects = await prisma.project.findMany({
      where: { featured: true },
      select: { id: true, title: true },
      take: 5,
    });

    // Get all projects for performance metrics
    const allProjects = await prisma.project.findMany({
      select: { id: true, title: true, featured: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });

    // Get skills by category
    const skillsByCategory = await prisma.skill.groupBy({
      by: ['category'],
      _count: {
        category: true,
      },
    });

    // Get recent contacts
    const recentContacts = await prisma.contact.findMany({
      select: { createdAt: true, read: true },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    // Get experience timeline
    const experiences = await prisma.experience.findMany({
      select: { startDate: true, endDate: true, current: true },
      orderBy: { startDate: 'desc' },
    });

    // Return only real data from database
    const analyticsData = {
      contentStats: {
        totalProjects: projectsCount,
        totalSkills: skillsCount,
        totalExperience: experienceCount,
        featuredProjects: featuredProjects.length,
      },
      skillDistribution: skillsByCategory.map(category => ({
        category: category.category,
        count: category._count.category,
        percentage: Math.round((category._count.category / skillsCount) * 100),
      })),
      contactAnalytics: {
        totalContacts: contactsCount,
        unreadContacts: recentContacts.filter(c => !c.read).length,
        recentContacts: recentContacts.length,
      },
      experienceTimeline: experiences.map(exp => ({
        startDate: exp.startDate,
        endDate: exp.endDate,
        current: exp.current,
        duration: calculateDuration(
          exp.startDate.toISOString(),
          exp.endDate?.toISOString() || '',
          exp.current
        ),
      })),
      projects: allProjects.map(project => ({
        id: project.id,
        title: project.title,
        featured: project.featured,
        createdAt: project.createdAt,
      })),
    };

    return NextResponse.json({ success: true, data: analyticsData });
  } catch (error) {
    logger.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

// Helper function to calculate duration between dates
function calculateDuration(
  startDate: string,
  endDate: string | null,
  current: boolean
): string {
  const start = new Date(startDate);
  const end = current ? new Date() : endDate ? new Date(endDate) : new Date();

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const months = Math.floor(diffDays / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''} ${months % 12} month${months % 12 > 1 ? 's' : ''}`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''}`;
  } else {
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  }
}
