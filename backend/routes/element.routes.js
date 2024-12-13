import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

router.get('/types', authenticateToken, async (req, res) => {
  try {
    const elementTypes = await prisma.elementType.findMany({
      orderBy: { category: 'asc' },
    });
    res.json(elementTypes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;