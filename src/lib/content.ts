import type { Experience, Profile, Project, Skill } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import logger from '@/lib/logger';
import { site } from '@/data/site';

export type PublicProfile = Pick<
  Profile,
  | 'name'
  | 'title'
  | 'bio'
  | 'email'
  | 'phone'
  | 'location'
  | 'website'
  | 'github'
  | 'linkedin'
  | 'twitter'
  | 'profileImage'
>;

export type SiteContent = {
  profile: PublicProfile;
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  stats: { years: number | null; projects: number | null; skills: number };
};

// Used when the database has no profile yet or cannot be reached
const fallbackProfile: PublicProfile = {
  name: 'Monther Alzamli',
  title: 'Full Stack Developer',
  bio: 'I build web applications with React, Next.js, Node.js and TypeScript.',
  email: '',
  phone: null,
  location: null,
  website: site.url,
  github: null,
  linkedin: null,
  twitter: null,
  profileImage: '/profile-image.jpg',
};

function yearsSince(date: Date) {
  const years = (Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  return Math.max(1, Math.floor(years));
}

// One failing query should not blank the rest of the page
async function safe<T>(label: string, query: Promise<T>, fallback: T) {
  try {
    return await query;
  } catch (error) {
    logger.error(`Error loading ${label}:`, error);
    return fallback;
  }
}

// Loads everything the public page renders, on the server
export async function getSiteContent(): Promise<SiteContent> {
  const [profile, skills, projects, experience] = await Promise.all([
    safe('profile', prisma.profile.findFirst(), null),
    safe(
      'skills',
      prisma.skill.findMany({ orderBy: [{ order: 'asc' }, { name: 'asc' }] }),
      []
    ),
    safe(
      'projects',
      prisma.project.findMany({
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      }),
      []
    ),
    safe(
      'experience',
      prisma.experience.findMany({ orderBy: { startDate: 'desc' } }),
      []
    ),
  ]);

  const earliest = experience[experience.length - 1]?.startDate;

  return {
    profile: profile ?? fallbackProfile,
    skills,
    projects,
    experience,
    stats: {
      years:
        site.stats.yearsOfExperience ??
        (earliest ? yearsSince(earliest) : null),
      projects:
        site.stats.projectsDelivered ??
        (projects.length > 0 ? projects.length : null),
      skills: skills.length,
    },
  };
}
