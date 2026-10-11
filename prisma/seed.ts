import { PrismaClient } from '@prisma/client';
import logger from '@/lib/logger';

const prisma = new PrismaClient();

async function seed() {
  try {
    // Create profile
    const profile = await prisma.profile.upsert({
      where: { id: 'singleton-profile-id' },
      update: {},
      create: {
        id: 'singleton-profile-id',
        name: 'Monther Alzamli',
        title: 'Full Stack Developer & UI/UX Designer',
        bio: 'Passionate full-stack developer with 5+ years of experience building scalable web applications and mobile apps. I specialize in React, Next.js, Node.js, and modern cloud technologies. I love creating intuitive user experiences and solving complex technical challenges.',
        email: 'montherismail90@gmail.com',
        phone: '+970 59 123 4567',
        location: 'Palestine',
        website: 'https://monther-alzamli.com',
        github: 'https://github.com/MontherIsmail',
        linkedin: 'https://linkedin.com/in/MontherAlzamli',
        twitter: 'https://twitter.com/MontherAlzamli',
        profileImage: '/profile-image.jpg',
      },
    });

    // Create skills
    const skills = [
      // Frontend Technologies
      { name: 'React', category: 'Frontend', level: 5, order: 1 },
      { name: 'Next.js', category: 'Frontend', level: 5, order: 2 },
      { name: 'TypeScript', category: 'Frontend', level: 5, order: 3 },
      { name: 'JavaScript', category: 'Frontend', level: 5, order: 4 },
      { name: 'HTML5', category: 'Frontend', level: 5, order: 5 },
      { name: 'CSS3', category: 'Frontend', level: 5, order: 6 },
      { name: 'Tailwind CSS', category: 'Frontend', level: 5, order: 7 },
      { name: 'Sass/SCSS', category: 'Frontend', level: 4, order: 8 },
      { name: 'Vue.js', category: 'Frontend', level: 3, order: 9 },
      { name: 'Angular', category: 'Frontend', level: 3, order: 10 },

      // Backend Technologies
      { name: 'Node.js', category: 'Backend', level: 5, order: 1 },
      { name: 'Express.js', category: 'Backend', level: 5, order: 2 },
      { name: 'Python', category: 'Backend', level: 4, order: 3 },
      { name: 'FastAPI', category: 'Backend', level: 4, order: 4 },
      { name: 'PostgreSQL', category: 'Backend', level: 5, order: 5 },
      { name: 'MongoDB', category: 'Backend', level: 4, order: 6 },
      { name: 'Prisma', category: 'Backend', level: 5, order: 7 },
      { name: 'Redis', category: 'Backend', level: 3, order: 8 },
      { name: 'GraphQL', category: 'Backend', level: 4, order: 9 },

      // Mobile Development
      { name: 'React Native', category: 'Mobile', level: 4, order: 1 },
      { name: 'Flutter', category: 'Mobile', level: 3, order: 2 },
      { name: 'Dart', category: 'Mobile', level: 3, order: 3 },
      { name: 'Expo', category: 'Mobile', level: 4, order: 4 },

      // Cloud & DevOps
      { name: 'AWS', category: 'Cloud', level: 4, order: 1 },
      { name: 'Vercel', category: 'Cloud', level: 5, order: 2 },
      { name: 'Docker', category: 'Cloud', level: 4, order: 3 },
      { name: 'Kubernetes', category: 'Cloud', level: 2, order: 4 },
      { name: 'CI/CD', category: 'Cloud', level: 4, order: 5 },

      // Design & Tools
      { name: 'Figma', category: 'Design', level: 4, order: 1 },
      { name: 'Adobe XD', category: 'Design', level: 3, order: 2 },
      { name: 'Sketch', category: 'Design', level: 3, order: 3 },
      { name: 'Git', category: 'Tools', level: 5, order: 1 },
      { name: 'GitHub', category: 'Tools', level: 5, order: 2 },
      { name: 'VS Code', category: 'Tools', level: 5, order: 3 },
      { name: 'Webpack', category: 'Tools', level: 3, order: 4 },
      { name: 'Jest', category: 'Tools', level: 4, order: 5 },
      { name: 'Cypress', category: 'Tools', level: 3, order: 6 },
    ];

    for (const skill of skills) {
      await prisma.skill.upsert({
        where: {
          id:
            (
              await prisma.skill.findFirst({
                where: { name: skill.name, category: skill.category },
              })
            )?.id || 'temp-id',
        },
        update: skill,
        create: skill,
      });
    }

    // Create projects
    const projects = [
      {
        title: 'E-Commerce Platform',
        slug: 'ecommerce-platform',
        description:
          'A comprehensive full-stack e-commerce platform built with Next.js 14, TypeScript, and Prisma. Features include advanced user authentication, product management, shopping cart, payment integration with Stripe, admin dashboard, and real-time inventory tracking.',
        imageUrl:
          'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
        link: 'https://ecommerce-demo.com',
        githubUrl: 'https://github.com/MontherIsmail/ecommerce',
        technologies:
          'Next.js, TypeScript, Prisma, PostgreSQL, Stripe, Tailwind CSS, NextAuth.js',
        featured: true,
      },
      {
        title: 'Task Management App',
        slug: 'task-management-app',
        description:
          'A collaborative task management application with real-time updates, team collaboration features, project tracking capabilities, and advanced analytics. Built with modern web technologies and optimized for performance.',
        imageUrl:
          'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800',
        link: 'https://taskmanager-demo.com',
        githubUrl: 'https://github.com/MontherIsmail/taskmanager',
        technologies:
          'React, Node.js, Socket.io, MongoDB, Express.js, Material-UI',
        featured: true,
      },
      {
        title: 'Weather Dashboard',
        slug: 'weather-dashboard',
        description:
          'A responsive weather dashboard that displays current weather conditions and forecasts for multiple cities with interactive charts, maps, and detailed analytics. Features include location-based weather alerts and historical data visualization.',
        imageUrl:
          'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800',
        link: 'https://weather-demo.com',
        githubUrl: 'https://github.com/MontherIsmail/weather',
        technologies: 'React, Chart.js, OpenWeather API, CSS3, Leaflet Maps',
        featured: true,
      },
      {
        title: 'Social Media Analytics Tool',
        slug: 'social-media-analytics',
        description:
          'A comprehensive social media analytics platform that tracks engagement metrics, audience insights, and content performance across multiple platforms. Features include automated reporting and data visualization.',
        imageUrl:
          'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800',
        link: 'https://social-analytics-demo.com',
        githubUrl: 'https://github.com/MontherIsmail/social-analytics',
        technologies:
          'Next.js, TypeScript, Prisma, PostgreSQL, Chart.js, Twitter API',
        featured: true,
      },
      {
        title: 'AI-Powered Chat Application',
        slug: 'ai-chat-app',
        description:
          'A modern chat application powered by AI with features like real-time messaging, file sharing, voice messages, and intelligent message suggestions. Built with WebSocket technology and modern UI/UX principles.',
        imageUrl:
          'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800',
        link: 'https://ai-chat-demo.com',
        githubUrl: 'https://github.com/MontherIsmail/ai-chat',
        technologies:
          'React, Node.js, Socket.io, OpenAI API, MongoDB, Tailwind CSS',
        featured: true,
      },
      {
        title: 'Portfolio Website',
        slug: 'portfolio-website',
        description:
          'A modern, responsive portfolio website showcasing projects, skills, and experience with smooth animations, dark mode support, and admin dashboard for content management.',
        imageUrl:
          'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800',
        link: 'https://monther-alzamli.com',
        githubUrl: 'https://github.com/MontherIsmail/portfolio',
        technologies:
          'Next.js, TypeScript, Tailwind CSS, Framer Motion, Prisma',
        featured: false,
      },
      {
        title: 'Mobile Banking App',
        slug: 'mobile-banking-app',
        description:
          'A secure mobile banking application built with React Native featuring biometric authentication, transaction history, bill payments, and real-time notifications.',
        imageUrl:
          'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
        link: 'https://banking-app-demo.com',
        githubUrl: 'https://github.com/MontherIsmail/banking-app',
        technologies: 'React Native, Node.js, PostgreSQL, JWT, Biometric Auth',
        featured: false,
      },
      {
        title: 'Real Estate Platform',
        slug: 'real-estate-platform',
        description:
          'A comprehensive real estate platform with property listings, virtual tours, mortgage calculators, and agent management system. Features include advanced search filters and interactive property maps.',
        imageUrl:
          'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
        link: 'https://realestate-demo.com',
        githubUrl: 'https://github.com/MontherIsmail/realestate',
        technologies:
          'Next.js, TypeScript, Prisma, PostgreSQL, Google Maps API',
        featured: false,
      },
    ];

    for (const project of projects) {
      await prisma.project.upsert({
        where: { slug: project.slug },
        update: project,
        create: project,
      });
    }

    // Create experience
    const experiences = [
      {
        company: 'TechFlow Solutions',
        role: 'Senior Full Stack Developer',
        startDate: new Date('2022-03-01'),
        endDate: null,
        description:
          'Leading development of scalable web applications using React, Next.js, and Node.js. Mentoring junior developers, implementing CI/CD pipelines, and optimizing application performance. Successfully delivered 15+ projects with 99.9% uptime.',
        current: true,
        order: 1,
      },
      {
        company: 'Digital Innovation Agency',
        role: 'Full Stack Developer',
        startDate: new Date('2020-08-01'),
        endDate: new Date('2022-02-28'),
        description:
          'Developed responsive web applications and mobile apps for various clients using React, React Native, and backend APIs. Collaborated with design teams to implement pixel-perfect UIs and optimized applications for performance.',
        current: false,
        order: 2,
      },
      {
        company: 'StartupHub',
        role: 'Frontend Developer',
        startDate: new Date('2019-06-01'),
        endDate: new Date('2020-07-31'),
        description:
          'Built user interfaces for web applications using React and modern CSS frameworks. Implemented responsive designs, optimized for mobile devices, and collaborated closely with UX designers to create intuitive user experiences.',
        current: false,
        order: 3,
      },
      {
        company: 'WebCraft Studio',
        role: 'Junior Frontend Developer',
        startDate: new Date('2018-09-01'),
        endDate: new Date('2019-05-31'),
        description:
          'Developed static websites and landing pages using HTML, CSS, and JavaScript. Learned modern frontend frameworks and contributed to team projects while gaining experience in version control and collaborative development.',
        current: false,
        order: 4,
      },
    ];

    for (const experience of experiences) {
      await prisma.experience.create({
        data: experience,
      });
    }
  } catch (error) {
    logger.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
