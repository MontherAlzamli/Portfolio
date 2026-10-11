import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { StructuredData } from '@/components/StructuredData';
import { RevealObserver } from '@/components/ui/RevealObserver';
import { getSiteContent } from '@/lib/content';

// Statically generated; the admin API revalidates this page after every edit,
// and this interval is the fallback.
export const revalidate = 300;

export default async function Home() {
  const { profile, skills, projects, experience, stats } =
    await getSiteContent();

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <StructuredData profile={profile} skills={skills.map(s => s.name)} />
      <Navigation name={profile.name} />
      <main id="main-content">
        <HeroSection profile={profile} />
        <AboutSection profile={profile} stats={stats} />
        <SkillsSection skills={skills} />
        <ProjectsSection projects={projects} />
        <ExperienceSection experience={experience} />
        <ContactSection profile={profile} />
      </main>
      <Footer name={profile.name} />
      <RevealObserver />
    </>
  );
}
