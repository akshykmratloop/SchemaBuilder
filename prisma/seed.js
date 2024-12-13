import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create default element types
  const elementTypes = [
    // Text elements
    {
      name: 'Heading 1',
      category: 'text',
      icon: 'Heading1',
      properties: {
        tag: 'h1',
        defaultStyles: 'text-4xl font-bold',
      },
    },
    {
      name: 'Heading 2',
      category: 'text',
      icon: 'Heading2',
      properties: {
        tag: 'h2',
        defaultStyles: 'text-3xl font-semibold',
      },
    },
    {
      name: 'Paragraph',
      category: 'text',
      icon: 'Type',
      properties: {
        tag: 'p',
        defaultStyles: 'text-base',
      },
    },
    // Media elements
    {
      name: 'Image',
      category: 'media',
      icon: 'Image',
      properties: {
        allowedTypes: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        maxSize: 5242880, // 5MB
      },
    },
    {
      name: 'Video',
      category: 'media',
      icon: 'Video',
      properties: {
        allowedTypes: ['mp4', 'webm'],
        maxSize: 104857600, // 100MB
      },
    },
    // Layout elements
    {
      name: 'Container',
      category: 'layout',
      icon: 'Box',
      properties: {
        defaultStyles: 'w-full max-w-7xl mx-auto px-4',
      },
    },
    {
      name: 'Grid',
      category: 'layout',
      icon: 'LayoutGrid',
      properties: {
        columns: 3,
        gap: 4,
        defaultStyles: 'grid grid-cols-3 gap-4',
      },
    },
    // Interactive elements
    {
      name: 'Button',
      category: 'interactive',
      icon: 'Button',
      properties: {
        variants: ['primary', 'secondary', 'outline'],
        defaultStyles: 'px-4 py-2 rounded',
      },
    },
    {
      name: 'Form',
      category: 'interactive',
      icon: 'FormInput',
      properties: {
        method: 'POST',
        defaultStyles: 'space-y-4',
      },
    },
  ];

  // Create element types
  for (const elementType of elementTypes) {
    await prisma.elementType.upsert({
      where: { name: elementType.name },
      update: {},
      create: elementType,
    });
  }

  // Create super user
  const hashedPassword = await bcrypt.hash('1234', 10);
  await prisma.user.upsert({
    where: { email: 'a@gmail.com' },
    update: {},
    create: {
      email: 'a@gmail.com',
      password: hashedPassword,
      isSuperUser: true,
    },
  });
}

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.disconnect();
//   });

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect(); // Change this line
  });