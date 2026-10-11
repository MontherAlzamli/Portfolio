import { site } from '@/data/site';
import type { PublicProfile } from '@/lib/content';

type StructuredDataProps = {
  profile: PublicProfile;
  skills: string[];
};

// JSON-LD rendered on the server so search engines read it without running JS
export function StructuredData({ profile, skills }: StructuredDataProps) {
  const image = profile.profileImage?.startsWith('/')
    ? `${site.url}${profile.profileImage}`
    : profile.profileImage;

  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${site.url}/#person`,
        name: profile.name,
        jobTitle: profile.title,
        description: profile.bio,
        url: site.url,
        ...(image ? { image } : {}),
        ...(profile.email ? { email: profile.email } : {}),
        ...(profile.location
          ? {
              address: {
                '@type': 'PostalAddress',
                addressLocality: profile.location,
              },
            }
          : {}),
        sameAs: [profile.github, profile.linkedin, profile.twitter].filter(
          Boolean
        ),
        ...(skills.length > 0 ? { knowsAbout: skills } : {}),
      },
      {
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        url: site.url,
        name: `${profile.name} | ${profile.title}`,
        author: { '@id': `${site.url}/#person` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
