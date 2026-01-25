
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Create Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@socialhub.com' },
    update: {},
    create: {
      email: 'admin@socialhub.com',
      name: 'Admin User',
      password: 'admin123', // Use a secure password in production
      role: 'admin',
    },
  });
  console.log(`Created admin user: ${adminUser.email}`);

  // Create Sales User
  const salesUser = await prisma.user.upsert({
    where: { email: 'ventas@socialhub.com' },
    update: {},
    create: {
      email: 'ventas@socialhub.com',
      name: 'Sales User',
      password: 'ventas123', // Use a secure password in production
      role: 'ventas',
    },
  });
  console.log(`Created sales user: ${salesUser.email}`);

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
