import bcrypt from 'bcrypt';
import { prisma } from '../src/config/prisma.config';

async function resetPassword() {
  const email = 'admin@gmail.com';
  const newPassword = 'admin';

  console.log(`Searching for user with email: ${email}...`);
  const user = await prisma.user.findFirst({ where: { email } });

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  if (user) {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });
    console.log(`Password successfully updated for '${updatedUser.email}' (ID: ${updatedUser.id}) to "admin".`);
  } else {
    const createdUser = await prisma.user.create({
      data: {
        name: 'System Administrator',
        email,
        password: hashedPassword,
        role: 'Admin'
      }
    });
    console.log(`User '${email}' was not found, created new user (ID: ${createdUser.id}) with password "admin".`);
  }
}

resetPassword()
  .catch((e) => {
    console.error('Error updating password:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
