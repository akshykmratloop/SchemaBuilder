import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// export const initializeDatabase = async () => {
//   try {
//     await prisma.$connect();
//     console.log('Database connected successfully');
//   } catch (error) {
//     console.error('Database connection failed:', error);
//     process.exit(1);
//   }
// };

export const initializeDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1); // This will stop the server if the connection fails
  }
};

export default prisma;