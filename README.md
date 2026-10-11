# Monther Alzamli Portfolio

A modern, dynamic portfolio website with an admin dashboard for content management.

## 🚀 Features

- **Modern Frontend**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Admin Dashboard**: Secure content management without code changes
- **Responsive Design**: Mobile-first approach with beautiful animations
- **SEO Optimized**: Built-in SEO features for better search visibility
- **Image Management**: Cloudinary integration for easy image uploads
- **Authentication**: Secure admin access with NextAuth.js
- **Contact Form**: Interactive contact form with email notifications
- **Analytics**: Built-in analytics dashboard for tracking

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Beautiful icons

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Prisma ORM**: Database access and migrations
- **NextAuth.js**: Authentication system
- **PostgreSQL**: Relational database

### Services
- **Cloudinary**: Cloud-based image storage and optimization
- **Toast Notifications**: User feedback system

### Deployment
- **Vercel**: Hosting, serverless functions, and automatic SSL
- **Hosted PostgreSQL**: Neon (or any Postgres provider with connection pooling)

## 📋 Project Structure

```
portfolio/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/
│   │   ├── admin/            # Admin dashboard components
│   │   ├── layout/           # Navigation and footer
│   │   ├── sections/          # Page sections
│   │   └── providers/        # Context providers
│   ├── lib/                   # Utilities and configurations
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── cloudinary.ts     # Cloudinary client
│   │   ├── prisma.ts         # Prisma client
│   │   ├── requireAdmin.ts   # Session check for admin-only API routes
│   │   └── password.ts       # Password hashing
│   └── middleware.ts         # Next.js middleware
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts               # Database seeding script
├── scripts/
│   └── create-admin.ts       # Admin user creation script
├── public/                    # Static assets
├── env.example               # Environment variables template
└── package.json              # Dependencies and scripts
```

## 🗄️ Database Schema

The application uses PostgreSQL with the following main models:

- **Profile**: Personal information and social links
- **Skill**: Technical skills with categories and proficiency levels
- **Project**: Portfolio projects with images, technologies, and links
- **Experience**: Work experience and achievements
- **Contact**: Contact form submissions
- **Image**: Cloudinary image references
- **User**: Admin user authentication

## 🔧 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

`NEXTAUTH_SECRET` is required; generate one with `openssl rand -base64 32`.

The Prisma CLI and the scripts in `prisma/` and `scripts/` read `.env`, not `.env.local`, so put `DATABASE_URL` in `.env` as well (or export it in your shell) before running them.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Cloudinary account (for image uploads)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MontherIsmail/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your credentials
   # Also put DATABASE_URL in .env so the Prisma CLI can read it
   ```

4. **Set up the database**
   ```bash
   # Push database schema
   npx prisma db push
   
   # Generate Prisma client
   npx prisma generate
   ```

5. **Seed the database (optional)**
   ```bash
   npx tsx prisma/seed.ts
   ```

6. **Create an admin user**
   ```bash
   npx tsx scripts/create-admin.ts
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📦 Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Generate the Prisma client and build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier
- `npm run type-check`: Run the TypeScript compiler without emitting
- `npm run db:push`: Push Prisma schema to database
- `npm run db:studio`: Open Prisma Studio

## 🖥️ Deployment

### Vercel

#### Prerequisites

- A Vercel account connected to this GitHub repository
- A hosted PostgreSQL database (Neon via the Vercel Storage tab is the simplest)
- A Cloudinary account
- Access to the DNS settings of your domain

#### Deployment Steps

1. **Create the database**

   In the Vercel dashboard open **Storage → Create Database → Neon** and connect it to the project, or create a database at your Postgres provider and copy its pooled connection string.

2. **Create the tables**

   Run this once from your machine, with `DATABASE_URL` in `.env` pointing at the new database (use the direct, non-pooled connection string for this step if your provider gives you both):

   ```bash
   npx prisma db push
   ```

3. **Add content and an admin user**

   ```bash
   # Optional: sample content
   npx tsx prisma/seed.ts

   # Admin login for the dashboard
   npx tsx scripts/create-admin.ts
   ```

   To move content from an existing Postgres database instead of seeding, restore a `pg_dump` of it into the new database.

