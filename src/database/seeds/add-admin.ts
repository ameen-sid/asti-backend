import bcrypt from 'bcrypt';
import { prisma } from '../../config/prisma.config';

async function main() {
  const email = 'admin@gmail.com';
  const password = 'admin';

  console.log('Seeding admin user...');
  const existingUser = await prisma.user.findFirst({ where: { email } });
  if (existingUser) {
    console.log(`User '${email}' already exists. Skipping...`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const adminUser = await prisma.user.create({
    data: {
      name: 'System Administrator',
      email: email,
      password: hashedPassword,
      role: 'Admin'
    }
  });

  console.log('Admin user seeded successfully:', {
    id: adminUser.id,
    name: adminUser.name,
    email: adminUser.email,
    role: adminUser.role
  });
}

main()
  .catch((e) => {
    console.error('Error seeding admin user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });