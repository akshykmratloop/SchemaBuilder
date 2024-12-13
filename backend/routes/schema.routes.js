import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { createSchema, getSchemas, getSchemaById } from '../controllers/schema.controller.js';

const router = Router();

router.post('/', authenticateToken, createSchema);
router.get('/', authenticateToken, getSchemas);
router.get('/:id', authenticateToken, getSchemaById);

export default router;