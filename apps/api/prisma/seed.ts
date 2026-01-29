import { PrismaClient, Role, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // ====== Config tài khoản test ======
  const adminEmail = 'admin@test.com';
  const userEmail = 'user@test.com';
  const plainPassword = '123456';

  const passwordHash = await bcrypt.hash(plainPassword, 10);

  // ====== Upsert ADMIN ======
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      fullName: 'Test Admin',
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      password: passwordHash,
    },
    create: {
      email: adminEmail,
      fullName: 'Test Admin',
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      password: passwordHash,
    },
  });

  // ====== Upsert USER ======
  const user = await prisma.user.upsert({
    where: { email: userEmail },
    update: {
      fullName: 'Test User',
      role: Role.USER,
      status: UserStatus.ACTIVE,
      password: passwordHash,
    },
    create: {
      email: userEmail,
      fullName: 'Test User',
      role: Role.USER,
      status: UserStatus.ACTIVE,
      password: passwordHash,
    },
  });

  // ====== (Optional) seed dữ liệu blog demo ======
  const cat = await prisma.category.upsert({
    where: { name: 'Tech' },
    update: {},
    create: { name: 'Tech' },
  });

  const tag = await prisma.tag.upsert({
    where: { name: 'React' },
    update: {},
    create: { name: 'React' },
  });

  // Post demo cho admin
  await prisma.post.upsert({
    where: { slug: 'hello-world' },
    update: {
      title: 'Hello World',
      content: 'Bài viết seed để test hệ thống.',
      published: true,
      authorId: admin.id,
      categoryId: cat.id,
      tags: { set: [{ id: tag.id }] },
    },
    create: {
      title: 'Hello World',
      slug: 'hello-world',
      content: 'Bài viết seed để test hệ thống.',
      published: true,
      authorId: admin.id,
      categoryId: cat.id,
      tags: { connect: [{ id: tag.id }] },
    },
  });

  console.log('✅ Seed done!');
  console.log('ADMIN:', adminEmail, '| password:', plainPassword);
  console.log('USER :', userEmail, '| password:', plainPassword);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
