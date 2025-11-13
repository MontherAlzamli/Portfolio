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
- **VPS**: Ubuntu server with PM2
- **NGINX**: Reverse proxy and SSL termination
- **PM2**: Process manager for Node.js applications
- **Let's Encrypt**: SSL certificate management

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
│   │   └── password.ts       # Password hashing
│   └── middleware.ts         # Next.js middleware
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts               # Database seeding script
│   └── migrations/           # Database migrations
├── scripts/
│   └── create-admin.ts       # Admin user creation script
├── public/                    # Static assets
├── .env.example              # Environment variables template
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
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# App Configuration
NODE_ENV="development"
PORT="3000"
```

See `env.example` for detailed descriptions of each variable.

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
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier
- `npm run db:push`: Push Prisma schema to database
- `npm run db:studio`: Open Prisma Studio
- `npm run seed`: Seed the database

## 🖥️ Deployment

### VPS Deployment with PM2 and NGINX

#### Prerequisites

- Ubuntu/Debian VPS
- Node.js and npm installed
- PostgreSQL installed
- Domain name pointed to your VPS IP

#### Deployment Steps

1. **Clone the repository on your VPS**
   ```bash
   cd /var/www
   git clone https://github.com/MontherIsmail/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create production environment file**
   ```bash
   cp env.example .env.production
   # Edit .env.production with production credentials
   ```

4. **Set up PostgreSQL database**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE portfolio_db;
   CREATE USER portfolio_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;
   \q
   ```

5. **Push database schema**
   ```bash
   export DATABASE_URL="postgresql://portfolio_user:password@localhost:5432/portfolio_db"
   npx prisma db push
   ```

6. **Seed the database**
   ```bash
   npx tsx prisma/seed.ts
   ```

7. **Create admin user**
   ```bash
   npx tsx scripts/create-admin.ts
   ```

8. **Build the application**
   ```bash
   npm run build
   ```

9. **Start with PM2**
   ```bash
   DATABASE_URL="your_database_url" PORT=3002 pm2 start npm --name "portfolio-app" -- start
   pm2 save
   ```

10. **Configure NGINX**
    
    Create `/etc/nginx/sites-available/portfolio`:
    ```nginx
    server {
        listen 80;
        server_name montheralzamli.com www.montheralzamli.com;

        location /_next/ {
            proxy_pass http://localhost:3002/_next/;
            proxy_set_header Host $host;
        }

        location /admin {
            proxy_pass http://localhost:3002/admin;
            proxy_set_header Host $host;
        }

        location / {
            proxy_pass http://localhost:3002;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
    ```

    Enable the site:
    ```bash
    sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl reload nginx
    ```

11. **Set up SSL with Let's Encrypt**
    ```bash
    sudo certbot --nginx -d montheralzamli.com -d www.montheralzamli.com
    ```

### Access URLs

- **Portfolio**: https://montheralzamli.com
- **Admin Dashboard**: https://montheralzamli.com/admin/login
- **Ecommerce**: https://montheralzamli.com/ecommerce
- **Ecommerce Admin**: https://montheralzamli.com/ecommerce-admin

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

If you're having trouble connecting to the database:

```bash
# Verify PostgreSQL is running
sudo systemctl status postgresql

# Check database credentials
psql -h localhost -U portfolio_user -d portfolio_db
```

### PM2 Process Issues

```bash
# View logs
pm2 logs portfolio-app

# Restart the application
pm2 restart portfolio-app

# Check status
pm2 status
```

### NGINX Configuration

```bash
# Test configuration
sudo nginx -t

# Reload NGINX
sudo systemctl reload nginx
```

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
- Deployed with [PM2](https://pm2.keymetrics.io/)