4. **Import the project in Vercel**

   **Add New → Project**, pick the repository and keep the detected Next.js settings. The build command (`npm run build`) generates the Prisma client before building.

5. **Set the environment variables**

   In **Project → Settings → Environment Variables**:

   | Variable                | Value                                          |
   | ----------------------- | ---------------------------------------------- |
   | `DATABASE_URL`          | Pooled Postgres connection string              |
   | `NEXTAUTH_URL`          | `https://montheralzamli.com`                   |
   | `NEXTAUTH_SECRET`       | Output of `openssl rand -base64 32`            |
   | `CLOUDINARY_CLOUD_NAME` | From the Cloudinary dashboard                  |
   | `CLOUDINARY_API_KEY`    | From the Cloudinary dashboard                  |
   | `CLOUDINARY_API_SECRET` | From the Cloudinary dashboard                  |

   Redeploy after changing any of them.

6. **Add the domain**

   In **Project → Settings → Domains** add `montheralzamli.com` and `www.montheralzamli.com`, then create the DNS records Vercel shows you. SSL certificates are issued automatically.

After a schema change in `prisma/schema.prisma`, run `npx prisma db push` against the production database before deploying the code that depends on it.

### Access URLs

- **Portfolio**: https://montheralzamli.com
- **Admin Dashboard**: https://montheralzamli.com/admin/login

### Platform Limits

- **Uploads**: Vercel rejects request bodies over 4.5MB, so image uploads are limited to 4MB.
- **Filesystem**: Serverless functions cannot write to disk. All content lives in PostgreSQL and all images in Cloudinary.

## 👨‍💻 Admin Dashboard Features

The admin dashboard provides full content management capabilities:

- **Profile Management**: Update personal information, bio, and social links
- **Skills Management**: Add, edit, and delete technical skills
- **Projects Management**: Manage portfolio projects with rich descriptions
- **Experience Management**: Track work experience and achievements
- **Contacts Management**: View and manage contact form submissions
- **Image Gallery**: Upload and manage images via Cloudinary
- **Analytics**: View page analytics and insights
- **Settings**: Configure application settings

## 🔐 Authentication

The admin dashboard is protected by NextAuth.js with credential-based authentication. Only authenticated users can access the dashboard.

## 📧 Contact Form

The portfolio includes a contact form that:
- Validates user input
- Stores submissions in the database
- Provides email notifications (optional)
- Displays submissions in the admin dashboard

## 🎨 Customization

### Styling

The project uses Tailwind CSS for styling. Customize colors and styles in:
- `tailwind.config.js`: Tailwind configuration
- `src/app/globals.css`: Global styles

### Sections

Page sections are located in `src/components/sections/`:
- `HeroSection.tsx`: Hero section with profile info
- `AboutSection.tsx`: About me section
- `SkillsSection.tsx`: Skills display
- `ProjectsSection.tsx`: Projects grid
- `ExperienceSection.tsx`: Work experience
- `ContactSection.tsx`: Contact form

## 🐛 Troubleshooting

### Database Connection Issues

- Check that `DATABASE_URL` is set for the environment you are deploying to (Production, Preview) and redeploy after changing it.
- Use the pooled connection string on Vercel; serverless functions open many short-lived connections.
- Verify the connection from your machine:

  ```bash
  npx prisma db pull --print
  ```

### Admin Login Issues

- `NEXTAUTH_SECRET` must be set, and `NEXTAUTH_URL` must match the domain you are visiting.
- Admin API routes return `401 Unauthorized` when the session has expired; sign in again.

### Build and Runtime Errors

```bash
# Reproduce the production build locally
npm run build
```

Runtime logs for each function are in the Vercel dashboard under **Project → Logs**.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Monther Alzamli**

- 🌐 Website: [montheralzamli.com](https://montheralzamli.com)
- 💼 LinkedIn: [Monther Alzamli](https://www.linkedin.com/in/monther-alzamli/)
- 🐙 GitHub: [@MontherIsmail](https://github.com/MontherIsmail)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)
- Images hosted on [Cloudinary](https://cloudinary.com/)
- Deployed on [Vercel](https://vercel.com/)
