import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/lib/password';
import logger from '@/lib/logger';

const prisma = new PrismaClient();

async function createAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password || password.length < 12) {
    console.error(
      'Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) before running this script'
    );
    process.exitCode = 1;
    return;
  }

  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await hashPassword(password);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    console.log(`Admin user created: ${email}`);
  } catch (error) {
    logger.error('Error creating admin user:', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
