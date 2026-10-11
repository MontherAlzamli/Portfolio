'use client';

import { useEffect, useState } from 'react';

interface ProfileData {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
  profileImage: string;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  link?: string;
  githubUrl?: string;
  technologies: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  order: number;
}

interface StructuredDataProps {
  profile?: ProfileData | null;
  projects?: Project[];
  experiences?: Experience[];
}

export function StructuredData({
  profile,
  projects = [],
  experiences = [],
}: StructuredDataProps) {
  const [structuredData, setStructuredData] = useState<any>(null);

  useEffect(() => {
    if (!profile) return;

    const personSchema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: profile.name,
      jobTitle: profile.title,
      description: profile.bio,
      email: profile.email,
      telephone: profile.phone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: profile.location,
      },
      url: profile.website,
      sameAs: [profile.github, profile.linkedin, profile.twitter].filter(
        Boolean
      ),
      image: profile.profileImage,
      knowsAbout: [
        'React',
        'Next.js',
        'TypeScript',
        'Node.js',
        'JavaScript',
        'Web Development',
        'Full Stack Development',
        'Software Engineering',
      ],
    };

    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: `${profile.name} - Portfolio`,
      url: 'https://monther-alzamli.com',
      description: profile.bio,
      author: {
        '@type': 'Person',
        name: profile.name,
      },
      inLanguage: 'en-US',
    };

    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: `${profile.name} - Professional Portfolio`,
      url: 'https://monther-alzamli.com',
      logo: profile.profileImage,
      founder: {
        '@type': 'Person',
        name: profile.name,
      },
      description: profile.bio,
    };

    const projectSchemas = projects.map(project => ({
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      description: project.description,
      url: project.link,
      image: project.imageUrl,
      creator: {
        '@type': 'Person',
        name: profile.name,
      },
      dateCreated: project.createdAt,
      dateModified: project.updatedAt,
      keywords: project.technologies.split(',').map(tech => tech.trim()),
      genre: 'Software Development',
      inLanguage: 'en-US',
    }));

    const experienceSchemas = experiences.map(exp => ({
      '@context': 'https://schema.org',
      '@type': 'OrganizationRole',
      roleName: exp.title,
      worksFor: {
        '@type': 'Organization',
        name: exp.company,
        address: {
          '@type': 'PostalAddress',
          addressLocality: exp.location,
        },
      },
      startDate: exp.startDate,
      endDate: exp.current ? undefined : exp.endDate,
      description: exp.description,
    }));

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://monther-alzamli.com#home',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'About',
          item: 'https://monther-alzamli.com#about',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Projects',
          item: 'https://monther-alzamli.com#projects',
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Experience',
          item: 'https://monther-alzamli.com#experience',
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: 'Contact',
          item: 'https://monther-alzamli.com#contact',
        },
      ],
    };

    const allSchemas = [
      personSchema,
      websiteSchema,
      organizationSchema,
      breadcrumbSchema,
      ...projectSchemas,
      ...experienceSchemas,
    ];

    setStructuredData(allSchemas);
  }, [profile, projects, experiences]);

  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
