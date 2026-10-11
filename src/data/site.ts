// Copy and settings for the public site that are not stored in the database.
// Profile details, skills, projects and experience come from the admin dashboard.
export const site = {
  url: 'https://monther-alzamli.com',
  // Used where the database is not available, such as the social sharing image
  name: 'Monther Alzamli',
  role: 'Full Stack Developer',

  hero: {
    headline: 'I build fast, reliable web apps, end to end.',
    valueProp:
      'Full Stack Developer working with React, Next.js, Node.js and TypeScript. I turn product ideas into production software, from the database to the interface.',
    availability: 'Available for freelance and full-time roles',
    // Shown in the terminal panel next to the headline
    stack: {
      frontend: ['React', 'Next.js', 'TypeScript'],
      backend: ['Node.js', 'PostgreSQL', 'Prisma'],
    },
  },

  // Leave a value as null to calculate it from the database
  stats: {
    yearsOfExperience: null as number | null,
    projectsDelivered: null as number | null,
  },

  contact: {
    intro:
      'Have a project in mind or a role to fill? Send me a message and I will get back to you.',
    responseTime: 'I usually reply within 24 hours',
  },

  nav: [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Skills', id: 'skills' },
    { name: 'Projects', id: 'projects' },
    { name: 'Experience', id: 'experience' },
    { name: 'Contact', id: 'contact' },
  ],

  // Skill groups appear in this order; any other category follows alphabetically
  skillGroupOrder: [
    'Frontend',
    'Backend',
    'Database',
    'DevOps',
    'Mobile',
    'Tools',
  ],
};
